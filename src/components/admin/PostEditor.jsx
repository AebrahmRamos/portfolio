import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import DOMPurify from 'dompurify';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import {
  PiTextBBold, PiTextItalicBold, PiTextStrikethroughBold, PiCodeBold,
  PiTextHOneBold, PiTextHTwoBold, PiTextHThreeBold,
  PiListBulletsBold, PiListNumbersBold, PiQuotesBold, PiCodeBlockBold,
  PiLinkBold, PiLinkBreakBold, PiImageBold, PiUploadSimpleBold,
  PiArrowCounterClockwiseBold, PiArrowClockwiseBold,
  PiArrowLeftBold, PiXBold, PiWarningCircleBold, PiCheckCircleBold, PiPlusBold,
} from 'react-icons/pi';
import './admin.css';

const lowlight = createLowlight(common);

function deriveSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toMarkdown(editor) {
  try {
    return defaultMarkdownSerializer.serialize(editor.state.doc);
  } catch {
    return editor.getText();
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function ToolButton({ icon, label, onClick, active, disabled }) {
  return (
    <button
      type="button"
      className={`tb__btn${active ? ' tb__btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
    >
      {icon}
    </button>
  );
}

/**
 * The toolbar used to render letterforms and emoji as its icons ("B", "I",
 * "S̶", "`", "```", a paperclip emoji, arrows). Those are not icons, they are
 * text pretending to be icons, and they inherited none of the sizing or
 * alignment a real glyph set gives you.
 *
 * Link and image insertion used window.prompt(), and picking between upload and
 * URL used window.confirm() with "OK for file picker, Cancel to enter URL",
 * which is the kind of prompt you write for yourself and then never fix. Both
 * now use an inline bar inside the editor chrome.
 */
function Toolbar({ editor }) {
  const [bar, setBar] = useState(null); // null | 'link' | 'image'
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (bar) inputRef.current?.focus();
  }, [bar]);

  if (!editor) return null;

  const openLink = () => {
    setValue(editor.getAttributes('link').href ?? '');
    setBar('link');
  };

  const openImage = () => {
    setValue('');
    setBar('image');
  };

  const close = () => { setBar(null); setValue(''); editor.chain().focus().run(); };

  const apply = (e) => {
    e.preventDefault();
    const url = value.trim();
    if (!url) return;
    if (bar === 'link') editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    else editor.chain().focus().setImage({ src: url }).run();
    close();
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    close();
  };

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const dataUrl = await fileToBase64(file);
    editor.chain().focus().setImage({ src: dataUrl }).run();
    close();
  };

  return (
    <div className="tb">
      <div className="tb__row" role="toolbar" aria-label="Formatting">
        <div className="tb__group">
          <ToolButton icon={<PiTextBBold size={16} />} label="Bold" active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolButton icon={<PiTextItalicBold size={16} />} label="Italic" active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolButton icon={<PiTextStrikethroughBold size={16} />} label="Strikethrough" active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()} />
          <ToolButton icon={<PiCodeBold size={16} />} label="Inline code" active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()} />
        </div>

        <div className="tb__group">
          <ToolButton icon={<PiTextHOneBold size={16} />} label="Heading 1" active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
          <ToolButton icon={<PiTextHTwoBold size={16} />} label="Heading 2" active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolButton icon={<PiTextHThreeBold size={16} />} label="Heading 3" active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        </div>

        <div className="tb__group">
          <ToolButton icon={<PiListBulletsBold size={16} />} label="Bullet list" active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <ToolButton icon={<PiListNumbersBold size={16} />} label="Numbered list" active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <ToolButton icon={<PiQuotesBold size={16} />} label="Quote" active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolButton icon={<PiCodeBlockBold size={16} />} label="Code block" active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        </div>

        <div className="tb__group">
          <ToolButton icon={<PiLinkBold size={16} />} label="Link" active={editor.isActive('link')} onClick={openLink} />
          <ToolButton icon={<PiImageBold size={16} />} label="Image" onClick={openImage} />
        </div>

        <div className="tb__group tb__group--end">
          <ToolButton icon={<PiArrowCounterClockwiseBold size={16} />} label="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()} />
          <ToolButton icon={<PiArrowClockwiseBold size={16} />} label="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()} />
        </div>
      </div>

      {bar && (
        <form className="tb__bar" onSubmit={apply}>
          <label className="tb__bar-label" htmlFor="tb-url">
            {bar === 'link' ? 'Link URL' : 'Image URL'}
          </label>
          <input
            id="tb-url"
            ref={inputRef}
            className="tb__bar-input"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
          />
          <button type="submit" className="btn btn--sm btn--primary" disabled={!value.trim()}>
            Apply
          </button>
          {bar === 'image' && (
            <>
              <button type="button" className="btn btn--sm btn--outlined" onClick={() => fileRef.current?.click()}>
                <PiUploadSimpleBold size={14} />
                Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickFile} />
            </>
          )}
          {bar === 'link' && editor.isActive('link') && (
            <button type="button" className="btn btn--sm btn--outlined" onClick={removeLink}>
              <PiLinkBreakBold size={14} />
              Remove
            </button>
          )}
          <button type="button" className="tb__bar-close" onClick={close} aria-label="Close">
            <PiXBold size={14} />
          </button>
        </form>
      )}
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
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  const editor = useEditor({
    extensions: [
      // StarterKit ships the Link extension in Tiptap 3. Adding
      // @tiptap/extension-link on top of it registered 'link' twice and Tiptap
      // logged "Duplicate extension names found: ['link']" on every mount.
      // Configure it through StarterKit instead of stacking a second copy.
      StarterKit.configure({
        codeBlock: false,
        link: { openOnClick: false, autolink: true },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: 'Start writing' }),
    ],
    editorProps: {
      attributes: { 'aria-label': 'Post body', role: 'textbox' },
      // Handle image paste and drag-drop, convert to base64 and insert
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (!imageItem) return false;

        event.preventDefault();
        const file = imageItem.getAsFile();
        if (!file) return false;

        fileToBase64(file).then((dataUrl) => {
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: dataUrl })
            )
          );
        }).catch(() => {});
        return true;
      },
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith('image/'));
        if (!imageFile) return false;

        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coords) return false;

        fileToBase64(imageFile).then((dataUrl) => {
          const node = view.state.schema.nodes.image.create({ src: dataUrl });
          view.dispatch(view.state.tr.insert(coords.pos, node));
        }).catch(() => {});
        return true;
      },
    },
  });

  // Load existing post for edit
  useEffect(() => {
    if (!isEdit || !editor) return undefined;

    // React runs effects twice in development, and Tiptap destroys the editor
    // instance in the cleanup between the two runs. The first fetch then
    // resolved against a dead editor and `editor.commands` threw, which the
    // old code swallowed into a blank form. Ignore results from a run that has
    // already been cleaned up, and never touch a destroyed editor.
    let cancelled = false;

    fetch(`/api/admin/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'not_found' : 'fetch_error');
        return r.json();
      })
      .then((post) => {
        if (cancelled || editor.isDestroyed) return;
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
            // An empty object is valid JSON but not a valid ProseMirror doc.
            if (doc && doc.type) editor.commands.setContent(doc);
            else editor.commands.setContent(post.body_html ?? '');
          } catch {
            editor.commands.setContent(post.body_html ?? '');
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (import.meta.env.DEV) console.error('[PostEditor] load failed', err);
        // A failed load used to leave a blank form with no message, which looks
        // exactly like an empty post. Saving from that state would have
        // overwritten the real one with nothing.
        setLoadError(err.message === 'not_found'
          ? 'That post does not exist. It may have been deleted.'
          : 'Could not load this post. Refresh to try again.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isEdit, id, token, editor]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/series', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAllSeries(d.series ?? []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!slugManual && title) setSlug(deriveSlug(title));
  }, [title, slugManual]);

  const save = useCallback(async (targetStatus) => {
    if (!editor || !title) return;
    setSaveState('saving');
    setError('');

    const payload = {
      title,
      summary: summary || null,
      slug,
      body_json: editor.getJSON(),
      body_html: DOMPurify.sanitize(editor.getHTML()),
      body_md: toMarkdown(editor),
      series_slug: seriesSlug || null,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: targetStatus ?? status,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/posts/${id}` : '/api/admin/posts', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        const d = await res.json();
        setError(`That slug is taken. Try "${d.suggested}".`);
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
      setStatus(payload.status);
      if (!isEdit) navigate(`/admin/edit/${d.id}`, { replace: true });
    } catch {
      setError('Network error. Your work is still in the editor.');
      setSaveState('error');
    }
  }, [editor, title, summary, slug, seriesSlug, tags, status, isEdit, id, token, navigate]);

  // Cmd/Ctrl+S saves a draft. Writers reach for it whether you wire it or not,
  // and without this the browser's own save-page dialog opens over the editor.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save('draft');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  // Clear the "Saved" pill once the author starts typing again.
  useEffect(() => {
    if (saveState === 'saved') setSaveState('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, summary, slug, tags, seriesSlug]);

  if (loading) {
    return (
      <section className="admin">
        <div className="admin__container">
          <div className="admin__loading">Loading post</div>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="admin">
        <div className="admin__container">
          <Link to="/admin" className="btn btn--outlined btn--sm">
            <PiArrowLeftBold size={14} />
            Posts
          </Link>
          <div className="admin__notice admin__notice--error">
            <PiWarningCircleBold size={18} />
            <p>{loadError}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin admin--editor">
      <header className="admin__bar">
        <div className="admin__bar-inner">
          <div className="admin__bar-left">
            <Link to="/admin" className="admin__back" aria-label="Back to posts">
              <PiArrowLeftBold size={15} />
              Posts
            </Link>
            <span className="admin__bar-sep" aria-hidden="true" />
            <span className="admin__bar-title">{isEdit ? title || 'Untitled post' : 'New post'}</span>
            <span className={`admin__pill admin__pill--${status}`}>{status}</span>
          </div>

          <div className="admin__bar-right">
            {saveState === 'saving' && <span className="admin__save">Saving</span>}
            {saveState === 'saved' && (
              <span className="admin__save admin__save--ok">
                <PiCheckCircleBold size={14} />
                Saved
              </span>
            )}
            <button type="button" className="btn btn--outlined btn--sm" onClick={() => save('draft')}>
              Save draft
            </button>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => save('published')}>
              {status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
        {saveState === 'error' && (
          <p className="admin__bar-error" role="alert">
            <PiWarningCircleBold size={15} />
            {error}
          </p>
        )}
      </header>

      <div className="admin__container">
        <h1 className="sr-only">{isEdit ? `Edit post: ${title || 'Untitled'}` : 'New post'}</h1>

        <div className="admin-editor">
          <div className="admin-editor__main">
            <input
              className="admin-editor__title"
              type="text"
              placeholder="Post title"
              aria-label="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Toolbar editor={editor} />
            <div className="admin-editor__canvas">
              <EditorContent editor={editor} />
            </div>
          </div>

          <aside className="admin-editor__sidebar">
            <section className="admin-card">
              <h2 className="admin-card__title">Details</h2>

              <div className="admin-field">
                <label htmlFor="f-slug">Slug</label>
                <input
                  id="f-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                  placeholder="post-slug"
                />
                <span className="admin-field__help">/blog/{slug || 'post-slug'}</span>
              </div>

              <div className="admin-field">
                <label htmlFor="f-summary">Summary</label>
                <textarea
                  id="f-summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One sentence. Shows on the index and in search results."
                />
              </div>

              <div className="admin-field">
                <label htmlFor="f-tags">Tags</label>
                <input
                  id="f-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="systems, embedded, c"
                />
                <span className="admin-field__help">Comma separated.</span>
              </div>
            </section>

            <section className="admin-card">
              <h2 className="admin-card__title">Series</h2>
              <div className="admin-field">
                <label htmlFor="f-series">Part of</label>
                <select id="f-series" value={seriesSlug} onChange={(e) => setSeriesSlug(e.target.value)}>
                  <option value="">No series</option>
                  {allSeries.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </div>
              <CreateSeriesInline
                token={token}
                onCreated={(s) => { setAllSeries((prev) => [...prev, s]); setSeriesSlug(s.slug); }}
              />
            </section>
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
  const [err, setErr] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/admin/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description: desc }),
      });
      const d = await res.json();
      if (!res.ok) {
        setErr(d.error === 'slug_conflict' ? 'A series with that name exists.' : 'Could not create series.');
        return;
      }
      onCreated({ slug: d.slug, title, description: desc, post_count: 0 });
      setTitle(''); setDesc(''); setShow(false);
    } catch {
      setErr('Network error.');
    } finally {
      setLoading(false);
    }
  }

  if (!show) {
    return (
      <button type="button" className="btn btn--sm btn--outlined" onClick={() => setShow(true)}>
        <PiPlusBold size={14} />
        New series
      </button>
    );
  }

  return (
    <form className="admin-subform" onSubmit={handleCreate}>
      <div className="admin-field">
        <label htmlFor="f-series-title">Name</label>
        <input
          id="f-series-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bare Metal"
          required
          autoFocus
        />
      </div>
      <div className="admin-field">
        <label htmlFor="f-series-desc">Description</label>
        <input
          id="f-series-desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional"
        />
      </div>
      {err && <p className="admin-field__error">{err}</p>}
      <div className="admin-subform__actions">
        <button type="submit" className="btn btn--sm btn--primary" disabled={loading || !title.trim()}>
          {loading ? 'Creating' : 'Create'}
        </button>
        <button type="button" className="btn btn--sm btn--outlined" onClick={() => setShow(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
