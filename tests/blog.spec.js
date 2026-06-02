// Playwright E2E tests for the blog and admin CMS
// Run with: npx playwright test tests/blog.spec.js
import { test, expect } from '@playwright/test';

const BASE = 'https://aebrahmramos.dev';
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

    // Clean up — delete the test post
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

test.describe('Blog UI', () => {
  test('blog index page loads and shows post', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState('networkidle');
    // Should show at least one post
    const posts = page.locator('.post-row, .post-card');
    await expect(posts.first()).toBeVisible({ timeout: 10000 });
  });

  test('blog post page renders test-post', async ({ page }) => {
    await page.goto(`${BASE}/blog/test-post`);
    await page.waitForLoadState('networkidle');
    // Title should be visible
    await expect(page.locator('h1')).toContainText('Test Post', { timeout: 10000 });
  });

  test('progress bar exists on post page', async ({ page }) => {
    await page.goto(`${BASE}/blog/test-post`);
    await page.waitForLoadState('networkidle');
    const bar = page.locator('.bpr__progress, [class*="progress"]');
    await expect(bar.first()).toBeVisible({ timeout: 10000 });
  });

  test('blog index search filters posts', async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistent xyz abc');
      await page.waitForTimeout(500); // debounce
      const emptyState = page.locator('[class*="empty"], [class*="no-results"]');
      // Either empty state shows OR posts are filtered
      const posts = page.locator('.post-row, .post-card');
      const count = await posts.count();
      expect(count).toBe(0);
    }
  });
});

// ─── Browser: Admin CMS ───────────────────────────────────────────────────────

test.describe('Admin CMS', () => {
  test('admin gate shows login form', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 8000 });
  });

  test('admin login with correct token works', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    // Should navigate to posts list
    await expect(page.locator('text=Posts')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=New post')).toBeVisible({ timeout: 5000 });
  });

  test('admin shows existing test post', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Test Post')).toBeVisible({ timeout: 10000 });
  });

  test('editor loads when clicking Edit', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="password"]').fill(ADMIN_TOKEN);
    await page.locator('button[type="submit"]').click();
    await page.locator('text=New post').click();
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="Post title"]')).toBeVisible();
  });
});
