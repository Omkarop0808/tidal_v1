import { useState } from 'react';
import { Zap, ShieldCheck, Users, Clock, Square } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    icon: Zap,
    title: 'DEPLOY TO JUHU',
    desc: 'Pre-emptive skimmer interception before peak tidal accumulation.',
    impactLabel: 'RECOVERY',
    impactValue: '+34%',
    impactColor: 'text-[#ff4d00]',
    isPositive: true,
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'OFFSHORE BOOM',
    desc: 'Anchor containment boom across Bandra channel entrance.',
    impactLabel: 'INFLUX',
    impactValue: '-45%',
    impactColor: 'text-white',
    isPositive: true,
  },
  {
    id: 3,
    icon: Users,
    title: 'SURGE SQUADS',
    desc: 'Scale active containment units from 12 to 18 field squads.',
    impactLabel: 'CLEARANCE',
    impactValue: '1.8H',
    impactColor: 'text-white',
    isPositive: true,
  },
  {
    id: 4,
    icon: Clock,
    title: 'STORM DELAY',
    desc: 'Model monsoon storm surge and uncontrolled tidal drift.',
    impactLabel: 'PENALTY',
    impactValue: '-62%',
    impactColor: 'text-[#a3a3a3]',
    isPositive: false,
  }
];

export const InterventionSimulator = () => {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#333333] pb-4">
        <div className="flex items-center gap-4">
          <Square className="w-5 h-5 fill-white text-white" />
          <div className="flex flex-col gap-1">
            <h3 className="font-headline font-black text-2xl text-white uppercase tracking-tighter">Intervention Simulator</h3>
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Countermeasure Impact Modeling</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#ff4d00] uppercase font-bold tracking-widest">
          [ CLICK SCENARIO TO PREDICT DELTAS ]
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#333333] border-2 border-[#333333]">
        {scenarios.map((scenario) => {
          const isActive = activeId === scenario.id;
          const Icon = scenario.icon;

          return (
            <div 
              key={scenario.id} 
              onClick={() => setActiveId(isActive ? null : scenario.id)}
              className={`p-6 cursor-pointer flex flex-col justify-between gap-6 transition-none ${
                isActive
                  ? scenario.isPositive
                    ? 'bg-[#111111] border-l-4 border-l-[#ff4d00]'
                    : 'bg-[#111111] border-l-4 border-l-white'
                  : 'bg-[#000000] border-l-4 border-l-transparent hover:bg-[#0a0a0a]'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#ff4d00]' : 'text-white'}`} />
                  {isActive && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-white text-black">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className={`font-headline font-black text-sm uppercase ${isActive ? 'text-[#ff4d00]' : 'text-white'}`}>
                    {scenario.title}
                  </h4>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#a3a3a3] font-bold border-l-2 border-[#333333] pl-2">
                    {scenario.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#333333] font-mono text-[10px] uppercase font-bold tracking-widest">
                <span className="text-[#a3a3a3]">{scenario.impactLabel}</span>
                <span className={scenario.impactColor}>{scenario.impactValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionSimulator;
