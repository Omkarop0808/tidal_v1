import { useEffect } from 'react';
import { Scene } from '../components/Map3D/Scene';
import { TimelineScrubber } from '../components/Map3D/TimelineScrubber';
import { DiagnosticsPanel } from '../components/Map3D/DiagnosticsPanel';
import { ScenarioPanel } from '../components/Map3D/ScenarioPanel';
import { useSim, OUTFALL_LOCATIONS } from '../store';
import { Layers, Radio } from 'lucide-react';
import { api } from '../lib/api';

export function Dashboard() {
  const setTrajectory = useSim(state => state.setTrajectory);
  const selectedLocation = useSim(state => state.selectedLocation);
  const setSelectedLocation = useSim(state => state.setSelectedLocation);

  useEffect(() => {
    const fetchTrajectory = async () => {
      try {
        const data = await api.getDriftTrajectory(selectedLocation.lat, selectedLocation.lon);
        if (data && data.trajectory) {
          setTrajectory(data.trajectory);
        }
      } catch (err) {
        console.error("Error fetching trajectory", err);
      }
    };

    fetchTrajectory();
  }, [setTrajectory, selectedLocation]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col relative bg-[#000000] text-white font-sans">
      
      {/* Top Floating HUD Bar */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-black border-2 border-[#333333] pointer-events-auto">
            <Layers className="w-4 h-4 text-white" />
            <span className="font-headline font-black text-sm uppercase tracking-widest text-white">3D DIGITAL TWIN COCKPIT</span>
            <span className="text-[10px] font-mono text-black font-bold px-2 py-1 bg-white uppercase">
              GREATER MUMBAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-black border-2 border-[#333333] text-[10px] font-mono font-bold uppercase tracking-widest text-[#a3a3a3] pointer-events-auto">
            <Radio className="w-3 h-3 text-[#ff4d00] animate-pulse" />
            <span>REAL-TIME BATHYMETRY & HYDRODYNAMIC MESH</span>
          </div>
        </div>

        {/* Quick Outfall Sector Jump Pills */}
        <div className="hidden lg:flex items-center gap-2 bg-black p-2 border-2 border-[#333333] pointer-events-auto">
          <span className="text-[10px] font-mono text-[#a3a3a3] uppercase px-3 font-bold">
            FOCUS SECTOR:
          </span>
          {OUTFALL_LOCATIONS.slice(0, 5).map(loc => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-bold transition-none ${
                  isSelected 
                    ? 'bg-white text-black' 
                    : 'text-[#a3a3a3] hover:text-white hover:bg-[#111111]'
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
