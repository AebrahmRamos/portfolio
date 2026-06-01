import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Chip } from '../m3';
import './blog.css';

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function SkeletonPost() {
  return (
    <div className="blog-post__container">
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 80, height: 14, borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '80%', height: 40, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 32 }} />
      {[100, 90, 95, 85, 100, 70].map((w, i) => (
        <div key={i} className="skeleton" style={{ width: `${w}%`, height: 14, marginBottom: 12 }} />
      ))}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bodyRef = useRef(null);

  // Check if author is authenticated (for draft preview)
  const adminToken = sessionStorage.getItem('adminToken');

  useEffect(() => {
    const headers = {};
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

    fetch(`/api/blog/${slug}`, { headers })
      .then(r => {
        if (r.status === 404) throw new Error('not_found');
        if (!r.ok) throw new Error('fetch_error');
        return r.json();
      })
      .then(async data => {
        setPost(data);
        // Load series posts if this post is in a series
        if (data.series_slug) {
          const sr = await fetch(`/api/blog/series/${data.series_slug}`);
          const sd = await sr.json();
          setSeriesPosts(sd.posts ?? []);
        }
        setLoading(false);
      })
      .catch(err => {
        if (err.message === 'not_found') navigate('/blog', { replace: true });
        else setError('Failed to load post.');
        setLoading(false);
      });
  }, [slug, adminToken, navigate]);

  // Sanitize and inject HTML safely
  useEffect(() => {
    if (post?.body_html && bodyRef.current) {
      const clean = DOMPurify.sanitize(post.body_html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder'],
      });
      bodyRef.current.innerHTML = clean;
    }
  }, [post]);

  // Set page title
  useEffect(() => {
    if (post) document.title = `${post.title} — Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [post]);

  if (loading) {
    return <section className="blog-post"><SkeletonPost /></section>;
  }

  if (error) {
    return (
      <section className="blog-post">
        <div className="blog-post__container">
          <p className="blog__error">{error}</p>
        </div>
      </section>
    );
  }

  if (!post) return null;

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <section className="blog-post">
      <div className="blog-post__container">
        <Link to="/blog" className="blog-post__back">
          ← All posts
        </Link>

        {post.series_slug && (
          <Link to={`/blog/series/${post.series_slug}`} className="blog-post__series-label">
            {post.series_slug}
          </Link>
        )}

        <h1 className="m3-display-small blog-post__title">{post.title}</h1>

        <div className="blog-post__meta">
          <span>{formatDate(post.published_at)}</span>
          {post.status === 'draft' && (
            <span style={{ color: 'var(--md-sys-color-tertiary)', fontWeight: 600 }}>DRAFT</span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="blog-post__tags">
            {tags.map(tag => <Chip key={tag} label={tag} variant="assist" />)}
          </div>
        )}

        {/* Post body — DOMPurify-sanitized HTML */}
        <div ref={bodyRef} className="blog-post__body" />

        {/* Series navigation */}
        {post.series_slug && seriesPosts.length > 1 && (
          <nav className="blog-post__series-nav" aria-label="Series navigation">
            <p className="blog-post__series-nav-title">More in this series</p>
            <ol className="series-nav__list">
              {seriesPosts.map(p => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className={p.slug === slug ? 'current' : ''}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
