import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Mouse-reactive particle field
function InteractiveParticleField({ mousePosition, count = 150, color = '#6366f1', size = 0.05 }) {
  const meshRef = useRef();
  
  const { positions, velocities, sizes, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const originalPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      
      sizes[i] = Math.random() * size;
    }
    
    return { positions, velocities, sizes, originalPositions };
  }, [count, size]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    const sizeAttribute = meshRef.current.geometry.attributes.size;
    
    // Get mouse influence
    const mouseX = mousePosition.x * 15;
    const mouseY = mousePosition.y * 10;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Calculate distance from mouse
      const dx = positionAttribute.array[i3] - mouseX;
      const dy = positionAttribute.array[i3 + 1] - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Mouse repulsion/attraction
      const force = Math.max(0, 1 - distance / 5);
      const pushX = (dx / distance) * force * 0.5;
      const pushY = (dy / distance) * force * 0.5;
      
      // Apply movement
      positionAttribute.array[i3] += velocities[i3] + pushX;
      positionAttribute.array[i3 + 1] += velocities[i3 + 1] + pushY;
      positionAttribute.array[i3 + 2] += velocities[i3 + 2];
      
      // Add wave motion
      positionAttribute.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
      
      // Pulsing size
      sizeAttribute.array[i] = sizes[i] * (1 + Math.sin(time * 2 + i * 0.5) * 0.3 + force * 0.5);
      
      // Boundary check - gentle wrap
      if (Math.abs(positionAttribute.array[i3]) > 10) {
        positionAttribute.array[i3] = originalPositions[i3];
      }
      if (Math.abs(positionAttribute.array[i3 + 1]) > 6) {
        positionAttribute.array[i3 + 1] = originalPositions[i3 + 1];
      }
      if (Math.abs(positionAttribute.array[i3 + 2]) > 4) {
        positionAttribute.array[i3 + 2] = originalPositions[i3 + 2];
      }
    }
    
    positionAttribute.needsUpdate = true;
    sizeAttribute.needsUpdate = true;
    
    // Subtle rotation
    meshRef.current.rotation.y = time * 0.03;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Mouse-following energy orb
function EnergyOrb({ mousePosition }) {
  const meshRef = useRef();
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Smooth follow mouse
    targetPosition.current.x += (mousePosition.x * 8 - targetPosition.current.x) * 0.05;
    targetPosition.current.y += (mousePosition.y * 5 - targetPosition.current.y) * 0.05;
    
    meshRef.current.position.x = targetPosition.current.x;
    meshRef.current.position.y = targetPosition.current.y;
    meshRef.current.position.z = Math.sin(time * 0.5) * 2;
    
    // Pulsing scale
    const scale = 1 + Math.sin(time * 2) * 0.2;
    meshRef.current.scale.setScalar(scale);
    
    // Color shift
    meshRef.current.material.opacity = 0.15 + Math.sin(time) * 0.05;
    
    // Rotation
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#a855f7"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Spiral connection lines
function SpiralRings({ mousePosition }) {
  const groupRef = useRef();
  const ringCount = 4;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Follow mouse rotation
    groupRef.current.rotation.z = time * 0.1 + mousePosition.x * 0.5;
    groupRef.current.rotation.x = mousePosition.y * 0.3;
    
    groupRef.current.children.forEach((ring, i) => {
      ring.rotation.x = time * (0.2 + i * 0.1);
      ring.rotation.y = time * (0.15 + i * 0.1) - mousePosition.x * 0.2;
      ring.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
    });
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / ringCount]}>
          <torusGeometry args={[2 + i * 0.8, 0.03, 16, 100]} />
          <meshBasicMaterial
            color={['#6366f1', '#a855f7', '#ec4899', '#f59e0b'][i]}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Morphing grid plane
function MorphingGrid({ mousePosition }) {
  const meshRef = useRef();
  const originalPositions = useRef();
  
  useMemo(() => {
    if (!meshRef.current) return;
    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    originalPositions.current = new Float32Array(positionAttribute.array);
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current || !originalPositions.current) return;
    const time = state.clock.elapsedTime;
    
    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3;
      const x = originalPositions.current[i3];
      const y = originalPositions.current[i3 + 1];
      
      // Calculate distance from mouse
      const mouseX = mousePosition.x * 10;
      const mouseY = mousePosition.y * 6;
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Wave distortion + mouse interaction
      const wave = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time * 0.8) * 0.5;
      const mouseEffect = Math.max(0, 1 - distance / 5) * 2;
      
      positionAttribute.setZ(i, wave + mouseEffect);
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Rotation
    meshRef.current.rotation.x = -Math.PI / 3 + mousePosition.y * 0.2;
    meshRef.current.rotation.z = time * 0.05;
  });
  
  return (
    <mesh ref={meshRef} position={[0, -3, -8]}>
      <planeGeometry args={[20, 12, 50, 30]} />
      <meshBasicMaterial
        color="#4f46e5"
        wireframe
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

const LoginBackgroundCanvas = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const mouseRef = useRef(mousePosition);
  mouseRef.current = mousePosition;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <InteractiveParticleField mousePosition={mouseRef.current} count={200} color="#6366f1" size={0.06} />
        <InteractiveParticleField mousePosition={mouseRef.current} count={100} color="#a855f7" size={0.04} />
        <InteractiveParticleField mousePosition={mouseRef.current} count={60} color="#ec4899" size={0.03} />
        <EnergyOrb mousePosition={mouseRef.current} />
        <SpiralRings mousePosition={mouseRef.current} />
        <MorphingGrid mousePosition={mouseRef.current} />
      </Canvas>
    </div>
  );
};

export default LoginBackgroundCanvas;
