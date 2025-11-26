/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      fontFamily: {
        arabic: ["Arabic", , ...defaultTheme.fontFamily.sans],
      },

      colors: {
        primary: {
          DEFAULT: '#22c55e', // Tailwind green-500
          light: '#4ade80',   // green-400
          dark: '#16a34a',    // green-600
        },
      },
      animation: {
        ayahHighlight: 'ayahHighlight 7s',
      },
      keyframes: {
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
