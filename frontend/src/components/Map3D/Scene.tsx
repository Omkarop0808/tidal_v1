import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Particles } from './Particles';
import { ForceVectors } from './ForceVectors';
import { ShorelineMesh } from './ShorelineMesh';
import { BarrierMesh } from './BarrierMesh';
import { Suspense } from 'react';

export function Scene() {
  return (
    <div className="w-full h-full bg-[#000000] relative select-none">
      <Canvas 
        camera={{ position: [0, 45, 45], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.65} />
        <directionalLight position={[20, 30, 20]} intensity={1.2} />
        <pointLight position={[-20, 15, -20]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          {/* Mumbai Coastal Topography Mesh */}
          <ShorelineMesh />

          {/* Defensive Boom Containment Barrier */}
          <BarrierMesh />

          {/* Hydrodynamic Wind & Current Force Vectors */}
          <ForceVectors />

          {/* Dual-Track Particles: Baseline (Ghost/Coral) vs Mitigated (Cyan/Emerald) */}
          <Particles isBaseline={true} />
          <Particles isBaseline={false} />
          
          {/* Oceanic Bathymetric Spatial Grid */}
          <Grid 
            args={[120, 120]} 
            position={[0, 0, 0]} 
            cellColor="#111111" 
            sectionColor="#333333" 
            cellThickness={0.5} 
            sectionThickness={1.2} 
            fadeDistance={90} 
            infiniteGrid 
          />
          
          {/* Camera Orbit Controls bounded to realistic top-down perspective */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={15}
            maxDistance={90}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
