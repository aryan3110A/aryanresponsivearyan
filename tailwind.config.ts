import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: "#5865F2",
        instagram: "#E1306C",
        youtube: "#FF0000",
        border: "#E5E7EB",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        "md-laptop": "1366px", // For 15.6-inch & 16-inch laptops
        "lg": "1600px", // Large PCs
      },
    },
  },
  plugins: [],
};

export default config;
