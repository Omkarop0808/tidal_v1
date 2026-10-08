# Tidal PRD

## Problem and Target User
Marine debris mapping is currently reactive, expensive, and difficult to understand. Coastal authorities and environmental NGOs need a proactive, highly visual command-and-control platform that predicts where plastic will beach, and proves the economic value of recovering it.

## One-Sentence Pitch
Tidal is an AI-powered marine intelligence platform that merges computer vision, Monte-Carlo drift physics, and economic gamification into a real-time 3D command center for ocean cleanup operations.

## The 30-Second Demo Story
1. The judge sees a dark, cinematic 3D map of the Mumbai coastline. A timeline is scrubbing at the bottom, and thousands of glowing cyan dots (debris) are drifting toward the shore.
2. We click the "Intervention Simulator." We crank up the wind speed and deploy a virtual barrier. We hit "EXECUTE PROTOCOL."
3. Ghost Trajectories appear. The judge instantly sees the red path (where the trash *was* going) vs. the green path (where it is going now).
4. The Plastics Exchange HUD lights up, showing that the diverted trash is worth $1,800 in recycled PET.
5. We click the Vision Diagnostics panel. A raw, murky drone feed plays. A slider is dragged across the video, revealing a crisp CLAHE-enhanced feed with YOLO bounding boxes perfectly tracking plastic bottles in the surf.

## UX Principles
- **Complexity in the Engine, Simplicity in the Experience:** The math (XGBoost, Monte Carlo, SHAP) is hidden. The user only sees "High Risk" and "Ghost Paths".
- **Tactile Interactivity:** Sliders, draggable components, and instantaneous 3D responses. 
- **Progressive Disclosure:** Don't show the charts until the user wants to see the charts. Keep the 3D map clean.

## Success Criteria
- The 3D map runs at 60fps with 2,000+ particles.
- The ML model runs strictly on chronologically split data with zero data leakage.
- The drone vision demo works on a moving video, not just a static image.
- A judge can understand the core value proposition within 10 seconds of looking at the dashboard.
