import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPostDate } from './format';
import './blog.css';

export default function BlogSeries() {
  const { slug } = useParams();
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
        setError(err.message === 'not_found'
          ? 'This series doesn’t exist or has no published posts yet.'
          : 'Failed to load series.');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (data?.series) document.title = `${data.series.title} — Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [data]);

  if (loading) {
    return (
      <section className="series-page">
        <div className="series-page__container">
          <div className="skeleton" style={{ width: 80, height: 13, borderRadius: 4, marginBottom: 36 }} />
          <div className="skeleton" style={{ width: 110, height: 11, borderRadius: 4, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: '65%', height: 38, borderRadius: 6, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '90%', height: 14, borderRadius: 4, marginBottom: 44 }} />
          {[70, 85, 60].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}%`, height: 22, borderRadius: 4, marginBottom: 24 }} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="series-page">
        <div className="series-page__container">
          <Link to="/blog" className="series-page__back">← All posts</Link>
          <p className="bpr__error">{error}</p>
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

        <p className="series-page__label">Series</p>
        <h1 className="series-page__title">{series.title}</h1>
        {series.description && (
          <p className="series-page__desc">{series.description}</p>
        )}

        {posts.length === 0 ? (
          <p className="bpr__error">No published posts in this series yet.</p>
        ) : (
          <div className="series-posts">
            {posts.map((post, idx) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="series-post-row">
                <span className="series-post-row__num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="series-post-row__title">{post.title}</span>
                <span className="series-post-row__date">{formatPostDate(post.published_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
