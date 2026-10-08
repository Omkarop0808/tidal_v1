# Traycer Technique Lessons

## 1. Decoupled Physics and Rendering
**What Traycer does:** Uses Zustand to hold simulation state completely separate from React's render cycle, updating the DOM only when necessary via `useFrame`.
**Why it works:** Prevents React from re-rendering the entire component tree 60 times a second.
**How it maps to Tidal:** We implemented `useSim` (Zustand) and `InstancedMesh` in `Particles.tsx` to handle 1,000+ debris particles smoothly.

## 2. InstancedMesh for High-Volume Objects
**What Traycer does:** Uses `THREE.InstancedMesh` for rendering thousands of identical objects (like food items or particles).
**Why it works:** Submits a single draw call to the GPU instead of one per object, resulting in massive performance gains.
**How it maps to Tidal:** Our debris particles are now rendered as a single `InstancedMesh`, allowing us to scale the Monte-Carlo simulation visually.

## 3. The "God-View" Timeline
**What Traycer does:** Provides a scrubber that allows the user to move back and forth in time, seeing the simulation state at any exact moment.
**Why it works:** Gives the user control over the narrative pacing. If something complex happens, they can scrub backward to re-watch it.
**How it maps to Tidal:** We added `TimelineScrubber.tsx` which updates the `currentFrameIndex` in the Zustand store, instantly snapping the particles to their coordinates for that hour.

## 4. One-Time Payload Architecture
**What Traycer does:** Fetches the entire simulation matrix from the backend once, rather than streaming it via WebSockets.
**Why it works:** Eliminates network jitter during the visual presentation. The simulation plays flawlessly because the data is already in memory.
**How it maps to Tidal:** Our FastAPI backend now returns a 72-hour matrix for all particles in a single JSON payload.

## 5. Floating Glassmorphism Panels
**What Traycer does:** Uses absolute positioning with backdrop-blur for UI panels overlaid on the 3D scene.
**Why it works:** Keeps the user immersed in the 3D environment while still providing critical data.
**How it maps to Tidal:** We implemented `DiagnosticsPanel.tsx` and `ScenarioPanel.tsx` using Tailwind's `backdrop-blur` utilities.

## 6. Progressive Disclosure of Complexity
**What Traycer does:** Hides deep analytical data until the user interacts with specific elements in the scene.
**Why it works:** Prevents overwhelming the user on their first glance.
**How it maps to Tidal:** We designed the Diagnostics Panel to be toggled via an eye icon, keeping the main map clean until the user specifically wants to see the SHAP ML explainability.
