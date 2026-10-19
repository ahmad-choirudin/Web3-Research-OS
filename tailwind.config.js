/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#080a09', panel: '#0d100f', card: '#121514', line: '#242a27',
          accent: '#6ee7b7', hover: '#8df0c9', glow: '#a7f3d0', alt: '#34d399',
          soft: '#8b948f', up: '#5fe3a1', down: '#ff6b6b',
        },
      },
    },
  },
  plugins: [],
}
