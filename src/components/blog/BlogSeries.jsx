import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PiArrowLeftBold } from 'react-icons/pi';
import { formatPostDate } from './format';
import './blog.css';

export default function BlogSeries() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/series/${slug}`)
      .then((r) => {
        if (r.status === 404) throw new Error('not_found');
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => {
        setError(err.message === 'not_found'
          ? 'This series does not exist, or it has no published posts yet.'
          : 'Could not load this series.');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (data?.series) document.title = `${data.series.title} | Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [data]);

  if (loading) {
    return (
      <section className="post">
        <div className="post__container" aria-hidden="true">
          <div className="skeleton" style={{ width: 90, height: 13, marginBottom: 40 }} />
          <div className="skeleton" style={{ width: '62%', height: 34, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '88%', height: 14, marginBottom: 44 }} />
          {[70, 85, 60].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}%`, height: 20, marginBottom: 24 }} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="post">
        <div className="post__container">
          <Link to="/blog" className="post__back">
            <PiArrowLeftBold size={14} aria-hidden="true" />
            All posts
          </Link>
          <p className="post__error">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { series, posts } = data;

  return (
    <section className="post">
      <div className="post__container">
        <Link to="/blog" className="post__back">
          <PiArrowLeftBold size={14} aria-hidden="true" />
          All posts
        </Link>

        <h1 className="post__title">{series.title}</h1>
        {series.description && <p className="series__desc">{series.description}</p>}

        {posts.length === 0 ? (
          <p className="post__error">No published posts in this series yet.</p>
        ) : (
          <ol className="series__list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="series__row">
                  <span className="series__row-title">{post.title}</span>
                  <span className="series__row-date">{formatPostDate(post.published_at)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
