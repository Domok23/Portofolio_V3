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
        "muted-bg": "var(--color-muted-bg)",
        border: "var(--color-border)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-tertiary": "var(--color-accent-tertiary)",
        "on-accent": "var(--color-on-accent)",
        ring: "var(--color-ring)",
        destructive: "var(--color-destructive)",
      },
      fontFamily: {
        heading: ["Orbitron", "Share Tech Mono", "monospace"],
        body: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
        label: ["Share Tech Mono", "monospace"],
      },
      boxShadow: {
        neon: "var(--shadow-neon)",
        "neon-sm": "var(--shadow-neon-sm)",
        "neon-lg": "var(--shadow-neon-lg)",
        "neon-secondary": "var(--shadow-neon-secondary)",
        "neon-tertiary": "var(--shadow-neon-tertiary)",
      },
    },
  },
  plugins: [],
};
