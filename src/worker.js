import {
  portfolioMarkdown,
  aboutData,
  experienceData,
  projectsData,
  contactData,
} from './agent/portfolio-content.js';

const LINK_HEADER = [
  '</.well-known/agent-skills/index.json>; rel="service-desc"',
  '</.well-known/mcp/server-card.json>; rel="service-doc"',
].join(', ');

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
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}

function adminJson(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });
}

function injectLinkHeader(response) {
  const headers = new Headers(response.headers);
  headers.set('Link', LINK_HEADER);
  headers.set('Vary', 'Accept');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// Timing-safe string comparison to prevent token timing attacks
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function deriveSlug(title) {
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

// ─── Public Blog API ──────────────────────────────────────────────────────────

async function handleGetPosts(request, env) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '10', 10)));
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
  return jsonResponse({
    posts: rowsResult.results.map(p => ({ ...p, tags: parseTags(p.tags) })),
    total, page, limit,
    hasMore: offset + limit < total,
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

  const accept = request.headers.get('Accept') ?? '';
  if (accept.includes('text/markdown')) {
    return new Response(row.body_md ?? '', {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'Vary': 'Accept' },
    });
  }
  return jsonResponse({ ...row, tags: parseTags(row.tags) });
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

  const slug = body.slug || deriveSlug(title);
  const existing = await env.DB.prepare(`SELECT id FROM posts WHERE slug = ?`).bind(slug).first();
  if (existing) return adminJson({ error: 'slug_conflict', suggested: `${slug}-2` }, 409);

  const now = Math.floor(Date.now() / 1000);
  const isPublished = status === 'published';
  const bodyJsonStr = typeof body_json === 'string' ? body_json : JSON.stringify(body_json);
  const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

  const result = await env.DB.prepare(
    `INSERT INTO posts (slug, title, body_json, body_html, body_md, summary, series_slug, tags, status, created_at, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    slug, title, bodyJsonStr, body_html ?? '', body_md ?? '',
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

  const now = Math.floor(Date.now() / 1000);
  const isPublishing = body.status === 'published' && existing.status === 'draft';
  const publishedAt = isPublishing ? now : existing.published_at;
  const bodyJsonStr = body.body_json
    ? (typeof body.body_json === 'string' ? body.body_json : JSON.stringify(body.body_json))
    : existing.body_json;
  const tagsJson = body.tags ? JSON.stringify(Array.isArray(body.tags) ? body.tags : []) : existing.tags;

  await env.DB.prepare(
    `UPDATE posts SET title=?, body_json=?, body_html=?, body_md=?, summary=?, series_slug=?, tags=?, status=?, published_at=?, updated_at=? WHERE id=?`
  ).bind(
    body.title ?? existing.title, bodyJsonStr,
    body.body_html ?? existing.body_html, body.body_md ?? existing.body_md,
    body.summary ?? existing.summary, 'series_slug' in body ? body.series_slug : existing.series_slug,
    tagsJson, body.status ?? existing.status,
    publishedAt, now, id
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

    // Markdown content negotiation — only for portfolio root, not blog/api paths
    const accept = request.headers.get('Accept') ?? '';
    if (accept.includes('text/markdown') && !pathname.startsWith('/api/') && !pathname.startsWith('/blog/')) {
      return new Response(portfolioMarkdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Vary': 'Accept',
          Link: LINK_HEADER,
        },
      });
    }

    // SPA fallback — all unmatched paths (including /blog/*, /admin/*) serve index.html
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.includes('text/html')) return injectLinkHeader(response);
    return response;
  },
};
