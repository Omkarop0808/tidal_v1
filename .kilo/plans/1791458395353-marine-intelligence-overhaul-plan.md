# TIDAL Marine Intelligence Platform: Comprehensive Engineering & UI/UX Overhaul Plan

## 1. Executive Summary & Vision

TIDAL is an operational marine intelligence platform designed for oceanographers, coastal authorities, and autonomous cleanup fleets. It unifies:
1. **Real-time oceanographic telemetry** (Open-Meteo weather & marine sensor streams via WebSockets).
2. **Physics-informed hydrodynamic drift modeling** (Monte Carlo particle dispersion engine).
3. **Machine-learning beaching forecasting** (XGBoost classifier/regressor with live SHAP explainability).
4. **Underwater optical computer vision** (YOLOv8/11 + CLAHE preprocessing for turbid waters).
5. **Deterministic autonomous fleet logistics** (Hungarian optimal bipartite matching algorithm with Gemini explanations).

This overhaul eliminates all generic "AI template" aesthetics, replacing them with a **bespoke, instrument-grade naval hydrodynamics design system**, while completely re-engineering the simulation engine and dashboard interactions for intuitive usability and robust performance.

---

## 2. Design System: The "Anti-AI" Aesthetic

### 2.1 Bespoke Marine Bathymetry Palette

| Token Name | Hex Code | Purpose & Function |
| :--- | :--- | :--- |
| **Abyssal Trench** | `#03070A` | Deepest background foundation; represents deep ocean floor |
| **Pelagic Depth** | `#08131E` | Primary card & panel containers; high-contrast backdrop |
| **Marine Shelf** | `#122436` | Secondary surfaces, table rows, active button fills |
| **Hydroluminescent Cyan** | `#00E5FF` | Active telemetry vectors, mitigated particle streams, primary actions |
| **Pelagic Cobalt** | `#2563EB` | Supporting metrics, ocean current vectors, baseline indicators |
| **Maritime Coral (Alert)** | `#FF3B30` | Critical hazard threshold, unmitigated debris beaching path |
| **Biosphere Emerald** | `#10B981` | Interception success, verified upcycling manifests, live connection status |
| **Solar Flare (Warning)** | `#F59E0B` | Elevated risk advisory, maintenance & battery notices |
| **Glacial Slate** | `#E2E8F0` | High-contrast display headlines and crisp readouts |
| **Deep Foam** | `#8FA3B7` | Subdued metadata, coordinates, unit indicators |

### 2.2 Typographic Hierarchy
*   **Display & Section Headers:** `Space Grotesk` (Weight 600/700, tracking `-0.02em`, sentence-case, zero eyebrow clutter) — engineered, architectural, human-designed.
*   **Data, Metrics, Coordinates & Units:** `JetBrains Mono` (Weight 500/700, tabular numbers) — instrument-grade readouts (`18.975° N`, `14.2 kg`, `T+24h`).
*   **Interface & Operational Body Copy:** `Plus Jakarta Sans` / `Inter` (Weight 400/500, line-height 1.5, max 75ch measure) — neutral, highly legible.

