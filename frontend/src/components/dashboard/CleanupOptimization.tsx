import { Sliders, Users, Truck, Anchor, CheckCircle2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CleanupOptimization = ({ assignments = [] }: { assignments?: any[] }) => {
  const totalRecovery = assignments.reduce((acc, a) => acc + (a.estimated_recovery_kg || 0), 0) / 1000;
  
  return (
    <div className="flex flex-col h-full bg-[#050505]">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2 border-[#333333] bg-[#111111]">
        <div className="flex items-center gap-4">
          <Sliders className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <h3 className="font-headline font-black text-sm uppercase text-white tracking-widest">Optimizer</h3>
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Hungarian</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Square className="w-2 h-2 fill-current" />
          OPTIMAL
        </span>
      </div>
      
      <div className="p-6 flex flex-col gap-6">
        {/* Resource Allocation */}
        <div className="grid grid-cols-3 gap-[1px] bg-[#333333] border border-[#333333]">
          <div className="p-4 bg-[#000000] flex flex-col items-center gap-2">
            <Users className="w-5 h-5 text-[#ff4d00]" />
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Squads</span>
            <span className="font-headline font-black text-2xl text-white">{assignments.length ? 14 : '--'}</span>
          </div>
          <div className="p-4 bg-[#000000] flex flex-col items-center gap-2">
            <Truck className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Trucks</span>
            <span className="font-headline font-black text-2xl text-white">{assignments.length ? 6 : '--'}</span>
          </div>
          <div className="p-4 bg-[#000000] flex flex-col items-center gap-2">
            <Anchor className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Cap</span>
            <span className="font-headline font-black text-2xl text-white">{assignments.length ? '2.4T' : '--'}</span>
          </div>
        </div>

        {/* Vectors */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono text-white uppercase font-bold tracking-widest border-b border-[#333333] pb-2">
            OPTIMAL FLEET VECTORS
          </span>
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase font-bold tracking-widest h-[120px]">
            <AnimatePresence>
              {assignments.slice(0, 3).map((a, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center justify-between p-3 bg-[#111111] border border-[#333333]"
                >
                  <span className="text-white truncate">{a.vessel_name}</span>
                  <span className="text-[#ff4d00] truncate">→ {a.target_zone.split(':')[0]}</span>
                </motion.div>
              ))}
              {assignments.length === 0 && (
                <span className="text-[#525252] text-center p-4">AWAITING ASSIGNMENTS</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t-2 border-[#333333] bg-[#111111] p-6 flex flex-col gap-3 font-mono text-[10px] uppercase font-bold tracking-widest">
        <div className="flex justify-between">
          <span className="text-[#a3a3a3]">EST. RECOVERY</span>
          <span className="text-white">{totalRecovery > 0 ? totalRecovery.toFixed(2) : '--'} TONS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a3a3a3]">COVERAGE</span>
          <span className="text-white">{assignments.length ? '7 SECTORS' : '--'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#a3a3a3]">EFFICIENCY</span>
          <span className="text-[#ff4d00] flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3" />
            {assignments.length ? '84% (+46%)' : '--'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CleanupOptimization;
