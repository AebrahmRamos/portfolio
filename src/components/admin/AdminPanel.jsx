import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  PiPlusBold, PiEyeBold, PiPencilSimpleBold, PiTrashBold,
  PiSignOutBold, PiWarningCircleBold,
} from 'react-icons/pi';
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
        setError('That token was not accepted.');
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
          <div className="admin-auth__card">
            <h1 className="admin-auth__title">Admin</h1>
            <p className="admin-auth__subtitle">Sign in to manage posts and series.</p>
            <form className="admin-auth__form" onSubmit={handleSubmit}>
              <div className="admin-field">
                <label htmlFor="admin-token">Admin token</label>
                <input
                  id="admin-token"
                  type="password"
                  className="admin-auth__input"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="admin-auth__error" role="alert">
                  <PiWarningCircleBold size={15} />
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn--primary" disabled={loading || !token}>
                {loading ? 'Checking' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Post List ────────────────────────────────────────────────────────────────

function PostList({ token, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error('fetch_error');
        return r.json();
      })
      .then((d) => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => { setError('Could not load posts.'); setLoading(false); });
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
    if (!ts) return 'Not published';
    return new Date(ts * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  const drafts = posts.filter((p) => p.status === 'draft').length;

  return (
    <section className="admin">
      <div className="admin__container">
        <div className="admin__header">
          <div>
            <h1 className="admin__title">Posts</h1>
            {!loading && !error && (
              <p className="admin__subtitle">
                {posts.length} total{drafts > 0 && `, ${drafts} draft${drafts === 1 ? '' : 's'}`}
              </p>
            )}
          </div>
          <div className="admin-actions">
            <Link to="/admin/new" className="btn btn--primary">
              <PiPlusBold size={15} />
              New post
            </Link>
            <Link to="/blog" className="btn btn--outlined">
              <PiEyeBold size={15} />
              View blog
            </Link>
            <button type="button" onClick={onLogout} className="btn btn--outlined">
              <PiSignOutBold size={15} />
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin__loading">Loading posts</div>
        ) : error ? (
          <div className="admin__notice admin__notice--error">
            <PiWarningCircleBold size={18} />
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="admin__loading">
            No posts yet. <Link to="/admin/new">Write the first one.</Link>
          </div>
        ) : (
          <div className="admin-posts__list">
            {posts.map((post) => (
              <div key={post.id} className="admin-post-item">
                <div className="admin-post-item__info">
                  <p className="admin-post-item__title">{post.title}</p>
                  <p className="admin-post-item__meta">
                    {formatDate(post.published_at)}
                    {post.series_slug && ` in ${post.series_slug}`}
                  </p>
                </div>
                <span className={`admin-post-item__status admin-post-item__status--${post.status}`}>
                  {post.status}
                </span>
                <div className="admin-post-item__actions">
                  <Link to={`/admin/edit/${post.id}`} className="btn btn--sm btn--secondary">
                    <PiPencilSimpleBold size={14} />
                    Edit
                  </Link>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--sm btn--outlined"
                  >
                    <PiEyeBold size={14} />
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.title)}
                    className="btn btn--sm btn--danger"
                    aria-label={`Delete ${post.title}`}
                  >
                    <PiTrashBold size={14} />
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
      <Route index element={<PostList token={token} onLogout={handleLogout} />} />
      <Route path="new" element={<PostEditor token={token} />} />
      <Route path="edit/:id" element={<PostEditor token={token} />} />
    </Routes>
  );
}
