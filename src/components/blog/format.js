// Shared date formatting for blog views so the index, post, and series pages
// never drift (they previously had three copies that disagreed on month style).
export function formatPostDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
