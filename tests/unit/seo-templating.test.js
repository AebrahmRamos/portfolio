import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyMeta, injectJsonLd, blogPostingJsonLd, breadcrumbJsonLd, readMinutes } from '../../src/worker.js';

const SHELL = `<!DOCTYPE html><html><head>
<title>Aebrahm Ramos - Portfolio</title>
<meta name="description" content="old desc" />
<meta property="og:title" content="old" />
<meta property="og:description" content="old" />
<meta property="og:url" content="https://aebrahmramos.dev/" />
<meta property="og:type" content="website" />
<meta property="twitter:title" content="old" />
<meta property="twitter:url" content="https://aebrahmramos.dev/" />
</head><body></body></html>`;

test('applyMeta rewrites title, description, og, type and adds canonical', () => {
  const out = applyMeta(SHELL, {
    title: 'Hello, RTOS | Aebrahm Ramos',
    description: 'A tiny RTOS.',
    url: 'https://aebrahmramos.dev/blog/hello-rtos',
    image: 'https://img/og.png',
    ogType: 'article',
  });
  assert.match(out, /<title>Hello, RTOS | Aebrahm Ramos<\/title>/);
  assert.match(out, /<meta name="description" content="A tiny RTOS\." \/>/);
  assert.match(out, /<meta property="og:title" content="Hello, RTOS | Aebrahm Ramos"/);
  assert.match(out, /<meta property="og:url" content="https:\/\/aebrahmramos\.dev\/blog\/hello-rtos"/);
  assert.match(out, /<meta property="og:type" content="article"/);
  assert.match(out, /<link rel="canonical" href="https:\/\/aebrahmramos\.dev\/blog\/hello-rtos" \/>/);
});

test('applyMeta escapes quotes and angle brackets in attribute values', () => {
  const out = applyMeta(SHELL, { title: 'A', description: 'He said "hi" <b>', url: 'https://x/y', image: 'i' });
  assert.match(out, /content="He said &quot;hi&quot; &lt;b&gt;"/);
});

test('injectJsonLd inserts before </head> and neutralizes </script> breakouts', () => {
  const out = injectJsonLd('<head></head>', { a: '</script><script>alert(1)</script>' });
  assert.match(out, /<\/script>\n<\/head>/);
  assert.ok(!out.includes('</script><script>alert(1)'));
  assert.ok(out.includes('\\u003c/script'));
});

test('blogPostingJsonLd builds a valid BlogPosting with ISO dates and keywords', () => {
  const ld = blogPostingJsonLd(
    { title: 'T', summary: 'S', tags: '["a","b"]', published_at: 1700000000, updated_at: 1700000100 },
    'https://x/blog/t'
  );
  assert.equal(ld['@type'], 'BlogPosting');
  assert.equal(ld.headline, 'T');
  assert.equal(ld.datePublished, new Date(1700000000 * 1000).toISOString());
  assert.equal(ld.dateModified, new Date(1700000100 * 1000).toISOString());
  assert.equal(ld.keywords, 'a, b');
  assert.equal(ld.author.name, 'Aebrahm Ramos');
  assert.equal(ld.mainEntityOfPage, 'https://x/blog/t');
});

test('blogPostingJsonLd omits empty optional fields', () => {
  const ld = blogPostingJsonLd({ title: 'T', summary: null, tags: '[]', published_at: null, updated_at: null }, 'u');
  assert.ok(!('description' in ld));
  assert.ok(!('datePublished' in ld));
  assert.ok(!('keywords' in ld));
});

test('breadcrumbList numbers items from 1 in order', () => {
  const bc = breadcrumbJsonLd([{ name: 'Home', url: 'h' }, { name: 'Blog', url: 'b' }, { name: 'Post', url: 'p' }]);
  assert.equal(bc['@type'], 'BreadcrumbList');
  assert.equal(bc.itemListElement[0].position, 1);
  assert.equal(bc.itemListElement[2].position, 3);
  assert.equal(bc.itemListElement[2].name, 'Post');
  assert.equal(bc.itemListElement[2].item, 'p');
});

test('applyMeta replaces an existing canonical rather than adding a second', () => {
  const shell = SHELL.replace(
    '</head>',
    '<link rel="canonical" href="https://aebrahmramos.dev/" />\n</head>'
  );
  const out = applyMeta(shell, {
    title: 'T',
    description: 'D',
    url: 'https://aebrahmramos.dev/blog/x',
    image: 'i',
  });
  const canonicals = out.match(/<link rel="canonical"/g) ?? [];
  assert.equal(canonicals.length, 1);
  assert.match(out, /<link rel="canonical" href="https:\/\/aebrahmramos\.dev\/blog\/x" \/>/);
});

test('readMinutes floors at one minute and returns null for empty bodies', () => {
  assert.equal(readMinutes(0), null);
  assert.equal(readMinutes(null), null);
  assert.equal(readMinutes(undefined), null);
  // Anything with content reads as at least a minute rather than "0 min read".
  assert.equal(readMinutes(10), 1);
  assert.equal(readMinutes(500), 1);
});

test('readMinutes scales with length at ~238wpm over 5.5 chars per word', () => {
  // 5.5 * 238 = 1309 chars per minute.
  assert.equal(readMinutes(1309 * 4), 4);
  assert.equal(readMinutes(1309 * 10), 10);
});
