import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Save, 
  Wind, 
  CloudRain, 
  Play, 
  Pause, 
  Shield, 
  ShieldCheck, 
  RotateCw, 
  Anchor, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ArrowRight,
  Square,
  Cpu,
  Recycle
} from 'lucide-react';
import { Scene } from '../components/Map3D/Scene';
import { useSim, OUTFALL_LOCATIONS } from '../store';
import { api } from '../lib/api';

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && trajectory.length > 0) {
      interval = setInterval(() => {
        setCurrentFrame((currentFrameIndex + 1) % trajectory.length);
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrameIndex, trajectory.length, setCurrentFrame]);

  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        wind_speed: windSpeed,
        rainfall_increase: precipitation,
        barrier_efficiency: isBarrierActive ? barrierEfficiency : 0,
        cleanup_teams: cleanupTeams,
        lat: selectedLocation.lat,
        lon: selectedLocation.lon
      };
      
      const response = await api.runSimulation(payload);
      const data = response;
      
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
  }, [windSpeed, precipitation, barrierEfficiency, isBarrierActive, cleanupTeams, setTrajectory, setTrajectoryBaseline, selectedLocation.lat, selectedLocation.lon]);

  useEffect(() => {
    if (trajectory.length === 0) {
      runSimulation();
    }
  }, [runSimulation, trajectory.length]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = OUTFALL_LOCATIONS.find(l => l.id === e.target.value) || OUTFALL_LOCATIONS[0];
    setSelectedLocation(loc);
  };

  const [toastMessage, setToastMessage] = useState('');

  const handleSaveScenario = () => {
    const payload = {
      wind_speed: windSpeed,
      rainfall_increase: precipitation,
      barrier_efficiency: isBarrierActive ? barrierEfficiency : 0,
      cleanup_teams: cleanupTeams,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      savedAt: new Date().toISOString()
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('tidal_saved_scenarios') || '[]');
      localStorage.setItem('tidal_saved_scenarios', JSON.stringify([...existing, payload]));
    } catch {
      localStorage.setItem('tidal_saved_scenarios', JSON.stringify([payload]));
    }

    setSaveSuccess(true);
    setToastMessage(`CAPTURED: /VOL/SCENARIOS/${Date.now().toString().slice(-6)}.JSON`);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const activeFrame = trajectory[currentFrameIndex] || { hour: 0, beached_percent: 0 };
  const baselineFrame = trajectoryBaseline[currentFrameIndex] || { hour: 0, beached_percent: 0 };

  const baselineBeachedKg = Math.round((baselineFrame.beached_percent / 100) * debrisMassKg);
  const mitigatedBeachedKg = Math.round((activeFrame.beached_percent / 100) * debrisMassKg);
  const capturedOffshoreKg = Math.max(0, debrisMassKg - mitigatedBeachedKg);
  const avoidedPercent = baselineFrame.beached_percent > 0 
    ? Math.max(0, Math.round(((baselineFrame.beached_percent - activeFrame.beached_percent) / baselineFrame.beached_percent) * 100))
    : 0;

  return (
    <div className="flex flex-col w-full text-white bg-[#000000] min-h-[calc(100vh-4rem)] border-x-2 border-[#333333]">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-8 border-b-2 border-[#333333] bg-[#111111]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[10px] font-mono text-white uppercase tracking-widest font-bold">
            <Square className="w-3 h-3 fill-white text-white" />
            <span>HYDRODYNAMIC TWIN // MONTE CARLO ENGINE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-headline font-black text-white uppercase tracking-tighter">
            Drift & Interception
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-black border-2 border-[#333333] text-[#a3a3a3] font-mono text-[10px] uppercase font-bold tracking-widest">
            ZONE: <strong className="text-white">{selectedLocation.name.split(' ')[0]}</strong>
          </span>

          <button 
            onClick={handleSaveScenario}
            className="px-6 py-2 bg-white hover:bg-black text-black hover:text-white border-2 border-white font-headline font-black text-xs uppercase tracking-widest transition-none flex items-center gap-3"
          >
            <Save className="w-4 h-4" />
            <span>SAVE SCENARIO</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-24 right-8 z-50 p-6 bg-white text-black border-2 border-black flex items-center gap-4 shadow-2xl"
          >
            <CheckCircle2 className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="font-headline font-black text-sm uppercase">CONFIGURATION PERSISTED</span>
              <span className="font-mono text-[10px] font-bold">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#333333] flex-1">
        
        {/* Left Column: Parametric Controls & Countermeasures (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-[1px] bg-[#333333]">
          
          <div className="p-8 bg-[#000000] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-white" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline font-black text-lg uppercase tracking-tighter">OUTFALL ORIGIN</h2>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#a3a3a3] uppercase">STEP 1: SOURCE POINT</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-black font-bold px-3 py-1 bg-white uppercase">
                CONFIG 01
              </span>
            </div>

            <div className="flex flex-col gap-6 text-[10px] font-mono uppercase font-bold tracking-widest">
              <div className="flex flex-col gap-3">
                <label className="text-[#a3a3a3]">OUTFALL RELEASE POINT</label>
                <select 
                  value={selectedLocation.id}
                  onChange={handleLocationChange}
                  className="w-full bg-[#111111] border-2 border-[#333333] focus:border-white text-white px-4 py-4 rounded-none appearance-none outline-none transition-none"
                >
                  {OUTFALL_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.lat.toFixed(3)}°N, {loc.lon.toFixed(3)}°E)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <label className="text-[#a3a3a3]">DEBRIS MASS (KG)</label>
                  <input 
                    type="number" 
                    value={debrisMassKg}
                    onChange={(e) => setScenario({ debrisMassKg: Math.max(10, parseInt(e.target.value) || 100) })}
                    className="w-full bg-[#111111] border-2 border-[#333333] focus:border-white text-white px-4 py-4 rounded-none outline-none transition-none" 
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[#a3a3a3]">POLYMER CLASS</label>
                  <select 
                    value={materialType}
                    onChange={(e) => setScenario({ materialType: e.target.value })}
                    className="w-full bg-[#111111] border-2 border-[#333333] focus:border-white text-white px-4 py-4 rounded-none outline-none transition-none appearance-none"
                  >
                    <option>MIXED (PET / HDPE)</option>
                    <option>NYLON NETS</option>
                    <option>MICRO-PLASTICS (&lt; 5MM)</option>
                    <option>RIGID CONTAINERS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#000000] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
              <div className="flex items-center gap-4">
                <Wind className="w-6 h-6 text-[#ff4d00]" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline font-black text-lg uppercase tracking-tighter">OCEAN FORCES</h2>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#a3a3a3] uppercase">STEP 2: CURRENTS</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#ff4d00] flex items-center gap-2 font-bold uppercase">
                <span className="w-2 h-2 bg-[#ff4d00] animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <div className="flex flex-col gap-6 font-mono text-[10px] uppercase font-bold tracking-widest">
              <div className="flex flex-col gap-4 p-6 bg-[#111111] border-2 border-[#333333]">
                <div className="flex items-center justify-between">
                  <span className="text-[#a3a3a3] flex items-center gap-3">
                    <Wind className="w-4 h-4 text-white" />
                    ONSHORE WIND VELOCITY
                  </span>
                  <span className="text-white text-lg">{windSpeed} KM/H (SW)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={windSpeed} 
                  onChange={(e) => setScenario({ windSpeed: Number(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>

              <div className="flex flex-col gap-4 p-6 bg-[#111111] border-2 border-[#333333]">
                <div className="flex items-center justify-between">
                  <span className="text-[#a3a3a3] flex items-center gap-3">
                    <CloudRain className="w-4 h-4 text-white" />
                    STORM RUNOFF SURGE
                  </span>
                  <span className="text-white text-lg">+{precipitation} MM</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={precipitation} 
                  onChange={(e) => setScenario({ precipitation: Number(e.target.value) })}
                  className="w-full accent-[#ff4d00]"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#000000] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-white" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline font-black text-lg uppercase tracking-tighter">COUNTERMEASURES</h2>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#a3a3a3] uppercase">STEP 3: TACTICAL FLEET</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 font-mono text-[10px] uppercase font-bold tracking-widest">
              
              <div className={`p-6 border-2 transition-none flex items-center justify-between cursor-pointer ${
                isBarrierActive 
                  ? 'bg-white border-white text-black' 
                  : 'bg-[#111111] border-[#333333] text-[#525252]'
              }`}
              onClick={() => setScenario({ isBarrierActive: !isBarrierActive })}
              >
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6" />
                  <div className="flex flex-col">
                    <span className="text-sm font-headline font-black tracking-tighter block">OFFSHORE CONTAINMENT BOOM</span>
                    <span className="text-[9px] opacity-70">ANCHORED BARRIER TRAPS PLASTICS</span>
                  </div>
                </div>
                <div className={`w-6 h-6 border-2 flex items-center justify-center ${
                  isBarrierActive ? 'border-black' : 'border-[#525252]'
                }`}>
                  {isBarrierActive && <CheckCircle2 className="w-4 h-4 text-black" />}
                </div>
              </div>

              {isBarrierActive && (
                <div className="p-6 bg-[#111111] border-2 border-white flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#a3a3a3]">BOOM CAPTURE EFFICIENCY:</span>
                    <span className="text-white text-lg">{barrierEfficiency}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={barrierEfficiency} 
                    onChange={(e) => setScenario({ barrierEfficiency: Number(e.target.value) })}
                    className="w-full accent-white"
                  />
                </div>
              )}

              <div className="p-6 bg-[#111111] border-2 border-[#333333] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Anchor className="w-5 h-5 text-white" />
                  <span className="text-[#a3a3a3]">AUTO SKIMMER SQUADS:</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setScenario({ cleanupTeams: Math.max(2, cleanupTeams - 2) })}
                    className="w-8 h-8 bg-black text-white border-2 border-[#333333] hover:border-white flex items-center justify-center transition-none"
                  >
                    -
                  </button>
                  <span className="text-xl font-headline font-black text-white px-2">{cleanupTeams}</span>
                  <button 
                    onClick={() => setScenario({ cleanupTeams: Math.min(24, cleanupTeams + 2) })}
                    className="w-8 h-8 bg-black text-white border-2 border-[#333333] hover:border-white flex items-center justify-center transition-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={runSimulation}
                disabled={isLoading}
                className="mt-4 w-full py-6 bg-[#ff4d00] hover:bg-white text-black font-headline font-black text-lg uppercase tracking-tighter flex items-center justify-center gap-4 transition-none disabled:opacity-50 border-2 border-[#ff4d00] hover:border-white"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-6 h-6 animate-spin" />
                    <span>CRUNCHING DYNAMICS...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>EXECUTE MONTE CARLO</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="p-8 bg-[#000000] flex flex-col gap-6 border-t-2 border-[#333333]">
              <div className="flex items-center gap-3 text-[#ff4d00]">
                <Cpu className="w-5 h-5" />
                <h3 className="font-headline font-black text-sm uppercase tracking-tighter">OCEAN-GPT SCENARIO ANALYSIS</h3>
              </div>
              <p className="text-[10px] font-mono text-[#a3a3a3] uppercase tracking-widest leading-relaxed">
                {windSpeed > 30 
                  ? `SEVERE WIND FORCES (${windSpeed} KM/H) ARE ACCELERATING DRIFT TOWARDS THE SHORE. ` 
                  : `MODERATE WIND VECTORS (${windSpeed} KM/H) INDICATE STANDARD DRIFT PACING. `}
                {precipitation > 20 
                  ? `HEAVY RUNOFF SURGE (+${precipitation}MM) SIGNIFICANTLY INCREASES THE OVERALL DEBRIS LOAD. ` 
                  : `NOMINAL RUNOFF DETECTED. `}
                {isBarrierActive && barrierEfficiency > 60 
                  ? `OFFSHORE BOOMS ARE HIGHLY EFFECTIVE (${barrierEfficiency}%), TRAPPING MAJOR VOLUMES BEFORE BEACHING. ` 
                  : isBarrierActive 
                  ? `BOOMS ARE ACTIVE BUT MAY LEAK DEBRIS UNDER CURRENT HYDRODYNAMIC STRESS. ` 
                  : `NO OFFSHORE BARRIERS DEPLOYED. SHORELINE IS COMPLETELY EXPOSED TO INCOMING PLASTICS. `}
                {cleanupTeams > 10
                  ? `HEAVY SKIMMER FLEET PRESENCE (${cleanupTeams} SQUADS) ENSURES RAPID INTERCEPTION.`
                  : `CURRENT FLEET OF ${cleanupTeams} SKIMMER SQUADS MAY BE OVERWHELMED IF CONTAINMENT FAILS.`}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: 3D Digital Twin Viewport & Comparative Metrics Dashboard (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-[1px] bg-[#333333]">
          
          <div className="relative w-full h-[640px] lg:h-[700px] min-h-[600px] bg-[#000000] flex flex-col">
            
            <div className="absolute inset-0 z-0 opacity-100">
              <Scene />
            </div>
            
            <div className="absolute top-4 left-4 z-30 max-w-[250px] bg-black/90 border border-[#333333] border-l-4 border-l-[#ff4d00] p-3 pointer-events-none shadow-xl">
              <h4 className="text-[#ff4d00] font-headline font-black text-xs uppercase tracking-tighter mb-1">Purpose & Objective</h4>
              <p className="text-[9px] font-mono text-[#e5e5e5] uppercase tracking-widest leading-relaxed">
                Simulates Monte-Carlo hydrodynamic drift to forecast shoreline beaching impact and guide fleet countermeasure placement.
              </p>
            </div>
            
            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3 px-4 py-2 bg-black text-[10px] font-mono text-white font-bold tracking-widest uppercase border-2 border-[#333333] pointer-events-auto">
                <Square className="w-3 h-3 fill-white" />
                <span>MUMBAI TWIN</span>
              </div>
              
              <div className="flex items-center gap-4 px-4 py-2 bg-black text-[10px] font-mono border-2 border-[#333333] pointer-events-auto font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#333333]"></span>
                  <span className="text-[#a3a3a3]">BASELINE (GHOST DOTS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white"></span>
                  <span className="text-white">MITIGATED (ACTIVE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#ff4d00]"></span>
                  <span className="text-[#ff4d00]">TRAPPED / BEACHED</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-20 mt-auto p-6 m-4 bg-black border-2 border-white flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold tracking-widest">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-white hover:bg-[#ff4d00] text-black flex items-center justify-center transition-none border-2 border-white hover:border-[#ff4d00]"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <span className="text-white text-lg">
                    T + {activeFrame.hour}H FORECAST
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#a3a3a3]">
                  <span>
                    FRAME: {currentFrameIndex + 1} / {trajectory.length || 13}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max={Math.max(0, trajectory.length - 1)} 
                  value={currentFrameIndex} 
                  onChange={(e) => { setCurrentFrame(Number(e.target.value)); if (isPlaying) togglePlay(); }}
                  className="w-full accent-white" 
                />
                <div className="flex justify-between text-[9px] text-[#525252] font-mono font-bold uppercase tracking-widest pt-1">
                  <span>T+0H REL</span>
                  <span>T+18H SURGE</span>
                  <span className="text-white">T+36H PEAK</span>
                  <span>T+54H DEFL</span>
                  <span>T+72H END</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#333333]">
            
            <div className="p-8 bg-[#000000] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
                <div className="flex items-center gap-3 text-[#525252]">
                  <XCircle className="w-5 h-5" />
                  <h3 className="font-headline font-black text-sm uppercase tracking-tighter">
                    UNMITIGATED BASELINE
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-black font-bold px-3 py-1 bg-[#525252] uppercase tracking-widest">
                  NO INTERVENTION
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono uppercase font-bold tracking-widest">
                <div>
                  <span className="text-[10px] text-[#a3a3a3] block mb-2">SHORELINE BEACHING</span>
                  <span className="font-headline font-black text-5xl text-[#525252]">
                    {baselineFrame.beached_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#a3a3a3] block mb-2">BEACHED MASS</span>
                  <span className="text-2xl text-white">{baselineBeachedKg} KG</span>
                </div>
              </div>

              <p className="text-[10px] text-[#a3a3a3] font-mono uppercase font-bold tracking-widest leading-relaxed border-l-2 border-[#333333] pl-4 mt-2">
                DEBRIS DISPERSES EASTWARD CAUSING SEVERE ACCUMULATION AT <strong className="text-white">{selectedLocation.name.split(' ')[0]}</strong>.
              </p>
            </div>

            <div className="p-8 bg-[#000000] flex flex-col gap-6 border-l-4 border-l-white">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-headline font-black text-sm uppercase tracking-tighter">
                    MITIGATED INTERVENTION
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-black font-bold px-3 py-1 bg-white uppercase tracking-widest">
                  {avoidedPercent}% AVOIDED
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono uppercase font-bold tracking-widest">
                <div>
                  <span className="text-[10px] text-[#a3a3a3] block mb-2">OFFSHORE CAPTURE</span>
                  <span className="font-headline font-black text-5xl text-white">
                    {(100 - activeFrame.beached_percent).toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#a3a3a3] block mb-2">CAPTURED MASS</span>
                  <span className="text-2xl text-white">{capturedOffshoreKg} KG</span>
                </div>
              </div>

              <p className="text-[10px] text-[#a3a3a3] font-mono uppercase font-bold tracking-widest leading-relaxed border-l-2 border-white pl-4 mt-2">
                BOOM AND SKIMMERS TRAP DEBRIS OFFSHORE, PROTECTING <strong className="text-white">{avoidedPercent}%</strong> OF THE SHORELINE.
              </p>
            </div>

          </div>

          <div className="p-8 bg-[#000000] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Activity className="w-5 h-5" />
                <h3 className="font-headline font-black text-lg uppercase tracking-tighter">CONCENTRATION CURVE</h3>
              </div>
              <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">T+36H PEAK RISK</span>
            </div>

            <div className="h-32 w-full bg-[#111111] border-2 border-[#333333] p-4 flex items-end justify-between relative overflow-hidden font-mono uppercase tracking-widest font-bold">
              <svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path d="M 0 44 Q 25 40, 50 12 T 100 4 L 100 50 L 0 50 Z" fill="#ffffff" opacity="0.1"></path>
                <path d="M 0 44 Q 25 40, 50 12 T 100 4" fill="none" stroke="#ffffff" strokeWidth="2"></path>
              </svg>
              <div className="absolute bottom-4 left-4 text-[10px] text-[#a3a3a3]">T+0H BASELINE</div>
              <div className="absolute bottom-4 right-4 text-[10px] text-white">T+72H STEADY STATE</div>
            </div>

            {/* Plastics Exchange & Real-Time Circular Economic Ledger */}
            <div className="p-6 bg-[#0a0a0a] border-2 border-[#222222] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                <div className="flex items-center gap-2 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                  <Recycle className="w-4 h-4 text-[#ff4d00]" />
                  <span>PLASTICS EXCHANGE // VALUE RECOVERY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">₹35.0 / KG SPOT RATE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-3 bg-[#050505] border border-[#222222] flex flex-col gap-1">
                  <span className="text-[9px] text-[#737373] uppercase font-bold">RECOVERED VALUE</span>
                  <span className="text-lg sm:text-xl font-headline font-black text-white">₹{(capturedOffshoreKg * 35).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#050505] border border-[#222222] flex flex-col gap-1">
                  <span className="text-[9px] text-[#737373] uppercase font-bold">CO₂e AVOIDED</span>
                  <span className="text-lg sm:text-xl font-headline font-black text-emerald-400">+{Math.round(capturedOffshoreKg * 1.8)} KG</span>
                </div>
                <div className="p-3 bg-[#050505] border border-[#222222] flex flex-col gap-1">
                  <span className="text-[9px] text-[#737373] uppercase font-bold">EPR CREDITS</span>
                  <span className="text-lg sm:text-xl font-headline font-black text-[#ff4d00]">{Math.round(capturedOffshoreKg * 1.2)}</span>
                </div>
              </div>

              <p className="text-[9px] font-mono text-[#a3a3a3] uppercase font-bold leading-relaxed border-l-2 border-[#ff4d00] pl-3">
                OFFSHORE INTERCEPTION OF {capturedOffshoreKg} KG PREVENTS MICROPLASTIC WEATHERING AND DELIVERS REVENUE TO COVER SQUAD FUEL.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-[#333333]">
              <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">
                ALLOCATE UNITS TO PREDICTED ZONES?
              </span>
              <Link 
                to="/hotspots"
                className="px-6 py-4 bg-white hover:bg-[#ff4d00] text-black font-headline font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-none"
              >
                <span>DEPLOY TO HOTSPOTS</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Simulate;
