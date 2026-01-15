import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Animated wave mesh with dots
function WaveMesh({ mouse }) {
  const meshRef = useRef();
  const pointsRef = useRef();
  
  // Create geometry for wave
  const { positions, colors } = useMemo(() => {
    const width = 100;
    const depth = 100;
    const segmentsX = 80;
    const segmentsZ = 80;
    
    const positions = [];
    const colors = [];
    
    for (let i = 0; i <= segmentsX; i++) {
      for (let j = 0; j <= segmentsZ; j++) {
        const x = (i / segmentsX - 0.5) * width;
        const z = (j / segmentsZ - 0.5) * depth;
        positions.push(x, 0, z);
        
        // Gradient color from dark to neon green
        const intensity = Math.random() * 0.3 + 0.7;
        colors.push(0.1 * intensity, 0.95 * intensity, 0.5 * intensity);
      }
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);
  
  // Animation
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const array = positionAttr.array;
    
    const segmentsX = 81;
    const segmentsZ = 81;
    
    for (let i = 0; i < segmentsX; i++) {
      for (let j = 0; j < segmentsZ; j++) {
        const index = (i * segmentsZ + j) * 3;
        const x = array[index];
        const z = array[index + 2];
        
        // Multiple wave functions for organic movement
        const wave1 = Math.sin(x * 0.1 + time * 0.8) * 2;
        const wave2 = Math.sin(z * 0.1 + time * 0.6) * 2;
        const wave3 = Math.sin((x + z) * 0.05 + time * 0.5) * 1.5;
        const wave4 = Math.cos(x * 0.08 - time * 0.4) * Math.sin(z * 0.08 + time * 0.3) * 2;
        
        // Mouse influence
        const mouseInfluence = mouse.current ? 
          Math.sin(x * 0.05 + mouse.current.x * 2) * Math.cos(z * 0.05 + mouse.current.y * 2) * 1.5 : 0;
        
        array[index + 1] = wave1 + wave2 + wave3 + wave4 + mouseInfluence;
      }
    }
    
    positionAttr.needsUpdate = true;
    
    // Slow rotation based on mouse
    if (pointsRef.current && mouse.current) {
      pointsRef.current.rotation.y = mouse.current.x * 0.1;
      pointsRef.current.rotation.x = mouse.current.y * 0.05 - 0.5;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera controller for parallax effect
function CameraController({ mouse }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (mouse.current) {
      camera.position.x += (mouse.current.x * 5 - camera.position.x) * 0.02;
      camera.position.y += (mouse.current.y * 3 + 15 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// Fog particles
function FogParticles() {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 30 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, sizes };
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    particlesRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#00ff88"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Wave Background Component
export default function WaveBackground() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 15, 30], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={['#000000', 20, 80]} />
        <ambientLight intensity={0.2} />
        <CameraController mouse={mouse} />
        <WaveMesh mouse={mouse} />
        <FogParticles />
      </Canvas>
    </div>
  );
}
