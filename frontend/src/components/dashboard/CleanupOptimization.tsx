import { Sliders, Users, Truck, Anchor, CheckCircle2, Sparkles } from 'lucide-react';

export const CleanupOptimization = () => {
  return (
    <div className="lg:col-span-3 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xl">
      <div className="flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface">Optimization Engine</h3>
              <span className="text-[10px] font-mono text-on-surface-variant uppercase">Hungarian Assignment</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold border border-primary/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            OPTIMAL
          </span>
        </div>
        
        {/* Resource Allocation Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col items-center text-center">
            <Users className="w-4 h-4 text-on-surface-variant mb-1" />
            <span className="text-[9px] font-mono text-on-surface-variant uppercase">Squads</span>
            <span className="font-headline font-bold text-lg text-on-surface">14</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col items-center text-center">
            <Truck className="w-4 h-4 text-on-surface-variant mb-1" />
            <span className="text-[9px] font-mono text-on-surface-variant uppercase">Trucks</span>
            <span className="font-headline font-bold text-lg text-on-surface">6</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col items-center text-center">
            <Anchor className="w-4 h-4 text-primary mb-1" />
            <span className="text-[9px] font-mono text-on-surface-variant uppercase">Capacity</span>
            <span className="font-headline font-bold text-lg text-primary">2.4t</span>
          </div>
        </div>

        {/* Tactical Fleet Allocation */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
            Optimal Fleet Vectors:
          </span>
          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/80 border border-error/20">
              <span className="text-on-surface font-semibold text-xs">SKM-01 (Skimmer)</span>
              <span className="px-2 py-0.5 rounded bg-error/10 text-error text-[10px] font-bold">→ Versova Creek</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/80 border border-primary/20">
              <span className="text-on-surface font-semibold text-xs">SKM-02 (Skimmer)</span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">→ Mahim Outfall</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/80 border border-secondary/20">
              <span className="text-on-surface font-semibold text-xs">Squad Bravo (Shore)</span>
              <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-bold">→ Juhu Beach</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Summary Matrix */}
      <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-2 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Est. Debris Recovery:</span>
          <span className="text-primary font-bold text-sm">1.85 metric tons</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Fleet Coverage:</span>
          <span className="text-on-surface font-semibold">7 Coastal Sectors</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Efficiency Score:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            84% (+46% vs Manual)
          </span>
        </div>
      </div>
    </div>
  );
};

export default CleanupOptimization;
