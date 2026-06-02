import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Chip, TextField } from '../m3';
import './blog.css';

// Assumes average silent reading speed.
const WORDS_PER_MINUTE = 200;

function estimateReadingTime(text) {
  if (!text) return null;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return minutes;
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Staggered fade-in via CSS animation-delay keyed by index.
function PostRow({ post, index, onTagClick, activeTagSet }) {
  const readingTime = estimateReadingTime(post.summary);

  return (
    <article
      className="post-row"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="post-row__meta-top">
        {post.series_slug && (
          <span className="post-row__series">{post.series_slug}</span>
        )}
        <span className="post-row__date">{formatDate(post.published_at)}</span>
        {readingTime && (
          <>
            <span className="post-row__meta-dot" aria-hidden="true">·</span>
            <span className="post-row__reading-time">{readingTime} min read</span>
          </>
        )}
      </div>

      <Link to={`/blog/${post.slug}`} className="post-row__title-link">
        <h2 className="post-row__title">{post.title}</h2>
      </Link>

      {post.summary && (
        <p className="post-row__summary">{post.summary}</p>
      )}

      {post.tags?.length > 0 && (
        <div className="post-row__tags">
          {post.tags.slice(0, 5).map(tag => (
            <button
              key={tag}
              className={`post-row__tag-pill${activeTagSet.has(tag) ? ' post-row__tag-pill--active' : ''}`}
              onClick={() => onTagClick(tag)}
              aria-pressed={activeTagSet.has(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

// Skeleton rows mirror the editorial list layout — no card boxes.
function SkeletonRows() {
  return (
    <div className="blog-skeleton-list" aria-busy="true" aria-label="Loading posts">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="blog-skeleton-row"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="skeleton" style={{ width: '22%', height: 12, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: '72%', height: 26, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '85%', height: 14, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="skeleton" style={{ width: 56, height: 22, borderRadius: 99 }} />
            <div className="skeleton" style={{ width: 72, height: 22, borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="blog-empty-state">
      {hasFilters ? (
        <>
          <p className="blog-empty-state__message">No posts matching your filters.</p>
          <button className="blog-empty-state__clear" onClick={onClearFilters}>
            Clear all filters
          </button>
        </>
      ) : (
        <p className="blog-empty-state__message">No posts yet. Check back soon.</p>
      )}
    </div>
  );
}

// Collapsible section used for the mobile series panel.
function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible">
      <button
        className="collapsible__trigger"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`collapsible__arrow${open ? ' collapsible__arrow--open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && <div className="collapsible__body">{children}</div>}
    </div>
  );
}

export default function BlogIndex() {
  const [allPosts, setAllPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTags, setActiveTags] = useState(new Set());
  const [activeSeriesSlug, setActiveSeriesSlug] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const debounceTimer = useRef(null);

  // Load all posts upfront — client-side filtering only.
  // If the post count grows substantially, paginate on the backend and disable client filtering.
  useEffect(() => {
    Promise.all([
      fetch('/api/blog?page=1&limit=200').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch('/api/blog/series').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([postsData, seriesData]) => {
        setAllPosts(postsData.posts ?? []);
        setSeries(seriesData.series ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  const handleTagClick = useCallback((tag) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const handleSeriesClick = useCallback((slug) => {
    setActiveSeriesSlug(prev => (prev === slug ? null : slug));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setActiveTags(new Set());
    setActiveSeriesSlug(null);
    setSortOrder('newest');
  }, []);

  // Derive unique tags from all loaded posts.
  const allTags = useMemo(() => {
    const tagSet = new Set();
    allPosts.forEach(post => post.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [allPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let results = allPosts;

    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      results = results.filter(post =>
        post.title?.toLowerCase().includes(lower) ||
        post.summary?.toLowerCase().includes(lower) ||
        post.tags?.some(t => t.toLowerCase().includes(lower))
      );
    }

    if (activeTags.size > 0) {
      results = results.filter(post =>
        post.tags?.some(t => activeTags.has(t))
      );
    }

    if (activeSeriesSlug) {
      results = results.filter(post => post.series_slug === activeSeriesSlug);
    }

    results = [...results].sort((a, b) => {
      const diff = (b.published_at ?? 0) - (a.published_at ?? 0);
      return sortOrder === 'newest' ? diff : -diff;
    });

    return results;
  }, [allPosts, debouncedQuery, activeTags, activeSeriesSlug, sortOrder]);

  const hasActiveFilters =
    debouncedQuery.trim().length > 0 ||
    activeTags.size > 0 ||
    activeSeriesSlug !== null;

  const activeTagList = Array.from(activeTags);

  return (
    <section className="blog">
      <div className="blog__container">

        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <header className="blog-hero">
          <h1 className="blog-hero__title">Writing</h1>
          <p className="blog-hero__subtitle">
            Things I've figured out — systems programming, embedded systems, and software engineering.
          </p>
        </header>

        {/* ── Search + sort controls ───────────────────────────────────────── */}
        <div className="blog-controls">
          <div className="blog-controls__search">
            <TextField
              label="Search posts"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search posts by title, summary, or tag"
            />
          </div>
          <div className="blog-controls__sort">
            <label htmlFor="blog-sort" className="blog-controls__sort-label">Sort</label>
            <select
              id="blog-sort"
              className="blog-controls__sort-select"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* ── Active tag pills (when tags are selected) ─────────────────── */}
        {activeTagList.length > 0 && (
          <div className="blog-active-filters">
            <span className="blog-active-filters__label">Filtered by:</span>
            {activeTagList.map(tag => (
              <Chip
                key={tag}
                label={tag}
                variant="filter"
                selected
                onDelete={() => handleTagClick(tag)}
              />
            ))}
            <button className="blog-active-filters__clear" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
        )}

        {/* ── Two-column layout: posts + sidebar ──────────────────────────── */}
        <div className="blog__layout">

          {/* ── Post list ─────────────────────────────────────────────────── */}
          <main className="blog__main">
            {loading ? (
              <SkeletonRows />
            ) : error ? (
              <p className="blog__error">{error}</p>
            ) : filteredAndSortedPosts.length === 0 ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            ) : (
              <div className="blog-post-list">
                {filteredAndSortedPosts.map((post, i) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    index={i}
                    onTagClick={handleTagClick}
                    activeTagSet={activeTags}
                  />
                ))}
              </div>
            )}
          </main>

          {/* ── Sidebar (desktop sticky, mobile collapsible) ─────────────── */}
          <aside className="blog-sidebar">

            {/* Series filter — desktop always visible */}
            {series.length > 0 && (
              <div className="blog-sidebar__section blog-sidebar__section--desktop">
                <p className="blog-sidebar__heading">Series</p>
                <ul className="sidebar-series-list">
                  {series.map(s => (
                    <li key={s.slug}>
                      <button
                        className={`sidebar-series-list__item${activeSeriesSlug === s.slug ? ' sidebar-series-list__item--active' : ''}`}
                        onClick={() => handleSeriesClick(s.slug)}
                        aria-pressed={activeSeriesSlug === s.slug}
                      >
                        <span className="sidebar-series-list__name">{s.title}</span>
                        <span className="sidebar-series-list__count">{s.post_count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tag filter — desktop always visible */}
            {allTags.length > 0 && (
              <div className="blog-sidebar__section blog-sidebar__section--desktop">
                <p className="blog-sidebar__heading">Tags</p>
                <div className="sidebar-tag-list">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      className={`sidebar-tag-list__tag${activeTags.has(tag) ? ' sidebar-tag-list__tag--active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                      aria-pressed={activeTags.has(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile: collapsible versions */}
            {series.length > 0 && (
              <div className="blog-sidebar__section blog-sidebar__section--mobile">
                <CollapsibleSection title="Series">
                  <ul className="sidebar-series-list">
                    {series.map(s => (
                      <li key={s.slug}>
                        <button
                          className={`sidebar-series-list__item${activeSeriesSlug === s.slug ? ' sidebar-series-list__item--active' : ''}`}
                          onClick={() => handleSeriesClick(s.slug)}
                          aria-pressed={activeSeriesSlug === s.slug}
                        >
                          <span className="sidebar-series-list__name">{s.title}</span>
                          <span className="sidebar-series-list__count">{s.post_count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              </div>
            )}

            {allTags.length > 0 && (
              <div className="blog-sidebar__section blog-sidebar__section--mobile">
                <CollapsibleSection title="Tags">
                  <div className="sidebar-tag-list">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        className={`sidebar-tag-list__tag${activeTags.has(tag) ? ' sidebar-tag-list__tag--active' : ''}`}
                        onClick={() => handleTagClick(tag)}
                        aria-pressed={activeTags.has(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </CollapsibleSection>
              </div>
            )}

          </aside>
        </div>
      </div>
    </section>
  );
}
