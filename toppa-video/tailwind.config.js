/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        toppa: {
          orange: "#FFA533",
          dark: "#E8901A",
          light: "#FFF7ED",
          text: "#0F172A",
          text2: "#475569",
          bg: "#FFFFFF",
          bgalt: "#F8FAFC",
          border: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
