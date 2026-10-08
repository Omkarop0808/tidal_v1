import { Sparkles, XCircle } from 'lucide-react';

export const ComparisonVisual = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Conventional Reactionary Cleanups */}
      <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-error/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-error/15 text-error border-b border-l border-error/30 rounded-bl-2xl font-mono text-xs font-bold uppercase tracking-wider">
          Conventional Approach
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/10 border border-error/30 flex items-center justify-center text-error">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg text-on-surface">WITHOUT TIDAL</h4>
            <p className="text-xs font-mono text-on-surface-variant">Post-shoreline reactionary cleanup squads</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Recovery Rate</span>
            <span className="font-headline font-bold text-2xl text-error flex items-center gap-1">
              38%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Shore Impact</span>
            <span className="font-headline font-bold text-2xl text-on-surface">72h+</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Efficiency</span>
            <span className="font-headline font-bold text-2xl text-error">Low</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Debris fragments into microplastics upon crashing onto rocky seawalls before crews arrive, causing severe ecological contamination and exponentially higher manual retrieval costs.
        </p>
      </div>

      {/* With TIDAL Autonomous Prediction */}
      <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-primary/40 relative overflow-hidden shadow-glow-sm group">
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/20 text-primary border-b border-l border-primary/30 rounded-bl-2xl font-mono text-xs font-bold uppercase tracking-wider">
          Prediction-Driven System
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg text-on-surface">WITH TIDAL INTELLIGENCE</h4>
            <p className="text-xs font-mono text-primary">Pre-beaching hydrodynamic offshore interception</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface-container/80 border border-primary/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Recovery Rate</span>
            <span className="font-headline font-bold text-2xl text-primary text-glow flex items-center gap-1">
              78%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container/80 border border-primary/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Clearance Time</span>
            <span className="font-headline font-bold text-2xl text-emerald-400">18h</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container/80 border border-primary/30 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">Efficiency</span>
            <span className="font-headline font-bold text-2xl text-emerald-400">Optimal</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Autonomous skimmers and collection barriers are pre-dispatched to convergence coordinates 12 to 24 hours in advance, collecting intact buoyant plastics before shoreline disintegration.
        </p>
      </div>

    </div>
  );
};

export default ComparisonVisual;
