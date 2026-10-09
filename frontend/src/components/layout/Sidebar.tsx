import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Activity, 
  Compass, 
  Recycle, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Waves,
  X,
  Navigation
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { to: '/overview', label: 'Digital Twin (Live)', icon: LayoutGrid, tag: 'LIVE' },
  { to: '/simulate', label: 'Simulate Drift', icon: Activity, tag: '72H' },
  { to: '/hotspots', label: 'Tactical Hotspots', icon: Compass, tag: 'AI OPS' },
  { to: '/field-ops', label: 'Field Operations', icon: Navigation, tag: 'MOBILE' },
  { to: '/circular-recovery', label: 'Circular Recovery', icon: Recycle, tag: 'YOLO11' },
  { to: '/model-lab', label: 'Model Lab', icon: Cpu, tag: 'METRICS' },
];

export const Sidebar = ({ mobileOpen, onCloseMobile }: SidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/90 z-40 lg:hidden"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-[#000000] z-50 flex flex-col justify-between py-6 px-4 border-r-2 border-[#333333] transition-none lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col gap-8">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-[#ff4d00] flex items-center justify-center text-black">
                <Waves className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-black animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-black"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-black text-2xl tracking-tighter text-white uppercase flex items-center gap-2 leading-none">
                  TIDAL
                  <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-white text-black border border-white">v2.4</span>
                </span>
                <span className="text-[10px] font-mono text-[#a3a3a3] uppercase tracking-widest mt-1">Marine Intel</span>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden p-2 bg-[#111111] border border-[#333333] text-white hover:bg-[#ff4d00] hover:text-black hover:border-[#ff4d00] transition-none"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-[1px] bg-[#333333] border border-[#333333]">
            <div className="px-3 py-2 bg-[#000000] text-[10px] font-mono font-bold uppercase tracking-widest text-[#a3a3a3]">
              Operations & Telemetry
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `flex items-center justify-between px-3 py-3 font-mono text-xs uppercase tracking-wide transition-none group ${
                    isActive 
                      ? 'bg-[#111111] text-white border-l-4 border-[#ff4d00]' 
                      : 'bg-[#000000] text-[#a3a3a3] border-l-4 border-transparent hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${({isActive}: any) => isActive ? 'text-[#ff4d00]' : ''} group-hover:text-[#ff4d00]`} />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1 py-0.5 border border-[#333333] text-[#a3a3a3] group-hover:border-[#ff4d00] group-hover:text-[#ff4d00]">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Widgets */}
        <div className="flex flex-col gap-4 px-1">
          
          {/* Telemetry Status Card */}
          <div className="p-4 bg-[#111111] border border-[#333333] flex flex-col gap-3 font-mono text-xs uppercase">
            <div className="flex items-center justify-between text-[#a3a3a3]">
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#ff4d00] animate-pulse" />
                Data Stream
              </span>
              <span className="flex items-center gap-2 text-white font-bold tracking-widest">
                <span className="w-2 h-2 bg-white animate-ping"></span>
                ACTIVE
              </span>
            </div>
            <div className="text-white font-bold tracking-widest text-[10px] border-y border-[#333333] py-2">
              MUMBAI COAST // SEC_04
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#a3a3a3]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-white" />
                Physics Core
              </span>
              <span className="text-[#ff4d00] font-bold">OPERATIONAL</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-[#000000] border border-[#333333] hover:border-[#ff4d00] transition-none group cursor-pointer">
            <div className="relative w-10 h-10 bg-white flex items-center justify-center text-black font-headline font-black text-sm">
              AS
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ff4d00] border-2 border-black"></span>
            </div>
            <div className="flex flex-col overflow-hidden uppercase">
              <span className="text-xs font-bold text-white truncate">Dr. Ananya Sharma</span>
              <span className="text-[10px] font-mono text-[#a3a3a3] truncate group-hover:text-white">Chief Oceanographer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
