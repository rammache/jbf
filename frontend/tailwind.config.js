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
          blue: "#0077fe",
          blueHover: "#005fc9",
          blueGlow: "#38bdf8",
          blueLight: "#eff6ff",
          red: "#0077fe", // Remapped to primary electric blue
          redHover: "#005fc9",
          legacyRed: "#d10024", // Preserved for test compatibility
          gray: "#8d99ae",
          border: "#e4e7ed",
          light: "#f4f5f7"
        },
        swatch: {
          graphite: "#3a3d45",
          silver: "#c8ccd2",
          midnight: "#15161d",
          white: "#f4f5f7",
          crimson: "#0077fe",
          blue: "#0077fe",
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
