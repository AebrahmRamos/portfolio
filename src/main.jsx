import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './m3/tokens/index.css';
import './m3/m3.css';
import './index.css';
import { applyTheme } from './m3/theme.js';
import { aboutData, experienceData, projectsData, contactData } from './agent/portfolio-content.js';

// Apply theme before first paint to prevent flash
const saved = localStorage.getItem('darkMode');
applyTheme(saved && JSON.parse(saved) ? 'dark' : 'light');

// WebMCP — expose portfolio data and blog to browser-based AI agents
if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'get_about',
        description: 'Get biography, education, and summary for Aebrahm Ramos',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => aboutData,
      },
      {
        name: 'get_projects',
        description: 'Get all portfolio projects with descriptions and tech stacks',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => projectsData,
      },
      {
        name: 'get_experience',
        description: 'Get professional work experience and internships',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => experienceData,
      },
      {
        name: 'get_contact',
        description: 'Get contact information including email, GitHub, LinkedIn, and resume',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => contactData,
      },
      {
        name: 'get_posts',
        description: 'Get index of published blog posts with title, slug, summary, series, and tags',
        inputSchema: { type: 'object', properties: { limit: { type: 'number' } } },
        execute: async ({ limit } = {}) => {
          const res = await fetch(`/api/blog?limit=${limit ?? 50}`);
          return res.json();
        },
      },
      {
        name: 'get_post_by_slug',
        description: 'Get full markdown content of a blog post by its slug',
        inputSchema: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] },
        execute: async ({ slug } = {}) => {
          const res = await fetch(`/api/blog/${slug}`, { headers: { Accept: 'text/markdown' } });
          if (!res.ok) return { error: 'not_found' };
          return res.text();
        },
      },
      {
        name: 'get_series',
        description: 'Get all blog series with post counts and descriptions',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => {
          const res = await fetch('/api/blog/series');
          return res.json();
        },
      },
    ],
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