### 2.3 Visual Principles (Eliminating AI Tells)
1.  **Zero Decorative Clutter:** No floating ambient purple gradient orbs, no unnecessary all-caps eyebrows above every title, no nested cards-inside-cards.
2.  **Structural Borders as Information:** 1px hairline borders (`rgba(0, 229, 255, 0.12)`) that encode status (coral for high-risk zones, cyan for active sensors).
3.  **Physical Purposeful Motion:** Exponential deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`) answering user actions; zero generic bouncing or scattered hover fades.
4.  **Tangible Spatial Geometry:** Real coastline topology in the 3D viewport, clearly distinguishing land from water.

---

## 3. Simulation & Digital Twin Overhaul: Dual-Mode Interactive Architecture

### 3.1 Problem Statement
The existing simulation was perceived as ineffective and confusing:
*   The 3D Scene rendered an abstract infinite grid with floating dots without geography (users couldn't tell land from sea).
*   Parameter inputs were disconnected from the actual physical particle paths.
*   Outputs failed to convey what the simulation achieved or what action to take.

### 3.2 Solution: Interactive Dual-Mode (Baseline vs. Mitigation)

```
+-------------------------------------------------------------------------------------------------------------------+
| SIMULATION ENGINE // 72H HYDRODYNAMIC DUAL-TRACK TWIN                                [Run Simulation] [Reset]     |
+--------------------------------------------------+----------------------------------------------------------------+
| PARAMETERS & CONTROLS                            | 3D BATHYMETRIC DIGITAL TWIN VIEWPORT                           |
| Release Outfall: [ Versova Creek Channel ▼ ]     |                                                                |
| Debris Mass: [ 500 kg ]  Material: [ PET/Nets ▼] |   WEST (ARABIAN SEA)           EAST (MUMBAI SHORELINE)         |
|                                                  |   ~~~~~~~~~~~~~~~~~            |  /                            |
| ENVIRONMENTAL FORCES                             |   Wind SW 24km/h --->          | / (Versova Creek Outfall)     |
| Onshore Wind: [-------●---------] 24 km/h        |                                |/                              |
| Tidal Current: [---●-------------] 0.8 m/s       |   [=== BOOM BARRIER ===]       | (Juhu Beach)                  |
| Monsoon Surge: [--------●--------] +35 mm        |      ▲                         |                               |
|                                                  |   (Trapped Particles)          | (Bandra Channel)              |
| DEFENSIVE COUNTERMEASURES                        |   ● Cyan = Mitigated Stream    |                               |
| [X] Deploy Offshore Containment Boom             |   ● Coral = Unmitigated Path   |/                              |
| [X] Dispatch 2 Autonomous Skimmers               |                                                                |
+--------------------------------------------------+----------------------------------------------------------------+
| COMPARATIVE OUTCOME TIMELINE (T+0h to T+72h)                                                                      |
| [ ▶ Play ] T+0h ------------------[ ● T+24h Peak ]----------------------------------------------------- T+72h    |
|                                                                                                                   |
| [ UNMITIGATED BASELINE ]                         | [ MITIGATED INTERVENTION ]                                     |
| Shoreline Beaching: 78.4% (392 kg washed ashore) | Shoreline Beaching: 16.2% (81 kg washed ashore)                |
| Primary Impact: Versova (Zone A) at T+18h        | Offshore Capture: 83.8% (419 kg recovered)                     |
| Environmental Hazard: CRITICAL                   | Net Shoreline Protection: +62.2% Improvement                   |
+-------------------------------------------------------------------------------------------------------------------+
```

### 3.3 Core Technical Implementation Details
1.  **Shoreline Topography Geometry (`ShorelineMesh.tsx`):**
    *   Construct an accurate 2D/3D extruded polygon representing the Mumbai western coastline from Colaba (`18.90° N, 72.81° E`) through Bandra (`19.05° N`), Juhu (`19.10° N`), Versova (`19.13° N`), to Manori (`19.22° N`).
    *   Land is textured in dark slate topography (`#0F1E2E`) with shoreline edge outlines.
    *   Ocean is rendered on the west (`#030910`) with dynamic flow vectors.
2.  **Dual-Particle Instanced Emitters (`Particles.tsx`):**
    *   **Baseline Stream (Ghost/Coral):** Simulates unmitigated hydrodynamic drift where particles drift east and stick to the coastline (`#FF3B30`).
    *   **Intervention Stream (Bioluminescent Cyan):** Simulates deflection by the offshore containment barrier and collection by skimmer vessels (`#00E5FF`).
3.  **Barrier Interception Mesh (`BarrierMesh.tsx`):**
    *   Renders a physical floating containment boom line in the 3D scene when `barrier_efficiency > 0`, showing particles bouncing/stopping at the boom coordinates.
