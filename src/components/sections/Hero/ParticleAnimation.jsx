// ==========================================
// DGrealtors - Particle Animation Component
// ==========================================

import React, { useEffect, useRef, useState, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Particle Component
const Particle = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Particle System Component
const ParticleSystem = memo(({ count = 100 }) => {
  const particlesRef = useRef([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 0.02 + 0.01,
    }));
    setParticles(newParticles);
  }, [count]);

  useFrame(() => {
    particlesRef.current.forEach((particle, index) => {
      particle.position[1] += particle.speed;
      if (particle.position[1] > 5) {
        particle.position[1] = -5;
        particle.position[0] = (Math.random() - 0.5) * 10;
        particle.position[2] = (Math.random() - 0.5) * 10;
      }
    });
  });

  return (
    <>
      {particles.map((particle, index) => (
        <Particle key={index} position={particle.position} color={particle.color} />
      ))}
    </>
  );
});

ParticleSystem.displayName = 'ParticleSystem';

// Main Particle Animation Component
const ParticleAnimation = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ParticleSystem count={200} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default memo(ParticleAnimation);
                                   
