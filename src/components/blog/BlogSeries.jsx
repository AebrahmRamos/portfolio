import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PiArrowLeftBold, PiArrowRightBold, PiStackSimpleBold } from 'react-icons/pi';
import { formatPostDate } from './format';
import './blog.css';

// A series is a reading playlist: an ordered run of posts meant to be taken in
// sequence. The page used to render it as a bare numbered list of titles, which
// told you the order and nothing else. This shows what each part covers, how
// long it takes, and where the run starts.
export default function BlogSeries() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/blog/series/${slug}`)
      .then((r) => {
        if (r.status === 404) throw new Error('not_found');
        return r.json();
      })
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message === 'not_found'
          ? 'This series does not exist, or it has no published posts yet.'
          : 'Could not load this series.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (data?.series) document.title = `${data.series.title} | Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [data]);

  if (loading) {
    return (
      <section className="post">
        <div className="post__container" aria-hidden="true">
          <div className="skeleton" style={{ width: 90, height: 13, marginBottom: 44 }} />
          <div className="skeleton" style={{ width: 110, height: 12, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '62%', height: 38, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '88%', height: 14, marginBottom: 44 }} />
          {[70, 85, 60].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}%`, height: 20, marginBottom: 26 }} />
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
  const totalMinutes = posts.reduce((sum, p) => sum + (p.read_minutes ?? 0), 0);
  const start = posts[0];

  return (
    <section className="post">
      <div className="post__container">
        <Link to="/blog" className="post__back">
          <PiArrowLeftBold size={14} aria-hidden="true" />
          All posts
        </Link>

        <header className="series-head">
          <p className="series-head__kicker">
            <PiStackSimpleBold size={14} aria-hidden="true" />
            Series
          </p>
          <h1 className="post__title">{series.title}</h1>
          {series.description && <p className="post__standfirst">{series.description}</p>}

          <div className="post__meta">
            <span>{posts.length} {posts.length === 1 ? 'part' : 'parts'}</span>
            {totalMinutes > 0 && <span>{totalMinutes} min total</span>}
          </div>

          {start && (
            <Link to={`/blog/${start.slug}`} className="series-head__start">
              Start with part 1
              <PiArrowRightBold size={14} aria-hidden="true" />
            </Link>
          )}
        </header>

        {posts.length === 0 ? (
          <p className="post__error">No published posts in this series yet.</p>
        ) : (
          <ol className="parts">
            {posts.map((post, i) => (
              <li key={post.slug} className="parts__item">
                <Link to={`/blog/${post.slug}`} className="parts__link">
                  <span className="parts__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="parts__body">
                    <span className="parts__title">{post.title}</span>
                    {post.summary && <span className="parts__summary">{post.summary}</span>}
                    <span className="parts__meta">
                      <time dateTime={new Date(post.published_at * 1000).toISOString()}>
                        {formatPostDate(post.published_at)}
                      </time>
                      {post.read_minutes && <span>{post.read_minutes} min read</span>}
                    </span>
                  </span>
                  <PiArrowRightBold className="parts__arrow" size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
