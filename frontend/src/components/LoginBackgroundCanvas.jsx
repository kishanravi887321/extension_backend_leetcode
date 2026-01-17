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
      const distSq = dx * dx + dy * dy;
      
      // Only apply mouse effect if close (performance optimization)
      if (distSq < 64) {  // distance < 8
        const distance = Math.sqrt(distSq);
        const force = (1 - distance / 8) * 0.2;
        const angle = Math.atan2(dy, dx);
        
        // Simplified attraction
        positionAttribute.array[i3] += velocities[i3] - Math.cos(angle) * force;
        positionAttribute.array[i3 + 1] += velocities[i3 + 1] - Math.sin(angle) * force;
        
        // Size effect
        sizeAttribute.array[i] = sizes[i] * (1 + force * 1.5);
      } else {
        // Normal movement when far from mouse
        positionAttribute.array[i3] += velocities[i3];
        positionAttribute.array[i3 + 1] += velocities[i3 + 1];
        sizeAttribute.array[i] = sizes[i];
      }
      
      positionAttribute.array[i3 + 2] += velocities[i3 + 2];
      
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

// Mouse-following energy orb with trails
function EnergyOrb({ mousePosition }) {
  const meshRef = useRef();
  const trailRef = useRef();
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Calculate velocity for trail effect
    const targetX = mousePosition.x * 10;
    const targetY = mousePosition.y * 6;
    
    velocity.current.x = (targetX - targetPosition.current.x) * 0.1;
    velocity.current.y = (targetY - targetPosition.current.y) * 0.1;
    
    // Smooth follow mouse
    targetPosition.current.x += velocity.current.x;
    targetPosition.current.y += velocity.current.y;
    
    meshRef.current.position.x = targetPosition.current.x;
    meshRef.current.position.y = targetPosition.current.y;
    meshRef.current.position.z = Math.sin(time * 0.5) * 1;
    
    // Dynamic scale based on movement speed
    const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
    const scale = 1.5 + Math.sin(time * 2) * 0.3 + speed * 0.5;
    meshRef.current.scale.setScalar(scale);
    
    // Color shift
    meshRef.current.material.opacity = 0.25 + Math.sin(time) * 0.1 + speed * 0.1;
    
    // Rotation based on movement
    meshRef.current.rotation.x = time * 0.5 + velocity.current.y;
    meshRef.current.rotation.y = time * 0.3 + velocity.current.x;
    
    // Trail effect
    if (trailRef.current) {
      trailRef.current.position.copy(meshRef.current.position);
      trailRef.current.position.z -= 0.5;
      trailRef.current.scale.setScalar(scale * 1.3);
    }
  });
  
  return (
    <>
      <mesh ref={trailRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// Interactive spiral rings that follow cursor
function SpiralRings({ mousePosition }) {
  const groupRef = useRef();
  const ringRefs = useRef([]);
  const ringCount = 5;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Move entire group toward mouse
    const targetX = mousePosition.x * 3;
    const targetY = mousePosition.y * 2;
    
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
    
    // Dramatic rotation based on mouse
    groupRef.current.rotation.z = time * 0.2 + mousePosition.x * Math.PI;
    groupRef.current.rotation.x = mousePosition.y * Math.PI * 0.5;
    groupRef.current.rotation.y = time * 0.1;
    
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      
      // Each ring rotates independently
      ring.rotation.x = time * (0.3 + i * 0.15) + mousePosition.x * 2;
      ring.rotation.y = time * (0.2 + i * 0.1) - mousePosition.y * 2;
      ring.rotation.z = time * (0.1 + i * 0.05);
      
      // Pulsing scale
      const scale = 1 + Math.sin(time * 3 + i) * 0.2 + Math.abs(mousePosition.x + mousePosition.y) * 0.3;
      ring.scale.setScalar(scale);
    });
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh 
          key={i} 
          ref={el => ringRefs.current[i] = el}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / ringCount]}
        >
          <torusGeometry args={[2.5 + i * 0.6, 0.04, 16, 100]} />
          <meshBasicMaterial
            color={['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b'][i]}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating cosmic dust particles
function CosmicDust({ mousePosition }) {
  const meshRef = useRef();
  const count = 40;
  
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;
      
      sizes[i] = Math.random() * 0.08 + 0.04;
    }
    
    return { positions, velocities, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    // Simplified ambient movement - no time-based calculations
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionAttribute.array[i3] += velocities[i3];
      positionAttribute.array[i3 + 1] += velocities[i3 + 1];
      positionAttribute.array[i3 + 2] += velocities[i3 + 2];
      
      // Wrap around
      if (Math.abs(positionAttribute.array[i3]) > 15) positionAttribute.array[i3] *= -1;
      if (Math.abs(positionAttribute.array[i3 + 1]) > 10) positionAttribute.array[i3 + 1] *= -1;
    }
    
    positionAttribute.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#fbbf24"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        <InteractiveParticleField mousePosition={mouseRef.current} count={120} color="#6366f1" size={0.07} />
        <InteractiveParticleField mousePosition={mouseRef.current} count={60} color="#a855f7" size={0.05} />
        <InteractiveParticleField mousePosition={mouseRef.current} count={40} color="#ec4899" size={0.04} />
        <EnergyOrb mousePosition={mouseRef.current} />
        <SpiralRings mousePosition={mouseRef.current} />
        <CosmicDust mousePosition={mouseRef.current} />
      </Canvas>
    </div>
  );
};

export default LoginBackgroundCanvas;