4.  **Reactive Parametric Store (`store.ts`):**
    *   Syncs all sliders (wind speed, rainfall, barrier efficiency, skimmer squads) directly with `/api/v1/simulate/scenario`.

---

## 4. Feature-by-Feature Engineering Overhaul

### 4.1 Overview & Tactical Command (`/overview`)
*   **Hero Snapshot:** Live meteorological ticker (wind, tide, wave height, barometric pressure) connected to WebSocket telemetry.
*   **Bento Metric Instruments:**
    *   Predicted Coastal Debris Mass (with 24h trend delta).
    *   High-Risk Coastal Zones (with severity badges and SHAP explainability tooltips).
    *   Active Fleet Deployment (autonomous skimmers + field teams).
    *   Circular Recovery Feasibility Index.
*   **Telemetry Event Stream:** Categorized chronological feed with quick-inspect drawers (`DebrisAnalysisPanel.tsx`).

### 4.2 Tactical Hotspots & Fleet Command (`/hotspots`)
*   **Reactive Ranking Matrix:** Interactive list of zones (Versova, Juhu, Bandra, Mahim). Clicking any zone pans the Leaflet map and highlights its risk boundary.
*   **Tactical Leaflet Radar:** Dark inverted tiles, glowing zone halos, vector intercept lines from Mumbai Port HQ to hotspots.
*   **Hungarian AI Dispatch Modal:** Deterministic vessel-to-hotspot assignment with ETA, capacity match, and Gemini natural-language rationale.
*   **Live Tactical Execution Feedback:** Upon dispatch authorization, vessel paths animate toward hotspots on the map, status transitions to `INTERCEPTING`, and fleet telemetry reflects active missions.

### 4.3 Circular Recovery & YOLO11 Vision (`/circular-recovery`)
*   **Dual-Stage Valuation Pipeline:**
    *   *Stage 1 (Vision Detection):* CLAHE contrast-enhancement and YOLO11 detection with responsive percentage-scaled bounding boxes.
    *   *Stage 2 (Material Valuation & Manifest):* Gemini polymer categorization (PET, HDPE, Nylon Nets) calculates real-time catch valuation against live Mumbai spot rates (`₹35/kg PET`, `₹28.5/kg HDPE`, `₹42/kg Nylon`) and generates an executable Upcycler Transfer Manifest for certified recyclers.

### 4.4 AI Model Lab & ML Observability (`/model-lab`)
*   **Model Performance KPI Tiles:** Live MAE, R², mAP@50, Precision, Recall, and F1-Score.
*   **SHAP Feature Contribution Gauges:** Visual bar charts showing the mathematical weights of onshore wind, precipitation lag, and tidal velocity.
*   **Active Learning Retrain Queue:** Interactive retraining trigger with live progress state and ground-truth sample counters.

### 4.5 Ocean-GPT Copilot (`OceanGPTWidget.tsx`)
*   **Floating Tactical Assistant:** Expandable conversational HUD connected to `/api/v1/chat` (Gemini 2.5 Flash / Groq fallback).
*   **Pre-computed Prompt Chips:** Quick questions for rapid field queries ("What is Versova risk?", "Optimize fleet dispatch", "Explain drift physics").

---

## 5. Detailed Task Breakdown & Implementation Sequence

### Phase 1: Foundation & Design System (Tokens & Assets)
1.  **Configure Theme & Utilities:**
    *   Update `frontend/tailwind.config.js` with the 6-color bathymetric palette and typography scale.
    *   Update `frontend/src/index.css` with clean glass utilities, custom scrollbars, and removal of generic grid-lines.
2.  **Verify Clean Compilation:**
    *   Run `npm run build` (`tsc -b && vite build`) to confirm zero compilation errors.

### Phase 2: 3D Coastal Shoreline & Physics Engine
3.  **Create Mumbai Coastline Geometry:**
    *   Implement `frontend/src/components/Map3D/ShorelineMesh.tsx` with Mumbai polygon coordinates.
