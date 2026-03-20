/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enable dark mode via class
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
