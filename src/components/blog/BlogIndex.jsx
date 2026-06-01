import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Chip } from '../m3';
import './blog.css';

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="post-card" aria-label={post.title}>
      <Card variant="elevated" className="post-card">
        <div className="post-card__content">
          <div className="post-card__meta">
            {post.series_slug && (
              <span className="post-card__series">{post.series_slug}</span>
            )}
            <span className="post-card__date">{formatDate(post.published_at)}</span>
          </div>
          <h2 className="m3-title-large post-card__title">{post.title}</h2>
          {post.summary && <p className="m3-body-medium post-card__summary">{post.summary}</p>}
          {post.tags?.length > 0 && (
            <div className="post-card__tags">
              {post.tags.slice(0, 4).map(tag => (
                <Chip key={tag} label={tag} variant="assist" />
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

function SkeletonCards() {
  return (
    <div className="blog-skeleton">
      {[1, 2, 3].map(i => (
        <div key={i} className="blog-skeleton__card">
          <div className="skeleton blog-skeleton__line" style={{ width: '30%', marginBottom: 12 }} />
          <div className="skeleton blog-skeleton__line" style={{ width: '75%', height: 22, marginBottom: 12 }} />
          <div className="skeleton blog-skeleton__line" style={{ width: '100%' }} />
          <div className="skeleton blog-skeleton__line" style={{ width: '90%' }} />
        </div>
      ))}
    </div>
  );
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const LIMIT = 10;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/blog?page=${page}&limit=${LIMIT}`).then(r => r.json()),
      fetch('/api/blog/series').then(r => r.json()),
    ])
      .then(([postsData, seriesData]) => {
        setPosts(postsData.posts ?? []);
        setHasMore(postsData.hasMore ?? false);
        setTotal(postsData.total ?? 0);
        setSeries(seriesData.series ?? []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load posts. Please try again.');
        setLoading(false);
      });
  }, [page]);

  return (
    <section className="blog">
      <div className="blog__container">
        <div className="blog__header">
          <h1 className="m3-display-small blog__title">Blog</h1>
          <p className="m3-body-large blog__subtitle">
            Things I've figured out — systems programming, embedded systems, and software engineering.
          </p>
        </div>

        {/* Mobile: series as chips */}
        {series.length > 0 && (
          <div className="blog__series-chips">
            {series.map(s => (
              <Link key={s.slug} to={`/blog/series/${s.slug}`} style={{ textDecoration: 'none' }}>
                <Chip label={`${s.title} (${s.post_count})`} variant="filter" />
              </Link>
            ))}
          </div>
        )}

        <div className="blog__layout">
          {/* Post list */}
          <div>
            {loading ? (
              <SkeletonCards />
            ) : error ? (
              <p className="blog__error">{error}</p>
            ) : posts.length === 0 ? (
              <div className="blog__empty">
                <p className="m3-body-large">No posts yet. Check back soon.</p>
              </div>
            ) : (
              <>
                <div className="blog__posts">
                  {posts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
                {hasMore && (
                  <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <button
                      className="m3-button m3-button--outlined"
                      onClick={() => setPage(p => p + 1)}
                    >
                      Load more ({total - page * LIMIT} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Desktop: series sidebar */}
          {series.length > 0 && (
            <aside className="blog__series-sidebar">
              <p className="m3-title-small blog__series-title">Series</p>
              <ul className="series-list">
                {series.map(s => (
                  <li key={s.slug} className="series-list__item">
                    <Link to={`/blog/series/${s.slug}`}>
                      <span>{s.title}</span>
                      <span className="series-list__count">{s.post_count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
