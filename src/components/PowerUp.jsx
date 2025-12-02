import React from "react";
import { motion } from "framer-motion";

const PowerUp = ({ type, isActive, onClick, quantity }) => {
  const powerUpData = {
    healthBoost: {
      icon: "💊",
      name: "Health Boost",
      description: "Restores 20 health points",
      color: "from-green-400 to-emerald-500"
    },
    streakMultiplier: {
      icon: "✨",
      name: "Streak Multiplier",
      description: "2x points for correct answers",
      color: "from-yellow-400 to-orange-500"
    },
    timeExtension: {
      icon: "⏰",
      name: "Time Extension",
      description: "Adds 10 seconds to timer",
      color: "from-blue-400 to-cyan-500"
    }
  };

  const data = powerUpData[type] || powerUpData.healthBoost;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-3 rounded-xl bg-gradient-to-br ${data.color} shadow-lg cursor-pointer ${
        !isActive ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center">
        <div className="text-2xl mr-2">{data.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-white text-sm">{data.name}</div>
          <div className="text-xs text-white/80">{data.description}</div>
        </div>
        {quantity > 0 && (
          <div className="bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
            {quantity}
          </div>
        )}
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-bold">LOCKED</span>
        </div>
      )}
    </motion.div>
  );
};

export default PowerUp;