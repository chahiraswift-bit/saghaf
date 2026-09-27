import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Neutral surfaces
        paper: "#FFFFFF",
        "paper-subtle": "#F6F4FA",
        ink: "#161221",
        "ink-muted": "#5C5570",
        void: "#0B0A10",
        "void-subtle": "#151320",
        "void-line": "#26223A",

        // Brand purple ramp (sourced from the logo gradient)
        shagaf: {
          950: "#1C1140",
          900: "#2A1868",
          800: "#3A1F95",
          700: "#4C28B8",
          600: "#6633D6",
          500: "#7C4DEF",
          400: "#9C79F5",
          300: "#BBA3F8",
          200: "#DCD0FC",
          100: "#EFEAFD",
        },
        // Gold accent — used sparingly
        gold: {
          600: "#A9822E",
          500: "#C79A3B",
          400: "#D9B45C",
        },
        success: "#2E9E6A",
        warning: "#C79A3B",
        danger: "#D14343",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 18, 33, 0.06), 0 8px 24px -12px rgba(22, 18, 33, 0.12)",
        "card-dark": "0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px -12px rgba(0, 0, 0, 0.5)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
