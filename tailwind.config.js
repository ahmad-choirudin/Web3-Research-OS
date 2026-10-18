/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#000000', panel: '#0a0a0a', card: '#111111', line: '#262626',
          accent: '#22d3ee', soft: '#a3a3a3', up: '#3dffb0', down: '#ff3d9a',
        },
      },
    },
  },
  plugins: [],
}
