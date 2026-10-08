---
name: TIDAL Marine Intelligence
description: Tactical marine debris telemetry, hydrodynamic drift modeling, and autonomous fleet coordination platform.
colors:
  background: "#050b10"
  surface: "#0b1622"
  surface-low: "#08121c"
  surface-high: "#132537"
  primary: "#00f2fe"
  secondary: "#38bdf8"
  error: "#ff3366"
  warning: "#f59e0b"
  success: "#10b981"
  on-surface: "#f1f5f9"
  on-surface-variant: "#94a3b8"
  outline: "#334155"
  outline-variant: "#1e293b"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#031d28"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-tactical:
    backgroundColor: "{colors.surface-low}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System

## Overview

TIDAL's visual identity embodies precision marine intelligence, deep oceanographic research, and tactical naval fleet operations. The visual atmosphere is anchored in deep oceanic abyssal tones (`#050b10`), punctuated by bioluminescent electric cyan telemetry vectors (`#00f2fe`), tactical alert coral (`#ff3366`), and sensor-synced emerald statuses (`#10b981`).

## Colors

- **Abyssal Foundations:** Deep dark grounds (`#050b10`, `#08121c`, `#0b1622`) provide maximum contrast for telemetry data and spatial maps.
- **Bioluminescent Primary:** Electric Cyan (`#00f2fe`) denotes active systems, predictions, vector overlays, and primary interactions.
- **Ocean Cerulean Secondary:** Tactical Blue (`#38bdf8`) signifies supporting metrics, sensor readings, and autonomous vessels.
- **Tactical Signals:** High-visibility Coral Alert (`#ff3366`) for critical debris thresholds, Amber (`#f59e0b`) for active warnings, and Emerald (`#10b981`) for verified upcycling and synced connections.

## Typography

- **Display & Headlines:** Space Grotesk — bold, structural, engineered, with slight negative tracking for commanding authority.
- **Body:** Plus Jakarta Sans & Inter — highly readable, neutral, optimized for dense tabular scanning.
- **Telemetry & Metadata:** JetBrains Mono — instrument-grade tabular figures, coordinates, timestamp logs, and telemetry units.

## Layout

- **Grid:** Asymmetric tactical command bento grids with responsive fluid scaling (`sm`, `md`, `lg`, `xl`).
- **Sidebar & Top Bar:** Fixed glassmorphic navigation shell with sticky quick-action header and mobile responsive drawer.
- **Pacing:** High density of actionable telemetry paired with generous structural padding and clear visual grouping.

## Elevation & Depth

- **Tactical Glass Panels:** `backdrop-filter: blur(16px)` with hairline borders (`rgba(56, 189, 248, 0.12)`) and deep drop shadows (`rgba(0, 0, 0, 0.4)`).
- **Glow Accents:** Soft cyan aura halos (`shadow-glow`) highlighting active vectors and emergency modes without overwhelming the eye.

## Shapes

- **Radii:** Substantial 24px (`rounded-3xl`) for primary instrument panels; 12-16px (`rounded-xl` / `rounded-2xl`) for metric cards and buttons; subtle pill badges for telemetry tags.

## Components

- **Instrument Cards:** Deep layered cards featuring integrated status beacons, progress meters, and categorical tags.
- **Digital Twin Viewport:** High-contrast 3D spatial viewport with floating HUD controls, time scrubbers, and vector indicators.
- **Telemetry Feeds:** Filterable real-time chronological event logs with inspectable vision link drawers.
- **Action Buttons:** Glowing primary gradient actions with crisp active/hover transitions and loading spinners.

## Do's and Don'ts

- **DO** use monospace for all numbers, coordinates, timestamps, and physical units (kg, km/h, m/s, °N, °E).
- **DO** maintain high contrast (>4.5:1) for all typography against dark surfaces.
- **DO** preserve all backend data flow, WebSocket streams, and state hooks.
- **DON'T** use generic purple SaaS gradients or decorative non-functional illustrations.
- **DON'T** use bounce/elastic easing; use smooth exponential deceleration for all interface transitions.
- **DON'T** place borders or backgrounds that obstruct map vector legibility.
