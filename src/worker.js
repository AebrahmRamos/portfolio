import { portfolioMarkdown } from './agent/portfolio-content.js';
import { sanitizeBodyHtml } from './sanitize.js';

const LINK_HEADER = [
  '</.well-known/agent-skills/index.json>; rel="service-desc"',
  '</.well-known/mcp/server-card.json>; rel="service-doc"',
].join(', ');

// CSP ships as Report-Only first: the app uses inline JSON-LD, Google Fonts,
// reCAPTCHA, EmailJS, and data/blob images, so enforce only after the report
// stream confirms the allowlist is complete. The rest enforce immediately.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://api.emailjs.com https://www.google.com",
  "frame-src https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join('; ');

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy-Report-Only': CSP_REPORT_ONLY,
};

const MCP_SERVER_CARD = {
  schemaVersion: '1.0',
  serverInfo: {
    name: 'aebrahmramos-portfolio',
    version: '1.1.0',
    description: 'Portfolio and blog of Aebrahm Ramos — CS student and developer at DLSU',
  },
  transport: { type: 'webmcp' },
  capabilities: {
    tools: ['get_about', 'get_projects', 'get_experience', 'get_contact', 'get_posts', 'get_post_by_slug', 'get_series'],
  },
  url: 'https://aebrahmramos.dev',
};

const AGENT_SKILLS_INDEX = {
  $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
  skills: [
    {
      name: 'get_about',
      type: 'webmcp',
      description: 'Get biography, education, and summary for Aebrahm Ramos',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_projects',
      type: 'webmcp',
      description: 'Get all portfolio projects with descriptions and tech stacks',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_experience',
      type: 'webmcp',
      description: 'Get professional work experience and internships',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_contact',
      type: 'webmcp',
      description: 'Get contact information including email, GitHub, LinkedIn, and resume',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_posts',
      type: 'webmcp',
      description: 'Get index of published blog posts with title, slug, summary, series, and tags',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_post_by_slug',
      type: 'webmcp',
      description: 'Get full content of a blog post by slug (returns markdown)',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_series',
      type: 'webmcp',
      description: 'Get all blog series with post counts and descriptions',
      url: 'https://aebrahmramos.dev',
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' },
  });
}

function adminJson(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

function injectLinkHeader(response) {
  const headers = new Headers(response.headers);
  headers.set('Link', LINK_HEADER);
  headers.set('Vary', 'Accept');
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// Static assets (JS/CSS/fonts) bypass injectLinkHeader; give them at least
// nosniff + HSTS (CSP/frame-options are only meaningful on the HTML document).
function withAssetHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// Timing-safe string comparison to prevent token timing attacks
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function deriveSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!env.ADMIN_TOKEN || !safeEqual(token, env.ADMIN_TOKEN)) {
    return adminJson({ error: 'unauthorized' }, 401);
  }
  return null;
}

function parseTags(raw) {
  try { return JSON.parse(raw ?? '[]'); } catch { return []; }
}

// Pure: merge a PATCH body over the existing row into the next field set.
// Exported for unit tests. Uses `'key' in body` so an explicit null/empty value
// can CLEAR summary/tags/series_slug (the old `??`/truthy checks made them
// un-clearable once set), and handles both publish and unpublish timestamps.
export function computePostUpdate(body, existing, now) {
  const isPublishing = body.status === 'published' && existing.status === 'draft';
  const isUnpublishing = body.status === 'draft' && existing.status === 'published';
  return {
    title: body.title ?? existing.title,
    body_json: body.body_json != null
      ? (typeof body.body_json === 'string' ? body.body_json : JSON.stringify(body.body_json))
      : existing.body_json,
    body_html: body.body_html ?? existing.body_html,
    body_md: body.body_md ?? existing.body_md,
    summary: 'summary' in body ? body.summary : existing.summary,
    series_slug: 'series_slug' in body ? body.series_slug : existing.series_slug,
    tags: 'tags' in body ? JSON.stringify(Array.isArray(body.tags) ? body.tags : []) : existing.tags,
    status: body.status ?? existing.status,
    published_at: isPublishing ? now : isUnpublishing ? null : existing.published_at,
    updated_at: now,
  };
}

