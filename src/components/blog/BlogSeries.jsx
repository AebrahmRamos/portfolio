import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Chip } from '../m3';
import './blog.css';

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogSeries() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/series/${slug}`)
      .then(r => {
        if (r.status === 404) throw new Error('not_found');
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err.message === 'not_found') navigate('/blog', { replace: true });
        else setError('Failed to load series.');
        setLoading(false);
      });
  }, [slug, navigate]);

  useEffect(() => {
    if (data?.series) document.title = `${data.series.title} — Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [data]);

  if (loading) {
    return (
      <section className="series-page">
        <div className="series-page__container">
          <div className="skeleton" style={{ width: 80, height: 14, marginBottom: 32 }} />
          <div className="skeleton" style={{ width: '60%', height: 32, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '80%', height: 14 }} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="series-page">
        <div className="series-page__container">
          <p className="blog__error">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { series, posts } = data;

  return (
    <section className="series-page">
      <div className="series-page__container">
        <Link to="/blog" className="series-page__back">← All posts</Link>

        <h1 className="m3-display-small blog__title">{series.title}</h1>
        {series.description && (
          <p className="m3-body-large series-page__description">{series.description}</p>
        )}

        {posts.length === 0 ? (
          <p className="m3-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            No published posts in this series yet.
          </p>
        ) : (
          <div className="series-posts__list">
            {posts.map((post, idx) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <Card variant="elevated" interactive>
                  <div className="post-card__content">
                    <div className="post-card__meta">
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>
                        Part {idx + 1}
                      </span>
                      <span className="post-card__date">{formatDate(post.published_at)}</span>
                    </div>
                    <h2 className="m3-title-large post-card__title">{post.title}</h2>
                    {post.summary && (
                      <p className="m3-body-medium post-card__summary">{post.summary}</p>
                    )}
                    {post.tags?.length > 0 && (
                      <div className="post-card__tags">
                        {post.tags.slice(0, 3).map(tag => (
                          <Chip key={tag} label={tag} variant="assist" />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
