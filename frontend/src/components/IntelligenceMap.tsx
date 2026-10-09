import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../lib/api';
import { Radio } from 'lucide-react';

interface IntelligenceMapProps {
  onSelectBeach?: (beach: any) => void;
  selectedBeachId?: string;
}

const NAVAL_BASE_COORDS: [number, number] = [18.9067, 72.8147]; // Colaba Naval Dock

// Clean, high-precision tactical radar beacon generator
const createTacticalMarkerIcon = (beach: any, isSelected: boolean) => {
  const isCritical = beach.baseline_risk >= 70 || beach.status === 'High Risk';
  const isCleaned = beach.status === 'Cleaned' || (beach.remaining_debris_kg !== undefined && beach.remaining_debris_kg <= 20);
  const risk = Math.round(beach.baseline_risk || 60);
  const name = (beach.name || 'ZONE').split(' ')[0].toUpperCase();

  // Color scheme
  const themeColor = isCleaned ? '#10b981' : isCritical ? '#ff4d00' : '#00e5ff';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
        
        <!-- Subtle 1px Sonar Pulse (No excessive blur or dirty glow) -->
        ${isCritical ? `
          <span class="absolute inset-1 rounded-full border border-[#ff4d00] animate-ping opacity-60 pointer-events-none" style="animation-duration: 2.2s;"></span>
        ` : ''}

        <!-- Active Target Lock Reticle (when selected) -->
        ${isSelected ? `
          <div class="absolute inset-0 border border-white/60 pointer-events-none animate-pulse">
            <span class="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-[#ff4d00]"></span>
            <span class="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-[#ff4d00]"></span>
            <span class="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-[#ff4d00]"></span>
            <span class="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-[#ff4d00]"></span>
          </div>
        ` : ''}

        <!-- Tactical Core Beacon (Crisp 14px with 1.5px white border) -->
        <div class="relative w-3.5 h-3.5 flex items-center justify-center transition-transform duration-150 group-hover:scale-125 shadow-md"
             style="background-color: ${themeColor}; border: 1.5px solid #ffffff;">
          ${isCleaned ? `
            <svg class="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ` : `
            <span class="w-1 h-1 bg-black rounded-full"></span>
          `}
        </div>

        <!-- Clean Interactive Hover / Selected Tactical Pill -->
        <div class="absolute left-full ml-2 px-2 py-0.5 bg-black/95 border border-[${themeColor}] text-white font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-2xl pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 ${
          isSelected 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
        }">
          <span style="color: ${themeColor}">${name}</span>
          <span class="px-1 py-0.2 text-[8px] font-mono text-black font-extrabold" style="background-color: ${themeColor}">
            ${isCleaned ? 'OK' : `${risk}%`}
          </span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const IntelligenceMap = ({ onSelectBeach, selectedBeachId }: IntelligenceMapProps) => {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [trajectories, setTrajectories] = useState<Record<string, [number, number][]>>({});

  const fetchBeaches = async () => {
    try {
      const data = await api.getBeaches();
      setBeaches(data);
      
      // Fetch predictive drift for high-risk zones
      const driftPromises = data
        .filter((b: any) => b.baseline_risk >= 70 || b.status === 'High Risk')
        .map(async (b: any) => {
          try {
            const res = await api.getDriftTrajectory(b.lat, b.lon);
            const path: [number, number][] = res.trajectory.map((frame: any) => [frame.lat, frame.lon]);
            return { id: b.id, path };
          } catch (err) {
            return null;
          }
        });
        
      const results = await Promise.all(driftPromises);
      const trajMap: Record<string, [number, number][]> = {};
      results.forEach(res => {
        if (res && res.path.length > 0) {
          trajMap[res.id] = res.path;
        }
      });
      setTrajectories(trajMap);
    } catch (e) {
      console.error('Failed to fetch beaches for map:', e);
    }
  };

  useEffect(() => {
    fetchBeaches();
    window.addEventListener('CleanupCompletedEvent', fetchBeaches);
    return () => {
      window.removeEventListener('CleanupCompletedEvent', fetchBeaches);
    };
  }, []);

  return (
    <div className="w-full h-full relative z-0 bg-[#050505] overflow-hidden">
      <MapContainer 
        center={[19.04, 72.82]} 
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#050505' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Esri World Dark Gray Base Tiles - 100% Free, Zero Watermark, Dark Maritime Obsidian Theme */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          minZoom={7}
          attribution="&copy; Esri &copy; DeLorme"
        />

        {/* Esri Subtle Reference Labels Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          minZoom={7}
          opacity={0.65}
        />

        {/* Tactical Fleet Patrol Lines from Colaba Base to Critical Sectors */}
        {beaches
          .filter(b => b.baseline_risk >= 70 || b.status === 'High Risk')
          .slice(0, 3)
          .map((b, idx) => (
            <Polyline 
              key={`line-${b.id || idx}`}
              positions={[NAVAL_BASE_COORDS, [b.lat, b.lon]]}
              pathOptions={{
                color: '#ff4d00',
                weight: 2,
                opacity: 0.8,
                dashArray: '5, 8',
              }}
            />
          ))}

        {/* Predictive Drift Vector Paths */}
        {Object.entries(trajectories).map(([id, path]) => (
          <Polyline 
            key={`drift-${id}`}
            positions={path}
            pathOptions={{
              color: '#00e5ff',
              weight: 3,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Base Port Marker */}
        <Marker 
          position={NAVAL_BASE_COORDS} 
          icon={L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer group" style="width: 28px; height: 28px;">
                <div class="w-3.5 h-3.5 bg-white border border-black flex items-center justify-center transition-transform duration-150 group-hover:scale-125 shadow-md">
                  <span class="w-1.5 h-1.5 bg-[#ff4d00]"></span>
                </div>
                <div class="absolute left-full ml-2 px-2 py-0.5 bg-black/95 border border-white text-white font-mono text-[8px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl">
                  COLABA FLEET HQ
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <span className="font-mono text-xs uppercase font-bold">Colaba Fleet Deployment HQ</span>
          </Tooltip>
        </Marker>
        
        {/* Coastal Hotspot Beacons */}
        {beaches.map((b, idx) => {
          const isSelected = selectedBeachId === b.id;
          const icon = createTacticalMarkerIcon(b, isSelected);
          
          return (
            <Marker 
              key={b.id || idx} 
              position={[b.lat, b.lon]} 
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectBeach) {
                    onSelectBeach(b);
                  }
                }
              }}
            >
              <Popup>
                <div className="p-4 bg-[#050505] text-white font-mono text-xs uppercase min-w-[230px]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#333333] mb-3">
                    <div className="font-headline font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                      <span className={`w-2 h-2 ${b.baseline_risk >= 70 ? 'bg-[#ff4d00]' : b.status === 'Cleaned' ? 'bg-[#10b981]' : 'bg-[#00e5ff]'}`}></span>
                      {b.name}
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#222222] text-[#a3a3a3] font-bold">
                      {b.sector}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
                    <div className="bg-[#111111] p-2 border border-[#222222]">
                      <span className="text-[#737373] block mb-0.5">BEACHING RISK</span>
                      <span className={`font-bold text-sm ${b.baseline_risk >= 70 ? 'text-[#ff4d00]' : 'text-white'}`}>
                        {b.baseline_risk}%
                      </span>
                    </div>

                    <div className="bg-[#111111] p-2 border border-[#222222]">
                      <span className="text-[#737373] block mb-0.5">DEBRIS LOAD</span>
                      <span className="font-bold text-sm text-white">
                        {b.remaining_debris_kg || b.current_debris_kg || 0} KG
                      </span>
                    </div>
                  </div>

                  <div className="text-[9px] text-[#a3a3a3] mb-3 border-l-2 border-[#ff4d00] pl-2 leading-relaxed">
                    STATUS: <strong className="text-white">{b.status}</strong><br />
                    COORDS: {b.lat.toFixed(4)}°N, {b.lon.toFixed(4)}°E
                  </div>

                  <button 
                    onClick={() => {
                      if (onSelectBeach) onSelectBeach(b);
                    }}
                    className="w-full py-2 bg-[#ff4d00] hover:bg-white text-black font-headline font-black text-[10px] uppercase tracking-widest transition-none"
                  >
                    LOCK ON TARGET HUD
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* On-Map Tactical Legend Box */}
      <div className="absolute top-4 right-4 z-[500] bg-black/95 border-2 border-[#333333] p-3 text-white font-mono text-[9px] uppercase font-bold tracking-widest shadow-2xl flex flex-col gap-2 pointer-events-auto max-w-[240px]">
        <div className="flex items-center gap-2 pb-1 border-b border-[#333333] text-[#a3a3a3]">
          <Radio className="w-3 h-3 text-[#ff4d00] animate-pulse" />
          <span>RADAR TARGET BEACONS</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#ff4d00] border border-white text-black font-black text-[7px] flex items-center justify-center">%</span>
          <span className="text-[#ff4d00]">CRITICAL (&gt;70% RISK)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#00e5ff] border border-white"></span>
          <span className="text-[#00e5ff]">MODERATE WATCH (30-70%)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#10b981] border border-white"></span>
          <span className="text-[#10b981]">SECURED / CLEANED (&lt;20KG)</span>
        </div>

        <div className="pt-1 border-t border-[#222222] text-[8px] text-[#737373] normal-case">
          *Dashed orange lines represent autonomous skimmer transit vectors from Colaba Base.
        </div>
      </div>
    </div>
  );
};

export default IntelligenceMap;
