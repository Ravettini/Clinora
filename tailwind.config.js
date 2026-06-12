/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f4fb",
          100: "#ece7f7",
          200: "#dcd2f0",
          300: "#c4b3e4",
          400: "#a98ed4",
          500: "#8f6cc4",
          600: "#7a52b0",
          700: "#664394",
          800: "#553a79",
          900: "#473263",
        },
        accent: {
          rose: "#e7c6d4",
          lavender: "#d9d2f0",
          mauve: "#cdb8d8",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f7f6fb",
          subtle: "#f1eff7",
        },
        ink: {
          900: "#1f1b2e",
          700: "#3a3450",
          500: "#6b6480",
          400: "#8d8799",
        },
        positive: {
          50: "#eef8f1",
          100: "#d7eede",
          500: "#4ca777",
          600: "#3d8c63",
          700: "#2f6e4d",
        },
        warning: {
          50: "#fdf6ec",
          100: "#f9e9cf",
          500: "#d99b3c",
          600: "#b97f28",
        },
        danger: {
          50: "#fceef0",
          100: "#f7d7dc",
          500: "#cf5b6c",
          600: "#b3475a",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31, 27, 46, 0.04), 0 8px 24px rgba(31, 27, 46, 0.06)",
        soft: "0 1px 3px rgba(31, 27, 46, 0.06)",
        pop: "0 12px 40px rgba(31, 27, 46, 0.16)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
