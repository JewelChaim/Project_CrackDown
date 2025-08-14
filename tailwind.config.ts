import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./public/**/*.{svg,html}", "./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0EA5A6",
          dark: "#0B7B7E",
          light: "#5EEAD4",
          bg: "#0B0C10",
          panel: "#121317"
        }
      },
      boxShadow: {
        glass: "0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 30px rgba(0,0,0,0.35)"
      },
      backdropBlur: { xs: "2px" },
      container: { center: true, padding: "1rem" }
    }
  },
  plugins: []
};

export default config;
