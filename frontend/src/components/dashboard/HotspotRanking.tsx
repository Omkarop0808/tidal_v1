import { useEffect, useState } from 'react';
import axios from 'axios';
import { ListOrdered, CheckCircle2 } from 'lucide-react';

export interface Hotspot {
  zone_name: string;
  sector: string;
  lat: number;
  lon: number;
  risk_percentage: number;
  estimated_debris_kg: number;
  peak_arrival_hours: number;
  severity: string;
}

export const MOCK_HOTSPOTS: Hotspot[] = [
  { zone_name: 'Versova Creek Outfall', sector: 'North-West', lat: 19.1350, lon: 72.8140, risk_percentage: 94, estimated_debris_kg: 520, peak_arrival_hours: 6, severity: 'Critical' },
  { zone_name: 'Juhu Beach Shoreline', sector: 'North-West', lat: 19.0970, lon: 72.8258, risk_percentage: 82, estimated_debris_kg: 380, peak_arrival_hours: 12, severity: 'High' },
  { zone_name: 'Aksa Beach & Dana Pani', sector: 'North-West', lat: 19.1750, lon: 72.7920, risk_percentage: 76, estimated_debris_kg: 290, peak_arrival_hours: 14, severity: 'High' },
  { zone_name: 'Mahim Bay & Mithi River', sector: 'Central', lat: 19.0350, lon: 72.8350, risk_percentage: 88, estimated_debris_kg: 650, peak_arrival_hours: 8, severity: 'Critical' },
  { zone_name: 'Bandra Channel & Carter', sector: 'Central', lat: 19.0550, lon: 72.8180, risk_percentage: 61, estimated_debris_kg: 310, peak_arrival_hours: 18, severity: 'Moderate' },
  { zone_name: 'Worli Sea Face Basin', sector: 'South', lat: 19.0120, lon: 72.8150, risk_percentage: 54, estimated_debris_kg: 230, peak_arrival_hours: 20, severity: 'Moderate' },
  { zone_name: 'Girgaon Marine Drive Bay', sector: 'South', lat: 18.9550, lon: 72.8120, risk_percentage: 42, estimated_debris_kg: 190, peak_arrival_hours: 24, severity: 'Moderate' },
];

interface HotspotRankingProps {
  selectedZoneIndex?: number;
  onSelectZone?: (index: number) => void;
  isFleetDispatched?: boolean;
}

export const HotspotRanking = ({ 
  selectedZoneIndex = 0, 
  onSelectZone, 
  isFleetDispatched = false 
}: HotspotRankingProps) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(MOCK_HOTSPOTS);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/hotspots/spatial');
        if (response.data && response.data.length > 0) {
          setHotspots(response.data);
        }
      } catch (error) {
        setHotspots(MOCK_HOTSPOTS);
      }
    };
    fetchHotspots();
    const interval = setInterval(fetchHotspots, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:col-span-4 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xl">
      <div className="flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface">Hotspot Spatial Matrix</h3>
              <span className="text-[10px] font-mono text-on-surface-variant uppercase">Full Mumbai Coastline</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-mono text-xs font-bold border border-outline-variant/30">
            {hotspots.length} SECTORS
          </span>
        </div>
        
        {/* Hotspots List */}
        <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {hotspots.map((hotspot, index) => {
            const isCritical = hotspot.severity.toLowerCase() === 'critical';
            const isHigh = hotspot.severity.toLowerCase() === 'high';
            const isSelected = selectedZoneIndex === index;

            return (
              <div 
                key={index} 
                onClick={() => onSelectZone?.(index)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                  isSelected 
                    ? isCritical 
                      ? 'bg-error/10 border-error shadow-glow-error' 
                      : 'bg-primary/10 border-primary shadow-glow-sm'
                    : isCritical
                    ? 'bg-surface-container/70 border-error/30 hover:border-error/60'
                    : isHigh
                    ? 'bg-surface-container/70 border-warning/30 hover:border-warning/60'
                    : 'bg-surface-container/70 border-outline-variant/30 hover:border-primary/40'
                }`}
              >
                {/* Zone Name & Severity Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isFleetDispatched 
                        ? 'bg-emerald-400 animate-pulse' 
                        : isCritical 
                        ? 'bg-error animate-ping' 
                        : isHigh 
                        ? 'bg-warning' 
                        : 'bg-secondary'
                    }`}></span>
                    <span className="font-headline font-semibold text-xs text-on-surface">
                      Zone {String.fromCharCode(65 + index)}: {hotspot.zone_name}
                    </span>
                  </div>

                  {isFleetDispatched ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      INTERCEPTING
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                      isCritical 
                        ? 'bg-error/20 text-error border border-error/30' 
                        : isHigh 
                        ? 'bg-warning/20 text-warning border border-warning/30' 
                        : 'bg-secondary/20 text-secondary border border-secondary/30'
                    }`}>
                      {hotspot.severity}
                    </span>
                  )}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-mono text-on-surface-variant">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant/70 uppercase">Risk Tier</span>
                    <span className={`font-bold ${isCritical ? 'text-error' : isHigh ? 'text-warning' : 'text-secondary'}`}>
                      {isFleetDispatched ? Math.round(hotspot.risk_percentage * 0.35) : hotspot.risk_percentage}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant/70 uppercase">Est. Debris</span>
                    <span className="text-on-surface font-semibold">{hotspot.estimated_debris_kg} kg</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant/70 uppercase">Peak Arrival</span>
                    <span className="text-primary font-semibold">T+{hotspot.peak_arrival_hours}h</span>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="w-full bg-surface-container-highest/80 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      isFleetDispatched ? 'bg-emerald-400' : isCritical ? 'bg-error' : isHigh ? 'bg-warning' : 'bg-secondary'
                    }`} 
                    style={{ width: `${isFleetDispatched ? hotspot.risk_percentage * 0.35 : hotspot.risk_percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>Selected Sector:</span>
        <span className="text-primary font-semibold">
          {hotspots[selectedZoneIndex]?.zone_name || 'Versova Outfall'}
        </span>
      </div>
    </div>
  );
};

export default HotspotRanking;
