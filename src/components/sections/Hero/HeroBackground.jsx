// ==========================================
// DGrealtors - Hero Background Component
// ==========================================

import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Utils
import { cn } from '../../../utils/cn';

// Styles
import styles from './HeroBackground.module.css';

// Constants
const PARTICLE_COUNT = 100;
const WAVE_SEGMENTS = 100;
const GRADIENT_COLORS = [
  'rgba(255, 229, 180, 0.3)', // Peach
  'rgba(220, 224, 195, 0.3)', // Olive
  'rgba(255, 217, 160, 0.3)', // Orange
];

// 3D Animated Sphere Component
const AnimatedSphere = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#ffe5b4"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

// Particle System Component
const ParticleField = memo(({ count = PARTICLE_COUNT }) => {
  const particlesRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.5,
    }));

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          particle.x -= dx * 0.01;
          particle.y -= dy * 0.01;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 229, 180, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 229, 180, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 120) {
            ctx.strokeStyle = `rgba(255, 229, 180, ${0.2 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
});

ParticleField.displayName = 'ParticleField';

// Wave Animation Component
const WaveAnimation = memo(() => {
  const canvasRef = useRef(null);
  const waveRef = useRef({ offset: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      GRADIENT_COLORS.forEach((color, index) => {
        gradient.addColorStop(index / (GRADIENT_COLORS.length - 1), color);
      });

      // Draw multiple waves
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3 - i * 0.1;
        ctx.beginPath();

        const waveHeight = 100 + i * 30;
        const waveSpeed = 0.02 - i * 0.005;
        const yOffset = canvas.height * 0.6 + i * 50;

        for (let x = 0; x <= canvas.width; x++) {
          const y = Math.sin((x + waveRef.current.offset) * waveSpeed) * waveHeight + yOffset;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      waveRef.current.offset += 2;
      animationId = requestAnimationFrame(drawWave);
    };

    drawWave();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.waveCanvas} />;
});

WaveAnimation.displayName = 'WaveAnimation';

// Gradient Mesh Component
const GradientMesh = memo(() => {
  const meshRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const { x, y } = mousePos;
    meshRef.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  }, [mousePos]);

  return (
    <div ref={meshRef} className={styles.gradientMesh}>
      <div className={styles.meshBlob1} />
      <div className={styles.meshBlob2} />
      <div className={styles.meshBlob3} />
      <div className={styles.meshBlob4} />
    </div>
  );
});

GradientMesh.displayName = 'GradientMesh';

// Video Background Component
const VideoBackground = memo(({ src, poster }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      video.play().catch(error => {
        console.error('Video autoplay failed:', error);
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className={styles.videoBackground}>
      <video
        ref={videoRef}
        className={cn(styles.video, { [styles.videoLoaded]: isLoaded })}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.videoOverlay} />
    </div>
  );
});

VideoBackground.displayName = 'VideoBackground';

// Main Hero Background Component
const HeroBackground = ({
  type = 'gradient',
  videoSrc,
  videoPoster,
  imageUrl,
  imageAlt,
  enableParallax = true,
  enableInteraction = true,
  className
}) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y = useTransform(scrollY, [0, 1000], [0, enableParallax ? -300 : 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, enableParallax ? 1.2 : 1]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.3]);
  
  // Spring physics
  const springConfig = { damping: 20, stiffness: 100 };
  const ySpring = useSpring(y, springConfig);
  const scaleSpring = useSpring(scale, springConfig);
  const opacitySpring = useSpring(opacity, springConfig);

  const renderBackground = () => {
    switch (type) {
      case 'particles':
        return <ParticleField count={PARTICLE_COUNT} />;
        
      case 'wave':
        return <WaveAnimation />;
        
      case 'gradient':
        return <GradientMesh />;
        
      case '3d':
        return (
          <div className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <AnimatedSphere />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        );
        
      case 'video':
        return <VideoBackground src={videoSrc} poster={videoPoster} />;
        
      case 'image':
        return (
          <div className={styles.imageBackground}>
            <img
              src={imageUrl || "https://placehold.co/1920x1080"}
              alt={imageAlt || "Hero background showcasing modern architecture and premium real estate"}
              className={styles.backgroundImage}
            />
            <div className={styles.imageOverlay} />
          </div>
        );
        
      default:
        return <GradientMesh />;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(styles.heroBackground, className)}
      style={{
        y: ySpring,
        scale: scaleSpring,
        opacity: opacitySpring,
      }}
    >
      {renderBackground()}
      
      {/* Ambient Effects */}
      <div className={styles.ambientEffects}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.glowOrb3} />
      </div>
      
      {/* Noise Texture */}
      <div className={styles.noiseTexture} />
    </motion.div>
  );
};

export default memo(HeroBackground);
                                   
