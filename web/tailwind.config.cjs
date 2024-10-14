/** @type {import('tailwindcss').Config} */
const { colors } = require("./theme/colors")

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { colors },
  },
}
