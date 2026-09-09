// Playwright E2E tests for the blog and admin CMS
// Run with: npx playwright test tests/blog.spec.js
import { test, expect } from '@playwright/test';

// Defaults to production, but a local run can point at `wrangler dev` or a
// preview build with BLOG_TEST_BASE=http://127.0.0.1:5200 so the suite is
// runnable before a deploy rather than only after one.
const BASE = process.env.BLOG_TEST_BASE ?? 'https://aebrahmramos.dev';
const ADMIN_TOKEN = 'dev-change-me-in-production';

// ─── Public Blog API ─────────────────────────────────────────────────────────

test.describe('Blog API', () => {
  test('GET /api/blog returns posts list', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog?page=1&limit=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('posts');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.posts)).toBe(true);
  });

  test('GET /api/blog/test-post returns published post', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog/test-post`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe('test-post');
    expect(body.status).toBe('published');
    expect(body).toHaveProperty('body_html');
    expect(body).toHaveProperty('tags');
    expect(Array.isArray(body.tags)).toBe(true);
  });

  test('GET /api/blog/test-post with Accept: text/markdown returns markdown', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog/test-post`, {
      headers: { Accept: 'text/markdown' },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/markdown');
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /api/blog/nonexistent returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog/this-post-does-not-exist`);
    expect(res.status()).toBe(404);
  });

  test('GET /api/blog/series returns series list', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog/series`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('series');
    expect(Array.isArray(body.series)).toBe(true);
  });

  test('GET /api/blog/feed.json returns JSON Feed', async ({ request }) => {
    const res = await request.get(`${BASE}/api/blog/feed.json`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.version).toContain('jsonfeed.org');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('GET /llms.txt returns AI SEO content', async ({ request }) => {
    const res = await request.get(`${BASE}/llms.txt`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Aebrahm Ramos');
    expect(body).toContain('## Posts');
  });
});

// ─── MCP server card ──────────────────────────────────────────────────────────

test('MCP server card includes blog tools', async ({ request }) => {
  const res = await request.get(`${BASE}/.well-known/mcp/server-card.json`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.capabilities.tools).toContain('get_posts');
  expect(body.capabilities.tools).toContain('get_post_by_slug');
  expect(body.capabilities.tools).toContain('get_series');
  expect(body.serverInfo.version).toBe('1.1.0');
});

// ─── Admin API auth ───────────────────────────────────────────────────────────

test.describe('Admin API', () => {
  test('GET /api/admin/posts without token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/api/admin/posts`);
    expect(res.status()).toBe(401);
  });

  test('GET /api/admin/posts with wrong token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/api/admin/posts`, {
      headers: { Authorization: 'Bearer wrong-token' },
    });
    expect(res.status()).toBe(401);
  });

  test('GET /api/admin/posts with correct token returns posts', async ({ request }) => {
    const res = await request.get(`${BASE}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('posts');
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThan(0);
  });

  test('Admin response has private cache headers', async ({ request }) => {
    const res = await request.get(`${BASE}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    const cc = res.headers()['cache-control'] ?? '';
    expect(cc).toContain('private');
    expect(cc).toContain('no-store');
  });

  test('POST /api/admin/posts creates a draft post', async ({ request }) => {
    const res = await request.post(`${BASE}/api/admin/posts`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'Playwright test post',
        body_json: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello from Playwright' }] }] }),
        body_html: '<p>Hello from Playwright</p>',
        body_md: 'Hello from Playwright',
        summary: 'Created by Playwright test',
        tags: ['playwright', 'test'],
        status: 'draft',
      },
    });
    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty('slug');

    // Clean up: delete the test post
    if (body.id) {
      await request.delete(`${BASE}/api/admin/posts/${body.id}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
    }
  });

  test('POST /api/admin/posts with duplicate slug returns 409', async ({ request }) => {
    const res = await request.post(`${BASE}/api/admin/posts`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'Test Post', // same title → same slug as existing 'test-post'
        body_json: '{}',
        status: 'draft',
      },
    });
    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('slug_conflict');
    expect(body).toHaveProperty('suggested');
  });
});

// ─── Browser: Blog UI ─────────────────────────────────────────────────────────
// Note: SPAs never reach 'networkidle', use element-level waits instead.

test.describe('Blog UI', () => {
  // These used to hardcode the production seed post ('test-post', 'first post
  // for testing', the tag 'c++'), so the whole block failed against any other
  // database. They now read the first post off the index and follow it, which
  // exercises the same paths without pinning to one row.
  async function openFirstPost(page) {
    await page.goto(`${BASE}/blog`);
    const link = page.locator('.post-row__link').first();
    await expect(link).toBeVisible({ timeout: 20000 });
    const title = (await link.innerText()).trim();
    await link.click();
    await expect(page.locator('h1')).toContainText(title, { timeout: 20000 });
    return title;
  }

  test('blog index lists at least one post', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    const posts = page.locator('.post-row');
    await expect(posts.first()).toBeVisible({ timeout: 20000 });
    expect(await posts.count()).toBeGreaterThan(0);
  });

  test('a post page renders its title', async ({ page }) => {
    const title = await openFirstPost(page);
    expect(title.length).toBeGreaterThan(0);
  });

  test('back-to-blog link exists on post page', async ({ page }) => {
    await openFirstPost(page);
    const backLink = page.locator('a[href="/blog"]');
    await expect(backLink.first()).toBeVisible({ timeout: 5000 });
  });

  // Regression: the sanitized body used to be injected from an effect keyed on
  // `post`. For a post that belongs to a series, `post` was set one commit
  // before `loading` cleared, so the effect ran while the skeleton was still
  // mounted, found a null ref, and the article rendered with an empty body.
  test('post body is not empty', async ({ page }) => {
    await openFirstPost(page);
    const body = page.locator('.post__body');
    await expect(body).toBeVisible({ timeout: 20000 });
    await expect
      .poll(async () => (await body.innerText()).trim().length, { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('post tags link back to a filtered index', async ({ page }) => {
    await openFirstPost(page);
    const tag = page.locator('.post__tags .tag').first();
    if (await tag.count() === 0) test.skip(true, 'first post carries no tags');
    const label = (await tag.innerText()).trim();
    await tag.click();
    await expect(page).toHaveURL(new RegExp(`tag=${encodeURIComponent(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  });

  test('blog index search input is present', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page.locator('.post-row').first()).toBeVisible({ timeout: 20000 });
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('xyznonexistent123');
    // Search is debounced by 300ms; poll rather than sleep a fixed amount.
    await expect.poll(async () => page.locator('.post-row').count(), { timeout: 5000 }).toBe(0);
    await expect(page.locator('.blog__empty-title')).toBeVisible();
  });
});

// ─── Browser: Admin CMS ───────────────────────────────────────────────────────

test.describe('Admin CMS', () => {
  test('admin gate shows login form', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
  });

  test('admin login with correct token works', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    // Should navigate to posts list
    await expect(page.locator('text=Posts')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=New post')).toBeVisible({ timeout: 5000 });
  });

  test('admin shows existing test post', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Test Post')).toBeVisible({ timeout: 10000 });
  });

  test('editor loads when clicking Edit', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    await page.locator('text=Edit').first().click();
    // Tiptap editor should be present
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 10000 });
    // Title should be pre-filled
    await expect(page.locator('input[placeholder="Post title"]')).toHaveValue('Test Post', { timeout: 5000 });
  });

  test('new post editor opens with empty Tiptap', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    await page.locator('text=New post').click();
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="Post title"]')).toBeVisible();
  });
});
