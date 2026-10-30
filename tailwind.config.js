/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#000000', panel: '#0a0a0c', card: '#0f0f12', raise: '#15151a', line: '#212228',
          accent: '#3d6bff', deep: '#2f57e6', hover: '#6a8cff', glow: '#a9bcff', alt: '#7c4dff',
          soft: '#8b8e9a', up: '#4ade80', down: '#ff5d5d', lime: '#e4f25f', orange: '#ff8a4c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '600' }],
        headline: ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
        title: ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      boxShadow: {
        card: 'inset 0 1px 0 rgba(255,255,255,.05), 0 1px 2px rgba(0,0,0,.4), 0 16px 32px -16px rgba(0,0,0,.7)',
        lift: 'inset 0 1px 0 rgba(255,255,255,.07), 0 2px 4px rgba(0,0,0,.4), 0 24px 48px -20px rgba(0,0,0,.8)',
        glow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 0 0 1px rgba(61,107,255,.25), 0 12px 48px -12px rgba(61,107,255,.45)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(.22,1,.36,1)',
      },
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.09) 50%, rgba(255,255,255,.04) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up .55s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .4s ease-out both',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
