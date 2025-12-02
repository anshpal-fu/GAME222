import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QUESTIONS from "../data/questions";
import { motion, AnimatePresence } from "framer-motion";

function useLevelQuestions(levelId) {
  return useMemo(() => QUESTIONS.filter(q => q.level === levelId), [levelId]);
}

export default function QuizPage() {
  const { id } = useParams(); // level id
  const navigate = useNavigate();
  const questions = useLevelQuestions(id);
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [id]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg border border-sky-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">CHALLENGE NOT AVAILABLE</h2>
          <p className="text-gray-600 mb-6">This challenge doesn't have any questions yet. Contact mission control!</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-bold hover:from-sky-600 hover:to-cyan-600 transition shadow-md"
          >
            RETURN TO HOME
          </button>
        </motion.div>
      </div>
    );
  }

  const current = questions[idx];

  function onSelect(choiceIndex) {
    if (isAnswered) return;
    
    setSelectedOption(choiceIndex);
    setIsAnswered(true);
    
    const correct = choiceIndex === current.answer;
    
    if (correct) {
      setFeedback({
        message: current.feedback.correct,
        type: "success"
      });
    } else {
      setFeedback({
        message: current.feedback.incorrect,
        type: "error"
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setIsAnswered(false);
      if (idx + 1 < total) {
        setIdx(i => i + 1);
      } else {
        // go to result with state
        navigate("/result", { state: { level: id } });
      }
    }, 2000);
  }

  // Calculate progress percentage
  const progressPercentage = ((idx + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 p-6 relative overflow-hidden">
      {/* Soft radial glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* App Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xl">❤️</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-1/3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* Main Content - Split Screen */}
        <div className="flex flex-1 gap-8 h-[calc(100vh-120px)]">
          {/* Left Side - Heart Character (40%) */}
          <div className="w-2/5 flex flex-col items-center justify-center">
            <motion.div
              className="relative"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-400 rounded-full blur-2xl opacity-40 -z-10"></div>
              
              {/* Heart character */}
              <div className="relative bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-8 shadow-2xl">
                <div className="bg-gradient-to-br from-red-400 to-pink-400 rounded-full p-12">
                  <div className="relative w-40 h-40">
                    <img 
                      src="/src/assets/heart.png" 
                      alt="Heart Character" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Expressive eyes animation */}
              <motion.div
                className="absolute top-1/3 left-1/4 w-4 h-4 bg-black rounded-full"
                animate={{
                  scaleY: [1, 1, 0.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              <motion.div
                className="absolute top-1/3 right-1/4 w-4 h-4 bg-black rounded-full"
                animate={{
                  scaleY: [1, 1, 0.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2,
                  delay: 0.5
                }}
              />
            </motion.div>
            
            {/* Character name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 border border-white/50 shadow-sm"
            >
              <p className="text-gray-700 font-medium">Heart Hero</p>
            </motion.div>
          </div>
          
          {/* Right Side - Question & Options (60%) */}
          <div className="w-3/5 flex flex-col">
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 flex-1 flex flex-col"
            >
              {/* Question Counter */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-cyan-600 font-medium">Question {idx + 1} of {total}</span>
                <div className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold">
                  Q{idx + 1}
                </div>
              </div>
              
              {/* Question Text */}
              <div className="flex-1 flex items-center">
                <h2 className="text-2xl font-bold text-gray-800 text-center w-full">
                  {current.question}
                </h2>
              </div>
              
              {/* Options */}
              <div className="space-y-4 mt-8">
                <AnimatePresence>
                  {current.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = index === current.answer;
                    
                    let buttonClass = "w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-white to-cyan-50 border border-cyan-100 text-gray-800 font-medium text-lg shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md";
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        buttonClass = "w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-md";
                      } else if (isSelected && !isCorrect) {
                        buttonClass = "w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-md";
                      }
                    } else if (isSelected) {
                      buttonClass = "w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-lg shadow-md scale-[1.02]";
                    }
                    
                    return (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.98 }}
                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                        onClick={() => onSelect(index)}
                        disabled={isAnswered}
                        className={buttonClass}
                      >
                        <div className="flex items-center">
                          <span className="mr-4 font-bold">{String.fromCharCode(65 + index)}.</span>
                          <span>{option}</span>
                          {isAnswered && (
                            <span className="ml-auto text-2xl">
                              {isCorrect ? "✓" : isSelected ? "✗" : ""}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Feedback Panel */}
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-4 rounded-2xl ${
                    feedback.type === "success" 
                      ? "bg-green-100 border border-green-200 text-green-800" 
                      : "bg-red-100 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="text-center font-medium">{feedback.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
