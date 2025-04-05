/** @type {import('tailwindcss').Config} */
import tailwind from "tailwindcss-animated";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'],
      },
    },
  },
  plugins: [tailwind],
}

