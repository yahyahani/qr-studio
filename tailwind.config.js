/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo':    '0 0 24px -6px rgba(99,102,241,0.50)',
        'glow-indigo-sm': '0 0 12px -4px rgba(99,102,241,0.40)',
        'glow-violet':    '0 0 24px -6px rgba(139,92,246,0.40)',
      },
    },
  },
  plugins: [],
}
