# Frontend Styles - Instructions

## Purpose
Global styles, Tailwind configuration, design tokens, and CSS architecture.

## Style Structure

### 1. Tailwind Config (`tailwind.config.ts`)
```typescript
// Design tokens as theme extension
theme: {
  extend: {
    colors: {
      primary: { 50: '#...', 100: '#...', ..., 900: '#...', DEFAULT: '#...' },
      secondary: { ... },
      accent: { ... },
      success: { ... },
      warning: { ... },
      error: { ... },
      surface: { ... },
      background: { ... },
      text: { primary: '#...', secondary: '#...', muted: '#...', inverse: '#...' },
      border: { light: '#...', DEFAULT: '#...', dark: '#...' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    spacing: {
      // 4px base scale
      0: '0',
      1: '0.25rem',  // 4px
      2: '0.5rem',   // 8px
      3: '0.75rem',  // 12px
      4: '1rem',     // 16px
      5: '1.25rem',  // 20px
      6: '1.5rem',   // 24px
      8: '2rem',     // 32px
      10: '2.5rem',  // 40px
      12: '3rem',    // 48px
      16: '4rem',    // 64px
      20: '5rem',    // 80px
      24: '6rem',    // 96px
    },
    borderRadius: {
      none: '0',
      sm: '0.25rem',   // 4px
      DEFAULT: '0.5rem', // 8px
      md: '0.75rem',   // 12px
      lg: '1rem',      // 16px
      xl: '1.5rem',    // 24px
      '2xl': '2rem',   // 32px
      full: '9999px',
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },
    transitionDuration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    zIndex: {
      dropdown: '100',
      sticky: '200',
      fixed: '300',
      modalBackdrop: '400',
      modal: '500',
      popover: '600',
      tooltip: '700',
      toast: '800',
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
}
```

### 2. Global Styles (`globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme (default) */
    --color-primary: 59 130 246;
    --color-background: 255 255 255;
    --color-surface: 249 250 251;
    --color-text-primary: 17 24 39;
    --color-text-secondary: 75 85 99;
    --color-text-muted: 156 163 175;
    --color-border: 229 231 235;
  }

  [data-theme="dark"] {
    --color-primary: 96 165 250;
    --color-background: 17 24 39;
    --color-surface: 31 41 55;
    --color-text-primary: 249 250 251;
    --color-text-secondary: 209 213 219;
    --color-text-muted: 156 163 175;
    --color-border: 55 65 81;
  }

  * {
    @apply border-border;
  }

  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-background text-text-primary antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }

  :focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }

  ::selection {
    @apply bg-primary/20 text-primary;
  }
}

@layer components {
  /* Component classes using @apply */
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none;
  }
  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary/90;
  }
  .btn-secondary {
    @apply btn bg-surface text-text-primary hover:bg-surface/80 border border-border;
  }
  .btn-ghost {
    @apply btn hover:bg-surface hover:text-text-primary;
  }
  .btn-danger {
    @apply btn bg-error text-white hover:bg-error/90;
  }
  .btn-link {
    @apply btn p-0 text-primary underline-offset-2 hover:underline;
  }

  .input {
    @apply flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50;
  }

  .card {
    @apply rounded-xl border border-border bg-surface text-text-primary shadow-sm;
  }

  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
  }
  .badge-success { @apply badge bg-success/10 text-success; }
  .badge-warning { @apply badge bg-warning/10 text-warning; }
  .badge-error { @apply badge bg-error/10 text-error; }
  .badge-info { @apply badge bg-primary/10 text-primary; }

  .link {
    @apply text-primary underline-offset-2 hover:underline;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .animate-in {
    animation: animateIn 0.3s ease-out;
  }
  
  @keyframes animateIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 3. CSS Variables (`variables.css`)
```css
:root {
  /* Semantic color tokens */
  --color-primary: 59 130 246;
  --color-primary-hover: 37 99 235;
  --color-primary-light: 219 234 254;
  
  --color-success: 34 197 94;
  --color-warning: 234 179 8;
  --color-error: 239 68 68;
  --color-info: 59 130 246;
  
  /* Surface colors */
  --color-surface-1: 255 255 255;
  --color-surface-2: 249 250 251;
  --color-surface-3: 243 244 246;
  
  /* Text colors */
  --color-text-primary: 17 24 39;
  --color-text-secondary: 75 85 99;
  --color-text-tertiary: 156 163 175;
  --color-text-inverse: 255 255 255;
  
  /* Border colors */
  --color-border-light: 229 231 235;
  --color-border: 209 213 219;
  --color-border-dark: 156 163 175;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* Z-index */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

### 4. Component Styles (`components/`)
- Each component has optional `Component.module.css` for complex styles
- Prefer Tailwind utilities over custom CSS
- Use CSS Modules only for:
  - Complex animations
  - Third-party library integration
  - Specific browser hacks

### 5. Theme Utilities (`theme.ts`)
```typescript
export const theme = {
  colors: { ... },
  spacing: { ... },
  breakpoints: { ... },
  // Type-safe access to design tokens
} as const;

export type Theme = typeof theme;
```

## Dark Mode Strategy
- **Class-based**: `[data-theme="dark"]` on `<html>`
- **Toggle**: ThemeContext manages class
- **Persistence**: localStorage + system preference
- **Flash Prevention**: Inline script in `<head>`

## Responsive Design
- **Mobile First**: Base styles for mobile, `md:` `lg:` `xl:` for larger
- **Breakpoints**: xs(480), sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- **Container**: Max-width containers at each breakpoint

## Accessibility
- **Contrast**: WCAG AA minimum (4.5:1 text, 3:1 UI)
- **Focus**: Visible focus rings on all interactive elements
- **Motion**: Respect `prefers-reduced-motion`
- **High Contrast**: Support `prefers-contrast: more`

## Key Constraints
- No arbitrary values in Tailwind (use design tokens)
- No `!important` except for utilities
- No global element styling except in `@layer base`
- Component styles in component folder, not global
- CSS-in-JS only for dynamic values (theme-aware)