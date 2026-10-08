import { XCircle, Square } from 'lucide-react';

export const ComparisonVisual = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#333333] border-2 border-[#333333]">
      
      {/* Conventional Reactionary Cleanups */}
      <div className="bg-[#050505] p-8 flex flex-col justify-between gap-8 relative group">
        <div className="absolute top-0 right-0 px-4 py-2 bg-[#111111] text-[#a3a3a3] border-b-2 border-l-2 border-[#333333] font-mono text-[10px] font-bold uppercase tracking-widest">
          CONVENTIONAL
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <XCircle className="w-8 h-8 text-white" />
          <div className="flex flex-col gap-1">
            <h4 className="font-headline font-black text-2xl text-white uppercase tracking-tighter">WITHOUT TIDAL</h4>
            <p className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Reactionary Cleanup</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1px] bg-[#333333] border border-[#333333]">
          <div className="p-4 bg-[#000000] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Recovery</span>
            <span className="font-headline font-black text-3xl text-white">38%</span>
          </div>
          <div className="p-4 bg-[#000000] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Impact</span>
            <span className="font-headline font-black text-3xl text-white">72H+</span>
          </div>
          <div className="p-4 bg-[#000000] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Efficiency</span>
            <span className="font-headline font-black text-3xl text-white">LOW</span>
          </div>
        </div>

        <p className="text-xs font-mono uppercase font-bold tracking-widest text-[#a3a3a3] leading-relaxed border-l-2 border-[#525252] pl-4">
          Debris fragments into microplastics upon crashing onto rocky seawalls before crews arrive, causing severe ecological contamination and exponentially higher manual retrieval costs.
        </p>
      </div>

      {/* With TIDAL Autonomous Prediction */}
      <div className="bg-[#111111] p-8 flex flex-col justify-between gap-8 relative group border-l-4 border-l-[#ff4d00]">
        <div className="absolute top-0 right-0 px-4 py-2 bg-white text-black border-b-2 border-l-2 border-white font-mono text-[10px] font-bold uppercase tracking-widest">
          PREDICTION-DRIVEN
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <Square className="w-8 h-8 fill-[#ff4d00] text-[#ff4d00]" />
          <div className="flex flex-col gap-1">
            <h4 className="font-headline font-black text-2xl text-white uppercase tracking-tighter">WITH TIDAL</h4>
            <p className="text-[10px] font-mono text-[#ff4d00] uppercase font-bold tracking-widest">Pre-beaching Interception</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1px] bg-[#333333] border border-[#333333]">
          <div className="p-4 bg-[#050505] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Recovery</span>
            <span className="font-headline font-black text-3xl text-[#ff4d00]">78%</span>
          </div>
          <div className="p-4 bg-[#050505] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Clearance</span>
            <span className="font-headline font-black text-3xl text-white">18H</span>
          </div>
          <div className="p-4 bg-[#050505] flex flex-col gap-2">
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Efficiency</span>
            <span className="font-headline font-black text-3xl text-white">MAX</span>
          </div>
        </div>

        <p className="text-xs font-mono uppercase font-bold tracking-widest text-[#a3a3a3] leading-relaxed border-l-2 border-[#ff4d00] pl-4">
          Autonomous skimmers and collection barriers are pre-dispatched to convergence coordinates 12 to 24 hours in advance, collecting intact buoyant plastics before shoreline disintegration.
        </p>
      </div>

    </div>
  );
};

export default ComparisonVisual;
