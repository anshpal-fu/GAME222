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
          background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #bfdbfe 100%)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Gentle floating hearts */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ❤️
            </motion.div>
          ))}

          {/* Soft radial gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 60%, rgba(224, 242, 254, 0.8) 100%)'
            }}
          />
        </div>

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Elegant heart logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 100,
              damping: 10,
              duration: 1.5,
            }}
            className="relative mb-8"
          >
            {/* Heart shape with elegant styling */}
            <div className="relative">
              <div 
                className="text-9xl"
                style={{
                  textShadow: `
                    0 0 15px rgba(59, 130, 246, 0.5),
                    0 0 30px rgba(59, 130, 246, 0.3),
                    0 0 45px rgba(59, 130, 246, 0.2)
                  `,
                }}
              >
                ❤️
              </div>
              
              {/* Subtle white outline */}
              <div 
                className="absolute inset-0 text-9xl"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                  color: 'transparent',
                }}
              >
                ❤️
              </div>
            </div>
          </motion.div>

          {/* Game title with elegant typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              delay: 0.5,
              duration: 1,
            }}
            className="text-5xl font-bold tracking-wide mb-4"
            style={{
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(to bottom, #1e40af, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            HEART HERO
          </motion.h1>

          {/* Elegant subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg text-blue-800 font-light tracking-wider"
          >
            MASTER YOUR HEART HEALTH
          </motion.p>
          
          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 w-48 h-1 bg-blue-100 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Fade out overlay for exit transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent, #e0f2fe)'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default GameIntro;