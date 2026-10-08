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
        // Core Brutalist Palette (True Monochrome)
        background: "#000000",
        surface: {
          DEFAULT: "#000000",
          dim: "#000000",
          bright: "#111111",
          variant: "#222222",
        },
        "surface-container": {
          lowest: "#000000",
          low: "#050505",
          DEFAULT: "#111111",
          high: "#1a1a1a",
          highest: "#222222",
        },
        
        // Brand Primary (Utilitarian White/Silver)
        primary: {
          DEFAULT: "#ffffff",
          container: "#e5e5e5",
          fixed: "#d4d4d4",
          "fixed-dim": "#a3a3a3",
        },
        "on-primary": "#000000",
        "on-primary-container": "#000000",
        "on-primary-fixed": "#000000",
        "on-primary-fixed-variant": "#222222",
        
        // Secondary (Safety Orange / Tactical Alert)
        secondary: {
          DEFAULT: "#ff4d00",
          container: "#ea580c",
          fixed: "#f97316",
          "fixed-dim": "#fb923c",
        },
        "on-secondary": "#000000",
        "on-secondary-container": "#ffffff",
        "on-secondary-fixed": "#000000",
        "on-secondary-fixed-variant": "#431407",

        // Tertiary (Concrete Gray)
        tertiary: {
          DEFAULT: "#525252",
          container: "#737373",
          fixed: "#a3a3a3",
          "fixed-dim": "#d4d4d4",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffffff",
        
        // Neutral Typography & Outlines
        "on-surface": "#ffffff",
        "on-surface-variant": "#a3a3a3",
        "on-background": "#ffffff",
        outline: "#333333",
        "outline-variant": "#222222",
        "inverse-surface": "#ffffff",
        "inverse-on-surface": "#000000",
        "inverse-primary": "#000000",
        
        // Status Alerts
        error: {
          DEFAULT: "#dc2626",
          container: "#7f1d1d",
        },
        "on-error": "#ffffff",
        "on-error-container": "#fecaca",
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
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        "headline-xl": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "label-md": ["Fira Code", "monospace"],
        "label-sm": ["Fira Code", "monospace"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        "4xl": "0px",
        full: "0px",
      },
      boxShadow: {
        glow: "none",
        "glow-lg": "none",
        "glow-sm": "none",
        "glow-error": "none",
        "glow-warning": "none",
        "glow-success": "none",
        panel: "none",
      },
      backgroundImage: {
        "ocean-radial": "none",
        "tactical-grid": "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
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
