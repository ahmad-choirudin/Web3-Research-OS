/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#0a0612', panel: '#110a1f', card: '#170d2b', line: '#33204f',
          accent: '#ff3dcb', hover: '#ff66d6', glow: '#ff9de8', alt: '#22d3ee',
          soft: '#a994c9', up: '#2ff3c8', down: '#ff5c4d',
        },
      },
    },
  },
  plugins: [],
}
