import sanitizeHtml from 'sanitize-html';

// Server-side defense-in-depth for post body_html. The Worker stores body_html
// verbatim and the only other gate is client render-time DOMPurify, so a leaked
// admin token could POST arbitrary HTML. This sanitizes on write with an allowlist
// matching Tiptap's output (StarterKit + Image + Link + CodeBlockLowlight + tables)
// and mirrors the youtube/vimeo iframe allowlist used client-side in BlogPost.jsx.

const IFRAME_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'];

const OPTIONS = {
  allowedTags: [
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'strong', 'b', 'em', 'i', 's', 'strike', 'del', 'mark', 'sub', 'sup', 'u',
    'a', 'img', 'iframe',
    'span', 'div', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title', 'sandbox', 'loading'],
    // class needed for lowlight syntax-highlight tokens and code language hints
    code: ['class'],
    pre: ['class'],
    span: ['class'],
    div: ['class'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
  },
  // on* handlers are dropped automatically (not in allowedAttributes).
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowProtocolRelative: false,
  allowedIframeHostnames: IFRAME_HOSTS,
  // A disallowed-host iframe has its src stripped, leaving an empty shell; drop
  // it entirely rather than render a blank frame.
  exclusiveFilter: (frame) => frame.tag === 'iframe' && !frame.attribs.src,
  // sanitize-html drops <script>/<style> content via its default nonTextTags.
  transformTags: {
    iframe: (tagName, attribs) => ({
      tagName: 'iframe',
      // allow-same-origin is intentionally omitted (dangerous combined with
      // allow-scripts); allowlisted youtube/vimeo embeds play without it.
      attribs: { ...attribs, sandbox: 'allow-scripts allow-presentation allow-popups allow-fullscreen', loading: 'lazy' },
    }),
    a: (tagName, attribs) => ({
      tagName: 'a',
      attribs: { ...attribs, rel: 'noopener noreferrer' },
    }),
  },
};

export function sanitizeBodyHtml(html) {
  if (!html) return '';
  try {
    return sanitizeHtml(html, OPTIONS);
  } catch {
    // Fail safe: never store raw HTML if the sanitizer errors — escape to text
    // so a downstream renderer can't execute it.
    return String(html).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
