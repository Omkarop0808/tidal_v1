import { ListOrdered, CheckCircle2, Square } from 'lucide-react';

export interface Hotspot {
  zone_name: string;
  sector: string;
  lat: number;
  lon: number;
  risk_percentage: number;
  estimated_debris_kg: number;
  peak_arrival_hours: number;
  severity: string;
  top_driver?: string;
  shap_values?: any;
}

export const MOCK_HOTSPOTS: Hotspot[] = [
  { zone_name: 'Versova Creek Outfall', sector: 'North-West', lat: 19.1350, lon: 72.8140, risk_percentage: 94, estimated_debris_kg: 520, peak_arrival_hours: 6, severity: 'Critical', top_driver: 'Wind Vector (+42.1)' },
  { zone_name: 'Juhu Beach Shoreline', sector: 'North-West', lat: 19.0970, lon: 72.8258, risk_percentage: 82, estimated_debris_kg: 380, peak_arrival_hours: 12, severity: 'High', top_driver: 'Tidal Surge (+28.4)' },
  { zone_name: 'Aksa Beach & Dana Pani', sector: 'North-West', lat: 19.1750, lon: 72.7920, risk_percentage: 76, estimated_debris_kg: 290, peak_arrival_hours: 14, severity: 'High', top_driver: 'Current Vel (+21.0)' },
  { zone_name: 'Mahim Bay & Mithi River', sector: 'Central', lat: 19.0350, lon: 72.8350, risk_percentage: 88, estimated_debris_kg: 650, peak_arrival_hours: 8, severity: 'Critical', top_driver: 'River Outflow (+55.2)' },
  { zone_name: 'Bandra Channel & Carter', sector: 'Central', lat: 19.0550, lon: 72.8180, risk_percentage: 61, estimated_debris_kg: 310, peak_arrival_hours: 18, severity: 'Moderate', top_driver: 'Wind Vector (+12.1)' },
  { zone_name: 'Worli Sea Face Basin', sector: 'South', lat: 19.0120, lon: 72.8150, risk_percentage: 54, estimated_debris_kg: 230, peak_arrival_hours: 20, severity: 'Moderate', top_driver: 'Tidal Surge (+8.4)' },
  { zone_name: 'Girgaon Marine Drive Bay', sector: 'South', lat: 18.9550, lon: 72.8120, risk_percentage: 42, estimated_debris_kg: 190, peak_arrival_hours: 24, severity: 'Moderate', top_driver: 'Current Vel (+5.2)' },
];

interface HotspotRankingProps {
  hotspots?: Hotspot[];
  selectedZoneIndex?: number;
  onSelectZone?: (index: number) => void;
  isFleetDispatched?: boolean;
}

export const HotspotRanking = ({ 
  hotspots = MOCK_HOTSPOTS,
  selectedZoneIndex = 0, 
  onSelectZone, 
  isFleetDispatched = false 
}: HotspotRankingProps) => {

  return (
    <div className="flex flex-col h-full bg-[#050505] min-h-[500px]">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2 border-[#333333] bg-[#111111]">
        <div className="flex items-center gap-4">
          <ListOrdered className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <h3 className="font-headline font-black text-sm uppercase text-white tracking-widest">Hotspot Matrix</h3>
            <span className="text-[10px] font-mono text-[#a3a3a3] uppercase font-bold tracking-widest">Mumbai Coastline</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest">
          {hotspots.length} SECTORS
        </span>
      </div>
      
      {/* Hotspots List */}
      <div className="flex flex-col overflow-y-auto max-h-[550px]">
        {hotspots.map((hotspot, index) => {
          const isCritical = hotspot.severity.toLowerCase() === 'critical';
          const isSelected = selectedZoneIndex === index;

          return (
            <div 
              key={index} 
              onClick={() => onSelectZone?.(index)}
              className={`p-5 cursor-pointer flex flex-col gap-4 border-b border-[#222222] transition-none group ${
                isSelected ? 'bg-[#111111] border-l-4 border-l-[#ff4d00]' : 'bg-[#000000] border-l-4 border-l-transparent hover:bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Square className={`w-3 h-3 ${isSelected ? 'fill-[#ff4d00] text-[#ff4d00]' : isCritical ? 'fill-white text-white' : 'text-[#525252]'}`} />
                  <span className={`font-headline font-black uppercase text-sm ${isSelected ? 'text-[#ff4d00]' : 'text-white'}`}>
                    ZONE {String.fromCharCode(65 + index)}: {hotspot.zone_name}
                  </span>
                </div>
                {isFleetDispatched ? (
                  <span className="px-2 py-1 bg-white text-black text-[9px] font-mono uppercase font-bold tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    INTERCEPTING
                  </span>
                ) : (
                  <span className={`px-2 py-1 border text-[9px] font-mono uppercase font-bold tracking-widest ${
                    isCritical ? 'border-white text-white' : 'border-[#525252] text-[#a3a3a3]'
                  }`}>
                    {hotspot.severity}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase font-bold tracking-widest text-[#a3a3a3]">
                <div className="flex flex-col gap-1">
                  <span className="text-[#525252]">RISK</span>
                  <span className={`text-sm ${isCritical ? 'text-white' : 'text-[#a3a3a3]'}`}>
                    {isFleetDispatched ? Math.round(hotspot.risk_percentage * 0.35) : hotspot.risk_percentage}%
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#525252]">DEBRIS</span>
                  <span className="text-white text-sm">{hotspot.estimated_debris_kg} KG</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#525252]">DRIVER</span>
                  <span className="text-[#ff4d00] text-[9px] leading-tight mt-0.5">{hotspot.top_driver || 'WIND SURGE'}</span>
                </div>
              </div>
              
              {isSelected && (
                <div className="w-full h-1 bg-[#333333] mt-2 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full ${isFleetDispatched ? 'bg-white' : isCritical ? 'bg-[#ff4d00]' : 'bg-[#a3a3a3]'}`} 
                    style={{ width: `${isFleetDispatched ? hotspot.risk_percentage * 0.35 : hotspot.risk_percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[#111111] border-t-2 border-[#333333] flex items-center justify-between text-[10px] font-mono uppercase font-bold tracking-widest mt-auto">
        <span className="text-[#a3a3a3]">SELECTED:</span>
        <span className="text-white">
          {hotspots[selectedZoneIndex]?.zone_name || 'VERSOVA OUTFALL'}
        </span>
      </div>
    </div>
  );
};

export default HotspotRanking;
