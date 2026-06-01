-- Blog schema for portfolio-blog D1 database
-- Already applied to production via Cloudflare MCP

CREATE TABLE IF NOT EXISTS series (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  created_at  INTEGER NOT NULL DEFAULT (UNIXEPOCH())
);

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  body_json    TEXT NOT NULL DEFAULT '{}',
  body_html    TEXT NOT NULL DEFAULT '',
  body_md      TEXT NOT NULL DEFAULT '',
  summary      TEXT,
  series_slug  TEXT REFERENCES series(slug) ON DELETE SET NULL,
  tags         TEXT NOT NULL DEFAULT '[]',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
  created_at   INTEGER NOT NULL DEFAULT (UNIXEPOCH()),
  published_at INTEGER,
  updated_at   INTEGER NOT NULL DEFAULT (UNIXEPOCH())
);

CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_series ON posts(series_slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
