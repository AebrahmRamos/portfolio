/**
 * Skills grouped by area.
 *
 * The per-category `color` fields (#377dff, #f9b934, #2e7d32, #ed6c02) and the
 * `mernStack` export are gone. The colours were MUI-era hardcodes that put four
 * competing accents on one page, and MERN as a headline stack reads as dated
 * next to the Laravel and systems work that is actually shipping.
 */

export const skills = [
  {
    key: 'frontend',
    title: 'Frontend',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Tailwind CSS',
      'Inertia.js',
      'Radix UI',
      'SwiftUI',
    ],
  },
  {
    key: 'backend',
    title: 'Backend',
    items: [
      'Laravel',
      'PHP',
      'Node.js',
      'Express.js',
      'Python',
      'Java',
      'C/C++',
      'x86 Assembly',
    ],
  },
  {
    key: 'data',
    title: 'Data',
    items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Firebase', 'Supabase', 'SQLite'],
  },
  {
    key: 'platform',
    title: 'Platform and tooling',
    items: [
      'Cloudflare Workers',
      'Docker',
      'GCP',
      'Azure',
      'DigitalOcean',
      'Shopify (Liquid)',
      'Model Context Protocol',
      'Google Gemini',
      'OpenAI',
      'Playwright',
      'Git',
    ],
  },
];

export default skills;
