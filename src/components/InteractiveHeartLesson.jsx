import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DoctorAvatar from "./DoctorAvatar";

const InteractiveHeartLesson = ({ 
  questions, 
  onAnswer, 
  crackedPoints, 
  selectedAnswers,
  showFeedback,
  avatarMessage 
}) => {
  // Define the 10 key heart health factors
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

  // Calculate health status for the doctor avatar (0-100)
  const calculateHealthStatus = () => {
    // Start with 100% health
    let health = 100;
    // Subtract 10% for each wrong answer (cracked point)
    health -= crackedPoints.length * 10;
    return Math.max(0, health);
  };

  const healthStatus = calculateHealthStatus();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Heart Visualization */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800/50 rounded-2xl shadow-xl p-6 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Heart Health Visualization</h3>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-xs">
              {/* Heart Image with cracks */}
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
                
                {/* Cracks for each point that has been answered incorrectly */}
                {crackedPoints.map(pointId => {
                  const point = heartPoints.find(p => p.id === pointId);
                  if (!point) return null;
                  
                  // Position cracks near the corresponding point
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
                  
                  const position = crackPositions[pointId];
                  if (!position) return null;
                  
                  return (
                    <motion.div
                      key={pointId}
                      className="absolute w-8 h-8"
                      style={{ 
                        left: position.x, 
                        top: position.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-gray-800 text-2xl">⚡</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="mt-6 text-center">
            <div className="text-sm text-slate-400">
              Heart Health: {10 - crackedPoints.length}/10 factors protected
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((10 - crackedPoints.length) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions and Avatar */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-6">
          {/* Doctor Avatar */}
          <DoctorAvatar 
            healthStatus={healthStatus}
            message={avatarMessage}
            wrongAnswers={crackedPoints.length}
          />

          {/* Questions Grid */}
          <div className="bg-slate-800/50 rounded-2xl shadow-xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Heart Health Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((question, index) => {
                const pointId = index + 1;
                const isSelected = selectedAnswers[question.id] !== undefined;
                const isCracked = crackedPoints.includes(pointId);
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      isCracked 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-slate-700 hover:border-emerald-400 hover:bg-emerald-500/10'
                    } transition-all`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        isCracked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-600 text-white'
                      }`}>
                        {pointId}
                      </div>
                      <h4 className="font-medium text-slate-200">{question.question}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isOptionSelected = selectedAnswers[question.id] === optionIndex;
                        const isCorrect = optionIndex === question.answer;
                        const showOptionFeedback = showFeedback && isSelected;
                        
                        let optionStyle = "p-2 rounded-lg text-sm text-left w-full text-slate-300 hover:bg-slate-700/50";
                        
                        if (showOptionFeedback) {
                          if (isCorrect) {
                            optionStyle = "p-2 rounded-lg text-sm text-left w-full bg-emerald-500/20 text-emerald-100 border border-emerald-500/30";
                          } else if (isOptionSelected && !isCorrect) {
                            optionStyle = "p-2 rounded-lg text-sm text-left w-full bg-red-500/20 text-red-100 border border-red-500/30";
                          }
                        } else if (isOptionSelected) {
                          optionStyle = "p-2 rounded-lg text-sm text-left w-full bg-blue-500/20 text-blue-100 border border-blue-500/30";
                        }
                        
                        return (
                          <button
                            key={optionIndex}
                            onClick={() => onAnswer(question.id, optionIndex)}
                            className={optionStyle}
                            disabled={showFeedback}
                          >
                            <span className="font-bold text-slate-400 mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    
                    <AnimatePresence>
                      {showFeedback && isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`mt-3 p-3 rounded-lg text-sm ${
                            selectedAnswers[question.id] === question.answer
                              ? 'bg-emerald-500/20 text-emerald-100'
                              : 'bg-red-500/20 text-red-100'
                          }`}
                        >
                          {selectedAnswers[question.id] === question.answer
                            ? question.feedback.correct
                            : question.feedback.incorrect}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeartLesson;