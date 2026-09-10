import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

// Language aliases we care about, plus the label shown on the block.
const LABELS = {
  js: 'JavaScript', javascript: 'JavaScript', jsx: 'JSX',
  ts: 'TypeScript', typescript: 'TypeScript', tsx: 'TSX',
  c: 'C', cpp: 'C++', 'c++': 'C++', csharp: 'C#',
  py: 'Python', python: 'Python',
  php: 'PHP', rb: 'Ruby', ruby: 'Ruby', go: 'Go', rust: 'Rust', swift: 'Swift',
  java: 'Java', kotlin: 'Kotlin',
  sql: 'SQL', bash: 'Shell', sh: 'Shell', shell: 'Shell', zsh: 'Shell',
  json: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML',
  html: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS', diff: 'Diff', md: 'Markdown',
  makefile: 'Makefile', dockerfile: 'Dockerfile', armasm: 'Assembly', x86asm: 'Assembly',
};

// hast -> real DOM. We build nodes ourselves rather than assigning innerHTML,
// so nothing here can reintroduce markup that DOMPurify already stripped.
function hastToDom(node, doc) {
  if (node.type === 'text') return doc.createTextNode(node.value);
  const el = doc.createElement(node.tagName || 'span');
  const cls = node.properties?.className;
  if (cls) el.className = Array.isArray(cls) ? cls.join(' ') : String(cls);
  for (const child of node.children ?? []) el.appendChild(hastToDom(child, doc));
  return el;
}

function languageOf(codeEl) {
  const cls = codeEl.getAttribute('class') ?? '';
  const match = cls.match(/(?:language|lang)-([\w+#-]+)/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Syntax-highlight every code block inside `root`, in place.
 *
 * Highlighting happens at render time rather than relying on the markup stored
 * in the database. The editor's CodeBlockLowlight does emit hljs spans on save,
 * but anything written before it, pasted in as HTML, or authored by hand would
 * have rendered as flat monochrome text. Re-highlighting from `textContent`
 * gives every block the same treatment regardless of how it was stored.
 *
 * Also wraps each block so the language label and the copy button have
 * somewhere to live.
 */
export function highlightCodeBlocks(root) {
  if (!root) return;
  const doc = root.ownerDocument ?? document;

  root.querySelectorAll('pre > code').forEach((codeEl) => {
    const pre = codeEl.parentElement;
    if (!pre || pre.parentElement?.classList.contains('codeblock')) return;

    const source = codeEl.textContent ?? '';
    const lang = languageOf(codeEl);

    let tree;
    try {
      tree = lang && lowlight.registered(lang)
        ? lowlight.highlight(lang, source)
        : lowlight.highlightAuto(source);
    } catch {
      tree = null;
    }

    if (tree) {
      codeEl.textContent = '';
      codeEl.classList.add('hljs');
      for (const child of tree.children) codeEl.appendChild(hastToDom(child, doc));
    }

    const detected = lang ?? tree?.data?.language ?? null;

    // The block scrolls horizontally rather than wrapping code, so it has to
    // be reachable by keyboard: a scroll container that only responds to a
    // pointer strands keyboard users on the visible portion of a long line
    // (WCAG 2.1.1, axe scrollable-region-focusable). code.css gives it a
    // focus ring so the stop is visible when it lands.
    pre.setAttribute('tabindex', '0');

    const wrap = doc.createElement('div');
    wrap.className = 'codeblock';
    pre.replaceWith(wrap);

    const bar = doc.createElement('div');
    bar.className = 'codeblock__bar';

    const label = doc.createElement('span');
    label.className = 'codeblock__lang';
    label.textContent = LABELS[detected] ?? (detected ? detected : 'Code');
    bar.appendChild(label);

    const copy = doc.createElement('button');
    copy.type = 'button';
    copy.className = 'codeblock__copy';
    copy.textContent = 'Copy';
    copy.addEventListener('click', () => {
      navigator.clipboard.writeText(source).then(() => {
        copy.textContent = 'Copied';
        copy.classList.add('is-copied');
        setTimeout(() => {
          copy.textContent = 'Copy';
          copy.classList.remove('is-copied');
        }, 1600);
      });
    });
    bar.appendChild(copy);

    wrap.appendChild(bar);
    wrap.appendChild(pre);
  });
}

export default highlightCodeBlocks;
