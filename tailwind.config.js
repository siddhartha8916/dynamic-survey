/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#2B4652',      // Dark blue
        'secondary': '#90A4AD',    // Light blue-gray
        'light': '#EBEBEB',        // Light gray
        'dark': '#0D0D0D',         // Almost black
        'medium': '#575757',       // Medium gray
        'accent': '#FFD649',       // Yellow accent
      },
      fontFamily: {
        'sans': ['Aptos', 'sans-serif'],
        'aptos': ['Aptos', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
