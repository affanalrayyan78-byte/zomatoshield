/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E23744',
        secondary: '#2E3034',
        accent: '#FFA500'
      }
    },
  },
  plugins: [],
}