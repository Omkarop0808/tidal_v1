import { motion, AnimatePresence } from 'framer-motion';
import { X, Anchor, Zap, BatteryCharging, Radio, Navigation } from 'lucide-react';

interface FleetCommandPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockFleet = [
  { id: 'SKM-01', type: 'Autonomous Skimmer', battery: 85, capacity: '8.2 / 10 tons', status: 'En route to Versova (Zone A)', lat: 19.129, lng: 72.815, speed: '14.2 knots' },
  { id: 'SKM-02', type: 'Autonomous Skimmer', battery: 42, capacity: '9.8 / 10 tons', status: 'Returning to Base Port', lat: 18.922, lng: 72.834, speed: '11.8 knots' },
  { id: 'T-BRAVO', type: 'Tactical Shoreline Squad', battery: 100, capacity: '4.5 / 5 tons', status: 'On Standby at Juhu Beach', lat: 19.098, lng: 72.826, speed: 'Static' },
  { id: 'SKM-03', type: 'Autonomous Skimmer', battery: 96, capacity: '2.1 / 10 tons', status: 'Active Sweeping at Bandra', lat: 18.980, lng: 72.810, speed: '8.5 knots' },
];

export const FleetCommandPanel = ({ isOpen, onClose }: FleetCommandPanelProps) => {
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
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[9998]"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full md:w-[540px] bg-surface-container-low/95 backdrop-blur-2xl border-l border-outline-variant/40 z-[9999] shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 sm:p-8 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/40">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow-sm">
                  <Anchor className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest font-semibold">
                    Autonomous Fleet Telemetry
                  </span>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Maritime Fleet Command</h2>
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface border border-outline-variant/30"
                aria-label="Close Fleet Command"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Units List */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant pb-1">
                <span>Active Units (4 Online)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> All Systems Nominal
                </span>
              </div>

              {mockFleet.map((unit) => {
                const isSkimmer = unit.id.startsWith('SKM');
                const isBatteryGood = unit.battery > 50;

                return (
                  <div 
                    key={unit.id} 
                    className="p-5 rounded-3xl bg-surface-container/70 border border-outline-variant/40 hover:border-primary/40 transition-all flex flex-col gap-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          isSkimmer 
                            ? 'bg-primary/10 text-primary border border-primary/30' 
                            : 'bg-secondary/10 text-secondary border border-secondary/30'
                        }`}>
                          {isSkimmer ? <Zap className="w-5 h-5" /> : <Anchor className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-on-surface font-headline font-bold text-base">{unit.id}</span>
                          <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">{unit.type}</span>
                        </div>
                      </div>

                      {/* Battery Chip */}
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs border ${
                        isBatteryGood 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-warning/10 text-warning border-warning/30'
                      }`}>
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span className="font-bold">{unit.battery}%</span>
                      </div>
                    </div>
                    
                    {/* Status & Position Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-xs">
                      <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase">Payload Capacity</span>
                        <span className="text-on-surface font-semibold">{unit.capacity}</span>
                      </div>
                      
                      <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase">Cruising Speed</span>
                        <span className="text-primary font-semibold">{unit.speed}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-on-surface-variant truncate pr-2">
                        <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{unit.status}</span>
                      </div>
                      <span className="text-[10px] text-primary font-bold shrink-0">
                        {unit.lat.toFixed(3)}°, {unit.lng.toFixed(3)}°
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container/40 flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-on-surface-variant">
                Mesh Signal: <strong className="text-emerald-400">98.4% (Direct Satellite)</strong>
              </span>
              <button 
                onClick={() => alert("Fleet Recall Signal Broadcasted!")}
                className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono font-semibold text-on-surface border border-outline-variant/40 transition-colors"
              >
                Recall to Port
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FleetCommandPanel;
