import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Advanced particle system with multiple layers
function ParticleField({ count = 80, color = '#6366f1', size = 0.04, speed = 1 }) {
  const meshRef = useRef();
  
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 6;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.015 * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01 * speed;
      
      sizes[i] = Math.random() * size;
    }
    
    return { positions, velocities, sizes };
  }, [count, size, speed]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    const sizeAttribute = meshRef.current.geometry.attributes.size;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Complex wave motion
      positionAttribute.array[i3] += velocities[i3] + Math.sin(time * 0.5 + i * 0.1) * 0.002;
      positionAttribute.array[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.3 + i * 0.2) * 0.002;
      positionAttribute.array[i3 + 2] += velocities[i3 + 2];
      
      // Pulsing size
      sizeAttribute.array[i] = sizes[i] * (1 + Math.sin(time * 2 + i * 0.5) * 0.3);
      
      // Boundary wrap
      if (Math.abs(positionAttribute.array[i3]) > 3) positionAttribute.array[i3] *= -0.9;
      if (Math.abs(positionAttribute.array[i3 + 1]) > 4) positionAttribute.array[i3 + 1] *= -0.9;
      if (Math.abs(positionAttribute.array[i3 + 2]) > 1.5) positionAttribute.array[i3 + 2] *= -0.9;
    }
    
    positionAttribute.needsUpdate = true;
    sizeAttribute.needsUpdate = true;
    
    // Dynamic rotation
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
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

// Animated spiral rings
function SpiralRings() {
  const groupRef = useRef();
  const ringCount = 3;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    groupRef.current.rotation.z = time * 0.2;
    groupRef.current.children.forEach((ring, i) => {
      ring.rotation.x = time * (0.3 + i * 0.1);
      ring.rotation.y = time * (0.2 + i * 0.15);
      ring.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
    });
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / ringCount]}>
          <torusGeometry args={[1.5 + i * 0.5, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={['#6366f1', '#a855f7', '#ec4899'][i]}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Morphing gradient sphere
function MorphingSphere() {
  const meshRef = useRef();
  const materialRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Morphing effect
    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      
      const distortion = Math.sin(time * 2 + x * 2) * Math.cos(time * 1.5 + y * 2) * 0.1;
      const length = Math.sqrt(x * x + y * y + z * z);
      
      positionAttribute.setXYZ(
        i,
        x * (1 + distortion),
        y * (1 + distortion),
        z * (1 + distortion)
      );
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Rotation
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.15;
    
    // Color pulse
    materialRef.current.opacity = 0.1 + Math.sin(time * 0.8) * 0.05;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#a5b4fc"
        transparent
        opacity={0.1}
        wireframe
        blending={THREE.AdditiveBlending}
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
      opacity: 0.8
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField count={100} color="#6366f1" size={0.05} speed={1} />
        <ParticleField count={60} color="#a855f7" size={0.03} speed={0.7} />
        <ParticleField count={40} color="#ec4899" size={0.02} speed={1.5} />
        <SpiralRings />
        <MorphingSphere />
      </Canvas>
    </div>
  );
};

export default NotesPreviewCanvas;
