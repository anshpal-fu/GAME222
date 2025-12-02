import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GameIntro = ({ onIntroComplete }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      if (onIntroComplete) onIntroComplete();
    }, 4000); // Show intro for 4 seconds

    return () => clearTimeout(timer);
  }, [onIntroComplete]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a192f 0%, #0f2a4a 50%, #1e3a8a 100%)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Moving light streaks */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-blue-400/30 rounded-full"
              style={{
                width: '200px',
                top: `${20 + i * 15}%`,
                left: '-200px',
              }}
              animate={{
                x: ['0vw', '100vw'],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}

          {/* Glow particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Vignette effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 60%, rgba(10, 25, 47, 0.8) 100%)'
            }}
          />
        </div>

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Light rays behind the heart */}
          <div className="absolute -inset-32">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-96 h-1 origin-center"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Glowing 3D heart */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: [0, -10, 0],
            }}
            transition={{ 
              type: 'spring',
              stiffness: 100,
              damping: 10,
              duration: 1.5,
              y: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
            className="relative"
          >
            {/* Heart shape with glow */}
            <div className="relative">
              <div 
                className="text-9xl"
                style={{
                  textShadow: `
                    0 0 20px rgba(239, 68, 68, 0.7),
                    0 0 40px rgba(239, 68, 68, 0.5),
                    0 0 60px rgba(239, 68, 68, 0.3)
                  `,
                }}
              >
                ❤️
              </div>
              
              {/* Neon blue outline */}
              <div 
                className="absolute inset-0 text-9xl"
                style={{
                  WebkitTextStroke: '2px rgba(59, 130, 246, 0.8)',
                  color: 'transparent',
                }}
              >
                ❤️
              </div>
            </div>

            {/* Holographic shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                transform: 'rotate(45deg)',
                transformOrigin: 'center',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </motion.div>

          {/* Rising energy particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                left: `${45 + Math.random() * 10}%`,
                top: '80%',
              }}
              animate={{
                y: [-50, -500],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Futuristic tech lines */}
          <div 
            className="absolute -bottom-20 w-64 h-0.5"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.5), transparent)'
            }}
          />
          <div 
            className="absolute -bottom-24 w-48 h-0.5"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(103, 232, 249, 0.3), transparent)'
            }}
          />

          {/* Game title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              delay: 1,
              duration: 1,
            }}
            className="mt-16 text-5xl font-bold tracking-wider"
            style={{
              fontFamily: 'Arial Black, sans-serif',
              background: 'linear-gradient(to bottom, #f0f9ff, #dbeafe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.2),
                0 0 20px rgba(59, 130, 246, 0.6),
                0 0 10px rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            HEART HERO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-4 text-lg text-cyan-200 font-light tracking-widest"
          >
            SAVE LIVES. BECOME A HERO.
          </motion.p>
        </div>

        {/* Fade out overlay for exit transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0a192f)'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default GameIntro;