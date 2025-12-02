import React from 'react';
import { motion } from 'framer-motion';

const InteractiveHeart = ({ crackedPoints = [] }) => {
  // Define the 10 key heart health factors from Lesson 1
  const heartPoints = [
    { id: 1, name: "Sleep Quality", position: { x: 30, y: 20 }, description: "Adequate, high-quality sleep is essential for heart repair" },
    { id: 2, name: "Stress Management", position: { x: 70, y: 20 }, description: "Chronic stress stiffens arteries and raises inflammation" },
    { id: 3, name: "Nutrition", position: { x: 20, y: 40 }, description: "Whole foods reduce inflammation and support healing" },
    { id: 4, name: "Early Screenings", position: { x: 80, y: 40 }, description: "Detect risks before emergencies occur" },
    { id: 5, name: "Physical Activity", position: { x: 35, y: 60 }, description: "Balanced exercise improves circulation and endurance" },
    { id: 6, name: "Emotional Health", position: { x: 65, y: 60 }, description: "Positive emotions protect cardiovascular health" },
    { id: 7, name: "Smoking Avoidance", position: { x: 25, y: 80 }, description: "Smoking damages blood vessels and blocks healing" },
    { id: 8, name: "Alcohol Moderation", position: { x: 75, y: 80 }, description: "Excessive alcohol weakens heart structure" },
    { id: 9, name: "Weight Management", position: { x: 40, y: 90 }, description: "Healthy weight reduces heart workload" },
    { id: 10, name: "Medication Adherence", position: { x: 60, y: 90 }, description: "Proper medication use complements lifestyle changes" }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Heart SVG with cracks */}
      <div className="relative">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-auto"
        >
          {/* Main heart shape */}
          <path
            d="M100,30 
               C70,0 30,10 30,50 
               C30,90 100,130 100,170 
               C100,130 170,90 170,50 
               C170,10 130,0 100,30 Z"
            className="fill-red-500 stroke-red-600 stroke-2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' }}
          />
          
          {/* Glow effect */}
          <path
            d="M100,30 
               C70,0 30,10 30,50 
               C30,90 100,130 100,170 
               C100,130 170,90 170,50 
               C170,10 130,0 100,30 Z"
            className="fill-red-400 opacity-30"
            style={{ filter: 'blur(10px)' }}
          />
          
          {/* Cracks for each point that has been answered incorrectly */}
          {crackedPoints.map(pointId => {
            const point = heartPoints.find(p => p.id === pointId);
            if (!point) return null;
            
            // Different crack patterns for each point
            const crackPaths = {
              1: "M35,25 L45,30 M40,20 L50,35",
              2: "M155,25 L165,30 M160,20 L170,35",
              3: "M25,50 L35,55 M30,45 L40,60",
              4: "M165,50 L175,55 M170,45 L180,60",
              5: "M45,75 L55,80 M50,70 L60,85",
              6: "M145,75 L155,80 M150,70 L160,85",
              7: "M35,95 L45,100 M40,90 L50,105",
              8: "M155,95 L165,100 M160,90 L170,105",
              9: "M55,115 L65,120 M60,110 L70,125",
              10: "M135,115 L145,120 M140,110 L150,125"
            };
            
            return (
              <motion.path
                key={pointId}
                d={crackPaths[pointId]}
                className="stroke-gray-800 stroke-1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
          
          {/* Breaking effect when all points are cracked */}
          {crackedPoints.length >= 10 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <line x1="50" y1="50" x2="150" y2="150" className="stroke-gray-800 stroke-2" />
              <line x1="150" y1="50" x2="50" y2="150" className="stroke-gray-800 stroke-2" />
            </motion.g>
          )}
        </svg>
        
        {/* Points with labels */}
        {heartPoints.map(point => (
          <motion.div
            key={point.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              crackedPoints.includes(point.id) ? 'text-gray-600' : 'text-white'
            }`}
            style={{ 
              left: `${point.position.x}%`, 
              top: `${point.position.y}%` 
            }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative">
              {/* Point marker */}
              <div className={`w-4 h-4 rounded-full ${
                crackedPoints.includes(point.id) 
                  ? 'bg-gray-600 ring-2 ring-gray-800' 
                  : 'bg-red-400 ring-2 ring-red-200'
              }`} />
              
              {/* Label */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium">
                {point.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Status indicator */}
      <div className="mt-6 text-center">
        <div className="text-sm text-slate-600">
          Heart Health: {10 - crackedPoints.length}/10 factors protected
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((10 - crackedPoints.length) / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeart;