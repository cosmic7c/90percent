/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          25: '#fffbf5',
        },
        orange: {
          25: '#fff8f5',
        }
      }
    },
  },
  plugins: [],
};