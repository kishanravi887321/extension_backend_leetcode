import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Wave Points Component
function WavePoints({ mousePosition }) {
  const meshRef = useRef();
  const { viewport } = useThree();
  
  // Configuration
  const gridSize = 100;
  const spacing = 0.35;
  const waveAmplitude = 0.8;
  const waveFrequency = 0.4;
  const waveSpeed = 0.6;
  
  // Create the points geometry
  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(gridSize * gridSize * 3);
    const colors = new Float32Array(gridSize * gridSize * 3);
    const originalPositions = new Float32Array(gridSize * gridSize * 3);
    
    const halfGrid = (gridSize * spacing) / 2;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i * gridSize + j) * 3;
        
        const x = (i * spacing) - halfGrid;
        const z = (j * spacing) - halfGrid;
        const y = 0;
        
        positions[index] = x;
        positions[index + 1] = y;
        positions[index + 2] = z;
        
        originalPositions[index] = x;
        originalPositions[index + 1] = y;
        originalPositions[index + 2] = z;
        
        // Base color (cyan to purple gradient)
        const normalizedX = (x + halfGrid) / (halfGrid * 2);
        const normalizedZ = (z + halfGrid) / (halfGrid * 2);
        
        colors[index] = 0.1 + normalizedX * 0.2; // R
        colors[index + 1] = 0.6 + normalizedZ * 0.3; // G (cyan)
        colors[index + 2] = 0.8 + normalizedX * 0.2; // B
      }
    }
    
    return { positions, colors, originalPositions };
  }, [gridSize, spacing]);
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime * waveSpeed;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    const colorAttribute = meshRef.current.geometry.attributes.color;
    
    const halfGrid = (gridSize * spacing) / 2;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i * gridSize + j) * 3;
        
        const x = originalPositions[index];
        const z = originalPositions[index + 2];
        
        // Multi-layer wave effect
        const wave1 = Math.sin(x * waveFrequency + time) * waveAmplitude;
        const wave2 = Math.sin(z * waveFrequency * 0.8 + time * 0.7) * waveAmplitude * 0.6;
        const wave3 = Math.sin((x + z) * waveFrequency * 0.5 + time * 1.2) * waveAmplitude * 0.4;
        
        // Mouse influence
        const mouseInfluence = 2.5;
        const mouseX = mousePosition.current.x * viewport.width * 0.5;
        const mouseY = mousePosition.current.y * viewport.height * 0.5;
        const distToMouse = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(z - mouseY, 2));
        const mouseWave = Math.exp(-distToMouse * 0.15) * Math.sin(distToMouse - time * 3) * mouseInfluence;
        
        const y = wave1 + wave2 + wave3 + mouseWave;
        positionAttribute.array[index + 1] = y;
        
        // Dynamic colors based on height
        const normalizedY = (y + waveAmplitude * 2) / (waveAmplitude * 4);
        const normalizedX = (x + halfGrid) / (halfGrid * 2);
        const normalizedZ = (z + halfGrid) / (halfGrid * 2);
        
        // Cyan to teal gradient with height-based brightness
        colorAttribute.array[index] = 0.05 + normalizedY * 0.15; // R
        colorAttribute.array[index + 1] = 0.5 + normalizedY * 0.4 + normalizedZ * 0.1; // G
        colorAttribute.array[index + 2] = 0.7 + normalizedY * 0.3 + normalizedX * 0.1; // B
      }
    }
    
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={gridSize * gridSize}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={gridSize * gridSize}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera Controller for parallax effect
function CameraController({ mousePosition }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smooth camera movement based on mouse
    const targetX = mousePosition.current.x * 2;
    const targetY = mousePosition.current.y * 1 + 12;
    const targetZ = 18;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
    
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Fog Particles
function FogParticles() {
  const particlesRef = useRef();
  const count = 200;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = particlesRef.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionAttribute.array[i3 + 1] += Math.sin(time + i) * 0.002;
      positionAttribute.array[i3] += Math.cos(time * 0.5 + i) * 0.001;
    }
    
    positionAttribute.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#4fd1c5"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Wave Background Component
export default function WaveBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef();
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 12, 18], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#4fd1c5" />
        <pointLight position={[-10, 5, -10]} intensity={0.3} color="#7c3aed" />
        
        <WavePoints mousePosition={mousePosition} />
        <FogParticles />
        <CameraController mousePosition={mousePosition} />
        
        {/* Add a subtle fog effect */}
        <fog attach="fog" args={['#000000', 15, 50]} />
      </Canvas>
      
      {/* Gradient overlays for depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(79, 209, 197, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
