import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CrackingHeart = ({ crackedPoints = [], totalPoints = 10, onPointClick = null }) => {
  // Define the 10 key heart health factors with positions on the heart image
  const heartPoints = [
    { id: 1, name: "Sleep Quality", position: { x: 30, y: 20 } },
    { id: 2, name: "Stress Management", position: { x: 70, y: 20 } },
    { id: 3, name: "Nutrition", position: { x: 20, y: 40 } },
    { id: 4, name: "Early Screenings", position: { x: 80, y: 40 } },
    { id: 5, name: "Physical Activity", position: { x: 35, y: 60 } },
    { id: 6, name: "Emotional Health", position: { x: 65, y: 60 } },
    { id: 7, name: "Smoking Avoidance", position: { x: 25, y: 80 } },
    { id: 8, name: "Alcohol Moderation", position: { x: 75, y: 80 } },
    { id: 9, name: "Weight Management", position: { x: 40, y: 90 } },
    { id: 10, name: "Medication Adherence", position: { x: 60, y: 90 } }
  ];

  // Define crack positions for each point
  const crackPositions = {
    1: { x: '30%', y: '20%' },
    2: { x: '70%', y: '20%' },
    3: { x: '20%', y: '40%' },
    4: { x: '80%', y: '40%' },
    5: { x: '35%', y: '60%' },
    6: { x: '65%', y: '60%' },
    7: { x: '25%', y: '80%' },
    8: { x: '75%', y: '80%' },
    9: { x: '40%', y: '90%' },
    10: { x: '60%', y: '90%' }
  };

  // Determine heart health status
  const protectedPoints = totalPoints - crackedPoints.length;
  const healthPercentage = Math.max(0, (protectedPoints / totalPoints) * 100);

  // Determine health status message
  const getHealthStatus = () => {
    if (healthPercentage >= 80) return { text: "Excellent", color: "text-green-600", bgColor: "bg-green-100" };
    if (healthPercentage >= 60) return { text: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (healthPercentage >= 40) return { text: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (healthPercentage >= 20) return { text: "Poor", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { text: "Critical", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl border border-cyan-200 shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Heart Health Monitor</h3>
      
      <div className="relative flex items-center justify-center mb-6">
        <div className="relative w-full max-w-xs">
          {/* Heart Image */}
          <div className="relative">
            <img 
              src="/src/assets/heart.png" 
              alt="Heart" 
              className="w-full h-auto"
            />
            
            {/* Points with labels positioned over the heart image */}
            {heartPoints.map(point => (
              <motion.div
                key={point.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  crackedPoints.includes(point.id) ? 'text-gray-500' : 'text-red-500'
                }`}
                style={{ 
                  left: `${point.position.x}%`, 
                  top: `${point.position.y}%` 
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPointClick && onPointClick(point.id)}
              >
                <div className="relative">
                  {/* Point marker */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    crackedPoints.includes(point.id) 
                      ? 'bg-gray-400 ring-2 ring-gray-600' 
                      : 'bg-red-500 ring-2 ring-red-300'
                  }`}>
                    <span className="text-xs font-bold text-white">
                      {point.id}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-white/80 px-2 py-1 rounded-lg shadow-sm border border-cyan-100">
                    {point.name}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Cracks for each point that has been answered incorrectly */}
            <AnimatePresence>
              {crackedPoints.map(pointId => {
                const position = crackPositions[pointId];
                if (!position) return null;
                
                return (
                  <motion.div
                    key={pointId}
                    className="absolute w-10 h-10"
                    style={{ 
                      left: position.x, 
                      top: position.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-gray-700 text-3xl">💥</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Heart failure animation when all points are cracked */}
            {crackedPoints.length >= totalPoints && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-red-500 text-6xl">💔</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Health Status Indicator */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Heart Health Status</span>
          <span className={`text-sm font-bold px-2 py-1 rounded-full ${healthStatus.bgColor} ${healthStatus.color}`}>
            {healthStatus.text}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <motion.div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: `${healthPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>{protectedPoints} factors protected</span>
          <span>{crackedPoints.length} factors damaged</span>
        </div>
      </div>
      
      {/* Warning Message */}
      {crackedPoints.length > 0 && (
        <motion.div 
          className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-sm text-red-700">
              {crackedPoints.length >= 3 
                ? "Critical condition! Three or more factors damaged. Continue with caution."
                : "Warning: Incorrect answers are damaging your heart health factors."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CrackingHeart;