import React from "react";
import { motion } from "framer-motion";

const DoctorAvatar = ({ healthStatus, message, wrongAnswers }) => {
  // Determine avatar expression based on health status
  const getAvatarExpression = () => {
    if (wrongAnswers >= 3) return "😵"; // Deceased
    if (healthStatus <= 30) return "😰"; // Critical
    if (healthStatus <= 60) return "😐"; // Concerned
    return "😊"; // Healthy/Positive
  };

  // Determine avatar state message
  const getAvatarStateMessage = () => {
    if (wrongAnswers >= 3) return "DECEASED - Too many incorrect answers";
    if (healthStatus <= 30) return "CRITICAL - Immediate attention needed";
    if (healthStatus <= 60) return "CONCERNED - Be more careful";
    return "HEALTHY - Great job so far!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 border border-cyan-500/30 backdrop-blur-sm"
    >
      <div className="flex items-start">
        <div className="text-6xl mr-4">
          {getAvatarExpression()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white">Dr. Heart</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              wrongAnswers >= 3 ? "bg-red-500/20 text-red-400" :
              healthStatus <= 30 ? "bg-red-500/20 text-red-400" :
              healthStatus <= 60 ? "bg-yellow-500/20 text-yellow-400" :
              "bg-emerald-500/20 text-emerald-400"
            }`}>
              {getAvatarStateMessage()}
            </span>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-cyan-500/20">
            <p className="text-slate-200 italic">"{message}"</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Health Status</span>
                <span>{healthStatus}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div 
                  className={`h-3 rounded-full ${
                    healthStatus > 70 ? "bg-green-500" : 
                    healthStatus > 40 ? "bg-yellow-500" : 
                    "bg-red-500"
                  }`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${healthStatus}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            <div className="ml-4 text-right">
              <div className="text-sm text-slate-400">Wrong Answers</div>
              <div className="text-lg font-bold text-white">{wrongAnswers}/3</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorAvatar;