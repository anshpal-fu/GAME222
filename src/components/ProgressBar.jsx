import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const pct = Math.round(((current + 1) / total) * 100) || 0;
  
  return (
    <div>
      <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden shadow-inner border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-slate-400">
          Question {current + 1} of {total}
        </p>
        <p className="text-xs font-medium text-slate-300">
          {pct}% Complete
        </p>
      </div>
    </div>
  );
}