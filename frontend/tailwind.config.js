/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jabour: {
          dark: "#15161d",
          navy: "#1e1f29",
          red: "#d10024",
          redHover: "#a7001d",
          gray: "#8d99ae",
          border: "#e4e7ed",
          light: "#f4f5f7"
        },
        swatch: {
          graphite: "#3a3d45",
          silver: "#c8ccd2",
          midnight: "#15161d",
          white: "#f4f5f7",
          crimson: "#d10024",
          sand: "#d8c6ac",
          steel: "#8d99ae"
        }
      },
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
