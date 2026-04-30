import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { applyTheme } from '../m3/theme';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    applyTheme(darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const value = useMemo(() => ({ darkMode, toggleDarkMode }), [darkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
