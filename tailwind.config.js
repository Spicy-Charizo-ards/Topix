/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#f8f6f3',
          100: '#f3ece7',
          200: '#e7d8ce',
          300: '#d2b8a3',
          400: '#b98c6a',
          500: '#a06d4b',
          600: '#8a5637',
          700: '#6e3e25',
          800: '#4b2717',
          900: '#2d160c',
        },
      },
    },
  },
  plugins: [],
};
