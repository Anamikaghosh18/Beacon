/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        primary: '#2563EB',
        aiAccent: '#7C3AED',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'xs':  '0 1px 2px 0 rgba(0,0,0,0.04)',
        'sm':  '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'md':  '0 4px 8px -2px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'lg':  '0 12px 24px -4px rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.06)',
        'xl':  '0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.07)',
        '2xl': '0 32px 64px -12px rgba(0,0,0,0.14)',
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        'card-hover': '0 8px 24px -4px rgba(0,0,0,0.10), 0 3px 6px -2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'navbar': '0 1px 0 0 #E2E8F0, 0 4px 12px 0 rgba(0,0,0,0.04)',
        'button': '0 1px 2px 0 rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.15)',
        'button-primary': '0 2px 4px 0 rgba(37,99,235,0.30), 0 1px 2px 0 rgba(37,99,235,0.20), inset 0 1px 0 rgba(255,255,255,0.15)',
        'input': '0 1px 2px 0 rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.03)',
        'inset': 'inset 0 2px 4px 0 rgba(0,0,0,0.04)',
      },
      dropShadow: {
        'icon': '0 1px 2px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
