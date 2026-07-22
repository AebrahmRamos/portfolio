import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeBodyHtml } from '../../src/sanitize.js';

test('strips <script> and drops its content', () => {
  const out = sanitizeBodyHtml('<p>hi</p><script>alert(1)</script>');
  assert.ok(!out.includes('<script'));
  assert.ok(!out.includes('alert(1)'));
  assert.match(out, /<p>hi<\/p>/);
});

test('removes on* event handlers but keeps the element', () => {
  const out = sanitizeBodyHtml('<img src="x.png" onerror="alert(1)" alt="a">');
  assert.ok(!out.toLowerCase().includes('onerror'));
  assert.match(out, /<img[^>]*src="x.png"/);
});

test('drops javascript: URIs on links', () => {
  const out = sanitizeBodyHtml('<a href="javascript:alert(1)">x</a>');
  assert.ok(!out.includes('javascript:'));
  assert.match(out, />x<\/a>/);
});

test('removes iframes from non-allowlisted hosts', () => {
  const out = sanitizeBodyHtml('<iframe src="https://evil.com/x"></iframe>');
  assert.ok(!out.includes('evil.com'));
  assert.ok(!out.includes('<iframe'));
});

test('keeps allowlisted youtube iframe and forces a sandbox without allow-same-origin', () => {
  const out = sanitizeBodyHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe>');
  assert.match(out, /<iframe/);
  assert.match(out, /youtube\.com\/embed\/abc/);
  assert.match(out, /sandbox="[^"]*allow-scripts/);
  assert.ok(!out.includes('allow-same-origin'));
});

test('strips protocol-relative iframe (//evil.com)', () => {
  const out = sanitizeBodyHtml('<iframe src="//evil.com/x"></iframe>');
  assert.ok(!out.includes('evil.com'));
});

test('preserves safe editorial markup (Tiptap output)', () => {
  const html = '<h2>Title</h2><p><strong>bold</strong> and <em>italic</em></p>' +
    '<pre><code class="language-js">x</code></pre><blockquote>q</blockquote>' +
    '<ul><li>a</li></ul>';
  const out = sanitizeBodyHtml(html);
  assert.match(out, /<h2>Title<\/h2>/);
  assert.match(out, /<strong>bold<\/strong>/);
  assert.match(out, /<em>italic<\/em>/);
  assert.match(out, /<code class="language-js">/);
  assert.match(out, /<blockquote>q<\/blockquote>/);
  assert.match(out, /<li>a<\/li>/);
});

test('adds rel="noopener noreferrer" to links', () => {
  const out = sanitizeBodyHtml('<a href="https://example.com" target="_blank">x</a>');
  assert.match(out, /rel="noopener noreferrer"/);
});

test('empty / nullish input returns an empty string', () => {
  assert.equal(sanitizeBodyHtml(''), '');
  assert.equal(sanitizeBodyHtml(null), '');
  assert.equal(sanitizeBodyHtml(undefined), '');
});
