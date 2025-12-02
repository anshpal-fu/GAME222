import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GameIntroWithAvatar = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Welcome to Heart Hero!",
      content: "I'm Dr. Heart, and I'll be your guide through this exciting journey to master heart health!",
      image: "❤️",
      instruction: "Learn how to protect your heart through interactive challenges and quizzes."
    },
    {
      id: 2,
      title: "The Mission",
      content: "Heart disease is the #1 killer worldwide, but it's mostly preventable with the right knowledge!",
      image: "🎯",
      instruction: "In this game, you'll learn 10 key factors that protect your heart health."
    },
    {
      id: 3,
      title: "How It Works",
      content: "Answer questions correctly to keep your avatar healthy and strong!",
      image: "🎮",
      instruction: "Wrong answers will damage your avatar's health. Too many mistakes and..."
    },
    {
      id: 4,
      title: "Real Consequences",
      content: "Each mistake represents real-life choices that can harm your heart!",
      image: "⚠️",
      instruction: "But don't worry - this is a safe learning environment where you can practice."
    },
    {
      id: 5,
      title: "Ready for Adventure?",
      content: "You'll explore 7 levels of heart health knowledge, from basics to mastery!",
      image: "🏆",
      instruction: "Each level unlocks new powers to protect your heart. Are you ready?"
    }
  ];

  const currentSlideData = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleStartGame = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header with progress */}
          <div className="bg-slate-900/50 p-4 border-b border-white/10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Heart Hero Adventure</h1>
              <div className="text-slate-400 text-sm">
                Slide {currentSlide + 1} of {slides.length}
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Avatar Section */}
            <div className="lg:col-span-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 flex flex-col items-center justify-center border-r border-white/10">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-8xl mb-6"
              >
                👨‍⚕️
              </motion.div>
              
              <motion.div
                key={`message-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-white mb-2">Dr. Heart</h3>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-200 text-sm">{currentSlideData.content}</p>
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                    <div className="text-6xl mb-6">
                      {currentSlideData.image}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {currentSlideData.title}
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl">
                      {currentSlideData.instruction}
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevious}
                      disabled={currentSlide === 0}
                      className={`px-6 py-3 rounded-xl font-bold flex items-center ${
                        currentSlide === 0
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-slate-700 text-white hover:bg-slate-600 transition"
                      }`}
                    >
                      ← Previous
                    </button>

                    {currentSlide === slides.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartGame}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 transition"
                      >
                        START GAME! 🚀
                      </motion.button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameIntroWithAvatar;