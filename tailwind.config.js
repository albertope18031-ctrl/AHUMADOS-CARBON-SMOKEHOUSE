/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#171717',
        charcoalCard: '#222222',
        charcoalBorder: '#333333',
        flameOrange: '#EA580C',
        flameOrangeHover: '#C2410C',
        warmCream: '#FFF7ED',
        warmMuted: '#A8A29E',
        badgeGold: '#EAB308',
      },
    },
  },
  plugins: [],
}
