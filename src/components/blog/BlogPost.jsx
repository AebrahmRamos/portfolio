import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatPostDate } from './format';
import './blog.css';

// DOMPurify is configured to allow <iframe> for embeds, so constrain them to a
// trusted-host allowlist and force a restrictive sandbox — otherwise admin-authored
// (or compromised-token) HTML could embed any third-party frame (clickjacking/drive-by).
const ALLOWED_IFRAME_HOSTS = new Set([
  'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com',
]);

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName !== 'IFRAME') return;
  let host = '';
  try { host = new URL(node.getAttribute('src') || '', window.location.origin).hostname; } catch { host = ''; }
  if (!ALLOWED_IFRAME_HOSTS.has(host)) {
    node.remove();
    return;
  }
  // Omit allow-same-origin — the dangerous combo with allow-scripts — since
  // cross-origin YouTube/Vimeo embeds play fine without it.
  node.setAttribute('sandbox', 'allow-scripts allow-presentation allow-popups allow-fullscreen');
  node.setAttribute('loading', 'lazy');
});

// Strip HTML tags and count words to get an estimated reading time.
// Average adult reading speed is ~238 wpm (per Nielsen Norman Group research).
function calcReadingTime(html) {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 238);
  return minutes < 1 ? '< 1 min read' : `${minutes} min read`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonPost() {
  return (
    <div className="bpr__container">
      {/* Back link skeleton */}
      <div className="skeleton" style={{ width: 72, height: 13, borderRadius: 4, marginBottom: 40 }} />

      {/* Series label skeleton */}
      <div className="skeleton" style={{ width: 120, height: 11, borderRadius: 4, marginBottom: 16 }} />

      {/* Title */}
      <div className="skeleton" style={{ width: '85%', height: 44, borderRadius: 6, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: '60%', height: 44, borderRadius: 6, marginBottom: 28 }} />

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 120, height: 13, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 80, height: 13, borderRadius: 4 }} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--md-sys-color-outline-variant)', marginBottom: 40 }} />

      {/* Body lines */}
      {[100, 97, 93, 100, 88, 100, 95, 72].map((w, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: `${w}%`, height: 18, borderRadius: 4, marginBottom: 14 }}
        />
      ))}
    </div>
  );
}

// ── Reading progress bar ───────────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bpr__progress" aria-hidden="true">
      <div className="bpr__progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ── Floating side actions (desktop only) ───────────────────────────────────────

function FloatingActions() {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <aside className="bpr__float" aria-label="Article actions">
      <Link to="/blog" className="bpr__float-btn" aria-label="Back to blog">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="bpr__float-btn-label">Blog</span>
      </Link>

      <button
        className="bpr__float-btn"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
        <span className="bpr__float-btn-label">{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </aside>
  );
}

// ── Series prev/next navigation ────────────────────────────────────────────────

function SeriesNav({ seriesPosts, currentSlug, seriesTitle }) {
  const currentIdx = seriesPosts.findIndex(p => p.slug === currentSlug);
  const prev = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
  const next = currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="bpr__series-nav" aria-label="Series navigation">
      <p className="bpr__series-nav-header">
        Part {currentIdx + 1} of {seriesPosts.length} in
        <span className="bpr__series-nav-title"> {seriesTitle}</span>
      </p>
      <div className="bpr__series-grid">
        {prev ? (
          <Link to={`/blog/${prev.slug}`} className="bpr__series-card bpr__series-card--prev">
            <span className="bpr__series-card-dir">← Previous</span>
            <span className="bpr__series-card-title">{prev.title}</span>
          </Link>
        ) : (
          // Empty placeholder keeps the next card right-aligned when there's no prev
          <div />
        )}

        {next && (
          <Link to={`/blog/${next.slug}`} className="bpr__series-card bpr__series-card--next">
            <span className="bpr__series-card-dir">Next →</span>
            <span className="bpr__series-card-title">{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

// ── Tag pills at the bottom ────────────────────────────────────────────────────

function TagFooter({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="bpr__footer-tags">
      <span className="bpr__footer-tags-label">Tagged under</span>
      <div className="bpr__footer-tags-pills">
        {tags.map(tag => (
          <Link
            key={tag}
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className="bpr__tag-pill"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bodyRef = useRef(null);

  // Draft preview support — admin token grants access to unpublished posts
  const adminToken = sessionStorage.getItem('adminToken');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPost(null);
    setSeriesData(null);

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

        if (data.series_slug) {
          const sr = await fetch(`/api/blog/series/${data.series_slug}`);
          if (sr.ok) {
            const sd = await sr.json();
            setSeriesData(sd);
          }
        }

        setLoading(false);
      })
      .catch(err => {
        setError(err.message === 'not_found'
          ? 'This post doesn’t exist or has been unpublished.'
          : 'Failed to load this post. Please try again.');
        setLoading(false);
      });
  }, [slug, adminToken]);

  // Sanitize and inject body HTML — DOMPurify ensures no XSS from Tiptap output
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

  useEffect(() => {
    if (post) document.title = `${post.title} — Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [post]);

  if (loading) {
    return (
      <section className="bpr">
        <ReadingProgressBar />
        <SkeletonPost />
      </section>
    );
  }

  if (error) {
    return (
      <section className="bpr">
        <div className="bpr__container">
          <Link to="/blog" className="bpr__back">← Back</Link>
          <p className="bpr__error">{error}</p>
        </div>
      </section>
    );
  }

  if (!post) return null;

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const readingTime = calcReadingTime(post.body_html);
  const seriesPosts = seriesData?.posts ?? [];
  const seriesTitle = seriesData?.series?.title ?? post.series_slug;

  return (
    <section className="bpr">
      <ReadingProgressBar />
      <FloatingActions />

      <div className="bpr__container">
        {/* Top navigation */}
        <Link to="/blog" className="bpr__back">← Back</Link>

        {/* Article header */}
        <header className="bpr__header">
          {post.series_slug && (
            <Link
              to={`/blog/series/${post.series_slug}`}
              className="bpr__series-label"
            >
              {seriesTitle}
            </Link>
          )}

          <h1 className="bpr__title">{post.title}</h1>

          <div className="bpr__meta">
            {/* Drafts have a null published_at — don't emit a 1970 dateTime */}
            {post.published_at && (
              <time dateTime={new Date(post.published_at * 1000).toISOString()}>
                {formatPostDate(post.published_at)}
              </time>
            )}

            {readingTime && (
              <>
                {post.published_at && <span className="bpr__meta-dot" aria-hidden="true">·</span>}
                <span>{readingTime}</span>
              </>
            )}

            {post.status === 'draft' && (
              <>
                {(post.published_at || readingTime) && <span className="bpr__meta-dot" aria-hidden="true">·</span>}
                <span className="bpr__draft-badge">Draft</span>
              </>
            )}
          </div>

          {tags.length > 0 && (
            <div className="bpr__header-tags">
              {tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bpr__tag-pill bpr__tag-pill--header"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Post body — DOMPurify-sanitized Tiptap HTML */}
        <div ref={bodyRef} className="bpr__body" />

        {/* Footer section */}
        <footer className="bpr__footer">
          <TagFooter tags={tags} />

          {post.series_slug && seriesPosts.length > 1 && (
            <SeriesNav
              seriesPosts={seriesPosts}
              currentSlug={slug}
              seriesTitle={seriesTitle}
            />
          )}
        </footer>
      </div>
    </section>
  );
}
