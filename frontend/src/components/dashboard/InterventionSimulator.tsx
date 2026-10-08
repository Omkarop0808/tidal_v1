import { useState } from 'react';
import { Zap, ShieldCheck, Users, Clock, Sparkles } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    icon: Zap,
    title: 'Deploy to Juhu Immediately',
    desc: 'Pre-emptive skimmer interception before peak tidal accumulation.',
    impactLabel: 'Predicted Recovery:',
    impactValue: '+34% Capture',
    impactColor: 'text-primary',
    isPositive: true,
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Deploy Offshore Boom Barrier',
    desc: 'Anchor containment boom across Bandra channel entrance.',
    impactLabel: 'Shoreline Drift:',
    impactValue: '-45% Influx',
    impactColor: 'text-emerald-400',
    isPositive: true,
  },
  {
    id: 3,
    icon: Users,
    title: 'Surge Field Response Squads',
    desc: 'Scale active containment units from 12 to 18 field squads.',
    impactLabel: 'Clearance Window:',
    impactValue: '1.8h Total Clear',
    impactColor: 'text-primary',
    isPositive: true,
  },
  {
    id: 4,
    icon: Clock,
    title: 'Simulate 24h Weather Delay',
    desc: 'Model monsoon storm surge and uncontrolled tidal drift.',
    impactLabel: 'Recovery Penalty:',
    impactValue: '-62% Efficiency',
    impactColor: 'text-error',
    isPositive: false,
  }
];

export const InterventionSimulator = () => {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Intervention Simulator</h3>
            <span className="text-xs font-mono text-on-surface-variant">Real-time Countermeasure Impact Modeling</span>
          </div>
        </div>
        <span className="text-xs font-mono text-primary font-semibold">
          CLICK SCENARIO TO PREDICT STATE DELTAS
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((scenario) => {
          const isActive = activeId === scenario.id;
          const Icon = scenario.icon;

          return (
            <div 
              key={scenario.id} 
              onClick={() => setActiveId(isActive ? null : scenario.id)}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden ${
                isActive
                  ? scenario.isPositive
                    ? 'bg-primary/10 border-primary shadow-glow-sm'
                    : 'bg-error/10 border-error shadow-glow-error'
                  : 'bg-surface-container-low/80 border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-high/60'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    scenario.isPositive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-error/10 text-error border border-error/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface text-primary border border-primary/30">
                      SELECTED
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface mb-1">
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {scenario.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 font-mono text-xs">
                <span className="text-on-surface-variant text-[11px]">{scenario.impactLabel}</span>
                <span className={`font-bold ${scenario.impactColor}`}>{scenario.impactValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionSimulator;
