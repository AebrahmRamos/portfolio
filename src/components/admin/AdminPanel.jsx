import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../m3';
import PostEditor from './PostEditor';
import './admin.css';

// ─── Auth Gate ────────────────────────────────────────────────────────────────

function AuthGate({ onAuth }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        sessionStorage.setItem('adminToken', token);
        onAuth(token);
      } else {
        setError('Invalid token. Check your ADMIN_TOKEN.');
      }
    } catch {
      setError('Network error. Try again.');
    }
    setLoading(false);
  }

  return (
    <section className="admin">
      <div className="admin__container">
        <div className="admin-auth">
          <Card variant="elevated" className="admin-auth__card">
            <h1 className="m3-headline-medium admin-auth__title">Admin</h1>
            <p className="m3-body-medium admin-auth__subtitle">
              Enter your admin token to manage posts
            </p>
            <form className="admin-auth__form" onSubmit={handleSubmit}>
              <input
                type="password"
                className="admin-auth__input"
                placeholder="Admin token"
                value={token}
                onChange={e => setToken(e.target.value)}
                autoFocus
                required
              />
              {error && <p className="admin-auth__error">{error}</p>}
              <button type="submit" className="btn btn--primary" disabled={loading || !token}>
                {loading ? 'Verifying…' : 'Sign in'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Post List ────────────────────────────────────────────────────────────────

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(() => {
    fetch('/api/admin/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  function formatDate(ts) {
    if (!ts) return 'Draft';
    return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="admin">
        <div className="admin__container">
          <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <section className="admin">
      <div className="admin__container">
        <div className="admin__header">
          <h1 className="m3-headline-large admin__title">Posts</h1>
          <div className="admin-actions">
            <Link to="/admin/new" className="btn btn--primary">+ New post</Link>
            <Link to="/blog" className="btn btn--outlined">View blog</Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <Card variant="outlined" style={{ padding: 32, textAlign: 'center' }}>
            <p className="m3-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              No posts yet.{' '}
              <Link to="/admin/new" style={{ color: 'var(--md-sys-color-primary)' }}>
                Write your first post →
              </Link>
            </p>
          </Card>
        ) : (
          <div className="admin-posts__list">
            {posts.map(post => (
              <div key={post.id} className="admin-post-item">
                <div className="admin-post-item__info">
                  <p className="m3-title-medium admin-post-item__title">{post.title}</p>
                  <p className="admin-post-item__meta">
                    {post.series_slug && <span>{post.series_slug} · </span>}
                    {formatDate(post.published_at)}
                  </p>
                </div>
                <span className={`admin-post-item__status admin-post-item__status--${post.status}`}>
                  {post.status}
                </span>
                <div className="admin-post-item__actions">
                  <Link to={`/admin/edit/${post.id}`} className="btn btn--sm btn--secondary">Edit</Link>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="btn btn--sm btn--outlined">
                    View
                  </a>
                  <button onClick={() => handleDelete(post.id, post.title)} className="btn btn--sm btn--danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Admin Panel router ───────────────────────────────────────────────────────

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') ?? '');

  function handleAuth(t) { setToken(t); }
  function handleLogout() {
    sessionStorage.removeItem('adminToken');
    setToken('');
  }

  if (!token) return <AuthGate onAuth={handleAuth} />;

  return (
    <Routes>
      <Route index element={<PostList token={token} />} />
      <Route path="new" element={<PostEditor token={token} />} />
      <Route path="edit/:id" element={<PostEditor token={token} />} />
    </Routes>
  );
}
