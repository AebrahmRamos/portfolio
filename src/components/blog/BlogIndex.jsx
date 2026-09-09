import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { formatPostDate } from './format';
import './blog.css';

// The old index derived a "N min read" from the length of the post *summary*,
// which measured the wrong text and reported a number for it. The index has no
// body to measure, so it no longer claims one.
function PostRow({ post, onTagClick, seriesTitle }) {
  return (
    <article className="post-row">
      <div className="post-row__meta">
        <time dateTime={new Date(post.published_at * 1000).toISOString()}>
          {formatPostDate(post.published_at)}
        </time>
        {post.series_slug && (
          <span className="post-row__series">{seriesTitle ?? post.series_slug}</span>
        )}
      </div>

      <h2 className="post-row__title">
        <Link to={`/blog/${post.slug}`} className="post-row__link">{post.title}</Link>
      </h2>

      {post.summary && <p className="post-row__summary">{post.summary}</p>}

      {post.tags?.length > 0 && (
        <div className="post-row__tags">
          {post.tags.slice(0, 5).map((tag) => (
            <button key={tag} type="button" className="tag" onClick={() => onTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

function SkeletonRows() {
  return (
    <div aria-hidden="true">
      {[82, 64, 91].map((w, i) => (
        <div key={i} className="post-row post-row--skeleton">
          <div className="skeleton" style={{ width: 120, height: 10, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: `${w}%`, height: 22, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '78%', height: 12 }} />
        </div>
      ))}
    </div>
  );
}

export default function BlogIndex() {
  const [allPosts, setAllPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTags, setActiveTags] = useState(() => {
    const t = searchParams.get('tag');
    return new Set(t ? [t] : []);
  });
  const [sort, setSort] = useState('newest');
  const debounceRef = useRef(null);

  useEffect(() => {
    const asJson = (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    };
    Promise.all([
      fetch('/api/blog?limit=200').then(asJson),
      fetch('/api/blog/series').then(asJson),
    ])
      .then(([pd, sd]) => {
        setAllPosts(pd.posts ?? []);
        setSeries(sd.series ?? []);
        setLoading(false);
      })
      .catch(() => { setError('Could not load posts.'); setLoading(false); });
  }, []);

  const handleSearch = useCallback((val) => {
    setRawQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  useEffect(() => {
    const t = searchParams.get('tag');
    setActiveTags(t ? new Set([t]) : new Set());
  }, [searchParams]);

  const seriesTitleBySlug = useMemo(
    () => Object.fromEntries(series.map((s) => [s.slug, s.title])),
    [series]
  );

  const allTags = useMemo(() => {
    const map = new Map();
    allPosts.forEach((p) => (p.tags ?? []).forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t]) => t);
  }, [allPosts]);

  const visibleTags = useMemo(() => {
    const extra = [...activeTags].filter((t) => !allTags.includes(t));
    return [...allTags, ...extra];
  }, [allTags, activeTags]);

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      posts = posts.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.summary ?? '').toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTags.size) {
      posts = posts.filter((p) => (p.tags ?? []).some((t) => activeTags.has(t)));
    }
    return sort === 'oldest'
      ? [...posts].sort((a, b) => a.published_at - b.published_at)
      : posts;
  }, [allPosts, debouncedQuery, activeTags, sort]);

  const isFiltered = Boolean(debouncedQuery.trim()) || activeTags.size > 0;

  return (
    <div className="blog">
      <header className="blog__head">
        <div className="blog__head-inner">
          <h1 className="blog__title">Writing</h1>
          <p className="blog__lead">
            Notes on systems programming, embedded work, and shipping software.
          </p>
        </div>
      </header>

      <div className="blog__body">
        <main>
          <div className="blog__controls">
            <div className="blog__search">
              <PiMagnifyingGlassBold className="blog__search-icon" size={16} aria-hidden="true" />
              <input
                type="search"
                className="blog__search-input"
                placeholder="Search posts"
                aria-label="Search posts"
                value={rawQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <label className="blog__sort-wrap">
              <span className="blog__sr">Sort posts</span>
              <select
                className="blog__sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {visibleTags.length > 0 && (
            <div className="blog__tags">
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag ${activeTags.has(tag) ? 'tag--active' : ''}`}
                  aria-pressed={activeTags.has(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {activeTags.size > 0 && (
                <button
                  type="button"
                  className="tag tag--clear"
                  onClick={() => setActiveTags(new Set())}
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {loading ? (
            <SkeletonRows />
          ) : error ? (
            <div className="blog__empty">
              <p className="blog__empty-title">{error}</p>
              <p className="blog__empty-sub">Refresh the page to try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="blog__empty">
              <p className="blog__empty-title">
                {isFiltered ? 'No posts match those filters' : 'No posts yet'}
              </p>
              <p className="blog__empty-sub">
                {isFiltered
                  ? 'Try a different search, or clear the filters.'
                  : 'The first one is being written.'}
              </p>
              {isFiltered && (
                <button
                  type="button"
                  className="blog__empty-action"
                  onClick={() => {
                    setRawQuery('');
                    setDebouncedQuery('');
                    setActiveTags(new Set());
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="blog__list">
              {filtered.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onTagClick={toggleTag}
                  seriesTitle={seriesTitleBySlug[post.series_slug]}
                />
              ))}
            </div>
          )}
        </main>

        {series.length > 0 && (
          <aside className="blog__aside">
            <h2 className="blog__aside-title">Series</h2>
            <ul className="blog__series">
              {series.map((s) => (
                <li key={s.slug}>
                  <Link to={`/blog/series/${s.slug}`} className="blog__series-link">
                    <span>{s.title}</span>
                    <span className="blog__series-count">{s.post_count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
