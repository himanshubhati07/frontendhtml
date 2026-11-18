import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E5384F",
        "primary-dark": "#C42A40",
        "primary-soft": "#FFE8EB",
        secondary: "#FFC600",
        brand: "#2A9D8F",
        "brand-dark": "#21786d",
        "brand-soft": "#E3F4F2",
        surface: "#F5F5F5",
        ink: "#212121",
        muted: "#666666",
        line: "#E0E0E0",
        success: "#2E7D32",
        danger: "#D32F2F",
        warning: "#E65100",
        disabled: "#BDBDBD",
      },
      fontFamily: {
        sans: ["'Myriad Pro'", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
