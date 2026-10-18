/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#05080f', panel: '#0a101c', card: '#0e1626', line: '#1c2b4a',
          accent: '#00a3ff', glow: '#93c5ff', soft: '#8fa3c4', up: '#3dffb0', down: '#ff3d9a',
        },
      },
    },
  },
  plugins: [],
}
