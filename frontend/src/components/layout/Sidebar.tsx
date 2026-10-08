import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Activity, 
  Compass, 
  Recycle, 
  Cpu, 
  Layers, 
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
  { to: '/overview', label: 'Overview', icon: LayoutGrid, tag: 'LIVE' },
  { to: '/dashboard', label: 'Digital Twin 3D', icon: Layers, tag: '3D' },
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
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low/95 backdrop-blur-2xl z-50 flex flex-col justify-between py-6 px-4 border-r border-outline-variant/40 transition-transform duration-300 ease-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col gap-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,242,254,0.2)] group">
                <Waves className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl tracking-wider text-on-surface flex items-center gap-1.5">
                  TIDAL
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">v2.4</span>
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-widest">Marine Intelligence</span>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent my-1"></div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <div className="px-3 pb-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-on-surface-variant/70">
              Operations & Telemetry
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to} 
                  onClick={onCloseMobile}
                  className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary font-semibold border-l-2 border-primary shadow-[inset_0_1px_0_0_rgba(0,242,254,0.15)] text-glow' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high/80 text-on-surface-variant group-hover:text-primary transition-colors border border-outline-variant/30">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Widgets */}
        <div className="flex flex-col gap-3 px-1">
          
          {/* Telemetry Status Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/40 flex flex-col gap-2.5 text-xs font-mono">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
                Data Stream
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>
            <div className="text-on-surface font-medium tracking-tight text-[11px]">
              Mumbai Coast • Sector 04
            </div>
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Physics Core
              </span>
              <span className="text-primary">Operational</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-colors">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/40 text-on-surface font-headline font-bold text-xs">
              AS
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-on-surface truncate">Dr. Ananya Sharma</span>
              <span className="text-[10px] font-mono text-on-surface-variant truncate">Chief Oceanographer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
