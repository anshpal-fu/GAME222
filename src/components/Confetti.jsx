import React from "react";
import { motion } from "framer-motion";

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Floating emojis for celebration effect */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-10 left-1/4 text-3xl"
      >
        🎉
      </motion.div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-20 right-1/3 text-3xl"
      >
        ✨
      </motion.div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-16 left-1/2 text-3xl"
      >
        🏆
      </motion.div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 left-1/3 text-3xl"
      >
        👏
      </motion.div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-12 right-1/4 text-3xl"
      >
        💯
      </motion.div>
      
      {/* Additional floating particles */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1, 0],
          y: [0, -100]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
        className="absolute top-0 left-1/5 w-4 h-4 bg-emerald-400 rounded-full"
      />
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1, 0],
          y: [0, -80]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          delay: 1
        }}
        className="absolute top-0 right-1/4 w-3 h-3 bg-teal-400 rounded-full"
      />
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1, 0],
          y: [0, -120]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          delay: 1.5
        }}
        className="absolute top-0 left-2/3 w-2 h-2 bg-blue-400 rounded-full"
      />
    </div>
  );
}