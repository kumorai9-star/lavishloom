/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F2EA",
        ink: "#1B2436",
        indigo: {
          DEFAULT: "#1B2A41",
          light: "#2C3E5C",
        },
        terracotta: "#C1633D",
        stone: "#DCD4C5",
        sandstone: "#C9A688",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Jost'", "'Helvetica Neue'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};