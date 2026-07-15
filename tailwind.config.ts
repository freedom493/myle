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
          indigo: 'var(--color-brand-indigo)',
          lime: 'var(--color-brand-lime)',
          surface: 'var(--color-brand-surface)',
          elevated: 'var(--color-brand-elevated)',
          text: 'var(--color-brand-text)',
          muted: 'var(--color-brand-muted)',
          border: 'var(--color-brand-border)',
          success: 'var(--color-brand-success)',
          danger: 'var(--color-brand-danger)',
        },
      },
    },
  },
};

export default config;
