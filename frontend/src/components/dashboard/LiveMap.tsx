import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Radio, Square } from 'lucide-react';

const CENTER_POS: [number, number] = [19.0760, 72.8258];

const ZONE_POSITIONS: Array<{ name: string; sector: string; pos: [number, number]; color: string; fillColor: string }> = [
  { name: 'ZONE A: VERSOVA OUTFALL', sector: 'NORTH-WEST', pos: [19.1350, 72.8140], color: '#ffffff', fillColor: '#333333' },
  { name: 'ZONE B: JUHU SHORELINE', sector: 'NORTH-WEST', pos: [19.0970, 72.8258], color: '#ff4d00', fillColor: '#333333' },
  { name: 'ZONE C: AKSA BEACH', sector: 'NORTH-WEST', pos: [19.1750, 72.7920], color: '#a3a3a3', fillColor: '#111111' },
  { name: 'ZONE D: MAHIM BAY', sector: 'CENTRAL', pos: [19.0350, 72.8350], color: '#ffffff', fillColor: '#333333' },
  { name: 'ZONE E: BANDRA CHANNEL', sector: 'CENTRAL', pos: [19.0550, 72.8180], color: '#ff4d00', fillColor: '#333333' },
  { name: 'ZONE F: WORLI BASIN', sector: 'SOUTH', pos: [19.0120, 72.8150], color: '#a3a3a3', fillColor: '#111111' },
  { name: 'ZONE G: GIRGAON BAY', sector: 'SOUTH', pos: [18.9550, 72.8120], color: '#525252', fillColor: '#000000' },
];

const BASE_POS: [number, number] = [18.9100, 72.8250];

interface LiveMapProps {
  hotspots?: any[];
  selectedZoneIndex?: number;
  isFleetDispatched?: boolean;
}

export const LiveMap = ({ hotspots = [], selectedZoneIndex = 0, isFleetDispatched = false }: LiveMapProps) => {
  const zonePositions = hotspots.length > 0 ? hotspots.map((h, i) => {
    const isCritical = h.severity?.toLowerCase() === 'critical';
    const isCleaned = h.status === 'Cleaned';
    return {
      name: `ZONE ${String.fromCharCode(65 + i)}: ${h.zone_name || h.name}`,
      sector: h.sector || 'UNKNOWN',
      pos: [h.lat, h.lon] as [number, number],
      color: isCleaned ? '#525252' : isCritical ? '#ffffff' : '#a3a3a3',
      fillColor: isCleaned ? '#000000' : isCritical ? '#333333' : '#111111'
    };
  }) : ZONE_POSITIONS;

  return (
    <div className="flex flex-col h-full bg-[#000000] relative overflow-hidden min-h-[500px]">
      
      {/* Map Overlay Header */}
      <div className="absolute top-0 left-0 w-full z-10 flex items-start justify-between p-6 pointer-events-none">
        <div className="flex items-center gap-3 bg-black border border-white text-white px-4 py-2 pointer-events-auto font-mono text-[10px] uppercase font-bold tracking-widest">
          <span className="w-2 h-2 bg-[#ff4d00] animate-ping"></span>
          <span>MUMBAI RADAR</span>
        </div>
        
        <div className={`flex items-center gap-3 bg-black border text-[10px] px-4 py-2 font-mono font-bold tracking-widest uppercase pointer-events-auto ${isFleetDispatched ? 'border-white text-white' : 'border-[#333333] text-[#a3a3a3]'}`}>
          {isFleetDispatched ? (
            <span className="flex items-center gap-2">
              <Square className="w-3 h-3 fill-white" />
              FLEET ACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Navigation className="w-3 h-3" />
              PATROL STANDBY
            </span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 z-0 opacity-90 mix-blend-screen filter grayscale">
        <MapContainer 
          center={CENTER_POS} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#000000' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            className="map-tiles"
          />
          
          {zonePositions.map((z, idx) => {
            const isSelected = selectedZoneIndex === idx;
            const radius = isSelected ? 12 : 8;

            return (
              <CircleMarker 
                key={idx} 
                center={z.pos} 
                pathOptions={{ 
                  color: isSelected ? '#ff4d00' : z.color, 
                  fillColor: isSelected ? '#ff4d00' : z.fillColor, 
                  fillOpacity: isSelected ? 1 : 0.4,
                  weight: isSelected ? 4 : 2 
                }} 
                radius={radius}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="brutalist-tooltip bg-black border-2 border-white text-white p-2 rounded-none shadow-none font-mono text-[10px] uppercase font-bold tracking-widest">
                  <div className="flex flex-col gap-1">
                    <span style={{ color: isSelected ? '#ff4d00' : 'white' }}>{z.name}</span>
                    <span className="text-[#a3a3a3]">SEC: {z.sector}</span>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          <CircleMarker center={BASE_POS} pathOptions={{ color: '#ffffff', fillColor: '#ffffff', fillOpacity: 1, weight: 2 }} radius={6}>
            <Tooltip direction="bottom" offset={[0, 10]} opacity={1} className="brutalist-tooltip bg-white text-black border-none p-2 rounded-none font-mono text-[10px] uppercase font-bold tracking-widest">
              BASE HQ COLABA
            </Tooltip>
          </CircleMarker>

          {zonePositions.slice(0, 4).map((z, idx) => (
            <Polyline 
              key={idx}
              positions={[BASE_POS, z.pos]} 
              pathOptions={{ 
                color: isFleetDispatched ? '#ffffff' : '#333333', 
                dashArray: isFleetDispatched ? '0' : '4, 8', 
                weight: isFleetDispatched ? 2 : 1,
                opacity: 1
              }} 
            />
          ))}
        </MapContainer>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-10 flex flex-wrap items-center justify-between gap-4 p-6 pointer-events-none">
        <div className="flex gap-4 bg-black border border-[#333333] px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest pointer-events-auto">
          <div className="flex items-center gap-2"><Square className="w-2 h-2 fill-white text-white"/> <span className="text-white">NW</span></div>
          <div className="flex items-center gap-2"><Square className="w-2 h-2 fill-[#ff4d00] text-[#ff4d00]"/> <span className="text-white">CEN</span></div>
          <div className="flex items-center gap-2"><Square className="w-2 h-2 fill-[#525252] text-[#525252]"/> <span className="text-white">SOU</span></div>
        </div>
        <span className="bg-white text-black px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest pointer-events-auto flex items-center gap-2">
          <Radio className="w-3 h-3 animate-pulse" />
          {isFleetDispatched ? 'TX: ACTIVE' : 'TX: 7 ZONES ONLINE'}
        </span>
      </div>
    </div>
  );
};

export default LiveMap;
