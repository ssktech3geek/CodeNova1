/**
 * @file ThemeContextObject.ts
 * @description The raw React context object for theme.
 * Kept in its own non-TSX file so both ThemeContext.tsx (provider component)
 * and useTheme.ts (hook) can import it without triggering Vite Fast Refresh
 * "mixed exports" invalidation.
 */
import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const STORAGE_KEY = 'codenova_theme';
