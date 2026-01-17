import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating particles background for notes preview
function FloatingParticles() {
  const meshRef = useRef();
  const particleCount = 50;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return { positions, velocities };
  }, [particleCount]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Wave motion
      positionAttribute.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.001;
      
      // Gentle drift
      positionAttribute.array[i3] += velocities[i3];
      positionAttribute.array[i3 + 1] += velocities[i3 + 1];
      
      // Boundary check - wrap around
      if (Math.abs(positionAttribute.array[i3]) > 2) {
        positionAttribute.array[i3] *= -1;
      }
      if (Math.abs(positionAttribute.array[i3 + 1]) > 3) {
        positionAttribute.array[i3 + 1] *= -1;
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Gentle rotation
    meshRef.current.rotation.y = time * 0.05;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Animated gradient mesh
function GradientMesh() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    meshRef.current.rotation.z = time * 0.1;
    meshRef.current.material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[5, 8]} />
      <meshBasicMaterial 
        color="#a5b4fc" 
        transparent 
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const NotesPreviewCanvas = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.7
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <FloatingParticles />
        <GradientMesh />
      </Canvas>
    </div>
  );
};

export default NotesPreviewCanvas;
