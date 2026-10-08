import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSim } from '../../store';
import { projectLatLon } from './ShorelineMesh';

export function Particles({ isBaseline = false }: { isBaseline?: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const trajectory = useSim(state => isBaseline ? state.trajectoryBaseline : state.trajectory);
  const currentFrameIndex = useSim(state => state.currentFrameIndex);
  const isBarrierActive = useSim(state => state.isBarrierActive);
  const barrierEfficiency = useSim(state => state.barrierEfficiency);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX_PARTICLES = 1000;
  
  // High-contrast color tokens:
  // Baseline (Unmitigated): Ghost Slate (#64748b) in water -> Coral Alert (#ff3b30) when beached
  // Mitigated (Intervention): Bioluminescent Cyan (#00e5ff) in water -> Emerald (#10b981) when trapped at boom -> Coral (#ff3b30) if leaked
  const normalColor = useMemo(() => new THREE.Color(isBaseline ? '#64748b' : '#00e5ff'), [isBaseline]);
  const beachedColor = useMemo(() => new THREE.Color(isBaseline ? '#ff3b30' : '#ff3b30'), [isBaseline]);
  const trappedColor = useMemo(() => new THREE.Color('#10b981'), []);

  useFrame(({ clock }) => {
    if (!meshRef.current || trajectory.length === 0) return;

    const frameIdx = Math.min(currentFrameIndex, trajectory.length - 1);
    const currentFrame = trajectory[frameIdx];
    if (!currentFrame || !currentFrame.particles) return;

    const time = clock.getElapsedTime();

    currentFrame.particles.forEach((p, i) => {
      if (i >= MAX_PARTICLES) return;
      
      const { x, z } = projectLatLon(p.lat, p.lon);
      
      // Subtle physical wave motion on water
      const waveY = p.beached ? 1.6 : 0.45 + Math.sin(time * 2 + x * 0.5 + z * 0.5) * 0.08;
      
      dummy.position.set(x, isBaseline ? waveY - 0.05 : waveY, z);
      dummy.scale.setScalar(p.beached ? 1.4 : isBaseline ? 0.85 : 1.15);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Color logic
      let color = normalColor;
      if (p.beached) {
        color = beachedColor;
      } else if (!isBaseline && isBarrierActive && barrierEfficiency > 0 && i % 2 === 0 && currentFrame.hour > 12) {
        // Trapped at barrier
        color = trappedColor;
      }
      
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.count = currentFrame.particles.length;
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (trajectory.length === 0 || !trajectory[0].particles) return null;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined as any, undefined as any, MAX_PARTICLES]}
    >
      <sphereGeometry args={[0.35, 12, 12]} />
      <meshBasicMaterial 
        transparent
        opacity={isBaseline ? 0.4 : 0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default Particles;
