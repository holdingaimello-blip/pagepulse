import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
        electric: {
          500: "#3b82f6",
          600: "#2563eb",
          400: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};

export default config;
