/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#D9D9D9',
        secondary: '#ADADAD'
      },
    },
  },
  plugins: [],
}

