import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';

const InteractiveGrid = () => {
  const { scrollY } = useScroll();
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef(null);
  
  // Track the velocity of scrolling for 6D flow
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 30,
    stiffness: 150
  });

  // Map velocity to physical distortions
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-5, 5]);
  const yFlow = useTransform(smoothVelocity, [-2000, 2000], [-25, 25]);
  const stretch = useTransform(smoothVelocity, [-2000, 2000], [0.92, 1.08]);

  // Parallax Base
  const yParallax = useTransform(scrollY, [0, 5000], [0, -400]);

  // Mouse interactivity for the atmospheric glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="interactive-grid-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary, #0a0c10)'
    }}>
      {/* Grid Layer: The 6D Water Flow */}
      <motion.div 
        style={{ 
          y: yParallax,
          skewY: skewY,
          scaleY: stretch,
          position: 'absolute',
          top: '-20%',
          left: 0,
          width: '100%',
          height: '140%', 
          transformOrigin: 'center center'
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="grid-glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <motion.g style={{ y: yFlow }}>
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(88, 166, 255, 0.05)" strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="1.3" fill="var(--accent-primary, #58a6ff)" opacity="0.4" filter="url(#grid-glow)">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
                </circle>
              </motion.g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </motion.div>
      
      {/* Interative Atmospheric Glow (Anchored to Mouse) */}
      <div 
        ref={glowRef}
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(88, 166, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
          willChange: 'transform'
        }} 
      />

      {/* Static Vignette / Darkening Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(10, 12, 16, 0.4) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default InteractiveGrid;
