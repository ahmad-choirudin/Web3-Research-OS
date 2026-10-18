/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#050a14', panel: '#0a1424', card: '#0e1b30', line: '#1c3556',
          accent: '#22d3ee', soft: '#8aa9c7', up: '#3dffb0', down: '#ff3d9a',
        },
      },
    },
  },
  plugins: [],
}