4.  **Upgrade Dual-Particle Emitters & Barrier Physics:**
    *   Update `frontend/src/components/Map3D/Particles.tsx` for simultaneous Baseline vs. Mitigated rendering.
    *   Create `frontend/src/components/Map3D/BarrierMesh.tsx` for containment boom rendering.
    *   Update `frontend/src/components/Map3D/Scene.tsx` to compose the water plane, shoreline, force vectors, and barrier.

### Phase 3: Digital Twin Simulation UX Overhaul
5.  **Re-architect Simulation Page (`frontend/src/pages/Simulate.tsx`):**
    *   Implement the dual-mode comparison header and side-by-side delta cards.
    *   Bind all form inputs (outfall location, mass, material, wind, rain, barrier, skimmers) to `useSim` store and `/api/v1/simulate/scenario`.
    *   Implement smooth timeline scrubbing with play/pause and frame synchronization.
6.  **Enhance Full-Screen Digital Twin (`frontend/src/pages/Dashboard.tsx`):**
    *   Update `ScenarioPanel.tsx` and `DiagnosticsPanel.tsx` with high-contrast glass styling and real-time state reactivity.

### Phase 4: Hotspots, Fleet Logistics & Circular Recovery
7.  **Overhaul Hotspots Dashboard (`frontend/src/pages/Hotspots.tsx`):**
    *   Connect `HotspotRanking.tsx`, `LiveMap.tsx`, and `CleanupOptimization.tsx` with synchronized zone selection.
    *   Enhance `DispatchPlanModal.tsx` with animated vessel routes and live mission confirmation.
8.  **Overhaul Circular Recovery (`frontend/src/pages/CircularRecovery.tsx`):**
    *   Fix responsive bounding box rendering in `SplitScreenSlider.tsx`.
    *   Add verified upcycler manifest generation and dynamic commodity pricing calculations.

### Phase 5: Overview, Model Lab & Shell Layout
9.  **Overhaul Overview Command Center (`frontend/src/pages/Overview.tsx`):**
    *   Implement the hero telemetry ticker, bento metric instruments, and live activity log.
10. **Overhaul AI Model Lab (`frontend/src/pages/ModelLab.tsx`):**
    *   Wire live SHAP explainability and active learning queue simulation.
11. **Refine Navigation & Ocean-GPT (`Sidebar.tsx`, `Header.tsx`, `OceanGPTWidget.tsx`):**
    *   Ensure 100% mobile drawer responsiveness and smooth chat assistant flow.

---

## 6. Verification & Quality Assurance Plan

### 6.1 Mechanical Antipattern Detection
*   Run `node .agents/skills/impeccable/scripts/detect.mjs --json frontend/src` and ensure **0 warnings or antipattern violations** (no gradient text, no bounce easing, no overused generic fonts).

### 6.2 TypeScript & Build Verification
*   Execute `npm run build` in `frontend/` to ensure clean minification and zero TypeScript diagnostics.

### 6.3 Functional & UX Validation Matrix
| Feature | Expected Behavior | Verification Check |
| :--- | :--- | :--- |
| **3D Coastline Mesh** | Land is clearly distinct on the east, water on the west | Inspect 3D canvas rendering in `/simulate` and `/dashboard` |
| **Dual Particle Stream** | Red particles beach on coast; Cyan particles get trapped at barrier | Toggle boom barrier and scrub timeline |
| **Simulate Parameters** | Adjusting wind/rain/barrier updates trajectory immediately | Verify API payload and visual delta in results |
| **Hotspot Dispatch** | Clicking "Deploy AI Cleanup" opens Hungarian match and dispatches fleet | Verify modal and fleet status updates |
| **YOLO Vision** | Uploading debris image draws correctly proportioned bounding boxes | Test image upload and live drone simulation |
| **Model Lab Retrain** | Clicking "Trigger Nightly Retrain" animates retrain pipeline | Verify UI feedback and status badge |
| **Responsive Layout** | Layout is fully usable on mobile (390px), tablet (768px), and desktop | Verify across viewport breakpoints |
