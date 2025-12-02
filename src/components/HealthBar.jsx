import React from "react";
import { motion } from "framer-motion";

export default function HealthBar({ health }) {
  // Determine color based on health level
  const getHealthColor = () => {
    if (health > 70) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
    if (health > 40) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (health > 15) return "bg-gradient-to-r from-orange-500 to-red-500";
    return "bg-gradient-to-r from-red-600 to-red-800";
  };
  
  // Add pulse animation when health is critical
  const getPulseClass = () => {
    return health <= 15 ? "animate-pulse" : "";
  };

  return (
    <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden shadow-inner border border-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${health}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end ${getHealthColor()} ${getPulseClass()}`}
      >
        {health > 15 && (
          <span className="text-xs font-bold text-white pr-2">
            {health}%
          </span>
        )}
      </motion.div>
    </div>
  );
}