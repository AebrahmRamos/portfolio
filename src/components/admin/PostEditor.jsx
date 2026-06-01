import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import DOMPurify from 'dompurify';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import './admin.css';

const lowlight = createLowlight(common);

function deriveSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Serialize Tiptap doc to markdown using prosemirror-markdown
function toMarkdown(editor) {
  try {
    return defaultMarkdownSerializer.serialize(editor.state.doc);
  } catch {
    return editor.getText();
  }
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor }) {
  if (!editor) return null;

  const btn = (label, action, active, title) => (
    <button
      type="button"
      className={`tiptap-toolbar__btn${active ? ' tiptap-toolbar__btn--active' : ''}`}
      onClick={action}
      title={title || label}
      aria-label={title || label}
    >
      {label}
    </button>
  );

  const addImage = () => {
    const url = prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt('URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="tiptap-toolbar" role="toolbar" aria-label="Formatting">
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold')}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic')}
      {btn('S̶', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'Strike')}
      {btn('`', () => editor.chain().focus().toggleCode().run(), editor.isActive('code'), 'Inline code')}
      <div className="tiptap-toolbar__sep" />
      {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }), 'Heading 1')}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Heading 2')}
      {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'Heading 3')}
      <div className="tiptap-toolbar__sep" />
      {btn('• ', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet list')}
      {btn('1. ', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Numbered list')}
      {btn('" "', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'Blockquote')}
      {btn('```', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), 'Code block')}
      <div className="tiptap-toolbar__sep" />
      <button type="button" className="tiptap-toolbar__btn" onClick={addLink} title="Add link">🔗</button>
      <button type="button" className="tiptap-toolbar__btn" onClick={addImage} title="Insert image">🖼</button>
      <div className="tiptap-toolbar__sep" />
      {btn('↩', () => editor.chain().focus().undo().run(), false, 'Undo')}
      {btn('↪', () => editor.chain().focus().redo().run(), false, 'Redo')}
    </div>
  );
}

// ─── Post Editor ──────────────────────────────────────────────────────────────

export default function PostEditor({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [tags, setTags] = useState('');
  const [seriesSlug, setSeriesSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [allSeries, setAllSeries] = useState([]);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    editorProps: {
      attributes: { 'aria-label': 'Post body', role: 'textbox' },
    },
  });

  // Load existing post for edit
  useEffect(() => {
    if (!isEdit || !editor) return;
    fetch(`/api/admin/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(post => {
        setTitle(post.title ?? '');
        setSummary(post.summary ?? '');
        setSlug(post.slug ?? '');
        setSlugManual(true);
        setTags((post.tags ?? []).join(', '));
        setSeriesSlug(post.series_slug ?? '');
        setStatus(post.status ?? 'draft');
        if (post.body_json) {
          try {
            const doc = typeof post.body_json === 'string' ? JSON.parse(post.body_json) : post.body_json;
            editor.commands.setContent(doc);
          } catch {
            editor.commands.setContent(post.body_html ?? '');
          }
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load post.'); setLoading(false); });
  }, [isEdit, id, token, editor]);

  // Load series list for sidebar
  useEffect(() => {
    fetch('/api/admin/series', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAllSeries(d.series ?? []))
      .catch(() => {});
  }, [token]);

  // Auto-derive slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(deriveSlug(title));
  }, [title, slugManual]);

  async function save(targetStatus) {
    if (!editor || !title) return;
    setSaveState('saving');
    setError('');

    const body_json = editor.getJSON();
    const body_html = DOMPurify.sanitize(editor.getHTML());
    const body_md = toMarkdown(editor);
    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const finalStatus = targetStatus ?? status;

    const payload = {
      title, summary: summary || null, slug, body_json, body_html, body_md,
      series_slug: seriesSlug || null,
      tags: tagsArr, status: finalStatus,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${id}` : '/api/admin/posts';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        const d = await res.json();
        setError(`Slug conflict. Try: ${d.suggested}`);
        setSaveState('error');
        return;
      }

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'Save failed.');
        setSaveState('error');
        return;
      }

      const d = await res.json();
      setSaveState('saved');
      setStatus(finalStatus);
      if (!isEdit) navigate(`/admin/edit/${d.id}`, { replace: true });
    } catch {
      setError('Network error.');
      setSaveState('error');
    }
  }

  if (loading) {
    return (
      <section className="admin">
        <div className="admin__container">
          <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Loading post…</p>
        </div>
      </section>
    );
  }

  const saveStatusLabel = {
    idle: null,
    saving: 'Saving…',
    saved: 'Saved',
    error: `Error: ${error}`,
  }[saveState];

  return (
    <section className="admin">
      <div className="admin__container">
        <div className="admin__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/admin" className="btn btn--outlined btn--sm">← Posts</Link>
            <h1 className="m3-headline-medium admin__title">
              {isEdit ? 'Edit post' : 'New post'}
            </h1>
          </div>
          <div className="admin-actions">
            {saveStatusLabel && (
              <span className={`admin-status admin-status--${saveState}`}>{saveStatusLabel}</span>
            )}
            <button type="button" className="btn btn--outlined" onClick={() => save('draft')}>
              Save draft
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => save('published')}
            >
              {status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="admin-editor">
          {/* Main editing area */}
          <div className="admin-editor__main">
            <div className="admin-field" style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ fontSize: '1.5rem', fontWeight: 700, padding: '12px 16px', border: 'none', borderBottom: '2px solid var(--md-sys-color-outline-variant)', borderRadius: 0, background: 'transparent' }}
              />
            </div>

            <Toolbar editor={editor} />
            <div className="tiptap-editor-wrap">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="admin-editor__sidebar">
            <div className="admin-editor__sidebar-card">
              <p className="admin-editor__sidebar-card-title">Post details</p>

              <div className="admin-field">
                <label>Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugManual(true); }}
                  placeholder="post-slug"
                />
              </div>

              <div className="admin-field">
                <label>Summary</label>
                <textarea
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="One-sentence description for the post card and llms.txt"
                />
              </div>

              <div className="admin-field">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="systems, embedded, c++"
                />
              </div>
            </div>

            <div className="admin-editor__sidebar-card">
              <p className="admin-editor__sidebar-card-title">Series</p>
              <div className="admin-field">
                <label>Series</label>
                <select value={seriesSlug} onChange={e => setSeriesSlug(e.target.value)}>
                  <option value="">— None —</option>
                  {allSeries.map(s => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </div>
              <CreateSeriesInline token={token} onCreated={s => { setAllSeries(prev => [...prev, s]); setSeriesSlug(s.slug); }} />
            </div>

            <div className="admin-editor__sidebar-card">
              <p className="admin-editor__sidebar-card-title">Status</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['draft', 'published'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`btn btn--sm ${status === s ? 'btn--primary' : 'btn--outlined'}`}
                    onClick={() => setStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function CreateSeriesInline({ token, onCreated }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description: desc }),
    });
    const d = await res.json();
    if (res.ok) {
      onCreated({ slug: d.slug, title, description: desc });
      setTitle(''); setDesc(''); setShow(false);
    }
    setLoading(false);
  }

  if (!show) return (
    <button type="button" className="btn btn--sm btn--outlined" onClick={() => setShow(true)}>
      + New series
    </button>
  );

  return (
    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      <input
        className="admin-auth__input"
        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
        placeholder="Series title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        autoFocus
      />
      <input
        className="admin-auth__input"
        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
        placeholder="Description (optional)"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn btn--sm btn--primary" disabled={loading}>Create</button>
        <button type="button" className="btn btn--sm btn--outlined" onClick={() => setShow(false)}>Cancel</button>
      </div>
    </form>
  );
}
