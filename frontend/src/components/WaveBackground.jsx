import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Wave Points - subtle dot mesh like the reference image
function WavePoints({ mousePosition }) {
  const meshRef = useRef();
  
  // Grid configuration for full coverage
  const cols = 150;
  const rows = 100;
  const totalPoints = cols * rows;
  
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(totalPoints * 3);
    const originalPositions = new Float32Array(totalPoints * 3);
    
    const width = 70;
    const height = 45;
    const spacingX = width / cols;
    const spacingZ = height / rows;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const index = (i * rows + j) * 3;
        
        const x = (i - cols / 2) * spacingX;
        const z = (j - rows / 2) * spacingZ;
        
        positions[index] = x;
        positions[index + 1] = 0;
        positions[index + 2] = z;
        
        originalPositions[index] = x;
        originalPositions[index + 1] = 0;
        originalPositions[index + 2] = z;
      }
    }
    
    return { positions, originalPositions };
  }, [totalPoints, cols, rows]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    const mouseX = mousePosition.current.x * 30;
    const mouseY = mousePosition.current.y * 20;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const index = (i * rows + j) * 3;
        
        const x = originalPositions[index];
        const z = originalPositions[index + 2];
        
        // Smooth wave animation
        const wave1 = Math.sin(x * 0.15 + time * 0.5) * 1.5;
        const wave2 = Math.sin(z * 0.12 + time * 0.4) * 1.0;
        const wave3 = Math.sin((x + z) * 0.08 + time * 0.6) * 0.8;
        
        // Mouse ripple effect
        const dx = x - mouseX;
        const dz = z - mouseY;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const ripple = Math.sin(dist * 0.5 - time * 3) * Math.exp(-dist * 0.08) * 2;
        
        positionAttribute.array[index + 1] = wave1 + wave2 + wave3 + ripple;
      }
    }
    
    positionAttribute.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={totalPoints}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#4fd1c5"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Subtle camera parallax
function CameraController({ mousePosition }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const targetX = mousePosition.current.x * 2;
    const targetY = 18 + mousePosition.current.y * 1.5;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function WaveBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 18, 30], fov: 50 }}
        dpr={[1, 2]}
      >
        <WavePoints mousePosition={mousePosition} />
        <CameraController mousePosition={mousePosition} />
        <fog attach="fog" args={['#000000', 25, 60]} />
      </Canvas>
    </div>
  );
}
