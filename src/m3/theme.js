import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
} from '@material/material-color-utilities';

const SEED = '#377dff';

const cachedTheme = themeFromSourceColor(argbFromHex(SEED));

const COLOR_ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground',
  'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'outline', 'outlineVariant',
  'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  'shadow', 'scrim', 'surfaceTint',
];

function kebab(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function tonalSurfaces(palettes, mode) {
  const isDark = mode === 'dark';
  const neutral = palettes.neutral;
  return {
    'surface-dim': isDark ? neutral.tone(6) : neutral.tone(87),
    'surface-bright': isDark ? neutral.tone(24) : neutral.tone(98),
    'surface-container-lowest': isDark ? neutral.tone(4) : neutral.tone(100),
    'surface-container-low': isDark ? neutral.tone(10) : neutral.tone(96),
    'surface-container': isDark ? neutral.tone(12) : neutral.tone(94),
    'surface-container-high': isDark ? neutral.tone(17) : neutral.tone(92),
    'surface-container-highest': isDark ? neutral.tone(22) : neutral.tone(90),
  };
}

function applySchemeToRoot(scheme, mode) {
  const root = document.documentElement;
  const target = root.style;

  for (const role of COLOR_ROLES) {
    const argb = scheme[role];
    if (typeof argb === 'number') {
      target.setProperty(`--md-sys-color-${kebab(role)}`, hexFromArgb(argb));
    }
  }

  const tonals = tonalSurfaces(cachedTheme.palettes, mode);
  for (const [k, argb] of Object.entries(tonals)) {
    target.setProperty(`--md-sys-color-${k}`, hexFromArgb(argb));
  }
}

export function applyTheme(mode) {
  const scheme = mode === 'dark' ? cachedTheme.schemes.dark : cachedTheme.schemes.light;
  document.documentElement.dataset.theme = mode;
  applySchemeToRoot(scheme.toJSON(), mode);
}

export function getSeed() {
  return SEED;
}
