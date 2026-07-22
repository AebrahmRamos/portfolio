import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePostUpdate, deriveSlug } from '../../src/worker.js';

const NOW = 1_700_000_000;
const base = {
  title: 'Old', body_json: '{}', body_html: '<p>old</p>', body_md: 'old',
  summary: 'old summary', series_slug: 'rtos', tags: '["a","b"]',
  status: 'published', published_at: 1_600_000_000, updated_at: 1_600_000_000,
};

test('summary can be cleared with an explicit null', () => {
  assert.equal(computePostUpdate({ summary: null }, base, NOW).summary, null);
});

test('summary is preserved when the key is omitted', () => {
  assert.equal(computePostUpdate({}, base, NOW).summary, 'old summary');
});

test('tags can be cleared with an empty array', () => {
  assert.equal(computePostUpdate({ tags: [] }, base, NOW).tags, '[]');
});

test('tags are preserved when the key is omitted', () => {
  assert.equal(computePostUpdate({}, base, NOW).tags, '["a","b"]');
});

test('publishing a draft sets published_at to now', () => {
  const draft = { ...base, status: 'draft', published_at: null };
  assert.equal(computePostUpdate({ status: 'published' }, draft, NOW).published_at, NOW);
});

test('unpublishing a published post nulls published_at', () => {
  assert.equal(computePostUpdate({ status: 'draft' }, base, NOW).published_at, null);
});

test('editing without a status change keeps published_at', () => {
  const r = computePostUpdate({ title: 'New' }, base, NOW);
  assert.equal(r.published_at, base.published_at);
  assert.equal(r.title, 'New');
});

test('series_slug can be cleared and reassigned', () => {
  assert.equal(computePostUpdate({ series_slug: null }, base, NOW).series_slug, null);
  assert.equal(computePostUpdate({ series_slug: 'embedded' }, base, NOW).series_slug, 'embedded');
});

test('updated_at is always set to now', () => {
  assert.equal(computePostUpdate({}, base, NOW).updated_at, NOW);
});

test('deriveSlug only emits XML-safe [a-z0-9-] (no &, <, >, spaces)', () => {
  for (const t of ['Hello & <World>', 'A/B?c=1', 'Über Café!', '  spaced  out  ']) {
    assert.ok(/^[a-z0-9-]*$/.test(deriveSlug(t)), `unsafe slug for "${t}": ${deriveSlug(t)}`);
  }
  assert.equal(deriveSlug('Hello & World'), 'hello-world');
});
