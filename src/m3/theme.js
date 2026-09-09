// Theme switching is now a single attribute flip: both palettes live as static
// CSS custom properties in tokens/color.css, keyed on :root[data-theme].
//
// This replaces the previous runtime scheme generation, which pulled in
// @material/material-color-utilities, recomputed ~30 color roles in JS on every
// toggle, and wrote them all to element.style. That cost a dependency and a
// paint-blocking loop to produce colors that never changed at runtime.

const SEED = '#377dff';

export function applyTheme(mode) {
  document.documentElement.dataset.theme = mode === 'dark' ? 'dark' : 'light';
}

export function getSeed() {
  return SEED;
}
