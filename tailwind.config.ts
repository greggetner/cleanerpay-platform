import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0E7C7B",
          dark: "#0A5B5A",
          50: "#EAF5F5",
          100: "#CDE6E5",
          600: "#0E7C7B",
          700: "#0A5B5A",
        },
        cream: "#FAF8F3",
      },
      maxWidth: {
        site: "1100px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,25,23,0.04), 0 6px 16px -8px rgba(28,25,23,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
