import { useMemo } from 'react';
import * as THREE from 'three';
import { useSim } from '../../store';
import { projectLatLon } from './ShorelineMesh';
import { Html } from '@react-three/drei';

export function BarrierMesh() {
  const barrierEfficiency = useSim(state => state.barrierEfficiency);
  const isBarrierActive = useSim(state => state.isBarrierActive);
  const selectedLocation = useSim(state => state.selectedLocation);

  // Dynamically place barrier boom ~1.5km offshore west of the active outfall location
  const barrierPoints = useMemo(() => {
    const lat = selectedLocation.lat;
    const lon = selectedLocation.lon;

    const p1 = projectLatLon(lat + 0.015, lon - 0.025);
    const p2 = projectLatLon(lat, lon - 0.030);
    const p3 = projectLatLon(lat - 0.015, lon - 0.025);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(p1.x, 0.4, p1.z),
      new THREE.Vector3(p2.x, 0.4, p2.z),
      new THREE.Vector3(p3.x, 0.4, p3.z),
    ]);

    return curve.getPoints(30);
  }, [selectedLocation]);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(barrierPoints);
    return new THREE.TubeGeometry(curve, 30, 0.35, 8, false);
  }, [barrierPoints]);

  if (!isBarrierActive || barrierEfficiency <= 0) return null;

  const midPoint = barrierPoints[Math.floor(barrierPoints.length / 2)];

  return (
    <group>
      {/* Floating Boom Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial 
          color="#f59e0b" 
          roughness={0.4} 
          metalness={0.6}
          emissive="#b45309"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Floating Beacon Buoys along the barrier */}
      {barrierPoints.filter((_, i) => i % 5 === 0).map((pt, idx) => (
        <group key={idx} position={[pt.x, 0.5, pt.z]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#ffedd5" />
          </mesh>
        </group>
      ))}

      {/* Barrier Active Label */}
      <Html distanceFactor={50} position={[midPoint.x, 1.8, midPoint.z]} center pointerEvents="none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#08131e]/95 backdrop-blur-md border border-amber-500/50 text-[10px] font-mono whitespace-nowrap shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-amber-300 font-bold">Defensive Boom Active ({barrierEfficiency}% Deflection)</span>
        </div>
      </Html>
    </group>
  );
}

export default BarrierMesh;
