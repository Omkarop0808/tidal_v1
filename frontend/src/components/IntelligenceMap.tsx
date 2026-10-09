import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../lib/api';

// Fix leafet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createIcon = (colorHex: string) => new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23${colorHex}" width="24px" height="24px"%3E%3Ccircle cx="12" cy="12" r="10" opacity="0.3" /%3E%3Ccircle cx="12" cy="12" r="5" /%3E%3C/svg%3E`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const criticalIcon = createIcon('ff4d00'); // orange
const normalIcon = createIcon('ffffff'); // white
const cleanedIcon = createIcon('525252'); // gray

export const IntelligenceMap = () => {
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
    <div className="w-full h-full relative z-0 bg-[#000000]">
      <MapContainer 
        center={[19.05, 72.82]} 
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#000000' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a>'
          className="map-tiles"
        />
        
        {beaches.map(b => {
           let icon = normalIcon;
           if (b.status === 'Cleaned') icon = cleanedIcon;
           else if (b.baseline_risk > 70 || b.status === 'High Risk') icon = criticalIcon;
           
           return (
             <Marker key={b.id} position={[b.lat, b.lon]} icon={icon}>
               <Popup>
                 <div className="font-mono text-xs uppercase p-1">
                    <div className="font-bold text-[#ff4d00] mb-1">{b.name}</div>
                    <div className="text-[#a3a3a3]">Sector: <span className="text-black">{b.sector}</span></div>
                    <div className="text-[#a3a3a3]">Status: <span className="text-black">{b.status}</span></div>
                    <div className="text-[#a3a3a3]">Debris: <span className="text-black font-bold">{b.remaining_debris_kg} KG</span></div>
                 </div>
               </Popup>
             </Marker>
           );
        })}
      </MapContainer>
      
      {/* Dynamic Overlay Gradient for cinematic blending */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent pointer-events-none z-[1000]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-transparent pointer-events-none z-[1000]"></div>
    </div>
  );
};
