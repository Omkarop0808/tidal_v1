import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { OUTFALL_LOCATIONS, useSim } from '../../store';

// Coordinate projection helper: converts Mumbai Lat/Lon to X/Z plane (grid 120x120)
export const projectLatLon = (lat: number, lon: number) => {
  const latMin = 18.85, latMax = 19.35;
  const lonMin = 72.70, lonMax = 72.96;
  
  const z = -((lat - latMin) / (latMax - latMin) * 110 - 55); // North is -Z
  const x = (lon - lonMin) / (lonMax - lonMin) * 110 - 55;
  
  return { x, z };
};

export function ShorelineMesh() {
  const selectedLocation = useSim(state => state.selectedLocation);
  const setSelectedLocation = useSim(state => state.setSelectedLocation);

  // Full Western Coastline contour polygon for Greater Mumbai (Colaba to Vasai Creek)
  const shorelinePoints = useMemo(() => {
    const rawCoordinates: [number, number][] = [
      // 1. South Colaba Point & Navy Basin
      [18.890, 72.812],
      [18.910, 72.818],
      // 2. Nariman Point & Marine Drive Bay
      [18.925, 72.823],
      [18.940, 72.822],
      [18.950, 72.805],
      // 3. Malabar Hill & Walkeshwar Promontory
      [18.955, 72.793],
      [18.970, 72.798],
      [18.985, 72.805],
      // 4. Worli Point & Sea Face
      [19.005, 72.812],
      [19.020, 72.815],
      // 5. Mahim Bay & Mithi River Outfall
      [19.035, 72.835],
      [19.045, 72.830],
      // 6. Bandra Bandstand & Carter Road
      [19.055, 72.818],
      [19.070, 72.820],
      // 7. Khar Danda & Juhu Beach
      [19.085, 72.824],
      [19.100, 72.826],
      [19.120, 72.820],
      // 8. Versova Creek & Fishing Village
      [19.135, 72.814],
      [19.150, 72.808],
      // 9. Madh Island, Erangal & Silver Beach
      [19.165, 72.795],
      [19.185, 72.790],
      // 10. Aksa Beach & Dana Pani
      [19.175, 72.792],
      // 11. Marve Beach & Malad Creek
      [19.198, 72.788],
      // 12. Manori Beach & Fishing Creek
      [19.215, 72.775],
      // 13. Gorai Beach
      [19.245, 72.770],
      // 14. Uttan & Bhayandar Estuary
      [19.280, 72.775],
      // 15. Vasai Creek Outfall Mouth
      [19.310, 72.780],
      [19.330, 72.795],
      // 16. Inland Eastern Boundary Closure (Thane & Mumbai Mainland)
      [19.330, 72.955],
      [18.890, 72.955],
    ];

    return rawCoordinates.map(([lat, lon]) => {
      const { x, z } = projectLatLon(lat, lon);
      return new THREE.Vector2(x, z);
    });
  }, []);

  // Create extruded 3D landmass and contour line
  const { geometry, lineObj } = useMemo(() => {
    const shape = new THREE.Shape(shorelinePoints);
    const extrudeSettings = {
      steps: 1,
      depth: 1.8,
      bevelEnabled: true,
      bevelThickness: 0.4,
      bevelSize: 0.4,
      bevelSegments: 3,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(Math.PI / 2); // Lay flat on X/Z plane
    geom.translate(0, 0.9, 0);

    const edgePoints = shorelinePoints.slice(0, 27).map(p => new THREE.Vector3(p.x, 1.9, p.y));
    const edgeGeom = new THREE.BufferGeometry().setFromPoints(edgePoints);
    const edgeMat = new THREE.LineBasicMaterial({ color: '#00e5ff', transparent: true, opacity: 0.85 });
    const lineObj = new THREE.Line(edgeGeom, edgeMat);

    return { geometry: geom, lineObj };
  }, [shorelinePoints]);

  return (
    <group>
      {/* 3D Landmass Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#08131e" 
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Coastline Bioluminescent Cyan Edge Line */}
      <primitive object={lineObj} />

      {/* Coastal Outfalls & Landmarks with interactive pins */}
      {OUTFALL_LOCATIONS.map((loc) => {
        const { x, z } = projectLatLon(loc.lat, loc.lon);
        const isSelected = selectedLocation.id === loc.id;
        const isVersova = loc.id === 'versova';

        return (
          <group 
            key={loc.id} 
            position={[x, 2.2, z]}
            onClick={() => setSelectedLocation(loc)}
          >
            {/* 3D Pin Beacon */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[isSelected ? 0.9 : 0.6, 16, 16]} />
              <meshBasicMaterial 
                color={isSelected ? '#00e5ff' : isVersova ? '#ff3b30' : '#38bdf8'} 
              />
            </mesh>

            {/* Pulsing ring under marker */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[isSelected ? 1.0 : 0.7, isSelected ? 1.6 : 1.1, 16]} />
              <meshBasicMaterial 
                color={isSelected ? '#00e5ff' : isVersova ? '#ff3b30' : '#38bdf8'} 
                transparent 
                opacity={isSelected ? 0.8 : 0.4} 
              />
            </mesh>

            {/* Label Annotation */}
            <Html distanceFactor={45} position={[0, 1.4, 0]} center pointerEvents="none">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-mono whitespace-nowrap shadow-xl border transition-all ${
                isSelected 
                  ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : isVersova
                  ? 'bg-[#ff3b30]/15 border-[#ff3b30]/40 text-slate-100'
                  : 'bg-[#03070a]/90 border-slate-700/60 text-slate-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : isVersova ? 'bg-red-500' : 'bg-sky-400'}`}></span>
                <span>{loc.name.split(' ')[0]}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default ShorelineMesh;
