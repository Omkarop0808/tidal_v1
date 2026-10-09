import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Crosshair } from 'lucide-react';

const CENTER_POS: [number, number] = [19.06, 72.82];
const BASE_POS: [number, number] = [18.9100, 72.8250]; // Colaba Naval Dock

interface LiveMapProps {
  hotspots?: any[];
  selectedZoneIndex?: number;
  onSelectZone?: (index: number) => void;
  isFleetDispatched?: boolean;
}

const createHotspotIcon = (h: any, isSelected: boolean, index: number) => {
  const isCritical = h.severity?.toLowerCase() === 'critical' || (h.risk_percentage && h.risk_percentage > 75);
  const isCleaned = h.status === 'Cleaned';
  const label = h.zone_name?.split(' ')[0] || `ZONE ${String.fromCharCode(65 + index)}`;

  if (isCleaned) {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center cursor-pointer group" style="transform: translate(-12px, -12px);">
          <div class="w-6 h-6 bg-[#10b981] border-2 border-white flex items-center justify-center shadow-[0_0_12px_#10b981] ${isSelected ? 'ring-4 ring-white' : ''}">
            <svg class="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-2 px-2 py-0.5 bg-black/95 border border-[#10b981] text-[#10b981] font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
            ${label} • SECURED
          </div>
        </div>
      `,
      iconSize: [130, 24],
      iconAnchor: [12, 12],
    });
  }

  if (isCritical) {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center cursor-pointer group" style="transform: translate(-14px, -14px);">
          <span class="absolute -inset-1.5 w-10 h-10 bg-[#ff4d00] animate-ping opacity-60 rounded-full"></span>
          <div class="relative w-7 h-7 bg-[#ff4d00] border-2 border-white flex items-center justify-center shadow-[0_0_18px_#ff4d00] ${isSelected ? 'ring-4 ring-white' : ''}">
            <span class="w-2.5 h-2.5 bg-black"></span>
          </div>
          <div class="ml-2 px-2 py-0.5 bg-black/95 border-2 border-[#ff4d00] text-white font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-2xl flex items-center gap-1.5">
            <span class="text-[#ff4d00]">${label}</span>
            <span class="bg-[#ff4d00] text-black px-1 text-[8px] font-black">${h.risk_percentage || 94}% CRIT</span>
          </div>
        </div>
      `,
      iconSize: [160, 28],
      iconAnchor: [14, 14],
    });
  }

  // Moderate Watchlist
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center cursor-pointer group" style="transform: translate(-10px, -10px);">
        <div class="w-5 h-5 bg-[#00e5ff] border-2 border-white flex items-center justify-center shadow-[0_0_10px_#00e5ff] ${isSelected ? 'ring-4 ring-white' : ''}">
          <span class="w-1.5 h-1.5 bg-black"></span>
        </div>
        <div class="ml-2 px-2 py-0.5 bg-black/95 border border-[#00e5ff] text-[#00e5ff] font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
          ${label} • ${h.risk_percentage || 60}% WATCH
        </div>
      </div>
    `,
    iconSize: [140, 20],
    iconAnchor: [10, 10],
  });
};

export const LiveMap = ({ 
  hotspots = [], 
  selectedZoneIndex = 0, 
  onSelectZone, 
  isFleetDispatched = false 
}: LiveMapProps) => {

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden min-h-[560px]">
      
      {/* Map Overlay Header */}
      <div className="absolute top-0 left-0 w-full z-10 flex items-start justify-between p-4 sm:p-6 pointer-events-none">
        <div className="flex items-center gap-3 bg-black border-2 border-white text-white px-4 py-2 pointer-events-auto font-mono text-[10px] uppercase font-bold tracking-widest">
          <span className="w-2.5 h-2.5 bg-[#ff4d00] animate-ping"></span>
          <span>MUMBAI RADAR • SECTOR OPS</span>
        </div>
        
        <div className={`flex items-center gap-3 bg-black border-2 text-[10px] px-4 py-2 font-mono font-bold tracking-widest uppercase pointer-events-auto ${isFleetDispatched ? 'border-[#ff4d00] text-[#ff4d00]' : 'border-[#333333] text-white'}`}>
          {isFleetDispatched ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff4d00] animate-pulse"></span>
              SKIMMERS EN ROUTE
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Navigation className="w-3 h-3 text-[#ff4d00]" />
              FLEET ON STANDBY
            </span>
          )}
        </div>
      </div>

      {/* CartoDB Dark Matter Tactical Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={CENTER_POS} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#050505' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            className="cartodb-dark-tiles"
          />

          {/* Colaba Base Station */}
          <Marker 
            position={BASE_POS}
            icon={L.divIcon({
              className: 'custom-leaflet-marker',
              html: `
                <div class="relative flex items-center cursor-pointer" style="transform: translate(-10px, -10px);">
                  <div class="w-5 h-5 bg-white border-2 border-black flex items-center justify-center shadow-[0_0_12px_#ffffff]">
                    <span class="w-2 h-2 bg-black"></span>
                  </div>
                  <div class="ml-2 px-2 py-0.5 bg-black border border-white text-white font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
                    BASE HQ (COLABA)
                  </div>
                </div>
              `,
              iconSize: [150, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="p-3 bg-black text-white font-mono text-xs uppercase border-2 border-white">
                <div className="font-bold text-white mb-1">COLABA NAVAL DOCK</div>
                <div className="text-[#a3a3a3] text-[10px]">Headquarters for 3 Autonomous Interception Skimmers.</div>
              </div>
            </Popup>
          </Marker>

          {/* Transit Vectors */}
          {hotspots.slice(0, 4).map((h, idx) => {
            const isSelected = selectedZoneIndex === idx;
            return (
              <Polyline 
                key={`vector-${idx}`}
                positions={[BASE_POS, [h.lat, h.lon]]} 
                pathOptions={{ 
                  color: isSelected ? '#ff4d00' : isFleetDispatched ? '#ffffff' : '#333333', 
                  dashArray: isSelected ? '4, 4' : '6, 8', 
                  weight: isSelected ? 3 : isFleetDispatched ? 2 : 1,
                  opacity: isSelected ? 1 : 0.6
                }} 
              />
            );
          })}

          {/* Hotspot Markers */}
          {hotspots.map((h, idx) => {
            const isSelected = selectedZoneIndex === idx;
            const icon = createHotspotIcon(h, isSelected, idx);

            return (
              <Marker 
                key={`hotspot-${idx}`} 
                position={[h.lat, h.lon]} 
                icon={icon}
                eventHandlers={{
                  click: () => {
                    if (onSelectZone) onSelectZone(idx);
                  }
                }}
              >
                <Popup>
                  <div className="p-4 bg-[#050505] text-white font-mono text-xs uppercase min-w-[220px]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#333333] mb-3">
                      <div className="font-headline font-black text-sm text-white tracking-tight">
                        {h.zone_name}
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#222222] text-[#ff4d00] font-bold">
                        {h.sector}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
                      <div className="bg-[#111111] p-2 border border-[#222222]">
                        <span className="text-[#737373] block mb-0.5">BEACHING RISK</span>
                        <span className="font-bold text-sm text-[#ff4d00]">
                          {h.risk_percentage}%
                        </span>
                      </div>

                      <div className="bg-[#111111] p-2 border border-[#222222]">
                        <span className="text-[#737373] block mb-0.5">EST. ACCUMULATION</span>
                        <span className="font-bold text-sm text-white">
                          {h.estimated_debris_kg} KG
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] text-[#a3a3a3] mb-3 leading-relaxed border-l-2 border-[#ff4d00] pl-2">
                      PRIMARY DRIVER: <strong className="text-white">{h.top_driver || 'WIND SURGE'}</strong><br />
                      PEAK ARRIVAL: <strong className="text-white">T+{h.peak_arrival_hours || 12}H</strong>
                    </div>

                    <button 
                      onClick={() => {
                        if (onSelectZone) onSelectZone(idx);
                      }}
                      className="w-full py-2 bg-[#ff4d00] hover:bg-white text-black font-headline font-black text-[10px] uppercase tracking-widest transition-none"
                    >
                      FOCUS RANKING ITEM #{idx + 1}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* On-Map Tactical Legend Box */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/95 border-2 border-[#333333] p-3 text-white font-mono text-[9px] uppercase font-bold tracking-widest shadow-2xl flex flex-col gap-1.5 pointer-events-auto max-w-[240px]">
        <div className="flex items-center gap-2 pb-1 border-b border-[#333333] text-[#a3a3a3]">
          <Crosshair className="w-3 h-3 text-[#ff4d00]" />
          <span>TACTICAL RADAR TARGETS</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ff4d00] border border-white"></span>
          <span className="text-[#ff4d00]">CRITICAL (&gt;75% PROBABILITY)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00e5ff] border border-white"></span>
          <span className="text-[#00e5ff]">MONITORED WATCH (30-75%)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#10b981] border border-white"></span>
          <span className="text-[#10b981]">SECURED / CLEANED</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
