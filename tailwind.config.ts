import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
        brand: {
          indigo: "#1E1B4B",
          lime: "#A3E635",
          surface: "#F8F7F4",
          text: "#0F0E17",
          muted: "#64748B",
          success: "#10B981",
          danger: "#F43F5E",
        },
      },
    },
  },
};

export default config;
