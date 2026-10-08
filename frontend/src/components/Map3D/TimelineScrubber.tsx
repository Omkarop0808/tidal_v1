import { useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useSim } from '../../store';

export function TimelineScrubber() {
  const trajectory = useSim(state => state.trajectory);
  const currentFrameIndex = useSim(state => state.currentFrameIndex);
  const isPlaying = useSim(state => state.isPlaying);
  const togglePlay = useSim(state => state.togglePlay);
  const setCurrentFrame = useSim(state => state.setCurrentFrame);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && trajectory.length > 0) {
      timerRef.current = window.setInterval(() => {
        setCurrentFrame((currentFrameIndex + 1) % trajectory.length);
      }, 500);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentFrameIndex, trajectory.length, setCurrentFrame]);

  if (trajectory.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-surface-container-low/95 backdrop-blur-2xl p-4 rounded-3xl border border-outline-variant/50 shadow-2xl z-50 flex items-center gap-4 text-on-surface">
      
      <button 
        onClick={togglePlay}
        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-primary text-on-primary hover:scale-105 transition-all shadow-glow-sm shrink-0"
        aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>
      
      <div className="flex-1 flex flex-col gap-1.5 font-mono">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">T+0h</span>
          <span className="font-bold text-primary text-sm tracking-tight">
            T+{trajectory[currentFrameIndex].hour}h Forecast Horizon
          </span>
          <span className="text-on-surface-variant">T+72h</span>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max={trajectory.length - 1} 
          value={currentFrameIndex}
          onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
          className="w-full cursor-pointer"
        />
        
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-on-surface-variant">
            Frame: {currentFrameIndex + 1} / {trajectory.length}
          </span>
          <span className="text-error font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
            Beached: {trajectory[currentFrameIndex].beached_percent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default TimelineScrubber;
