/*
THESIS: TIDAL Marine Intelligence transforms raw coastal telemetry and Monte Carlo hydrodynamic simulations into an authoritative, tactical maritime command dashboard.
OWN-WORLD: Deep abyssal grounds (#050b10, #08121c), electric cyan (#00f2fe) bioluminescent vector accents, high-contrast tactical coral (#ff3366) and emerald (#10b981) status indicators, precision monospace telemetry labels, and micro-grid borders.
STORY: Researchers and operators instantly grasp predicted debris accumulation, active coastal risks, fleet deployment states, and real-time hydrodynamic telemetry with zero clutter.
FIRST VIEWPORT: Asymmetric tactical header with live satellite coordinates, live meteorological ticker, high-impact bento metric cards with glow indicators and action triggers.
FORM: Tactical Maritime Command & Telemetry Intelligence Center (Seed: 3e22ff0d).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Wifi, 
  Radio, 
  ShieldAlert, 
  Compass, 
  Wind, 
  Droplets, 
  Eye, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { IntelligenceMap } from '../components/IntelligenceMap';
import { ProtocolAlphaOverlay } from '../components/ProtocolAlphaOverlay';
import { FleetCommandPanel } from '../components/FleetCommandPanel';
import { DebrisAnalysisPanel } from '../components/DebrisAnalysisPanel';
import { useLiveFeed } from '../hooks/useLiveFeed';

interface TelemetrySummary {
  predicted_debris: number;
  high_risk_zones: number;
  cleanup_teams_active: number;
  recovery_potential: number;
  recent_activity: Array<{
    time: string;
    event: string;
    type: string;
  }>;
}

const Overview = () => {
  const [data, setData] = useState<TelemetrySummary | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isAlphaOpen, setIsAlphaOpen] = useState(false);
  const [isFleetOpen, setIsFleetOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [debrisMultiplier, setDebrisMultiplier] = useState(0);
  const [activeLayers, setActiveLayers] = useState<string[]>(['Debris', 'Current']);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  
  // OceanEye Integration State
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>();

  // WebSocket hook
  const { data: liveData, isConnected } = useLiveFeed('ws://localhost:8000/ws/live');

  useEffect(() => {
    if (liveData?.weather) {
      setWeatherData(liveData.weather);
    }
  }, [liveData]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/telemetry/summary');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching telemetry summary:', error);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReleaseDebris = () => {
    if (isReleasing) return;
    setIsReleasing(true);
    setTimeout(() => {
      setDebrisMultiplier(prev => prev + 1);
      setIsReleasing(false);
    }, 2000);
  };

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  // Derived metrics incorporating simulated debris drops
  const predictedDebris = data ? ((data.predicted_debris / 1000) + (debrisMultiplier * 1.2)).toFixed(1) : '--';
  const highRiskZones = data ? data.high_risk_zones + debrisMultiplier : '--';

  // Motion variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const filteredActivity = data?.recent_activity.filter(a => {
    if (activityFilter === 'all') return true;
    return a.type.toLowerCase() === activityFilter.toLowerCase();
  }) || [];

  return (
    <main className="w-full bg-background min-h-screen text-on-surface overflow-x-hidden">
      
      {/* Modals & Overlays */}
      <ProtocolAlphaOverlay isOpen={isAlphaOpen} onClose={() => setIsAlphaOpen(false)} />
      <FleetCommandPanel isOpen={isFleetOpen} onClose={() => setIsFleetOpen(false)} />
      <DebrisAnalysisPanel 
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)} 
        activityId={selectedActivityId} 
      />

      {/* TACTICAL HERO SECTION */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-8 pb-12 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
        
        {/* Top Status Ticker / Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SECTOR 04 ACTIVE
            </div>
            <span className="text-xs font-mono text-on-surface-variant hidden md:inline">
              LAT: 18.9750° N • LON: 72.8258° E • ARABIAN SEA BASIN
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Wind className="w-3.5 h-3.5 text-primary" />
              <span>{weatherData ? `${weatherData.wind_speed_10m} km/h` : '18.4 km/h'} SW</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Droplets className="w-3.5 h-3.5 text-secondary" />
              <span>{weatherData ? `${weatherData.precipitation} mm` : '12.0 mm'} Rain</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
              <Wifi className="w-3 h-3" />
              {isConnected ? 'LIVE SYNC' : 'TELEMETRY ON'}
            </div>
          </div>
        </div>

        {/* Hero Headline & Quick Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div 
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase">
              <Compass className="w-4 h-4" />
              Hydrodynamic Prediction & Automated Fleet Logistics
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-on-surface leading-[1.08]">
              Autonomous Marine <br />
              <span className="text-primary text-glow">
                Debris Intelligence.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed pt-1">
              Physics-informed Monte Carlo particle drift, XGBoost coastal beaching risk, and real-time Hungarian-optimized autonomous skimmer dispatch for the Mumbai Coastline.
            </p>
          </motion.div>
          
          <motion.div 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end"
          >
            <button 
              onClick={handleReleaseDebris}
              disabled={isReleasing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-headline font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 hover:shadow-glow transition-all duration-300 disabled:opacity-50 group shadow-lg"
            >
              {isReleasing ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Injecting Particles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>Simulate Debris Drop</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <Link 
              to="/simulate" 
              className="w-full py-3.5 px-6 rounded-xl bg-surface-container-high/90 hover:bg-surface-bright text-on-surface font-headline font-semibold text-sm flex items-center justify-center gap-2.5 border border-outline-variant/40 hover:border-primary/40 transition-all duration-200"
            >
              <Activity className="w-4 h-4 text-primary" />
              <span>Launch 72h Digital Twin</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BENTO INSTRUMENTATION GRID */}
      <section className="px-4 sm:px-8 lg:px-12 py-6 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bento Card 1: Predicted Debris (Double Span on Desktop) */}
          <motion.div 
            custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant block">Forecast Model</span>
                    <span className="text-sm font-semibold text-on-surface">Predicted Coastal Accumulation</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium border border-primary/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12% 24h
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl sm:text-7xl font-headline font-bold tracking-tight text-on-surface text-glow">
                    {predictedDebris}
                  </span>
                  <span className="text-xl font-mono text-on-surface-variant">metric tons</span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono text-on-surface-variant">
                  <div className="flex justify-between gap-4">
                    <span>Versova Hotspot:</span>
                    <span className="text-primary font-bold">58%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Juhu Shoreline:</span>
                    <span className="text-secondary font-bold">29%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Bandra Estuary:</span>
                    <span className="text-on-surface font-bold">13%</span>
                  </div>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-surface-container-highest/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,242,254,0.5)]" 
                  style={{ width: `${Math.min(100, Math.max(20, (parseFloat(predictedDebris as string) || 12) * 5))}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: High Risk Zones */}
          <motion.div 
            custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl relative overflow-hidden group hover:border-error/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-mono uppercase tracking-wider font-semibold border border-error/20">
                CRITICAL
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Active Threat Zones</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-headline font-bold text-error tracking-tight text-glow-error">
                  {highRiskZones}
                </span>
                <span className="text-sm font-mono text-on-surface-variant">Sectors flagged</span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span>Primary Sector:</span>
              <span className="text-error font-semibold">Versova Creek</span>
            </div>
          </motion.div>

          {/* Bento Card 3: Cleanup Teams Active */}
          <motion.div 
            custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            onClick={() => setIsFleetOpen(true)}
            className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl relative overflow-hidden group hover:border-secondary/50 cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-mono uppercase tracking-wider font-semibold border border-secondary/20 flex items-center gap-1">
                <span>OPEN FLEET</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4">
              <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Active Response Fleet</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-headline font-bold text-secondary tracking-tight">
                  {data ? data.cleanup_teams_active : '12'}
                </span>
                <span className="text-sm font-mono text-on-surface-variant">Units Deployed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span>Autonomous Skimmers:</span>
              <span className="text-emerald-400 font-semibold">3 Active</span>
            </div>
          </motion.div>

          {/* Bento Card 4: Circular Recovery Potential (Full width on mobile/tablet) */}
          <motion.div 
            custom={5} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Circular Economy Feasibility</span>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Material Recovery & Upcycling Efficiency</h3>
                </div>
              </div>

              <div className="flex-1 max-w-xl flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-on-surface-variant">AI-Optimized Interception Rate</span>
                  <span className="text-emerald-400 font-bold text-base">{data ? data.recovery_potential : '78'}%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                  <div 
                    className="bg-gradient-to-r from-secondary to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    style={{ width: `${data ? data.recovery_potential : 78}%` }}
                  ></div>
                </div>
              </div>

              <Link 
                to="/circular-recovery"
                className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-xs font-mono font-semibold text-primary flex items-center justify-center gap-2 transition-colors self-start lg:self-center"
              >
                <span>View YOLO11 Vision Feeds</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* TACTICAL MAP & MARITIME TELEMETRY SECTION */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Viewport Container (Col 8) */}
          <motion.div 
            custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-8 relative min-h-[500px] lg:min-h-[650px] rounded-3xl overflow-hidden border border-outline-variant/40 shadow-2xl bg-surface-container-low flex flex-col"
          >
            {/* Interactive Leaflet Map */}
            <div className="absolute inset-0 z-0">
              <IntelligenceMap />
            </div>

            {/* Floating Map HUD Top Bar */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="text-xs font-mono text-on-surface font-semibold">RADAR 04 • LIVE MESH</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="px-3 py-1.5 rounded-xl bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 text-xs font-mono text-on-surface-variant">
                  Zoom: 12x • Auto-Track
                </span>
              </div>
            </div>

            {/* Floating Map HUD Bottom Controls */}
            <div className="relative z-10 mt-auto p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
              <div className="px-4 py-2.5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/50 shadow-xl pointer-events-auto">
                <span className="text-[11px] font-mono text-on-surface-variant block uppercase tracking-wider">Coordinates Target</span>
                <span className="text-xs font-mono text-primary font-bold">18.9750° N, 72.8258° E</span>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/50 shadow-xl flex items-center gap-4 pointer-events-auto">
                <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider hidden sm:inline">Layers:</span>
                {['Current', 'Wind', 'Tide', 'Debris'].map(layer => {
                  const isActive = activeLayers.includes(layer);
                  return (
                    <button
                      key={layer} 
                      onClick={() => toggleLayer(layer)}
                      className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                        isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                        isActive ? 'border-primary bg-primary/20' : 'border-outline'
                      }`}>
                        {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-xs"></div>}
                      </div>
                      <span>{layer}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Coastal Intelligence & Response Protocol (Col 4) */}
          <motion.div 
            custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl flex flex-col justify-between gap-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant font-semibold">Sensor Fusion Feed</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">99.4% Uptime</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface tracking-tight">
                Hydrodynamic Vectors & Environmental Risk
              </h2>

              {/* Sensor stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">Tidal State</span>
                  <span className="text-lg font-headline font-bold text-primary">Rising (+0.8m)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">Wind Vector</span>
                  <span className="text-lg font-headline font-bold text-on-surface">
                    {weatherData ? `${weatherData.wind_speed_10m} km/h` : '18 km/h SW'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">Current Velocity</span>
                  <span className="text-lg font-headline font-bold text-secondary">
                    {liveData?.marine ? `${liveData.marine.ocean_current_velocity} km/h` : '0.54 m/s'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">Confidence</span>
                  <span className="text-lg font-headline font-bold text-emerald-400">89.2%</span>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed">
                Hydrodynamic current convergence indicates elevated debris deposition across <strong className="text-on-surface">Versova Beach</strong> and <strong className="text-on-surface">Juhu Sector</strong> within the next 12-hour tidal window.
              </p>
            </div>

            {/* Protocol Alpha Button */}
            <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/30">
              <button 
                onClick={() => setIsAlphaOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-error/20 via-error/10 to-transparent hover:from-error/30 hover:to-error/20 text-error font-headline font-bold text-sm tracking-wider uppercase border border-error/40 shadow-glow-error flex items-center justify-center gap-2.5 transition-all duration-300 group"
              >
                <ShieldAlert className="w-5 h-5 text-error group-hover:scale-110 transition-transform" />
                <span>Execute Protocol Alpha Simulation</span>
              </button>
              <span className="text-[10px] font-mono text-center text-on-surface-variant">
                Simulate emergency skimmer diversion & containment barrier deployment
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* REAL-TIME TELEMETRY EVENT STREAM */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 max-w-[1600px] mx-auto w-full border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest mb-1">
              <Clock className="w-3.5 h-3.5" />
              Telemetry Event Log
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
              Live Coastal Activity Feed
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'alert', 'dispatch', 'info'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActivityFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                  activityFilter === filter
                    ? 'bg-primary text-on-primary font-bold shadow-glow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredActivity.length > 0 ? (
              filteredActivity.map((activity, index) => {
                const isAlert = activity.type.toLowerCase() === 'alert';
                const isDispatch = activity.type.toLowerCase() === 'dispatch';
                
                return (
                  <motion.div 
                    key={`${activity.time}-${activity.event}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedActivityId(`activity_${index}`);
                      setIsAnalysisOpen(true);
                    }}
                    className={`p-5 rounded-2xl bg-surface-container-low border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group ${
                      isAlert 
                        ? 'border-error/30 hover:border-error/60 bg-error/5' 
                        : isDispatch 
                        ? 'border-emerald-500/30 hover:border-emerald-500/60' 
                        : 'border-outline-variant/40 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-on-surface-variant font-medium">
                        {activity.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold ${
                        isAlert 
                          ? 'bg-error/20 text-error' 
                          : isDispatch 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {activity.type}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface font-medium leading-relaxed group-hover:text-primary transition-colors">
                      {activity.event}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant/30">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-primary" />
                        Inspect Vision
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs font-mono text-on-surface-variant">
                No events recorded matching this filter.
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </main>
  );
};

export default Overview;
