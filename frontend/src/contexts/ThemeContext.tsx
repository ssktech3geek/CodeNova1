/**
 * @file ThemeContext.tsx
 * @description ThemeProvider component ONLY.
 * Exports a single React component so Vite Fast Refresh works correctly.
 * The context object lives in ThemeContextObject.ts.
 * The hook lives in useTheme.ts.
 */
import React, { useEffect, useState } from 'react';
import { ThemeContext, STORAGE_KEY, type Theme } from './ThemeContextObject';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    console.log('[ThemeProvider] Applying theme to DOM:', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
    }
    console.log('[ThemeProvider] html.className after apply:', root.className);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log('[ThemeProvider] toggleTheme called');
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
