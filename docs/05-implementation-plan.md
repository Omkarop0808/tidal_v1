# Implementation Plan

*Time Budget: 7 Days (One Developer)*

## Milestone 1: The Core Math & Data (COMPLETE)
**Tasks:** Fix ML data leakage, implement SHAP, refactor Drift simulation to return a 72h matrix.
**Status:** Completed.

## Milestone 2: The Core View (COMPLETE)
**Tasks:** Build R3F `Scene`, `InstancedMesh` for particles, `TimelineScrubber`, and hook up Zustand state.
**Status:** Completed.

## Milestone 3: The Ghost Trajectories & Vectors (Tier 3)
**Tasks:**
1. Update `backend/services/drift.py` to accept intervention parameters and return a *second* trajectory matrix (the "after" state).
2. Update `frontend/src/store.ts` to hold `baselineTrajectory` and `interventionTrajectory`.
3. Add a second `InstancedMesh` to `Particles.tsx` rendering in a different color.
4. Add wind vector lines using `@react-three/drei` `Line` component to visualize current flow.
**Effort:** 12 hours.
**Risk:** R3F performance drops if we double the particle count to 4,000.
**Verification:** Run the intervention slider and verify both red and green particles animate smoothly without lagging.

## Milestone 4: Live Video Drone Vision (Tier 4)
**Tasks:**
1. Procure a short, realistic MP4 of floating debris in murky water.
2. Build an OpenCV FastAPI endpoint (`/api/v1/vision/stream`) that reads the video, applies CLAHE, runs YOLOv8, and yields JPEG frames over a multipart HTTP response.
3. Update `SplitScreenSlider.tsx` to handle an `<img>` tag pointing to the stream endpoint instead of static images.
**Effort:** 10 hours.
**Risk:** Fast streaming base64 images might stutter in React.
**Verification:** The slider works flawlessly over moving video footage.

## Milestone 5: The Plastics Exchange (Tier 4)
**Tasks:**
1. Add a small HUD element to the main `Dashboard.tsx`.
2. Extract the number of particles diverted from the beach by comparing the baseline and intervention trajectories.
3. Multiply the diverted amount by a realistic scrap plastic value (e.g., $1.50/kg).
**Effort:** 4 hours.
**Risk:** Low.
**Verification:** The dollar amount increments visually when the user executes a successful intervention protocol.

## What Was Cut (If Needed)
If time runs out during Milestone 3, we will cut Milestone 4 (Live Video). We will fall back to the already-built static image Split Screen Slider, which is sufficient for a demo, albeit less impressive than live video. We will prioritize the Ghost Trajectories as the primary "Wow" factor.
