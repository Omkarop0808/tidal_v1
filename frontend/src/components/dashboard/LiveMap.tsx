import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Anchor, Radio } from 'lucide-react';

// Mumbai Central Coordinates
const CENTER_POS: [number, number] = [19.0760, 72.8258];

const ZONE_POSITIONS: Array<{ name: string; sector: string; pos: [number, number]; color: string; fillColor: string }> = [
  { name: 'Zone A: Versova Creek Outfall', sector: 'North-West', pos: [19.1350, 72.8140], color: '#ff3366', fillColor: '#881337' },
  { name: 'Zone B: Juhu Beach Shoreline', sector: 'North-West', pos: [19.0970, 72.8258], color: '#00f2fe', fillColor: '#0369a1' },
  { name: 'Zone C: Aksa Beach & Dana Pani', sector: 'North-West', pos: [19.1750, 72.7920], color: '#38bdf8', fillColor: '#0c4a6e' },
  { name: 'Zone D: Mahim Bay & Mithi River', sector: 'Central', pos: [19.0350, 72.8350], color: '#ff3366', fillColor: '#881337' },
  { name: 'Zone E: Bandra Channel & Carter', sector: 'Central', pos: [19.0550, 72.8180], color: '#00f2fe', fillColor: '#0369a1' },
  { name: 'Zone F: Worli Sea Face Basin', sector: 'South', pos: [19.0120, 72.8150], color: '#38bdf8', fillColor: '#0c4a6e' },
  { name: 'Zone G: Girgaon Marine Drive Bay', sector: 'South', pos: [18.9550, 72.8120], color: '#f59e0b', fillColor: '#78350f' },
];

const BASE_POS: [number, number] = [18.9100, 72.8250]; // Colaba Naval Fleet Port HQ

interface LiveMapProps {
  selectedZoneIndex?: number;
  isFleetDispatched?: boolean;
}

export const LiveMap = ({ selectedZoneIndex = 0, isFleetDispatched = false }: LiveMapProps) => {
  return (
    <div className="lg:col-span-5 rounded-3xl bg-surface-container-low border border-outline-variant/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col relative overflow-hidden min-h-[480px] lg:min-h-full shadow-2xl">
      
      {/* Map Overlay Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 pointer-events-none">
        <div className="flex items-center gap-2 bg-surface-container-low/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-outline-variant/50 shadow-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-mono text-xs font-bold text-on-surface">GREATER MUMBAI RADAR</span>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container-low/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/50 font-mono text-xs text-primary shadow-md pointer-events-auto">
          {isFleetDispatched ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Fleet Active Across 7 Sectors
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Patrol Vectors Standby</span>
            </span>
          )}
        </div>
      </div>

      {/* Leaflet Tactical Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={CENTER_POS} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#050b10' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-map-tiles"
          />
          
          {/* Coastal Risk Zones */}
          {ZONE_POSITIONS.map((z, idx) => {
            const isSelected = selectedZoneIndex === idx;
            const radius = isSelected ? 16 : 10;

            return (
              <CircleMarker 
                key={idx} 
                center={z.pos} 
                pathOptions={{ 
                  color: isSelected ? '#ffffff' : z.color, 
                  fillColor: z.fillColor, 
                  fillOpacity: isSelected ? 0.85 : 0.55,
                  weight: isSelected ? 3 : 1.5 
                }} 
                radius={radius}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip primary-tooltip">
                  <div className="p-1 font-sans">
                    <div className="flex items-center gap-1.5 font-headline font-bold text-xs mb-0.5" style={{ color: z.color }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: z.color }}></span>
                      {z.name}
                    </div>
                    <div className="text-[10px] font-mono text-on-surface">
                      Sector: {z.sector} • {isFleetDispatched ? 'Interception In Progress' : 'Debris Accumulating'}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          {/* Operations Base Port HQ (Colaba) */}
          <CircleMarker center={BASE_POS} pathOptions={{ color: '#00e5ff', fillColor: '#031d28', fillOpacity: 1, weight: 2 }} radius={6}>
            <Tooltip direction="bottom" offset={[0, 10]} opacity={1} className="custom-tooltip">
              <div className="p-1 font-sans text-xs font-mono text-on-surface font-semibold flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-primary" />
                <span>Naval Port HQ: Colaba Base</span>
              </div>
            </Tooltip>
          </CircleMarker>

          {/* Intercept Trajectory Vectors from Base to Zones */}
          {ZONE_POSITIONS.slice(0, 4).map((z, idx) => (
            <Polyline 
              key={idx}
              positions={[BASE_POS, z.pos]} 
              pathOptions={{ 
                color: isFleetDispatched ? '#00e5ff' : z.color, 
                dashArray: isFleetDispatched ? '8, 8' : '4, 8', 
                weight: isFleetDispatched ? 3.5 : 1.8,
                opacity: 0.85
              }} 
            />
          ))}
        </MapContainer>
      </div>

      {/* Map Footer Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-outline-variant/50 mt-auto shadow-lg pointer-events-auto">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
            <span className="text-on-surface-variant">North-West</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-on-surface-variant">Central</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="text-on-surface-variant">South</span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-primary font-semibold flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          {isFleetDispatched ? 'Telemetry Vector Transmission Active' : '7 Coastal Zones Online'}
        </span>
      </div>
    </div>
  );
};

export default LiveMap;
