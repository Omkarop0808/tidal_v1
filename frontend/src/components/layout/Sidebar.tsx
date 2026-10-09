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
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { to: '/overview', label: 'Digital Twin (Live)', icon: LayoutGrid, tag: 'LIVE' },
  { to: '/simulate', label: 'Simulate Drift', icon: Activity, tag: '72H' },
  { to: '/hotspots', label: 'Tactical Hotspots', icon: Compass, tag: 'AI OPS' },
  { to: '/field-ops', label: 'Field Operations', icon: Navigation, tag: 'MOBILE' },
  { to: '/circular-recovery', label: 'Circular Recovery', icon: Recycle, tag: 'YOLO11' },
  { to: '/model-lab', label: 'Model Lab', icon: Cpu, tag: 'METRICS' },
];

export const Sidebar = ({ 
  mobileOpen, 
  onCloseMobile, 
  isCollapsed = false, 
  onToggleCollapse 
}: SidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/90 z-40 lg:hidden"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full ${
        isCollapsed ? 'lg:w-20 w-72' : 'w-72'
      } bg-[#000000] z-50 flex flex-col justify-between py-6 ${
        isCollapsed ? 'lg:px-2 px-4' : 'px-4'
      } border-r-2 border-[#333333] transition-all duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col gap-8">
          
          {/* Brand Header - Collapsed Desktop Mode */}
          {isCollapsed && (
            <div className="hidden lg:flex flex-col items-center gap-3 pt-1">
              <div className="relative w-10 h-10 bg-[#ff4d00] flex items-center justify-center text-black">
                <Waves className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-black animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-black"></span>
              </div>
              <button 
                onClick={onToggleCollapse}
                className="p-1.5 bg-[#111111] border border-[#333333] text-[#a3a3a3] hover:text-white hover:border-[#ff4d00] hover:bg-[#ff4d00] hover:text-black transition-none flex items-center justify-center"
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Brand Header - Full / Expanded (Desktop & Mobile) */}
          <div className={`flex items-center justify-between px-2 pt-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
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

            <div className="flex items-center gap-2">
              {/* Desktop Collapse Arrow Button */}
              {onToggleCollapse && (
                <button 
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 bg-[#111111] border border-[#333333] text-[#a3a3a3] hover:text-white hover:border-[#ff4d00] hover:bg-[#ff4d00] hover:text-black transition-none items-center justify-center"
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Close Button */}
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
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-[1px] bg-[#333333] border border-[#333333]">
            {(!isCollapsed || mobileOpen) && (
              <div className={`px-3 py-2 bg-[#000000] text-[10px] font-mono font-bold uppercase tracking-widest text-[#a3a3a3] ${
                isCollapsed ? 'lg:hidden' : ''
              }`}>
                Operations & Telemetry
              </div>
            )}
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `font-mono text-xs uppercase tracking-wide transition-none group relative ${
                    isCollapsed 
                      ? 'flex items-center justify-between lg:justify-center px-3 py-3 lg:p-3'
                      : 'flex items-center justify-between px-3 py-3'
                  } ${
                    isActive 
                      ? 'bg-[#111111] text-white border-l-4 border-[#ff4d00]' 
                      : 'bg-[#000000] text-[#a3a3a3] border-l-4 border-transparent hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {/* Icon and label */}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 group-hover:text-[#ff4d00] shrink-0`} />
                    <span className={`font-bold ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  </div>

                  {/* Tag on expanded or mobile */}
                  <span className={`text-[9px] font-mono px-1 py-0.5 border border-[#333333] text-[#a3a3a3] group-hover:border-[#ff4d00] group-hover:text-[#ff4d00] ${
                    isCollapsed ? 'lg:hidden' : ''
                  }`}>
                    {item.tag}
                  </span>

                  {/* Hover Floating Tooltip in Collapsed Desktop Mode */}
                  {isCollapsed && (
                    <div className="hidden lg:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-[100] bg-[#000000] border-2 border-white px-3 py-1.5 shadow-2xl items-center gap-2 whitespace-nowrap">
                      <span className="font-bold text-white text-xs">{item.label}</span>
                      <span className="text-[9px] px-1 py-0.5 bg-[#222222] text-[#ff4d00] border border-[#ff4d00] font-mono font-bold">
                        {item.tag}
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Widgets */}
        <div className="flex flex-col gap-4 px-1">
          
          {/* Collapsed Desktop Widgets */}
          {isCollapsed && (
            <div className="hidden lg:flex flex-col items-center gap-3">
              {/* Mini Telemetry Status */}
              <div 
                className="w-10 h-10 bg-[#111111] border border-[#333333] hover:border-[#ff4d00] flex items-center justify-center relative cursor-pointer group"
                title="Data Stream: ACTIVE"
              >
                <Radio className="w-4 h-4 text-[#ff4d00] animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white"></span>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-[100] bg-black border-2 border-[#333333] p-2 text-white font-mono text-[9px] uppercase whitespace-nowrap shadow-2xl">
                  DATA STREAM: ACTIVE // SEC_04
                </div>
              </div>

              {/* Mini User Avatar */}
              <div 
                className="w-10 h-10 bg-white text-black font-headline font-black text-sm flex items-center justify-center relative cursor-pointer group border border-white hover:border-[#ff4d00]"
                title="Dr. Ananya Sharma"
              >
                AS
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#ff4d00] border border-black"></span>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-[100] bg-black border-2 border-white p-2 text-white font-mono text-[9px] uppercase whitespace-nowrap shadow-2xl">
                  DR. ANANYA SHARMA // CHIEF OCEANOGRAPHER
                </div>
              </div>
            </div>
          )}

          {/* Full Footer Widgets (Expanded or Mobile) */}
          <div className={`flex flex-col gap-4 ${isCollapsed ? 'lg:hidden' : ''}`}>
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

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
