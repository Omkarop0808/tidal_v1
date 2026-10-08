import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Map, Activity, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtocolAlphaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolAlphaOverlay = ({ isOpen, onClose }: ProtocolAlphaOverlayProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setStage(1), 1800);
      return () => clearTimeout(timer);
    } else {
      setStage(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" onClick={onClose}></div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-4xl bg-surface-container-low border border-error/40 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-8 overflow-hidden shadow-glow-error"
          >
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,51,102,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,51,102,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-error/15 text-error border border-error/30 flex items-center justify-center shadow-glow-error">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-error font-bold block">
                      Emergency Countermeasure Simulation
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-headline font-bold text-on-surface tracking-tight">
                      Protocol Alpha
                    </h2>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant font-mono max-w-2xl leading-relaxed">
                  Simulating rapid automated emergency interception response based on live hydrodynamic convergence and coastal beaching probability vectors.
                </p>
              </div>

              <button 
                onClick={onClose} 
                className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tactical Objective Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container/80 border border-outline-variant/40 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">Primary Objective</span>
                  <span className="text-on-surface font-headline font-bold text-sm">Versova Creek Containment</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container/80 border border-outline-variant/40 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center">
                  <Map className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">Asset Diversion</span>
                  <span className="text-on-surface font-headline font-bold text-sm">3 Skimmers Re-routed</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container/80 border border-outline-variant/40 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">Projected Impact</span>
                  <span className="text-emerald-400 font-headline font-bold text-sm">
                    {stage === 0 ? 'Computing deltas...' : '+7.4% Shoreline Protection'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Progress Meter */}
            <div className="relative z-10 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between uppercase">
                <span className="text-on-surface-variant">Hydrodynamic Simulation Progress</span>
                <span className="text-primary font-bold">{stage === 0 ? '34%' : '100% (Complete)'}</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: stage === 0 ? '34%' : '100%' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full shadow-glow-sm"
                ></motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-mono text-on-surface-variant transition-colors"
              >
                Abort Protocol
              </button>

              <button 
                disabled={stage === 0}
                onClick={onClose}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-error to-warning text-white font-headline font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 hover:shadow-glow-error transition-all duration-300 disabled:opacity-40 shadow-lg"
              >
                {stage === 0 ? 'Simulating Physics...' : 'Authorize Emergency Fleet Diversion'}
              </button>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProtocolAlphaOverlay;
