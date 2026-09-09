import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PiMagnifyingGlassBold, PiArrowRightBold, PiXBold } from 'react-icons/pi';
import { formatPostDate } from './format';
import './blog.css';

function Meta({ post, seriesTitle }) {
  return (
    <div className="post-row__meta">
      <time dateTime={new Date(post.published_at * 1000).toISOString()}>
        {formatPostDate(post.published_at)}
      </time>
      {post.read_minutes && <span>{post.read_minutes} min read</span>}
      {seriesTitle && <span className="post-row__series">{seriesTitle}</span>}
    </div>
  );
}

// The newest post gets a lead treatment. Six rows of identical weight told the
// reader nothing about where to start, which is the main reason the index read
// as a list of files rather than a publication.
function LeadPost({ post, seriesTitle }) {
  return (
    <article className="lead">
      <Meta post={post} seriesTitle={seriesTitle} />
      <h2 className="lead__title">
        <Link to={`/blog/${post.slug}`} className="lead__link">{post.title}</Link>
      </h2>
      {post.summary && <p className="lead__summary">{post.summary}</p>}
      <span className="lead__cta">
        Read this
        <PiArrowRightBold size={14} aria-hidden="true" />
      </span>
    </article>
  );
}

function PostRow({ post, seriesTitle }) {
  return (
    <article className="post-row">
      <Meta post={post} seriesTitle={seriesTitle} />
      <h2 className="post-row__title">
        <Link to={`/blog/${post.slug}`} className="post-row__link">{post.title}</Link>
      </h2>
      {post.summary && <p className="post-row__summary">{post.summary}</p>}
    </article>
  );
}

function SkeletonRows() {
  return (
    <div aria-hidden="true">
      <div className="lead lead--skeleton">
        <div className="skeleton" style={{ width: 180, height: 10, marginBottom: 18 }} />
        <div className="skeleton" style={{ width: '86%', height: 34, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: '54%', height: 34, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '70%', height: 13 }} />
      </div>
      {[74, 88].map((w, i) => (
        <div key={i} className="post-row">
          <div className="skeleton" style={{ width: 150, height: 10, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: `${w}%`, height: 20, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: '64%', height: 12 }} />
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

  // Top tags only. Eleven undifferentiated pills in a row was a wall, not a
  // filter; the long tail is reachable from any post's own tag links.
  const topTags = useMemo(() => {
    const map = new Map();
    allPosts.forEach((p) => (p.tags ?? []).forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
  }, [allPosts]);

  const visibleTags = useMemo(() => {
    const names = topTags.map(([t]) => t);
    const extra = [...activeTags].filter((t) => !names.includes(t));
    return [...topTags, ...extra.map((t) => [t, 0])];
  }, [topTags, activeTags]);

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
  // The lead treatment is for browsing. Once you are filtering you want a
  // comparable list, so every result renders at the same weight.
  const [lead, ...rest] = isFiltered ? [null, ...filtered] : filtered;

  const clearAll = () => {
    setRawQuery('');
    setDebouncedQuery('');
    setActiveTags(new Set());
  };

  return (
    <div className="blog">
      <header className="blog__head">
        <div className="blog__head-inner">
          <h1 className="blog__title">Writing</h1>
          <p className="blog__lead-text">
            Notes on systems programming, embedded work, and shipping software that
            other people depend on.
          </p>
          {!loading && !error && allPosts.length > 0 && (
            <p className="blog__count">
              {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'}
              {series.length > 0 && `, ${series.length} ${series.length === 1 ? 'series' : 'series'}`}
            </p>
          )}
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
              {visibleTags.map(([tag, count]) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag ${activeTags.has(tag) ? 'tag--active' : ''}`}
                  aria-pressed={activeTags.has(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {count > 1 && <span className="tag__count">{count}</span>}
                </button>
              ))}
              {isFiltered && (
                <button type="button" className="tag tag--clear" onClick={clearAll}>
                  <PiXBold size={11} aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>
          )}

          {isFiltered && !loading && !error && (
            <p className="blog__result-count" role="status">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
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
                <button type="button" className="blog__empty-action" onClick={clearAll}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="blog__list">
              {lead && (
                <LeadPost post={lead} seriesTitle={seriesTitleBySlug[lead.series_slug]} />
              )}
              {rest.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
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
                    <span className="blog__series-name">
                      {s.title}
                      <span className="blog__series-count">{s.post_count}</span>
                    </span>
                    {s.description && (
                      <span className="blog__series-desc">{s.description}</span>
                    )}
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
