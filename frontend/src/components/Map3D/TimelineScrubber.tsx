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
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-black p-4 border-2 border-white shadow-2xl z-50 flex items-center gap-6 text-white font-mono uppercase font-bold tracking-widest">
      
      <button 
        onClick={togglePlay}
        className="w-12 h-12 flex items-center justify-center bg-white text-black hover:bg-[#ff4d00] hover:text-black border-2 border-white hover:border-[#ff4d00] transition-none shrink-0"
        aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
      >
        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
      </button>
      
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between text-[10px]">
          <span className="text-[#a3a3a3]">T+0H</span>
          <span className="text-white text-sm">
            T+{trajectory[currentFrameIndex].hour}H FORECAST
          </span>
          <span className="text-[#a3a3a3]">T+72H</span>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max={trajectory.length - 1} 
          value={currentFrameIndex}
          onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
          className="w-full cursor-pointer accent-white"
        />
        
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#a3a3a3]">
            FRAME: {currentFrameIndex + 1} / {trajectory.length}
          </span>
          <span className="text-[#ff4d00] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff4d00] animate-pulse"></span>
            BEACHED: {trajectory[currentFrameIndex].beached_percent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default TimelineScrubber;
