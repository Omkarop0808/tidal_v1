import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Anchor, Zap, BatteryCharging, Radio, Navigation, CheckCircle2, RotateCcw } from 'lucide-react';

interface FleetCommandPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FleetUnit {
  id: string;
  type: string;
  battery: number;
  capacity: string;
  status: string;
  lat: number;
  lng: number;
  speed: string;
}

const initialFleet: FleetUnit[] = [
  { id: 'SKM-01', type: 'Autonomous Skimmer', battery: 85, capacity: '8.2 / 10 tons', status: 'En route to Versova (Zone A)', lat: 19.129, lng: 72.815, speed: '14.2 knots' },
  { id: 'SKM-02', type: 'Autonomous Skimmer', battery: 42, capacity: '9.8 / 10 tons', status: 'Active Intercept at Mahim Creek', lat: 19.035, lng: 72.835, speed: '11.8 knots' },
  { id: 'T-BRAVO', type: 'Tactical Shoreline Squad', battery: 100, capacity: '4.5 / 5 tons', status: 'On Standby at Juhu Beach', lat: 19.098, lng: 72.826, speed: 'Static' },
  { id: 'SKM-03', type: 'Autonomous Skimmer', battery: 96, capacity: '2.1 / 10 tons', status: 'Active Sweeping at Bandra Channel', lat: 18.980, lng: 72.810, speed: '8.5 knots' },
];

export const FleetCommandPanel = ({ isOpen, onClose }: FleetCommandPanelProps) => {
  const [isRecalled, setIsRecalled] = useState(false);
  const [recallToast, setRecallToast] = useState(false);

  const handleToggleRecall = () => {
    setIsRecalled(prev => !prev);
    setRecallToast(true);
    setTimeout(() => setRecallToast(false), 3500);
  };

  const currentFleet = initialFleet.map(unit => {
    if (isRecalled) {
      return {
        ...unit,
        status: 'RETURNING TO BASE PORT (COLABA NAVAL DOCK)',
        speed: unit.speed === 'Static' ? 'Prepping Transit' : '16.5 knots (URGENT RECALL)'
      };
    }
    return unit;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99998]"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[540px] md:w-[580px] bg-[#000000] border-l-2 border-[#333333] z-[99999] flex flex-col shadow-2xl"
          >
            {/* Drawer Header - Sticky & Non-Shrinking */}
            <div className="p-6 border-b-2 border-[#333333] flex items-center justify-between bg-[#0a0a0a] shrink-0 sticky top-0 z-20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center font-bold">
                  <Anchor className="w-5 h-5 text-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#a3a3a3] font-mono text-[10px] uppercase tracking-widest font-bold">
                    Autonomous Fleet Telemetry
                  </span>
                  <h2 className="text-xl sm:text-2xl font-headline font-black text-white uppercase tracking-tight">
                    Maritime Fleet Command
                  </h2>
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="px-3 py-2 bg-[#111111] hover:bg-[#ff4d00] hover:text-black transition-none text-white border-2 border-[#333333] hover:border-white font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
                aria-label="Close Fleet Command"
              >
                <span>CLOSE</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Toast if Recalled */}
            {recallToast && (
              <div className={`p-4 border-b-2 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-3 shrink-0 ${
                isRecalled ? 'bg-[#ff4d00] text-black border-[#ff4d00]' : 'bg-white text-black border-white'
              }`}>
                {isRecalled ? <CheckCircle2 className="w-5 h-5 text-black" /> : <RotateCcw className="w-5 h-5 text-black" />}
                <span>
                  {isRecalled 
                    ? 'RECALL BROADCAST TRANSMITTED: ALL VESSELS RETURNING TO COLABA DOCK' 
                    : 'PATROL RESUMED: VESSELS RE-ASSIGNED TO ACTIVE COASTAL SECTORS'}
                </span>
              </div>
            )}
            
            {/* Units List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-[#000000]">
              <div className="flex items-center justify-between text-xs font-mono uppercase font-bold tracking-widest pb-1 border-b border-[#222222]">
                <span className="text-[#a3a3a3]">Active Assets ({currentFleet.length} Online)</span>
                <span className={`${isRecalled ? 'text-[#ff4d00]' : 'text-emerald-400'} flex items-center gap-2`}>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  {isRecalled ? 'RECALL IN PROGRESS' : 'ALL SYSTEMS NOMINAL'}
                </span>
              </div>

              {currentFleet.map((unit) => {
                const isSkimmer = unit.id.startsWith('SKM');
                const isBatteryGood = unit.battery > 50;

                return (
                  <div 
                    key={unit.id} 
                    className="p-5 bg-[#0a0a0a] border-2 border-[#222222] hover:border-white transition-none flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 flex items-center justify-center border ${
                          isSkimmer 
                            ? 'bg-black text-[#ff4d00] border-[#ff4d00]' 
                            : 'bg-black text-white border-white'
                        }`}>
                          {isSkimmer ? <Zap className="w-4 h-4" /> : <Anchor className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-headline font-black text-base">{unit.id}</span>
                          <span className="text-[#a3a3a3] font-mono text-[10px] uppercase font-bold tracking-widest">{unit.type}</span>
                        </div>
                      </div>

                      {/* Battery Chip */}
                      <div className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs border font-bold ${
                        isBatteryGood 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                      }`}>
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span>{unit.battery}%</span>
                      </div>
                    </div>
                    
                    {/* Status & Position Grid */}
                    <div className="grid grid-cols-2 gap-[1px] bg-[#222222] font-mono text-xs uppercase font-bold">
                      <div className="p-3 bg-[#050505] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#737373]">Payload Capacity</span>
                        <span className="text-white">{unit.capacity}</span>
                      </div>
                      
                      <div className="p-3 bg-[#050505] flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#737373]">Cruising Speed</span>
                        <span className="text-[#ff4d00]">{unit.speed}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#050505] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono uppercase font-bold">
                      <div className="flex items-center gap-2 text-[#a3a3a3] truncate">
                        <Navigation className={`w-3.5 h-3.5 shrink-0 ${isRecalled ? 'text-[#ff4d00]' : 'text-white'}`} />
                        <span className={`truncate ${isRecalled ? 'text-[#ff4d00]' : 'text-white'}`}>{unit.status}</span>
                      </div>
                      <span className="text-[10px] text-[#737373] shrink-0 font-bold">
                        {unit.lat.toFixed(3)}°N, {unit.lng.toFixed(3)}°E
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions - Fixed to bottom */}
            <div className="p-6 border-t-2 border-[#333333] bg-[#0a0a0a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col gap-0.5 font-mono text-xs uppercase font-bold">
                <span className="text-[#a3a3a3]">Mesh Satellite Link:</span>
                <span className="text-emerald-400">98.4% (Direct Satellite)</span>
              </div>

              <button 
                onClick={handleToggleRecall}
                className={`w-full sm:w-auto px-6 py-3 font-headline font-black text-xs uppercase tracking-widest border-2 transition-none flex items-center justify-center gap-2 ${
                  isRecalled 
                    ? 'bg-white text-black border-white hover:bg-[#ff4d00] hover:text-black hover:border-[#ff4d00]' 
                    : 'bg-[#ff4d00] text-black border-[#ff4d00] hover:bg-white hover:border-white'
                }`}
              >
                {isRecalled ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>RESUME PATROL MISSIONS</span>
                  </>
                ) : (
                  <>
                    <Anchor className="w-4 h-4" />
                    <span>RECALL TO BASE PORT</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FleetCommandPanel;
