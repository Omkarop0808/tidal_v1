import { useEffect } from 'react';
import { Scene } from '../components/Map3D/Scene';
import { TimelineScrubber } from '../components/Map3D/TimelineScrubber';
import { DiagnosticsPanel } from '../components/Map3D/DiagnosticsPanel';
import { ScenarioPanel } from '../components/Map3D/ScenarioPanel';
import { useSim, OUTFALL_LOCATIONS } from '../store';
import { Layers, Radio } from 'lucide-react';

export function Dashboard() {
  const setTrajectory = useSim(state => state.setTrajectory);
  const selectedLocation = useSim(state => state.selectedLocation);
  const setSelectedLocation = useSim(state => state.setSelectedLocation);

  useEffect(() => {
    const fetchTrajectory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/simulate/predictive?lat=19.10&lon=72.70');
        if (response.ok) {
          const data = await response.json();
          setTrajectory(data.trajectory);
        }
      } catch (err) {
        console.error("Error fetching trajectory", err);
      }
    };

    fetchTrajectory();
  }, [setTrajectory]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col relative bg-background text-on-surface">
      
      {/* Top Floating HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/40 shadow-xl pointer-events-auto">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-headline font-bold text-xs text-on-surface">3D DIGITAL TWIN COCKPIT</span>
            <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
              GREATER MUMBAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/40 text-xs font-mono text-on-surface-variant pointer-events-auto">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Real-time Bathymetry & Hydrodynamic Mesh</span>
          </div>
        </div>

        {/* Quick Outfall Sector Jump Pills */}
        <div className="hidden lg:flex items-center gap-1.5 bg-surface-container-low/95 backdrop-blur-xl p-1.5 rounded-2xl border border-outline-variant/40 pointer-events-auto shadow-xl">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase px-2 font-semibold">
            Focus Sector:
          </span>
          {OUTFALL_LOCATIONS.slice(0, 5).map(loc => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all ${
                  isSelected 
                    ? 'bg-primary text-on-primary font-bold shadow-glow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {loc.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* R3F Map Area */}
      <div className="flex-1 relative w-full h-full">
        <Scene />
        <TimelineScrubber />
        <DiagnosticsPanel />
        <ScenarioPanel />
      </div>

    </div>
  );
}

export default Dashboard;