// D1 doesn't reliably enforce the series FK without a per-connection PRAGMA, so
// validate in app code. A null/empty series_slug (no series) is always allowed.
async function seriesExists(env, slug) {
  if (!slug) return true;
  const row = await env.DB.prepare('SELECT 1 FROM series WHERE slug = ?').bind(slug).first();
  return !!row;
}

// ─── Public Blog API ──────────────────────────────────────────────────────────

async function handleGetPosts(request, env) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') ?? '10', 10)));
  const offset = (page - 1) * limit;

  const [rowsResult, countResult] = await Promise.all([
    env.DB.prepare(
      `SELECT id, slug, title, summary, series_slug, tags, published_at, updated_at
       FROM posts WHERE status = 'published'
       ORDER BY published_at DESC LIMIT ? OFFSET ?`
    ).bind(limit, offset).all(),
    env.DB.prepare(`SELECT COUNT(*) as total FROM posts WHERE status = 'published'`).first(),
  ]);

  const total = countResult?.total ?? 0;
  // Short TTL for the list — stale-while-revalidate so CDN stays fast but refreshes quickly
  return new Response(JSON.stringify({
    posts: rowsResult.results.map(p => ({ ...p, tags: parseTags(p.tags) })),
    total, page, limit,
    hasMore: offset + limit < total,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

async function handleGetPost(slug, request, env) {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const isAdmin = env.ADMIN_TOKEN && safeEqual(token, env.ADMIN_TOKEN);

  const row = await env.DB.prepare(
    `SELECT id, slug, title, body_html, body_md, summary, series_slug, tags, status, published_at, updated_at
     FROM posts WHERE slug = ?`
  ).bind(slug).first();

  if (!row || (row.status !== 'published' && !isAdmin)) return jsonResponse({ error: 'not_found' }, 404);

  // Never let a CDN/proxy publicly cache an admin-viewed draft; Vary on
  // Authorization so authed and anonymous responses don't share a cache entry.
  const cacheControl = (isAdmin && row.status !== 'published')
    ? 'private, no-store'
    : 'public, max-age=0, s-maxage=300, stale-while-revalidate=600';
  const vary = 'Accept, Authorization';

  const accept = request.headers.get('Accept') ?? '';
  if (accept.includes('text/markdown')) {
    return new Response(row.body_md ?? '', {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': cacheControl, Vary: vary, 'X-Content-Type-Options': 'nosniff' },
    });
  }
  return new Response(JSON.stringify({ ...row, tags: parseTags(row.tags) }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cacheControl, Vary: vary, 'X-Content-Type-Options': 'nosniff' },
  });
}

async function handleGetSeriesList(env) {
  const rows = await env.DB.prepare(
    `SELECT s.id, s.slug, s.title, s.description,
            COUNT(p.id) as post_count
     FROM series s
     LEFT JOIN posts p ON p.series_slug = s.slug AND p.status = 'published'
     GROUP BY s.id ORDER BY s.title`
  ).all();
  return jsonResponse({ series: rows.results });
}

async function handleGetSeriesPosts(slug, env) {
  const series = await env.DB.prepare(`SELECT * FROM series WHERE slug = ?`).bind(slug).first();
  if (!series) return jsonResponse({ error: 'not_found' }, 404);
  const rows = await env.DB.prepare(
    `SELECT id, slug, title, summary, tags, published_at FROM posts
     WHERE series_slug = ? AND status = 'published' ORDER BY published_at ASC`
  ).bind(slug).all();
  return jsonResponse({ series, posts: rows.results.map(p => ({ ...p, tags: parseTags(p.tags) })) });
}

async function handleFeed(env) {
  const rows = await env.DB.prepare(
    `SELECT slug, title, summary, tags, series_slug, published_at FROM posts
     WHERE status = 'published' ORDER BY published_at DESC LIMIT 50`
  ).all();

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Aebrahm Ramos — Blog',
    home_page_url: 'https://aebrahmramos.dev/blog',
    feed_url: 'https://aebrahmramos.dev/api/blog/feed.json',
    description: 'Technical writing on systems programming, embedded systems, and software engineering.',
    author: { name: 'Aebrahm Ramos', url: 'https://aebrahmramos.dev' },
    items: rows.results.map(p => ({
      id: `https://aebrahmramos.dev/blog/${p.slug}`,
      url: `https://aebrahmramos.dev/blog/${p.slug}`,
      title: p.title,
      summary: p.summary,
      tags: parseTags(p.tags),
      _series: p.series_slug,
      date_published: p.published_at ? new Date(p.published_at * 1000).toISOString() : null,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json', 'Cache-Control': 'public, max-age=3600' },
  });
}

async function handleLlmsTxt(env) {
  const [postsResult, seriesResult] = await Promise.all([
    env.DB.prepare(
      `SELECT slug, title, summary FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 50`
    ).all(),
    env.DB.prepare(`SELECT slug, title, description FROM series ORDER BY title`).all(),
  ]);

  const postLines = postsResult.results.length
    ? postsResult.results.map(p =>
        `- [${p.title}](https://aebrahmramos.dev/blog/${p.slug})${p.summary ? ': ' + p.summary : ''}`
      ).join('\n')
    : '- No posts yet.';

  const seriesSection = seriesResult.results.length
    ? '\n## Series\n\n' + seriesResult.results.map(s =>
        `- [${s.title}](https://aebrahmramos.dev/blog/series/${s.slug})${s.description ? ': ' + s.description : ''}`
      ).join('\n')
    : '';

  const txt = `# Aebrahm Ramos — Technical Writing

> CS student and developer at DLSU. Writing about systems programming, embedded systems, and software engineering.

## Posts

${postLines}
${seriesSection}

## About

- [Portfolio](https://aebrahmramos.dev): Projects, experience, and education
- [GitHub](https://github.com/AebrahmRamos): Open source work
`;

  return new Response(txt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

// ─── Admin API ────────────────────────────────────────────────────────────────

async function handleAdminListPosts(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;
  const rows = await env.DB.prepare(
    `SELECT id, slug, title, summary, status, series_slug, tags, created_at, published_at, updated_at
     FROM posts ORDER BY updated_at DESC`
  ).all();
  return adminJson({ posts: rows.results.map(p => ({ ...p, tags: parseTags(p.tags) })) });
}

async function handleAdminGetPost(id, request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;
  const row = await env.DB.prepare(`SELECT * FROM posts WHERE id = ?`).bind(id).first();
  if (!row) return adminJson({ error: 'not_found' }, 404);
  return adminJson({ ...row, tags: parseTags(row.tags) });
}

async function handleAdminCreatePost(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  let body;
  try { body = await request.json(); } catch { return adminJson({ error: 'invalid_json' }, 400); }

  const { title, body_json, body_html, body_md, summary, series_slug, tags, status } = body;
  if (!title || !body_json) return adminJson({ error: 'missing_fields', required: ['title', 'body_json'] }, 400);

  // Normalize any client-supplied slug to [a-z0-9-] so it can't break routing
  // or produce invalid sitemap/RSS XML.
  const slug = deriveSlug(body.slug || title);
  const existing = await env.DB.prepare(`SELECT id FROM posts WHERE slug = ?`).bind(slug).first();
  if (existing) return adminJson({ error: 'slug_conflict', suggested: `${slug}-2` }, 409);

  if (!(await seriesExists(env, series_slug ?? null))) {
    return adminJson({ error: 'invalid_series_slug', series_slug }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  const isPublished = status === 'published';
  const bodyJsonStr = typeof body_json === 'string' ? body_json : JSON.stringify(body_json);
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

  const result = await env.DB.prepare(
    `INSERT INTO posts (slug, title, body_json, body_html, body_md, summary, series_slug, tags, status, created_at, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    slug, title, bodyJsonStr, sanitizeBodyHtml(body_html), body_md ?? '',
    summary ?? null, series_slug ?? null, tagsJson,
    isPublished ? 'published' : 'draft',
    now, isPublished ? now : null, now
  ).run();

  return adminJson({ id: result.meta.last_row_id, slug }, 201);
}

async function handleAdminUpdatePost(id, request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  let body;
  try { body = await request.json(); } catch { return adminJson({ error: 'invalid_json' }, 400); }

  const existing = await env.DB.prepare(`SELECT * FROM posts WHERE id = ?`).bind(id).first();
  if (!existing) return adminJson({ error: 'not_found' }, 404);

  // Reject unknown status at the boundary — otherwise it hits the DB CHECK and 500s.
  if (body.status != null && body.status !== 'draft' && body.status !== 'published') {
    return adminJson({ error: 'invalid_status', status: body.status }, 400);
  }

  // Sanitize incoming HTML server-side before it is merged/stored (defense in
  // depth on top of client render-time DOMPurify).
  if (typeof body.body_html === 'string') body.body_html = sanitizeBodyHtml(body.body_html);

  const now = Math.floor(Date.now() / 1000);
  const fields = computePostUpdate(body, existing, now);

  // Only validate the series when it actually changed (it was valid when last written).
  if (fields.series_slug !== existing.series_slug && !(await seriesExists(env, fields.series_slug))) {
    return adminJson({ error: 'invalid_series_slug', series_slug: fields.series_slug }, 400);
  }

  await env.DB.prepare(
    `UPDATE posts SET title=?, body_json=?, body_html=?, body_md=?, summary=?, series_slug=?, tags=?, status=?, published_at=?, updated_at=? WHERE id=?`
  ).bind(
    fields.title, fields.body_json, fields.body_html, fields.body_md,
    fields.summary, fields.series_slug, fields.tags, fields.status,
    fields.published_at, fields.updated_at, id
  ).run();

  return adminJson({ id: Number(id), slug: existing.slug });
}

async function handleAdminDeletePost(id, request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;
  const existing = await env.DB.prepare(`SELECT id FROM posts WHERE id = ?`).bind(id).first();
  if (!existing) return adminJson({ error: 'not_found' }, 404);
  await env.DB.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();
  return adminJson({ deleted: true });
}

async function handleAdminCreateSeries(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;
  let body;
  try { body = await request.json(); } catch { return adminJson({ error: 'invalid_json' }, 400); }
  if (!body.title) return adminJson({ error: 'missing_fields', required: ['title'] }, 400);
  const slug = deriveSlug(body.title);
  try {
    const result = await env.DB.prepare(
      `INSERT INTO series (slug, title, description) VALUES (?, ?, ?)`
    ).bind(slug, body.title, body.description ?? null).run();
    return adminJson({ id: result.meta.last_row_id, slug }, 201);
  } catch (e) {
    if (String(e).includes('UNIQUE')) return adminJson({ error: 'slug_conflict', suggested: `${slug}-2` }, 409);
    throw e;
  }
}

async function handleAdminListSeries(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;
  const rows = await env.DB.prepare(`SELECT * FROM series ORDER BY title`).all();
  return adminJson({ series: rows.results });
}

// ─── SEO / GEO: server-side <head> for blog routes (SSR-lite) ───────────────────
// Crawlers and social/AI scrapers don't run JS, so the SPA shell is contentless
// to them. For blog routes we fetch index.html and inject per-route title, meta,
// canonical, OG/Twitter, and JSON-LD from D1 before serving.

const SITE = 'https://aebrahmramos.dev';
const OG_IMAGE = 'https://wcnushafgkumpgjy.public.blob.vercel-storage.com/og-image.png';

function escAttr(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escText(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function applyMeta(html, { title, description, url, image, ogType }) {
  const setMeta = (h, attr, name, value) => {
    const re = new RegExp(`(<meta\\s+${attr}=["']${name}["']\\s+content=)["'][^"']*["']`, 'i');
    return re.test(h) ? h.replace(re, `$1"${escAttr(value)}"`) : h;
  };
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escText(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'twitter:title', title);
  html = setMeta(html, 'property', 'twitter:description', description);
  html = setMeta(html, 'property', 'twitter:url', url);
  html = setMeta(html, 'property', 'twitter:image', image);
  if (ogType) html = setMeta(html, 'property', 'og:type', ogType);
  const canonical = `<link rel="canonical" href="${escAttr(url)}" />`;
  html = /<link\s+rel=["']canonical["']/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonical)
    : html.replace('</head>', `  ${canonical}\n</head>`);
  return html;
}

export function injectJsonLd(html, ...objs) {
  // Escape `<` so a post title/summary containing </script> can't break out.
  const scripts = objs.map(o =>
    `  <script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
  ).join('\n');
  return html.replace('</head>', `${scripts}\n</head>`);
}

export function blogPostingJsonLd(row, url) {
  const keywords = parseTags(row.tags).join(', ');
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: row.title,
    ...(row.summary ? { description: row.summary } : {}),
    ...(row.published_at ? { datePublished: new Date(row.published_at * 1000).toISOString() } : {}),
    ...(row.updated_at ? { dateModified: new Date(row.updated_at * 1000).toISOString() } : {}),
    author: { '@type': 'Person', name: 'Aebrahm Ramos', url: SITE },
    image: OG_IMAGE,
    url,
    mainEntityOfPage: url,
    ...(keywords ? { keywords } : {}),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
      Link: LINK_HEADER,
      Vary: 'Accept',
      ...SECURITY_HEADERS,
    },
  });
}

async function handleBlogHtml(pathname, request, env) {
  const shell = await env.ASSETS.fetch(new URL('/index.html', request.url));
  const baseHtml = await shell.text();

  const postMatch = pathname.match(/^\/blog\/([^/]+)$/);
  const seriesMatch = pathname.match(/^\/blog\/series\/([^/]+)$/);

  if (postMatch && postMatch[1] !== 'series') {
    const slug = decodeURIComponent(postMatch[1]);
    const row = await env.DB.prepare(
      `SELECT slug, title, summary, series_slug, tags, published_at, updated_at
       FROM posts WHERE slug = ? AND status = 'published'`
    ).bind(slug).first();
    if (!row) return htmlResponse(baseHtml, 404); // real 404, not a soft-404
    const url = `${SITE}/blog/${row.slug}`;
    const title = `${row.title} — Aebrahm Ramos`;
    const description = row.summary || `${row.title} — writing by Aebrahm Ramos.`;
    let html = applyMeta(baseHtml, { title, description, url, image: OG_IMAGE, ogType: 'article' });
    html = injectJsonLd(html,
      blogPostingJsonLd(row, url),
      breadcrumbJsonLd([
        { name: 'Home', url: SITE },
        { name: 'Blog', url: `${SITE}/blog` },
        { name: row.title, url },
      ]),
    );
    return htmlResponse(html);
  }

  if (seriesMatch) {
    const slug = decodeURIComponent(seriesMatch[1]);
    const series = await env.DB.prepare(`SELECT slug, title, description FROM series WHERE slug = ?`).bind(slug).first();
    if (!series) return htmlResponse(baseHtml, 404);
    const url = `${SITE}/blog/series/${series.slug}`;
    const title = `${series.title} — Series — Aebrahm Ramos`;
    const description = series.description || `Posts in the ${series.title} series by Aebrahm Ramos.`;
    let html = applyMeta(baseHtml, { title, description, url, image: OG_IMAGE });
    html = injectJsonLd(html, breadcrumbJsonLd([
      { name: 'Home', url: SITE },
      { name: 'Blog', url: `${SITE}/blog` },
      { name: series.title, url },
    ]));
    return htmlResponse(html);
  }

  // /blog index
  const url = `${SITE}/blog`;
  const title = 'Writing — Aebrahm Ramos';
  const description = 'Technical writing on systems programming, embedded systems, and software engineering by Aebrahm Ramos.';
  let html = applyMeta(baseHtml, { title, description, url, image: OG_IMAGE });
  html = injectJsonLd(html, breadcrumbJsonLd([
    { name: 'Home', url: SITE },
    { name: 'Blog', url },
  ]));
  return htmlResponse(html);
}

async function handleSitemap(env) {
  const [posts, series] = await Promise.all([
    env.DB.prepare(`SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC`).all(),
    env.DB.prepare(`SELECT slug FROM series`).all(),
  ]);
  const day = ts => new Date((ts || 0) * 1000).toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE}/blog`, changefreq: 'weekly', priority: '0.9' },
    ...posts.results.map(p => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: day(p.updated_at), changefreq: 'monthly', priority: '0.8' })),
    ...series.results.map(s => ({ loc: `${SITE}/blog/series/${s.slug}`, changefreq: 'monthly', priority: '0.6' })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u =>
      `  <url><loc>${escText(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}` +
      `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    ).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  });
}

async function handleRssFeed(env) {
  const rows = await env.DB.prepare(
    `SELECT slug, title, summary, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 50`
  ).all();
  const items = rows.results.map(p =>
    `    <item>\n` +
    `      <title>${escText(p.title)}</title>\n` +
    `      <link>${escText(`${SITE}/blog/${p.slug}`)}</link>\n` +
    `      <guid>${escText(`${SITE}/blog/${p.slug}`)}</guid>\n` +
    (p.summary ? `      <description>${escText(p.summary)}</description>\n` : '') +
    (p.published_at ? `      <pubDate>${new Date(p.published_at * 1000).toUTCString()}</pubDate>\n` : '') +
    `    </item>`
  ).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n  <channel>\n` +
    `    <title>Aebrahm Ramos — Blog</title>\n` +
    `    <link>${SITE}/blog</link>\n` +
    `    <description>Technical writing on systems programming, embedded systems, and software engineering.</description>\n` +
    `${items}\n  </channel>\n</rss>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  });
}

// ─── Main fetch handler ────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // .well-known
    if (pathname === '/.well-known/mcp/server-card.json') return jsonResponse(MCP_SERVER_CARD);
    if (pathname === '/.well-known/agent-skills/index.json' || pathname === '/.well-known/agent-skills/') {
      return jsonResponse(AGENT_SKILLS_INDEX);
    }

    // AI SEO
    if (pathname === '/llms.txt') return handleLlmsTxt(env);
    if (pathname === '/sitemap.xml') return handleSitemap(env);
    if (pathname === '/feed.xml') return handleRssFeed(env);

    // Blog read API
    if (pathname === '/api/blog/feed.json') return handleFeed(env);
    if (pathname === '/api/blog' && method === 'GET') return handleGetPosts(request, env);
    if (pathname === '/api/blog/series' && method === 'GET') return handleGetSeriesList(env);

    const seriesPostMatch = pathname.match(/^\/api\/blog\/series\/([^/]+)$/);
    if (seriesPostMatch && method === 'GET') return handleGetSeriesPosts(seriesPostMatch[1], env);

    const postSlugMatch = pathname.match(/^\/api\/blog\/([^/]+)$/);
    if (postSlugMatch && method === 'GET') return handleGetPost(postSlugMatch[1], request, env);

    // Admin API
    if (pathname === '/api/admin/posts' && method === 'GET') return handleAdminListPosts(request, env);
    if (pathname === '/api/admin/posts' && method === 'POST') return handleAdminCreatePost(request, env);
    if (pathname === '/api/admin/series' && method === 'GET') return handleAdminListSeries(request, env);
    if (pathname === '/api/admin/series' && method === 'POST') return handleAdminCreateSeries(request, env);

    const adminPostMatch = pathname.match(/^\/api\/admin\/posts\/(\d+)$/);
    if (adminPostMatch) {
      if (method === 'GET') return handleAdminGetPost(adminPostMatch[1], request, env);
      if (method === 'PATCH') return handleAdminUpdatePost(adminPostMatch[1], request, env);
      if (method === 'DELETE') return handleAdminDeletePost(adminPostMatch[1], request, env);
    }

    // Unmatched API paths get a clean JSON 404 instead of falling through to the
    // SPA shell (which would return index.html with a 200 and break r.json()).
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    // SEO/GEO: server-render the <head> for blog page routes so crawlers and
    // social/AI scrapers (which don't run JS) get real per-route metadata.
    if (method === 'GET' && (pathname === '/blog' || /^\/blog\/[^/]+$/.test(pathname) || /^\/blog\/series\/[^/]+$/.test(pathname))) {
      return handleBlogHtml(pathname, request, env);
    }

    // Markdown content negotiation — only for portfolio root, not blog/api paths
    const accept = request.headers.get('Accept') ?? '';
    if (accept.includes('text/markdown') && !pathname.startsWith('/api/') && !pathname.startsWith('/blog/')) {
      return new Response(portfolioMarkdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Vary': 'Accept',
          Link: LINK_HEADER,
          ...SECURITY_HEADERS,
        },
      });
    }

    // SPA fallback — all unmatched paths (including /blog/*, /admin/*) serve index.html
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.includes('text/html')) return injectLinkHeader(response);
    return withAssetHeaders(response);
  },
};
