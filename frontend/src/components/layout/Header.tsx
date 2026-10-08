import { useState, useEffect } from 'react';
import { 
  Globe2, 
  Bell, 
  Menu, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onToggleMobile?: () => void;
}

export const Header = ({ onToggleMobile }: HeaderProps) => {
  const [time, setTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, title: 'Debris Spike at Versova', time: '2m ago', type: 'critical', desc: 'Monte Carlo drift indicates +420kg accumulation over next 6 hours.' },
    { id: 2, title: 'Autonomous Skimmer SKM-01 Active', time: '14m ago', type: 'info', desc: 'Arrived at Bandra channel coordinates. Commencing interception.' },
    { id: 3, title: 'High Onshore Wind Alert', time: '1h ago', type: 'warning', desc: 'Wind speed increased to 24 knots (SW). Beaching risk elevated.' },
  ];

  return (
    <header className="fixed top-0 lg:left-72 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-6 border-b border-outline-variant/30">
      
      {/* Left: Hamburger (Mobile) + Breadcrumb/Sector */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container/90 border border-primary/20 text-on-surface shadow-sm">
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-primary">Mumbai Coast</span>
            <ChevronRight className="w-3 h-3 text-on-surface-variant" />
            <span className="text-on-surface-variant font-mono">Sector 04</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Telemetry Synced
          </div>
        </div>
      </div>

      {/* Right: Time, Notifications, Settings, User avatar */}
      <div className="flex items-center gap-3">
        {/* Real-time Marine Chronometer */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-xs font-mono text-on-surface-variant">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{time || '00:00:00 UTC'}</span>
        </div>

        {/* Notifications Toggle */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl border transition-all ${
              showNotifications 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-surface-container/60 border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-low/95 backdrop-blur-2xl border border-outline-variant/50 shadow-2xl p-4 flex flex-col gap-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <span className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Tactical Alerts (3)
                </span>
                <span className="text-[10px] font-mono text-primary uppercase cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-surface-container/80 border border-outline-variant/30 hover:border-primary/40 transition-colors flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className={n.type === 'critical' ? 'text-error' : n.type === 'warning' ? 'text-warning' : 'text-primary'}>
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Tools */}
        <button 
          className="p-2 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
          title="Sector Config"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-primary text-xs font-bold font-mono">
            AS
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
