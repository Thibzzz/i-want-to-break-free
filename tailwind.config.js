/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  // prefix: "plasmo-",
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["garden"]
  }
}