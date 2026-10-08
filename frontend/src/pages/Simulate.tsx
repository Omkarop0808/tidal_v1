/*
THESIS: TIDAL Dual-Mode Hydrodynamic Digital Twin visualizes unmitigated baseline beaching drift against active offshore barrier & skimmer countermeasures in real-time.
OWN-WORLD: Deep abyssal bathymetric backdrop (#03070a), extruded Mumbai coastal topography mesh (#0d1b2a), bioluminescent cyan (#00e5ff) particle streams, coral hazard alerts (#ff3b30), and amber boom barriers (#f59e0b).
STORY: Operators instantly configure coastal debris releases and weather forces, execute Monte Carlo physics, and evaluate exact percentage reductions in shoreline contamination.
FIRST VIEWPORT: Asymmetric tactical cockpit with parametric input matrix, high-fidelity 3D coastal viewport with dual-particle streams, and side-by-side mitigation delta comparison cards.
FORM: 72-Hour Hydrodynamic Dual-Track Twin (Seed: 3e22ff0d).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, 
  Save, 
  Wind, 
  CloudRain, 
  Play, 
  Pause, 
  Sparkles, 
  Shield, 
  ShieldCheck, 
  RotateCw, 
  Anchor, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { Scene } from '../components/Map3D/Scene';
import { useSim, OUTFALL_LOCATIONS } from '../store';

export const Simulate = () => {
  const selectedLocation = useSim(state => state.selectedLocation);
  const debrisMassKg = useSim(state => state.debrisMassKg);
  const materialType = useSim(state => state.materialType);
  const windSpeed = useSim(state => state.windSpeed);
  const precipitation = useSim(state => state.precipitation);
  const barrierEfficiency = useSim(state => state.barrierEfficiency);
  const cleanupTeams = useSim(state => state.cleanupTeams);
  const isBarrierActive = useSim(state => state.isBarrierActive);
  
  const trajectory = useSim(state => state.trajectory);
  const trajectoryBaseline = useSim(state => state.trajectoryBaseline);
  const currentFrameIndex = useSim(state => state.currentFrameIndex);
  const isPlaying = useSim(state => state.isPlaying);
  
  const setSelectedLocation = useSim(state => state.setSelectedLocation);
  const setScenario = useSim(state => state.setScenario);
  const setTrajectory = useSim(state => state.setTrajectory);
  const setTrajectoryBaseline = useSim(state => state.setTrajectoryBaseline);
  const setCurrentFrame = useSim(state => state.setCurrentFrame);
  const togglePlay = useSim(state => state.togglePlay);

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Playback timer animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && trajectory.length > 0) {
      interval = setInterval(() => {
        setCurrentFrame((currentFrameIndex + 1) % trajectory.length);
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrameIndex, trajectory.length, setCurrentFrame]);

  // Execute Simulation API
  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        wind_speed: windSpeed,
        rainfall_increase: precipitation,
        barrier_efficiency: isBarrierActive ? barrierEfficiency : 0,
        cleanup_teams: cleanupTeams
      };
      
      const response = await axios.post('http://localhost:8000/api/v1/simulate/scenario', payload);
      const data = response.data;
      
      if (data.trajectory_intervention) {
        setTrajectory(data.trajectory_intervention);
      }
      if (data.trajectory_baseline) {
        setTrajectoryBaseline(data.trajectory_baseline);
      }
    } catch (error) {
      console.error('Simulation run failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [windSpeed, precipitation, barrierEfficiency, isBarrierActive, cleanupTeams, setTrajectory, setTrajectoryBaseline]);

  // Initial load
  useEffect(() => {
    if (trajectory.length === 0) {
      runSimulation();
    }
  }, [runSimulation, trajectory.length]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = OUTFALL_LOCATIONS.find(l => l.id === e.target.value) || OUTFALL_LOCATIONS[0];
    setSelectedLocation(loc);
  };

  const handleSaveScenario = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Compute live frame metrics
  const activeFrame = trajectory[currentFrameIndex] || { hour: 0, beached_percent: 0 };
  const baselineFrame = trajectoryBaseline[currentFrameIndex] || { hour: 0, beached_percent: 0 };

  const baselineBeachedKg = Math.round((baselineFrame.beached_percent / 100) * debrisMassKg);
  const mitigatedBeachedKg = Math.round((activeFrame.beached_percent / 100) * debrisMassKg);
  const capturedOffshoreKg = Math.max(0, debrisMassKg - mitigatedBeachedKg);
  const avoidedPercent = baselineFrame.beached_percent > 0 
    ? Math.max(0, Math.round(((baselineFrame.beached_percent - activeFrame.beached_percent) / baselineFrame.beached_percent) * 100))
    : 0;

  return (
    <div className="flex flex-col w-full text-on-surface px-4 sm:px-8 lg:px-12 py-8 gap-8 max-w-[1600px] mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Hydrodynamic Digital Twin // Dual-Track Monte Carlo Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface tracking-tight">
            Marine Debris Drift & Interception Simulator
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface-variant font-mono text-xs">
            Zone: <strong className="text-primary">{selectedLocation.name.split(' ')[0]}</strong>
          </span>

          <button 
            onClick={handleSaveScenario}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-xs transition-all flex items-center gap-2 border border-outline-variant/40"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Scenario Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-primary" />
                <span>Save Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Cockpit Layout: Left Controls (5 cols) & Right 3D Viewport (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Parametric Controls & Countermeasures (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Release Configuration Card */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-sm text-on-surface">Release Vector & Outfall Origin</h2>
                  <span className="text-[10px] font-mono text-on-surface-variant">Step 1: Set Source Point</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                CONFIG 01
              </span>
            </div>

            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-on-surface-variant uppercase text-[10px] font-semibold">Outfall Release Point</label>
                <select 
                  value={selectedLocation.id}
                  onChange={handleLocationChange}
                  className="w-full bg-surface-container border border-outline-variant/40 text-on-surface px-3.5 py-2.5 rounded-xl appearance-none outline-none focus:border-primary transition-colors"
                >
                  {OUTFALL_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.lat.toFixed(3)}°N, {loc.lon.toFixed(3)}°E)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant uppercase text-[10px] font-semibold">Debris Mass (kg)</label>
                  <input 
                    type="number" 
                    value={debrisMassKg}
                    onChange={(e) => setScenario({ debrisMassKg: Math.max(10, parseInt(e.target.value) || 100) })}
                    className="w-full bg-surface-container border border-outline-variant/40 text-on-surface px-3.5 py-2.5 rounded-xl outline-none focus:border-primary transition-colors font-mono" 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-on-surface-variant uppercase text-[10px] font-semibold">Polymer Classification</label>
                  <select 
                    value={materialType}
                    onChange={(e) => setScenario({ materialType: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/40 text-on-surface px-3.5 py-2.5 rounded-xl outline-none focus:border-primary transition-colors"
                  >
                    <option>Mixed Polymers (PET / HDPE)</option>
                    <option>Nylon Ghost Fishing Nets</option>
                    <option>Micro-plastics (&lt; 5mm)</option>
                    <option>Rigid High-Density Containers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Force Modifiers Card */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-sm text-on-surface">Hydrodynamic Ocean Forces</h2>
                  <span className="text-[10px] font-mono text-on-surface-variant">Step 2: Weather & Currents</span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>

            <div className="flex flex-col gap-3.5 font-mono text-xs">
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-primary" />
                    Onshore Wind Velocity
                  </span>
                  <span className="text-primary font-bold">{windSpeed} km/h (SW Vector)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={windSpeed} 
                  onChange={(e) => setScenario({ windSpeed: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-surface-container/70 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-secondary" />
                    Monsoon Storm Runoff Surge
                  </span>
                  <span className="text-secondary font-bold">+{precipitation} mm</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={precipitation} 
                  onChange={(e) => setScenario({ precipitation: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Defensive Countermeasures Card */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-sm text-on-surface">Defensive Countermeasures</h2>
                  <span className="text-[10px] font-mono text-on-surface-variant">Step 3: Tactical Booms & Fleet</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              {/* Barrier Toggle */}
              <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                isBarrierActive 
                  ? 'bg-primary/10 border-primary/40 shadow-glow-sm' 
                  : 'bg-surface-container/60 border-outline-variant/30'
              }`}
              onClick={() => setScenario({ isBarrierActive: !isBarrierActive })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isBarrierActive ? 'bg-primary text-on-primary font-bold' : 'bg-surface text-on-surface-variant'
                  }`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-headline font-bold text-on-surface block">Offshore Containment Boom</span>
                    <span className="text-[10px] text-on-surface-variant">Anchored barrier line traps buoyant plastics</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  isBarrierActive ? 'border-primary bg-primary' : 'border-outline'
                }`}>
                  {isBarrierActive && <CheckCircle2 className="w-3.5 h-3.5 text-on-primary" />}
                </div>
              </div>

              {/* Barrier Efficiency Slider (if active) */}
              {isBarrierActive && (
                <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Boom Capture Efficiency:</span>
                    <span className="text-primary font-bold">{barrierEfficiency}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={barrierEfficiency} 
                    onChange={(e) => setScenario({ barrierEfficiency: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}

              {/* Skimmer Squads Count */}
              <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-on-surface">Autonomous Skimmer Squads:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setScenario({ cleanupTeams: Math.max(2, cleanupTeams - 2) })}
                    className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-bright"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-primary px-2">{cleanupTeams}</span>
                  <button 
                    onClick={() => setScenario({ cleanupTeams: Math.min(24, cleanupTeams + 2) })}
                    className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-bright"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Execute Button */}
              <button 
                onClick={runSimulation}
                disabled={isLoading}
                className="mt-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-on-primary font-headline font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 hover:shadow-glow transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Recalculating Hydrodynamics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Monte Carlo Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Digital Twin Viewport & Comparative Timeline (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 3D WebGL Digital Twin Viewport */}
          <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant/40 shadow-2xl flex flex-col">
            
            {/* 3D Three.js Scene */}
            <div className="absolute inset-0 z-0">
              <Scene />
            </div>
            
            {/* Top Floating HUD Overlay */}
            <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 text-xs font-mono text-primary font-semibold pointer-events-auto shadow-lg">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>MUMBAI BATHYMETRIC TWIN</span>
              </div>
              
              {/* Dual-Stream Legend */}
              <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 text-[11px] font-mono pointer-events-auto shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-slate-300">Baseline Drift</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]"></span>
                  <span className="text-cyan-300 font-bold">Mitigated</span>
                </div>
              </div>
            </div>
            
            {/* Floating Scrubber HUD at Bottom */}
            <div className="relative z-20 mt-auto p-4 m-3 rounded-2xl bg-surface-container-low/95 backdrop-blur-2xl border border-outline-variant/50 flex flex-col gap-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-all shadow-glow-sm"
                    aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <span className="text-primary font-bold text-sm">
                    T + {activeFrame.hour}h Forecast Horizon
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-on-surface-variant font-medium">
                    Frame: {currentFrameIndex + 1} / {trajectory.length || 13}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <input 
                  type="range" 
                  min="0" 
                  max={Math.max(0, trajectory.length - 1)} 
                  value={currentFrameIndex} 
                  onChange={(e) => { setCurrentFrame(Number(e.target.value)); if (isPlaying) togglePlay(); }}
                  className="w-full" 
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono px-1">
                  <span>T+0h Release</span>
                  <span>T+18h Outfall Surge</span>
                  <span className="text-primary font-bold">T+36h Peak Beaching</span>
                  <span>T+54h Deflection</span>
                  <span>T+72h Final State</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Dual-Track Comparative Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Baseline Unmitigated Card */}
            <div className="p-5 rounded-3xl bg-surface-container-low/90 border border-error/30 backdrop-blur-xl flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-error/20">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-error" />
                  <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-error">
                    Unmitigated Baseline
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-error font-bold px-2 py-0.5 rounded bg-error/10 border border-error/30">
                  NO INTERVENTION
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase block">Shoreline Beaching</span>
                  <span className="font-headline font-bold text-3xl text-error">
                    {baselineFrame.beached_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase block">Beached Mass</span>
                  <span className="text-lg font-bold text-on-surface">{baselineBeachedKg} kg</span>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed font-mono">
                Debris disperses eastward into coastal surf zones, causing severe plastic accumulation at <strong className="text-error">{selectedLocation.name.split(' ')[0]}</strong>.
              </p>
            </div>

            {/* Mitigated Intervention Card */}
            <div className="p-5 rounded-3xl bg-surface-container-low/90 border border-primary/40 backdrop-blur-xl flex flex-col gap-4 shadow-xl shadow-glow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-primary">
                    Mitigated Intervention
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  {avoidedPercent}% AVOIDED
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase block">Offshore Capture</span>
                  <span className="font-headline font-bold text-3xl text-primary text-glow">
                    {(100 - activeFrame.beached_percent).toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase block">Captured Mass</span>
                  <span className="text-lg font-bold text-emerald-400">{capturedOffshoreKg} kg</span>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed font-mono">
                Containment boom and autonomous skimmers trap debris offshore, protecting <strong className="text-primary">{avoidedPercent}%</strong> of the sensitive shoreline.
              </p>
            </div>

          </div>

          {/* Concentration Curve & Action Link */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="font-headline font-bold text-sm text-on-surface">Debris Concentration Curve (kg/m³)</h3>
              </div>
              <span className="text-xs font-mono text-primary font-semibold">T+36h Peak Risk</span>
            </div>

            <div className="h-28 w-full bg-surface-container/60 rounded-2xl p-3 flex items-end justify-between gap-1 relative overflow-hidden border border-outline-variant/30 font-mono">
              <svg className="absolute inset-0 w-full h-full p-3" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path d="M 0 44 Q 25 40, 50 12 T 100 4 L 100 50 L 0 50 Z" fill="url(#gradSimMain)" opacity="0.25"></path>
                <path d="M 0 44 Q 25 40, 50 12 T 100 4" fill="none" stroke="#00e5ff" strokeWidth="2.5"></path>
                <defs>
                  <linearGradient id="gradSimMain" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#00e5ff"></stop>
                    <stop offset="100%" stopColor="transparent"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-2 left-3 text-[10px] text-on-surface-variant">T+0h Baseline</div>
              <div className="absolute bottom-2 right-3 text-[10px] text-primary font-bold">T+72h Steady State</div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-on-surface-variant">
                Ready to allocate clean-up units to predicted zones?
              </span>
              <Link 
                to="/hotspots"
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center gap-2 hover:shadow-glow transition-all"
              >
                <span>Deploy Fleet to Hotspots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Simulate;
