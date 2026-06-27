import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0F1117',
        surface: '#1A1D27',
        border: '#2A2D3A',
        primary: {
          DEFAULT: '#6C63FF',
          hover: '#8B85FF',
        },
        text: {
          primary: '#F1F1F3',
          secondary: '#8B8FA8',
        },
        success: '#22C55E',
        danger: '#F43F5E',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
