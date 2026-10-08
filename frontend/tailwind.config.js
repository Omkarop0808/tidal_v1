/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core Abyss Palette
        background: "#050b10",
        surface: {
          DEFAULT: "#0b1622",
          dim: "#070e16",
          bright: "#162738",
          variant: "#1a2e42",
        },
        "surface-container": {
          lowest: "#04080c",
          low: "#08121c",
          DEFAULT: "#0d1b2a",
          high: "#132537",
          highest: "#1b334a",
        },
        
        // Brand Primary (Bioluminescent Cyan)
        primary: {
          DEFAULT: "#00f2fe",
          container: "#00f2fe",
          fixed: "#38bdf8",
          "fixed-dim": "#0ea5e9",
        },
        "on-primary": "#031d28",
        "on-primary-container": "#031d28",
        "on-primary-fixed": "#031d28",
        "on-primary-fixed-variant": "#075985",
        
        // Secondary (Tactical Ocean Blue)
        secondary: {
          DEFAULT: "#38bdf8",
          container: "#0284c7",
          fixed: "#bae6fd",
          "fixed-dim": "#7dd3fc",
        },
        "on-secondary": "#082f49",
        "on-secondary-container": "#f0f9ff",
        "on-secondary-fixed": "#082f49",
        "on-secondary-fixed-variant": "#0369a1",

        // Tertiary (Glacial White / Deep Sea)
        tertiary: {
          DEFAULT: "#e0f2fe",
          container: "#7dd3fc",
          fixed: "#bae6fd",
          "fixed-dim": "#38bdf8",
        },
        "on-tertiary": "#0c4a6e",
        "on-tertiary-container": "#082f49",
        
        // Neutral Typography & Outlines
        "on-surface": "#f1f5f9",
        "on-surface-variant": "#94a3b8",
        "on-background": "#f8fafc",
        outline: "#334155",
        "outline-variant": "#1e293b",
        "inverse-surface": "#f8fafc",
        "inverse-on-surface": "#0f172a",
        "inverse-primary": "#0284c7",
        
        // Status Alerts
        error: {
          DEFAULT: "#ff3366",
          container: "#881337",
        },
        "on-error": "#ffffff",
        "on-error-container": "#ffe4e6",
        warning: {
          DEFAULT: "#f59e0b",
          container: "#78350f",
        },
        success: {
          DEFAULT: "#10b981",
          container: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-xl": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 242, 254, 0.25)",
        "glow-lg": "0 0 40px -10px rgba(0, 242, 254, 0.35)",
        "glow-sm": "0 0 15px -3px rgba(0, 242, 254, 0.2)",
        "glow-error": "0 0 25px -5px rgba(255, 51, 102, 0.3)",
        "glow-warning": "0 0 25px -5px rgba(245, 158, 11, 0.3)",
        "glow-success": "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        panel: "0 8px 32px 0 rgba(0, 0, 0, 0.36)",
      },
      backgroundImage: {
        "ocean-radial": "radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.08) 0%, rgba(5, 11, 16, 0) 60%)",
        "tactical-grid": "linear-gradient(to right, rgba(56, 189, 248, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.04) 1px, transparent 1px)",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        "scan-line": "scan-line 3s linear infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        }
      }
    },
  },
  plugins: [],
}
