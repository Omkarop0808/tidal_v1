import { useState } from 'react';
import { Sliders, Wind, CloudRain, Shield, Play } from 'lucide-react';
import { useSim } from '../../store';

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
      const response = await fetch('http://127.0.0.1:8000/api/v1/simulate/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wind_speed: windSpeed,
          rainfall_increase: precipitation,
          barrier_efficiency: barrierEfficiency,
          cleanup_teams: 12
        })
      });
      if (response.ok) {
        const trajResponse = await fetch(`http://127.0.0.1:8000/api/v1/simulate/predictive?lat=19.10&lon=72.70`);
        if (trajResponse.ok) {
           const trajData = await trajResponse.json();
           setTrajectory(trajData.trajectory);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="absolute top-16 left-4 w-84 bg-surface-container-low/95 backdrop-blur-2xl border border-outline-variant/50 shadow-2xl rounded-3xl p-5 text-on-surface z-40 flex flex-col gap-4">
      
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="font-headline font-bold text-sm text-on-surface">Intervention Controls</h2>
        </div>
        <span className="text-[10px] font-mono text-primary uppercase">LIVE TWIN</span>
      </div>
      
      <div className="flex flex-col gap-3.5 font-mono text-xs">
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
          <label className="flex justify-between text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-primary" />
              Wind Speed
            </span>
            <span className="font-bold text-primary">{windSpeed} km/h</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="60" 
            value={windSpeed} 
            onChange={e => setScenario({ windSpeed: parseInt(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
          <label className="flex justify-between text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-secondary" />
              Rainfall Surge
            </span>
            <span className="font-bold text-secondary">{precipitation}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={precipitation} 
            onChange={e => setScenario({ precipitation: parseInt(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
          <label className="flex justify-between text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Boom Efficiency
            </span>
            <span className="font-bold text-emerald-400">{barrierEfficiency}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={barrierEfficiency} 
            onChange={e => setScenario({ barrierEfficiency: parseInt(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        <button 
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="mt-1 w-full py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-headline font-bold text-xs tracking-wider uppercase shadow-glow-sm hover:shadow-glow disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Recalculating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute 3D Protocol</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ScenarioPanel;
