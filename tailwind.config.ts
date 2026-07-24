import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f5f3",
          100: "#e9e6e1",
          200: "#d4cec5",
          300: "#b4aa9c",
          400: "#8f8170",
          500: "#6f6253",
          600: "#564b3f",
          700: "#3f372f",
          800: "#2a241f",
          900: "#181410",
        },
        accent: {
          50: "#fdf6f2",
          100: "#fae8df",
          200: "#f3cbb8",
          300: "#eaa888",
          400: "#df8458",
          500: "#c9663a",
          600: "#a84f2c",
          700: "#843d24",
          800: "#5f2d1c",
          900: "#3d1d12",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
