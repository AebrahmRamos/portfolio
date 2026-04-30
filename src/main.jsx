import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './m3/tokens/index.css';
import './m3/m3.css';
import './index.css';
import { applyTheme } from './m3/theme.js';

// Apply theme before first paint to prevent flash
const saved = localStorage.getItem('darkMode');
applyTheme(saved && JSON.parse(saved) ? 'dark' : 'light');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
