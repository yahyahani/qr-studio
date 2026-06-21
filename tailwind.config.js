/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#18181b',
          raised: '#27272a',
        },
      },
      boxShadow: {
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
