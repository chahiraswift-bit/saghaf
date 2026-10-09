import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Neutral surfaces
        paper: "#FFFFFF",
        "paper-subtle": "#FBF6F8",
        ink: "#24131D",
        "ink-muted": "var(--text-muted)",
        void: "#171116",
        "void-subtle": "#211820",
        "void-line": "#382833",

        // Primary burgundy ramp centered on the SHAGAF brand color.
        shagaf: {
          950: "#2B041D",
          900: "#45052D",
          800: "#59063A",
          700: "#6F0446",
          600: "#8C1E60",
          500: "#A83D7B",
          400: "#C06A9A",
          300: "#D69BB9",
          200: "#E9C7D8",
          100: "#F6E7EF",
          50: "#FCF5F8",
        },
        // Existing purple remains a secondary brand color.
        purple: {
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
