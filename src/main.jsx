import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './m3/tokens/index.css';
import './m3/m3.css';
import './index.css';
import { applyTheme } from './m3/theme.js';
import { aboutData, experienceData, projectsData, contactData } from './agent/portfolio-content.js';

// Apply theme before first paint to prevent flash
const saved = localStorage.getItem('darkMode');
applyTheme(saved && JSON.parse(saved) ? 'dark' : 'light');

// WebMCP — expose portfolio data to browser-based AI agents
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
    ],
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
