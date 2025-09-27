/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'leetcode-green': '#00b8a3',
        'leetcode-orange': '#ffa116',
        'leetcode-red': '#ff375f',
      }
    },
  },
  plugins: [],
}
