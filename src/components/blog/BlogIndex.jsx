import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPostDate } from './format';
import './blog.css';

function readingTime(summary) {
  if (!summary) return null;
  const words = summary.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function PostRow({ post, onTagClick, index, seriesTitle }) {
  const rt = readingTime(post.summary);
  // Stretched-link pattern: the row is a non-interactive <article>, the title
  // holds the link (covers the row via ::after), and tag buttons sit above it.
  // Avoids the invalid <button> inside <a> nesting the old markup had.
  return (
    <article className="blog-post-row" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="blog-post-row__header">
        <span className="blog-post-row__date">{formatPostDate(post.published_at)}</span>
        {post.series_slug && <span className="blog-post-row__series">{seriesTitle ?? post.series_slug}</span>}
        {rt && <span className="blog-post-row__read">{rt}</span>}
      </div>
      <h2 className="blog-post-row__title">
        <Link to={`/blog/${post.slug}`} className="blog-post-row__link">{post.title}</Link>
      </h2>
      {post.summary && <p className="blog-post-row__summary">{post.summary}</p>}
      {post.tags?.length > 0 && (
        <div className="blog-post-row__tags">
          {post.tags.slice(0, 5).map(tag => (
            <button key={tag} className="blog-tag" onClick={() => onTagClick(tag)}>
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
    <>
      {[80, 60, 90, 70].map((w, i) => (
        <div key={i} className="blog-skeleton-row">
          <div className="skeleton" style={{ width: 120, height: 10, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: `${w}%`, height: 22, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '85%', height: 12, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 100 }} />
            <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 100 }} />
          </div>
        </div>
      ))}
    </>
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
  // Seed filters from ?tag=… so tag links from posts actually filter the index.
  const [activeTags, setActiveTags] = useState(() => {
    const t = searchParams.get('tag');
    return new Set(t ? [t] : []);
  });
  const [sort, setSort] = useState('newest');
  const debounceRef = useRef(null);

  useEffect(() => {
    const asJson = r => {
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
      .catch(() => { setError('Failed to load posts.'); setLoading(false); });
  }, []);

  const handleSearch = useCallback(val => {
    setRawQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);

  const toggleTag = useCallback(tag => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  // Clear any pending debounce timer on unmount to avoid a state update after unmount.
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Re-seed the active tag when the ?tag= param changes (e.g. clicking a tag link
  // from a post while the index is already mounted, or back/forward navigation).
  useEffect(() => {
    const t = searchParams.get('tag');
    setActiveTags(t ? new Set([t]) : new Set());
  }, [searchParams]);

  const seriesTitleBySlug = useMemo(
    () => Object.fromEntries(series.map(s => [s.slug, s.title])),
    [series]
  );

  const allTags = useMemo(() => {
    const map = new Map();
    allPosts.forEach(p => (p.tags ?? []).forEach(t => map.set(t, (map.get(t) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t]) => t);
  }, [allPosts]);

  // Always surface active tags as toggles, even if they fall outside the top-20
  // (e.g. a ?tag=rare deep-link), so the user can always deselect them.
  const visibleTags = useMemo(() => {
    const extra = [...activeTags].filter(t => !allTags.includes(t));
    return [...allTags, ...extra];
  }, [allTags, activeTags]);

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.summary ?? '').toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeTags.size) {
      // OR semantics: a post matches if it carries any selected tag.
      posts = posts.filter(p => (p.tags ?? []).some(t => activeTags.has(t)));
    }
    return sort === 'oldest'
      ? [...posts].sort((a, b) => a.published_at - b.published_at)
      : posts;
  }, [allPosts, debouncedQuery, activeTags, sort]);

  const isFiltered = debouncedQuery.trim() || activeTags.size > 0;

  return (
    <div className="blog-index">
      <div className="blog-hero">
        <div className="blog-hero__inner">
          <p className="blog-hero__eyebrow">Writing</p>
          <h1 className="blog-hero__title">The Stack</h1>
          <p className="blog-hero__sub">
            Things I've figured out — systems programming, embedded systems, and software engineering.
          </p>
        </div>
      </div>

      {series.length > 0 && (
        <div className="blog-series-chips">
          {series.map(s => (
            <Link key={s.slug} to={`/blog/series/${s.slug}`} style={{ textDecoration: 'none' }}>
              <span className="blog-tag">{s.title} ({s.post_count})</span>
            </Link>
          ))}
        </div>
      )}

      <div className="blog-body">
        <div>
          <div className="blog-controls">
            <div className="blog-search">
              <span className="blog-search__icon">⌕</span>
              <input
                type="search"
                className="blog-search__input"
                placeholder="Search posts…"
                aria-label="Search posts"
                value={rawQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <select className="blog-sort" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {visibleTags.length > 0 && (
            <div className="blog-tags">
              {activeTags.size > 0 && (
                <button className="blog-tag blog-tag--clear" onClick={() => setActiveTags(new Set())}>
                  ✕ Clear
                </button>
              )}
              {visibleTags.map(tag => (
                <button key={tag}
                  className={`blog-tag ${activeTags.has(tag) ? 'blog-tag--active' : ''}`}
                  aria-pressed={activeTags.has(tag)}
                  onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          )}

          {loading ? <SkeletonRows /> : error ? (
            <div className="blog-empty">
              <p className="blog-empty__sub" style={{ color: 'var(--md-sys-color-error)' }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="blog-empty">
              <div style={{ fontSize: '2rem', marginBottom: 16, opacity: 0.45 }}>◈</div>
              <p className="blog-empty__title">{isFiltered ? 'No posts match your filters' : 'Nothing here yet'}</p>
              <p className="blog-empty__sub">{isFiltered ? 'Try adjusting your search or clearing filters.' : 'First post coming soon.'}</p>
              {isFiltered && (
                <button className="blog-empty__action"
                  onClick={() => { setRawQuery(''); setDebouncedQuery(''); setActiveTags(new Set()); }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div>{filtered.map((post, i) => <PostRow key={post.id} post={post} onTagClick={toggleTag} index={i} seriesTitle={seriesTitleBySlug[post.series_slug]} />)}</div>
          )}
        </div>

        <aside className="blog-sidebar">
          {series.length > 0 && (
            <div className="blog-sidebar__section">
              <p className="blog-sidebar__label">Series</p>
              {series.map(s => (
                <Link key={s.slug} to={`/blog/series/${s.slug}`} className="blog-sidebar__series-item">
                  <span>{s.title}</span>
                  <span className="blog-sidebar__series-count">{s.post_count}</span>
                </Link>
              ))}
            </div>
          )}
          {allTags.length > 0 && (
            <div className="blog-sidebar__section">
              <p className="blog-sidebar__label">Topics</p>
              <div className="blog-sidebar__tag-cloud">
                {allTags.slice(0, 12).map(tag => (
                  <button key={tag}
                    className={`blog-tag ${activeTags.has(tag) ? 'blog-tag--active' : ''}`}
                    aria-pressed={activeTags.has(tag)}
                    onClick={() => toggleTag(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
