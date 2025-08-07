/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // todas las páginas Next.js
    "./src/components/**/*.{js,ts,jsx,tsx}", // tus componentes React
    "./app/**/*.{js,ts,jsx,tsx}",        // si usas carpeta app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
