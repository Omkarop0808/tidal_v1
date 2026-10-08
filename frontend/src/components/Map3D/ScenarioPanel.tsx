import { useState } from 'react';
import { Sliders, Wind, CloudRain, Shield, Play } from 'lucide-react';
import { useSim } from '../../store';
import { api } from '../../lib/api';

export function ScenarioPanel() {
  const windSpeed = useSim(state => state.windSpeed);
  const precipitation = useSim(state => state.precipitation);
  const barrierEfficiency = useSim(state => state.barrierEfficiency);
  const setScenario = useSim(state => state.setScenario);
  const setTrajectory = useSim(state => state.setTrajectory);
  
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await api.runSimulation({
        wind_speed: windSpeed,
        rainfall_increase: precipitation,
        barrier_efficiency: barrierEfficiency,
        cleanup_teams: 12,
        lat: 19.10,
        lon: 72.70
      });
      if (response && response.trajectory_intervention) {
         setTrajectory(response.trajectory_intervention);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="absolute top-20 left-6 w-84 bg-black border-2 border-[#333333] shadow-2xl p-6 text-white z-40 flex flex-col gap-6">
      
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center text-black">
            <Sliders className="w-5 h-5" />
          </div>
          <h2 className="font-headline font-black text-sm text-white uppercase tracking-tighter">INTERVENTION CONTROLS</h2>
        </div>
        <span className="text-[10px] font-mono font-bold text-black bg-white px-2 py-1 uppercase tracking-widest">LIVE TWIN</span>
      </div>
      
      <div className="flex flex-col gap-4 font-mono text-[10px] font-bold uppercase tracking-widest">
        <div className="flex flex-col gap-3 p-4 bg-[#111111] border-2 border-[#333333]">
          <label className="flex justify-between text-white">
            <span className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#a3a3a3]" />
              WIND SPEED
            </span>
            <span>{windSpeed} KM/H</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="60" 
            value={windSpeed} 
            onChange={e => setScenario({ windSpeed: parseInt(e.target.value) })}
            className="w-full mt-2 accent-white"
          />
        </div>

        <div className="flex flex-col gap-3 p-4 bg-[#111111] border-2 border-[#333333]">
          <label className="flex justify-between text-white">
            <span className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-[#ff4d00]" />
              RAINFALL SURGE
            </span>
            <span className="text-[#ff4d00]">{precipitation}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={precipitation} 
            onChange={e => setScenario({ precipitation: parseInt(e.target.value) })}
            className="w-full mt-2 accent-[#ff4d00]"
          />
        </div>

        <div className="flex flex-col gap-3 p-4 bg-[#111111] border-2 border-[#333333]">
          <label className="flex justify-between text-white">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              BOOM EFFICIENCY
            </span>
            <span>{barrierEfficiency}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={barrierEfficiency} 
            onChange={e => setScenario({ barrierEfficiency: parseInt(e.target.value) })}
            className="w-full mt-2 accent-white"
          />
        </div>

        <button 
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="mt-2 w-full py-4 bg-[#ff4d00] hover:bg-white text-black font-headline font-black text-sm tracking-wider uppercase disabled:opacity-50 transition-none flex items-center justify-center gap-3 border-2 border-[#ff4d00] hover:border-white"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin"></div>
              <span>RECALCULATING...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>EXECUTE PROTOCOL</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ScenarioPanel;
