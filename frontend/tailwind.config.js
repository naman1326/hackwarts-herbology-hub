/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f0',
          100: '#d4e8d6',
          200: '#a8d1ad',
          300: '#7cba84',
          400: '#50a35b',
          500: '#2F6B3B',
          600: '#265930',
          700: '#1d4725',
          800: '#14351a',
          900: '#0b230f',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#B7D76A',
          600: '#9ac34d',
          700: '#7caf30',
          800: '#5e8b13',
          900: '#406700',
        },
        gold: {
          50: '#fefdf5',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37',
          600: '#b8941f',
          700: '#9c7917',
          800: '#805f0f',
          900: '#644507',
        },
        cream: '#F5F3E7',
        dark: '#0E1A14',
        card: 'rgba(255,255,255,.05)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        glass: '20px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        fade: 'fade 0.5s ease-in-out',
        slideUp: 'slideUp 0.6s ease-out',
        slideDown: 'slideDown 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(183, 215, 106, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(183, 215, 106, 0.8)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      spacing: {
        'glass': '1px',
      },
    },
  },
  plugins: [],
}
