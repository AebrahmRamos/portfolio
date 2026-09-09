import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PiArrowLeftBold, PiArrowRightBold, PiLinkSimpleBold, PiCheckBold, PiStackSimpleBold } from 'react-icons/pi';
import DOMPurify from 'dompurify';
import { formatPostDate } from './format';
import { highlightCodeBlocks } from './highlight';
import './blog.css';

// DOMPurify is configured to allow <iframe> for embeds, so constrain them to a
// trusted-host allowlist and force a restrictive sandbox. Otherwise
// admin-authored (or compromised-token) HTML could embed any third-party frame.
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
  // allow-same-origin is omitted deliberately: paired with allow-scripts it
  // defeats the sandbox, and cross-origin YouTube/Vimeo embeds play without it.
  node.setAttribute('sandbox', 'allow-scripts allow-presentation allow-popups allow-fullscreen');
  node.setAttribute('loading', 'lazy');
});

// Average adult reading speed is ~238 wpm (Nielsen Norman Group).
function calcReadingTime(html) {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 238);
  return minutes < 1 ? 'Under 1 min read' : `${minutes} min read`;
}

function SkeletonPost() {
  return (
    <div className="post__container" aria-hidden="true">
      <div className="skeleton" style={{ width: 72, height: 13, marginBottom: 44 }} />
      <div className="skeleton" style={{ width: 110, height: 12, marginBottom: 18 }} />
      <div className="skeleton" style={{ width: '90%', height: 42, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: '58%', height: 42, marginBottom: 26 }} />
      <div className="skeleton" style={{ width: 220, height: 12, marginBottom: 48 }} />
      {[100, 97, 93, 100, 88, 100, 95, 72].map((w, i) => (
        <div key={i} className="skeleton" style={{ width: `${w}%`, height: 16, marginBottom: 14 }} />
      ))}
    </div>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button type="button" className="post__action" onClick={copyLink}>
      {copied ? <PiCheckBold size={15} aria-hidden="true" /> : <PiLinkSimpleBold size={15} aria-hidden="true" />}
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}

function SeriesNav({ seriesPosts, currentSlug, seriesTitle, seriesSlug }) {
  const currentIdx = seriesPosts.findIndex((p) => p.slug === currentSlug);
  const next = currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  if (seriesPosts.length < 2) return null;

  // A playlist, not just prev/next. A reader who lands mid-series can see the
  // whole run, where they are in it, and jump to any part. The old version
  // exposed only the two neighbours, so parts 1 and 4 were unreachable from
  // part 2 without going back to the index.
  return (
    <nav className="series-panel" aria-label={`Parts in ${seriesTitle}`}>
      <div className="series-panel__head">
        <p className="series-panel__title">
          <PiStackSimpleBold size={14} aria-hidden="true" />
          <Link to={`/blog/series/${seriesSlug}`}>{seriesTitle}</Link>
        </p>
        <p className="series-panel__pos">
          Part {currentIdx + 1} of {seriesPosts.length}
        </p>
      </div>

      <ol className="series-panel__list">
        {seriesPosts.map((p, i) => {
          const isCurrent = p.slug === currentSlug;
          return (
            <li key={p.slug}>
              {isCurrent ? (
                <span className="series-panel__row series-panel__row--current" aria-current="true">
                  <span className="series-panel__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="series-panel__label">{p.title}</span>
                  <span className="series-panel__here">You are here</span>
                </span>
              ) : (
                <Link to={`/blog/${p.slug}`} className="series-panel__row">
                  <span className="series-panel__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="series-panel__label">{p.title}</span>
                  {p.read_minutes && <span className="series-panel__time">{p.read_minutes} min</span>}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {next && (
        <Link to={`/blog/${next.slug}`} className="series-panel__next">
          <span className="series-panel__next-label">Next in this series</span>
          <span className="series-panel__next-title">{next.title}</span>
          <PiArrowRightBold className="series-panel__next-arrow" size={16} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bodyRef = useRef(null);

  const adminToken = sessionStorage.getItem('adminToken');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPost(null);
    setSeriesData(null);

    const headers = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    fetch(`/api/blog/${slug}`, { headers })
      .then((r) => {
        if (r.status === 404) throw new Error('not_found');
        if (!r.ok) throw new Error('fetch_error');
        return r.json();
      })
      .then((data) => {
        // post and loading are set together, in one commit. Previously the
        // series fetch was awaited between them, so `post` landed while
        // `loading` was still true: the component was rendering the skeleton,
        // .post__body did not exist, and the ref callback never fired.
        setPost(data);
        setLoading(false);

        if (data.series_slug) {
          fetch(`/api/blog/series/${data.series_slug}`)
            .then((sr) => (sr.ok ? sr.json() : null))
            .then((sd) => { if (sd) setSeriesData(sd); })
            .catch(() => { /* series nav is optional */ });
        }
      })
      .catch((err) => {
        setError(err.message === 'not_found'
          ? 'This post does not exist, or it has been unpublished.'
          : 'Could not load this post. Please try again.');
        setLoading(false);
      });
  }, [slug, adminToken]);

  // A callback ref rather than an effect: it fires when the node actually
  // mounts, so the injection can never race the render that creates it.
  const setBodyRef = useCallback((node) => {
    bodyRef.current = node;
    if (!node) return;
    node.innerHTML = post?.body_html
      ? DOMPurify.sanitize(post.body_html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder'],
      })
      : '';
    highlightCodeBlocks(node);
  }, [post]);

  useEffect(() => {
    if (post) document.title = `${post.title} | Aebrahm Ramos`;
    return () => { document.title = 'Aebrahm Ramos'; };
  }, [post]);

  if (loading) {
    return (
      <article className="post">
        {/* Progress bar is driven entirely by CSS scroll-driven animation
            (see blog.css). It used to be a scroll listener writing a
            percentage into React state on every frame. */}
        <div className="post__progress" aria-hidden="true" />
        <SkeletonPost />
      </article>
    );
  }

  if (error) {
    return (
      <article className="post">
        <div className="post__container">
          <Link to="/blog" className="post__back">
            <PiArrowLeftBold size={14} aria-hidden="true" />
            All posts
          </Link>
          <p className="post__error">{error}</p>
        </div>
      </article>
    );
  }

  if (!post) return null;

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const readingTime = calcReadingTime(post.body_html);
  const seriesPosts = seriesData?.posts ?? [];
  const seriesTitle = seriesData?.series?.title ?? post.series_slug;

  return (
    <article className="post">
      <div className="post__progress" aria-hidden="true" />

      <div className="post__container">
        <Link to="/blog" className="post__back">
          <PiArrowLeftBold size={14} aria-hidden="true" />
          All posts
        </Link>

        <header className="post__header">
          {post.series_slug && (
            <Link to={`/blog/series/${post.series_slug}`} className="post__series-link">
              {seriesTitle}
            </Link>
          )}

          <h1 className="post__title">{post.title}</h1>

          {post.summary && <p className="post__standfirst">{post.summary}</p>}

          <div className="post__meta">
            {post.published_at && (
              <time dateTime={new Date(post.published_at * 1000).toISOString()}>
                {formatPostDate(post.published_at)}
              </time>
            )}
            {readingTime && <span>{readingTime}</span>}
            {post.status === 'draft' && <span className="post__draft">Draft</span>}
          </div>
        </header>

        <div ref={setBodyRef} className="post__body" />

        <footer className="post__footer">
          {tags.length > 0 && (
            <div className="post__tags">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="tag"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className="post__actions">
            <Link to="/blog" className="post__action">
              <PiArrowLeftBold size={15} aria-hidden="true" />
              All posts
            </Link>
            <CopyLinkButton />
          </div>

          {post.series_slug && seriesPosts.length > 1 && (
            <SeriesNav
              seriesPosts={seriesPosts}
              currentSlug={slug}
              seriesTitle={seriesTitle}
              seriesSlug={post.series_slug}
            />
          )}
        </footer>
      </div>
    </article>
  );
}
