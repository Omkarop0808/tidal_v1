# Tidal Audit Report

## 1. Executive Summary
Tidal is a marine intelligence platform designed to predict, visualize, and manage marine debris (specifically plastic waste) trajectories. It uses an XGBoost ML model to predict beaching risks and a Monte-Carlo particle simulation to forecast debris drift based on ocean currents and wind. The backend is a FastAPI Python service, while the frontend is a React application built with Vite and Tailwind CSS. The system aims to provide actionable intelligence for environmental clean-up operations.

**Architecture Map:**
- **Frontend:** React (Vite, Tailwind, Zustand) -> *New components use React Three Fiber for 60fps 3D visualization.*
- **Backend Core:** FastAPI (Python 3.11)
- **ML Layer:** `BeachingRiskModel` (XGBoost) trained on historical coastal data.
- **Physics Layer:** `DriftEngine` (Monte-Carlo simulation) for particle forecasting.

## 2. Feature Health
| Feature | Status | Evidence | Demo Impact |
| --- | --- | --- | --- |
| **ML Risk Prediction** | Works | `model.py` - Strict chronological splitting and SHAP explainability implemented. | High |
| **Monte-Carlo Simulation** | Works | `drift.py` - Returns 72h deterministic particle matrix. | High |
| **3D Visualization Map** | Works | `Dashboard.tsx` - High-performance R3F instanced meshes. | High |
| **Intervention Simulator** | Partially Works | `ScenarioPanel.tsx` - Updates parameters, but backend `/scenario` doesn't return full matrix yet. | Medium |
| **CLAHE Vision Split** | Fake/Demo | `SplitScreenSlider.tsx` - Uses static demo images instead of real drone stream. | High (Visuals) |
| **Circular Recovery** | Broken | `CircularRecovery.tsx` - Isolated from live state. | Low |
| **OceanGPT** | Placeholder | UI exists, but no real LLM integrated. | Low |

## 3. UI/UX Problems
- **Inconsistent Routing:** Prior to the fix, the navigation was disconnected. 
- **Information Overload:** The original `Overview.tsx` presented too many raw stats without contextualizing what the user should *do* with them.
- **Visual Disconnect:** The transition between 2D charts and the 3D map was jarring, lacking a unified design system.

## 4. Simulation Diagnosis
- **Original Flaw:** The simulation lacked a sense of scale and cause-and-effect. Users could not tell how wind or currents were pushing the debris.
- **Current State:** The new R3F map makes the flow clear, but first-time users might still struggle to understand what the color changes on particles signify without reading a legend.

## 5. ML Audit
- **Data:** Synthetic meteorological and coastal data generated via `generate_synthetic_data.py`. 
- **Leakage:** **Fixed**. Previously, random splitting caused data leakage from the future into the past. It now uses strict chronological splitting.
- **Metrics:** **Fixed**. Shifted from regression metrics (MAE, R2) to classification metrics (Precision, Recall, F1) tiered by risk level.
- **Explainability:** **Added**. SHAP values are calculated and exposed via API for the frontend diagnostics panel.

## 6. Architecture Weaknesses
- **State Coupling:** The original app had no centralized state management, making it hard to share data between the map and the analytics panels. Fixed with Zustand.
- **API Payload Size:** The particle matrix for the 3D simulation can grow to several megabytes if the particle count exceeds 5,000, which will cause latency over slow networks.

## 7. What is genuinely good
- The core premise of coupling ML risk prediction with Monte-Carlo physics is highly unique and solves a real-world problem.
- The FastAPI structure is clean, modular, and easy to extend.
