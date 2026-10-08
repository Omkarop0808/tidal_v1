import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Recycle, Sparkles, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DebrisAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activityId?: string;
}

const mockAnalysis = {
  confidence: 94,
  trashType: 'High-Density Polyethylene & Ghost Nets',
  threatLevel: 'High Environmental Risk',
  size: 'Large Aggregation (approx 25-40 kg)',
  decompositionYears: 450,
  location: 'Versova Outfall Channel (19.135° N, 72.814° E)',
  environmentalImpact: 'High risk of microplastic fragmentation and marine entanglement with local coastal biodiversity within 18 hours.',
  probableSource: 'Stormwater drainage outfall combined with tidal regurgitation.',
  disposalInstructions: 'Route to mechanical shredding and washing facility for pelletized upcycling via Lucro Plastecycle.'
};

export function DebrisAnalysisPanel({ isOpen, onClose, activityId }: DebrisAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      if (activityId) {
        axios.get(`http://localhost:8000/api/v1/telemetry/analysis/${activityId}`)
          .then(res => {
            setAnalysis(res.data.analysis || mockAnalysis);
          })
          .catch(() => {
            setAnalysis(mockAnalysis);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setAnalysis(mockAnalysis);
        setLoading(false);
      }
    }
  }, [isOpen, activityId]);

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
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[4000]"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-surface-container-low/95 backdrop-blur-2xl border-l border-outline-variant/40 z-[5000] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="p-6 sm:p-10 flex flex-col gap-8">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase font-semibold block">
                      OceanEye Vision Telemetry Link
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-on-surface">
                      Debris Classification
                    </h2>
                  </div>
                </div>

                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface border border-outline-variant/30"
                  aria-label="Close Debris Analysis"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading || !analysis ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div className="w-12 h-12 rounded-full border-3 border-surface-container-highest border-t-primary animate-spin"></div>
                  <span className="text-on-surface-variant font-mono text-xs tracking-widest uppercase">
                    Analyzing Drone Optical Telemetry...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  
                  {/* Drone Image Frame */}
                  <div className="w-full h-64 sm:h-72 bg-surface-container-lowest rounded-3xl overflow-hidden relative border border-outline-variant/40 group shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=800&q=80" 
                      alt="Detected Debris" 
                      className="w-full h-full object-cover filter contrast-125 saturate-125" 
                    />
                    
                    {/* Simulated Bounding Box */}
                    <div className="absolute top-[22%] left-[24%] w-[52%] h-[56%] border-2 border-primary bg-primary/20 rounded-xl flex items-start justify-start p-2 shadow-glow-sm pointer-events-none">
                      <span className="bg-primary text-on-primary text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        YOLO11: {analysis.trashType.substring(0, 20)}...
                      </span>
                    </div>

                    <div className="absolute top-4 left-4 bg-surface-container-low/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline-variant/40">
                      <span className="text-primary font-mono text-xs font-bold uppercase tracking-wider">
                        Confidence {analysis.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Classification header */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                      {analysis.trashType}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-error/10 text-error font-mono text-xs font-semibold border border-error/30">
                        {analysis.threatLevel}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs border border-outline-variant/40">
                        {analysis.size}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-surface-container/70 border border-outline-variant/40 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-warning font-mono text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-on-surface-variant text-[10px]">Decomposition</span>
                      </div>
                      <span className="text-2xl font-headline font-bold text-on-surface">
                        {analysis.decompositionYears} Years
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container/70 border border-outline-variant/40 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary font-mono text-xs">
                        <MapPin className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-on-surface-variant text-[10px]">Coordinate Vector</span>
                      </div>
                      <span className="text-sm font-mono font-semibold text-on-surface truncate" title={analysis.location}>
                        {analysis.location}
                      </span>
                    </div>
                  </div>

                  {/* Impact Analysis & Strategy */}
                  <div className="flex flex-col gap-3.5">
                    <div className="p-5 rounded-2xl bg-error/10 border border-error/20 flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-error font-bold">
                        Environmental Threat Profile
                      </span>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                        {analysis.environmentalImpact}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-secondary font-bold">
                        Probable Outfall Source
                      </span>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {analysis.probableSource}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                        <Recycle className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[10px]">Upcycler Routing Strategy</span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                        {analysis.disposalInstructions}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => {
                      alert("Vessel SKM-01 Dispatched to Debris Coordinates!");
                      onClose();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-on-primary font-headline font-bold text-xs sm:text-sm uppercase tracking-wider hover:shadow-glow transition-all duration-300 shadow-lg"
                  >
                    Acknowledge & Dispatch Autonomous Skimmer
                  </button>

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DebrisAnalysisPanel;
