import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../lib/api';
import { Radio, Navigation } from 'lucide-react';

interface IntelligenceMapProps {
  onSelectBeach?: (beach: any) => void;
  selectedBeachId?: string;
}

const NAVAL_BASE_COORDS: [number, number] = [18.9067, 72.8147]; // Colaba Naval Dock

// Generator for tactical high-contrast divIcons
const createTacticalMarkerIcon = (beach: any, isSelected: boolean) => {
  const isCritical = beach.baseline_risk >= 70 || beach.status === 'High Risk';
  const isCleaned = beach.status === 'Cleaned' || (beach.remaining_debris_kg !== undefined && beach.remaining_debris_kg <= 20);

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
          <div class="ml-2.5 px-2 py-0.5 bg-black/95 border border-[#10b981] text-[#10b981] font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
            ${beach.name.split(' ')[0]} • SECURED
          </div>
        </div>
      `,
      iconSize: [140, 24],
      iconAnchor: [12, 12],
    });
  }

  if (isCritical) {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center cursor-pointer group" style="transform: translate(-14px, -14px);">
          <span class="absolute -inset-1 w-9 h-9 bg-[#ff4d00] animate-ping opacity-60 rounded-full"></span>
          <div class="relative w-7 h-7 bg-[#ff4d00] border-2 border-white flex items-center justify-center shadow-[0_0_18px_#ff4d00] ${isSelected ? 'ring-4 ring-white' : ''}">
            <span class="w-2.5 h-2.5 bg-black"></span>
          </div>
          <div class="ml-2.5 px-2 py-0.5 bg-black/95 border-2 border-[#ff4d00] text-white font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-2xl flex items-center gap-1.5">
            <span class="text-[#ff4d00]">${beach.name.split(' ')[0]}</span>
            <span class="bg-[#ff4d00] text-black px-1 py-0.2 text-[8px]">${beach.baseline_risk || 94}% CRITICAL</span>
          </div>
        </div>
      `,
      iconSize: [160, 28],
      iconAnchor: [14, 14],
    });
  }

  // Moderate / Watchlist
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center cursor-pointer group" style="transform: translate(-10px, -10px);">
        <div class="w-5 h-5 bg-[#00e5ff] border-2 border-white flex items-center justify-center shadow-[0_0_10px_#00e5ff] ${isSelected ? 'ring-4 ring-white' : ''}">
          <span class="w-1.5 h-1.5 bg-black"></span>
        </div>
        <div class="ml-2 px-2 py-0.5 bg-black/95 border border-[#00e5ff] text-[#00e5ff] font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
          ${beach.name.split(' ')[0]} • ${beach.baseline_risk || 60}% WATCH
        </div>
      </div>
    `,
    iconSize: [140, 20],
    iconAnchor: [10, 10],
  });
};

export const IntelligenceMap = ({ onSelectBeach, selectedBeachId }: IntelligenceMapProps) => {
  const [beaches, setBeaches] = useState<any[]>([]);

  const fetchBeaches = async () => {
    try {
      const data = await api.getBeaches();
      setBeaches(data);
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
        {/* CartoDB Dark Matter Tiles: Pristine, high-contrast maritime obsidian theme */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          className="cartodb-dark-tiles"
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
                opacity: 0.7,
                dashArray: '6, 8',
              }}
            />
          ))}

        {/* Base Port Marker */}
        <Marker 
          position={NAVAL_BASE_COORDS} 
          icon={L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
              <div class="relative flex items-center cursor-pointer" style="transform: translate(-10px, -10px);">
                <div class="w-5 h-5 bg-white border-2 border-black flex items-center justify-center shadow-[0_0_10px_#ffffff]">
                  <span class="w-2 h-2 bg-black"></span>
                </div>
                <div class="ml-2 px-2 py-0.5 bg-black border border-white text-white font-mono text-[9px] font-bold uppercase whitespace-nowrap shadow-xl">
                  COLABA NAVAL DOCK (BASE)
                </div>
              </div>
            `,
            iconSize: [160, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup>
            <div className="p-3 bg-black text-white font-mono text-xs uppercase border-2 border-white">
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#ff4d00]" />
                COLABA NAVAL DOCK
              </div>
              <p className="text-[10px] text-[#a3a3a3]">Primary deployment base for Autonomous Skimmer Squads.</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Coastal Hotspot Beacons */}
        {beaches.map(b => {
          const isSelected = selectedBeachId === b.id;
          const icon = createTacticalMarkerIcon(b, isSelected);
          
          return (
            <Marker 
              key={b.id} 
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
                <div className="p-4 bg-[#050505] text-white font-mono text-xs uppercase min-w-[220px]">
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
                    SELECT TARGET HUD
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* On-Map Tactical Legend Box */}
      <div className="absolute top-4 right-4 z-[500] bg-black/90 border-2 border-[#333333] p-3 text-white font-mono text-[9px] uppercase font-bold tracking-widest shadow-2xl flex flex-col gap-2 pointer-events-auto max-w-[240px]">
        <div className="flex items-center gap-2 pb-1 border-b border-[#333333] text-[#a3a3a3]">
          <Radio className="w-3 h-3 text-[#ff4d00] animate-pulse" />
          <span>RADAR TARGET BEACONS</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ff4d00] border border-white"></span>
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
