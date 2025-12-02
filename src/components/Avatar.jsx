import React from "react";
import { motion } from "framer-motion";

export default function Avatar({ message = "Hi! I'm your heart coach." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 left-6 z-50 flex items-end gap-3"
    >
      <motion.div 
        className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg border-4 border-white relative float-animation"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Heart shape */}
        <div className="text-white text-2xl relative">
          ❤️
        </div>
        
        {/* Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-red-500 flex items-center justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping"></div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl text-white max-w-xs relative border border-white/20"
      >
        <div className="absolute -left-2 bottom-5 w-4 h-4 bg-slate-800 rotate-45 border-l border-b border-white/20"></div>
        <p className="text-sm font-medium">{message}</p>
        
        <div className="absolute -bottom-2 left-8 text-xs text-slate-400 font-medium">
          Dr. Heart
        </div>
      </motion.div>
    </motion.div>
  );
}