/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#22C55E',
        background: { light: '#FFFFFF', dark: '#0F0F0F' },
        surface: { light: '#FFFFFF', dark: '#1A1A1A' },
        text: { light: '#1F2937', dark: '#F9FAFB' },
        muted: { light: '#6B7280', dark: '#9CA3AF' },
        border: { light: '#E5E7EB', dark: '#1F2937' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1rem', '3xl': '1.25rem' },
      boxShadow: { soft: '0 10px 30px -10px rgba(255,107,53,0.25)', card: '0 4px 20px -8px rgba(0,0,0,0.15)' },
      transitionDuration: { '150': '150ms', '250': '250ms', '300': '300ms' },
    },
  },
  plugins: [],
}

