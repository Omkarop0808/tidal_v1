import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCw, 
  Sparkles, 
  ArrowRight, 
  Recycle, 
  Compass,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import HotspotRanking, { MOCK_HOTSPOTS } from '../components/dashboard/HotspotRanking';
import LiveMap from '../components/dashboard/LiveMap';
import CleanupOptimization from '../components/dashboard/CleanupOptimization';
import ComparisonVisual from '../components/dashboard/ComparisonVisual';
import InterventionSimulator from '../components/dashboard/InterventionSimulator';
import DispatchPlanModal from '../components/dashboard/DispatchPlanModal';
import FieldCleanupModal from '../components/dashboard/FieldCleanupModal';

const Hotspots = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [isFleetDispatched, setIsFleetDispatched] = useState(false);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1500);
  };

  const currentBeach = MOCK_HOTSPOTS[selectedZoneIndex] || MOCK_HOTSPOTS[0];

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 lg:px-12 py-8 gap-8 max-w-[1600px] mx-auto">
      
      {/* Top Header / Intro Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-medium flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              TACTICAL DEPLOYMENT & FIELD OPS
            </span>
            <span className="text-on-surface-variant font-mono text-xs">
              // SECTOR 04 — GREATER MUMBAI COASTLINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-on-surface tracking-tight">
            Hotspots & Autonomous Fleet Operations
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Transform machine learning forecasts into deterministic intercept missions. Real-time telemetry guides vessel assignment, before/after evidence recording, and central state synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsCleanupModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-emerald-400 font-headline font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-emerald-500/30 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Log Field Sweep ({currentBeach.zone_name.split(' ')[0]})</span>
          </button>

          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-outline-variant/40"
          >
            <RotateCw className={`w-4 h-4 text-primary ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Syncing...' : 'Recalculate'}</span>
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-primary text-on-primary font-headline font-bold text-xs sm:text-sm hover:shadow-glow transition-all duration-300 flex items-center gap-2 group shadow-lg"
          >
            <span className="absolute -top-2.5 -right-2 px-2 py-0.5 bg-error text-white text-[9px] font-mono font-bold rounded-full shadow-md uppercase tracking-wider">
              {isFleetDispatched ? 'ACTIVE' : 'AI LIVE'}
            </span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>{isFleetDispatched ? 'Re-optimize Fleet Plan' : 'Deploy AI Cleanup Plan'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Dispatched Banner (if active) */}
      {isFleetDispatched && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono text-xs text-emerald-400">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fleet Orders Transmitted • 3 Autonomous Skimmers En Route to Coastal Hotspots</span>
          </div>
          <span className="font-bold text-primary">ETA: 0.8h - 2.4h</span>
        </div>
      )}

      {/* Main Grid: Left Hotspots Ranking (4), Center Live Map (5), Right Cleanup Optimization (3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <HotspotRanking 
          selectedZoneIndex={selectedZoneIndex}
          onSelectZone={setSelectedZoneIndex}
          isFleetDispatched={isFleetDispatched}
        />
        <LiveMap 
          selectedZoneIndex={selectedZoneIndex}
          isFleetDispatched={isFleetDispatched}
        />
        <CleanupOptimization />
      </div>

      {/* Comparison Visual: Reactionary vs TIDAL Predictive */}
      <ComparisonVisual />

      {/* Intervention Simulator: Interactive Action Scenarios */}
      <InterventionSimulator />

      {/* Bottom CTA connecting to Circular Recovery */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-semibold uppercase tracking-wider">
            <Recycle className="w-4 h-4" />
            <span>Downstream Material Routing</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-headline font-bold text-on-surface">
            Route Recovered Marine Plastics to Circular Recovery?
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Seamlessly transfer collected ocean debris batches into verified upcycler networks, automated YOLO11 material valuation, and carbon offset ledgers.
          </p>
        </div>

        <Link 
          to="/circular-recovery" 
          className="relative z-10 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs sm:text-sm hover:shadow-glow transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
        >
          <span>Proceed to Circular Recovery</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <DispatchPlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirmDispatch={() => setIsFleetDispatched(true)}
      />

      <FieldCleanupModal 
        isOpen={isCleanupModalOpen}
        onClose={() => setIsCleanupModalOpen(false)}
        beach={{
          id: currentBeach.zone_name.toLowerCase().split(' ')[0],
          name: currentBeach.zone_name,
          sector: currentBeach.sector,
          estimated_debris_kg: currentBeach.estimated_debris_kg
        }}
        onSuccess={() => {
          setIsFleetDispatched(true);
        }}
      />
    </div>
  );
};

export default Hotspots;
