import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const gameModes = [
    {
      id: 1,
      path: "/level",
      emoji: "🏆",
      title: "Heart Health Challenge",
      description: "Test your knowledge with 10 progressive heart health questions. Answer carefully - only 3 wrong answers and it's game over!",
      buttonText: "Start Challenge",
      color: "from-cyan-50 to-blue-100",
      border: "border-cyan-200"
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            HEART HERO
          </motion.h1>
          <motion.p 
            className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Master heart health through an epic adventure. Become a cardiovascular champion and save lives!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-block px-6 py-3 bg-white rounded-full border border-cyan-200 shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-gray-700 font-medium">Ready for your heart health adventure?</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Game Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          {gameModes.map((mode, index) => (
            <Link key={mode.id} to={mode.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -10 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${mode.color} p-8 rounded-2xl border border-cyan-100 shadow-lg cursor-pointer transition-all duration-300 text-center`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-6">{mode.emoji}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{mode.title}</h2>
                  <p className="text-gray-600 mb-8 text-lg">{mode.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition shadow-lg text-lg"
                  >
                    {mode.buttonText} →
                  </motion.button>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl border border-cyan-100 shadow-lg p-6 md:p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-50 p-5 rounded-xl border border-cyan-200 text-center"
            >
              <div className="text-4xl mb-3 text-cyan-600">1️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Answer 10 Questions</h3>
              <p className="text-sm text-gray-600">Progress through increasingly difficult heart health challenges</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 p-5 rounded-xl border border-blue-200 text-center"
            >
              <div className="text-4xl mb-3 text-blue-600">2️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Stay Alive</h3>
              <p className="text-sm text-gray-600">Only 3 wrong answers allowed - each mistake damages your heart!</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-red-50 p-5 rounded-xl border border-red-200 text-center"
            >
              <div className="text-4xl mb-3 text-red-600">3️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Earn Achievements</h3>
              <p className="text-sm text-gray-600">Build streaks and unlock rewards as you master heart health</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Game Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl border border-cyan-100 shadow-lg p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Game Rules</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="/src/assets/heart.png" 
                  alt="Interactive Heart" 
                  className="w-full max-w-xs mx-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white bg-black/50 px-4 py-2 rounded-full">
                      3 Lives Only
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-cyan-100 rounded-full p-2 mr-3">
                    <span className="text-cyan-600 font-bold">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Limited Attempts</h3>
                    <p className="text-gray-600 text-sm">You only get 3 wrong answers before game over</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <span className="text-blue-600 font-bold">🔥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Streak Bonuses</h3>
                    <p className="text-gray-600 text-sm">Build streaks for extra points and health boosts</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-2 mr-3">
                    <span className="text-red-600 font-bold">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Achievements</h3>
                    <p className="text-gray-600 text-sm">Unlock badges for milestones like "3 in a row"</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-12 pt-6 border-t border-cyan-100"
        >
          <p className="text-gray-500 text-sm">
            © 2023 Heart Hero - Master your heart health through gamified learning
          </p>
        </motion.div>
      </div>
    </div>
  );
}