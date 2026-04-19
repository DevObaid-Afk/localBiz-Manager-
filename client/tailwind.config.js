/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f5",
          100: "#dbe9e2",
          200: "#b7d3c5",
          300: "#91beaa",
          400: "#6ba88e",
          500: "#4f8b72",
          600: "#3d6e5a",
          700: "#305848",
          800: "#25433a",
          900: "#1b2f29",
        },
        accent: {
          50: "#fff8ef",
          100: "#ffedd2",
          200: "#ffd6a0",
          300: "#ffbe6b",
          400: "#f8a94a",
          500: "#e38b28",
          600: "#c56d13",
          700: "#9d540f",
          800: "#76400f",
          900: "#4f2d0d",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Fraunces'", "serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(25, 42, 36, 0.12)",
        panel: "0 12px 36px rgba(30, 48, 43, 0.08)",
      },
      backgroundImage: {
        aura: "radial-gradient(circle at top left, rgba(107, 168, 142, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(248, 169, 74, 0.18), transparent 32%)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
