import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    // Keep the mobile composition at every browser width. The site is presented
    // as a focused, app-like portfolio instead of switching to desktop grids.
    screens: {
      sm: "9999px",
      md: "10000px",
      lg: "10001px",
      xl: "10002px",
      "2xl": "10003px",
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#22213f",
          50: "#f2f1f8",
          100: "#e2e0f1",
          200: "#c2bfe0",
          300: "#948dc4",
          400: "#6a63a4",
          500: "#4c4680",
          600: "#3a3564",
          700: "#2c2850",
          800: "#211d3d",
          900: "#181530",
          950: "#100e21",
        },
        night: {
          DEFAULT: "rgb(var(--color-night) / <alpha-value>)",
          light: "rgb(var(--color-night-light) / <alpha-value>)",
          dark: "rgb(var(--color-night-dark) / <alpha-value>)",
        },
        lavender: {
          DEFAULT: "rgb(var(--color-lavender) / <alpha-value>)",
          light: "rgb(var(--color-lavender-light) / <alpha-value>)",
          dark: "rgb(var(--color-lavender-dark) / <alpha-value>)",
        },
        paper: {
          DEFAULT: "rgb(var(--color-paper) / <alpha-value>)",
          dark: "rgb(var(--color-paper-dark) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)",
          light: "rgb(var(--color-gold-light) / <alpha-value>)",
          dark: "rgb(var(--color-gold-dark) / <alpha-value>)",
        },
        blush: "rgb(var(--color-blush) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        cocoa: "rgb(var(--color-cocoa) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-tc)", "Noto Serif TC", "serif"],
        sans: ["var(--font-noto-sans-tc)", "Noto Sans TC", "sans-serif"],
        hand: ["var(--font-ma-shan-zheng)", "cursive"],
      },
      backgroundImage: {
        "night-sky":
          "radial-gradient(ellipse at top, #3f3a78 0%, #2b2a5c 45%, #181542 100%)",
        "paper-warm":
          "linear-gradient(180deg, #faf6ee 0%, #f2e9d8 100%)",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(43, 42, 92, 0.25)",
        card: "0 8px 24px -6px rgba(43, 42, 92, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
