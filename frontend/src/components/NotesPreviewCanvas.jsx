import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple, minimal particle system
function ParticleField({ count = 30, color = '#6366f1', size = 0.02 }) {
  const meshRef = useRef();
  
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 4;
    positions[i3 + 1] = (Math.random() - 0.5) * 6;
    positions[i3 + 2] = (Math.random() - 0.5) * 2;
    
    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 2] = 0;
  }
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positionAttribute.array[i3] += velocities[i3];
      positionAttribute.array[i3 + 1] += velocities[i3 + 1];
      
      // Boundary wrap
      if (Math.abs(positionAttribute.array[i3]) > 2) positionAttribute.array[i3] *= -0.9;
      if (Math.abs(positionAttribute.array[i3 + 1]) > 3) positionAttribute.array[i3 + 1] *= -0.9;
    }
    
    positionAttribute.needsUpdate = true;
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
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
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
      opacity: 0.3
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField count={30} color="#6366f1" size={0.02} />
      </Canvas>
    </div>
  );
};

export default NotesPreviewCanvas;
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
