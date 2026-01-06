/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        picci1: '#711031',
        picci2: '#741233',
        picci3: '#701131',
        picciBg: '#EDEDEB',
      },
    },
  },
  plugins: [],
};
