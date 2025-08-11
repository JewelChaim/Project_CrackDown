import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0EA5A6", dark: "#0B7B7E", light: "#22D3EE", bg: "#0B1115", panel: "rgba(255,255,255,0.06)" }
      },
      boxShadow: { glass: "0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 30px rgba(0,0,0,0.35)" },
      backdropBlur: { xs: "2px" },
      container: { center: true, padding: "1rem" }
    }
  },
  plugins: [],
};
export default config;
