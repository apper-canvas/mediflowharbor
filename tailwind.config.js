/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B5394",
        secondary: "#6FA8DC", 
        accent: "#00ACC1",
        success: "#34A853",
        warning: "#F9AB00",
        error: "#EA4335",
        info: "#4285F4",
        surface: "#FFFFFF",
        background: "#F5F7FA"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}