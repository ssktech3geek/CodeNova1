/**
 * @file useTheme.ts
 * @description Hook-only file. Kept separate from ThemeContext.tsx so Vite
 * Fast Refresh doesn't invalidate (it requires files export ONLY components
 * OR only non-component values — never both in the same file).
 */
import { useContext } from 'react';
import { ThemeContext } from './ThemeContextObject';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
