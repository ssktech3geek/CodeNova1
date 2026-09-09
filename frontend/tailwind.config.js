/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B6E6E', // Deep ocean teal
          hover: '#085555',
          light: '#E6F4F4',
          dark: '#064242',
          bright: '#14A5A5',
        },
        accent: {
          DEFAULT: '#F5A623', // Warm amber
          hover: '#DF9215',
          light: '#FEF6E9',
        },
        disruption: {
          DEFAULT: '#DD6B20', // Alert orange
          light: '#FEEBC8',
          border: '#F6AD55',
          dark: '#C05621',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          subtle: 'var(--color-surface-subtle)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        dark: {
          bg: '#0F1417',
          card: '#1A2226',
          elevated: '#222C31',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#E8EAEC',
          secondary: '#9AA5AA',
        },
        success: {
          DEFAULT: '#38A169',
          light: '#F0FFF4',
        },
        danger: {
          DEFAULT: '#E53E3E',
          light: '#FFF5F5',
        }
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06)',
        'modal': 'var(--shadow-modal)',
        'glow-disruption': '0 0 15px rgba(221, 107, 32, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
