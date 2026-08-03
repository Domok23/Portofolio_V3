/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-on-accent)",
        ring: "var(--color-ring)",
      },
      fontFamily: {
        heading: ["Archivo", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
