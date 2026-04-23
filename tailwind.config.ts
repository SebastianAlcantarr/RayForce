import type { Config } from 'tailwindcss'

export default {
  content: [
    './app.vue',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './componentes_principal/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Brand + Material-like tokens used across the app
        primary: '#0057B8',
        'primary-dim': '#004494',
        'primary-container': '#D9E2FF',
        'on-primary': '#FFFFFF',
        'primary-fixed': '#D9E2FF',
        'on-primary-fixed': '#001A41',

        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-container': '#EEF2F7',
        'surface-container-low': '#F4F6FA',
        'surface-container-lowest': '#FCFDFF',
        'surface-container-high': '#E2E8F0',
        'surface-container-highest': '#CBD5E1',

        'on-surface': '#0F172A',
        'on-surface-variant': '#475569',
        outline: '#64748B',
        'outline-variant': '#CBD5E1',

        error: '#DC2626',
        'on-error': '#FFFFFF',
        'error-container': '#FEE2E2',
        'on-error-container': '#7F1D1D',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        rayforce: ['Amsterdam Signature Four', 'cursive'],
      },
    },
  },
} satisfies Config
