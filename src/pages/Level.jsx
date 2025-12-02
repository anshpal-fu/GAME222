import React from "react";
import levels from "../data/levels";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Level() {
  const level = levels[0]; // Get the single progressive level
  
  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-4">
            HEART HEALTH CHALLENGE
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with 10 progressive heart health questions. Remember: only 3 wrong answers and it's game over!
          </p>
        </motion.div>
        
        {/* Challenge Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl border border-cyan-100 shadow-lg overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl">
                  ❤️
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full mb-2">
                  MAIN CHALLENGE
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h2>
                <p className="text-gray-600">{level.description}</p>
              </div>
            </div>
            
            {/* Progress Visualization */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Challenge Progress</span>
                <span>10 Questions</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div 
                    key={index}
                    className="h-3 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Game Rules Reminder */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-500 text-xl mr-2">⚠️</div>
                <h3 className="font-bold text-red-700">Important Game Rules</h3>
              </div>
              <p className="text-red-600 text-sm mt-1">
                You only have 3 lives! Each wrong answer will damage your heart. Answer carefully!
              </p>
            </div>
            
            <Link 
              to={`/quiz/${level.id}`}
              className="block w-full text-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition shadow-lg text-lg"
            >
              START HEART HEALTH CHALLENGE
            </Link>
          </div>
        </motion.div>
        
        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-cyan-100 shadow p-6 text-center">
            <div className="text-3xl mb-3">🔥</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Streak Bonuses</h3>
            <p className="text-gray-600 text-sm">Build streaks for extra points and health boosts</p>
          </div>
          
          <div className="bg-white rounded-xl border border-cyan-100 shadow p-6 text-center">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Achievements</h3>
            <p className="text-gray-600 text-sm">Unlock badges for milestones like "3 in a row"</p>
          </div>
          
          <div className="bg-white rounded-xl border border-cyan-100 shadow p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Progress Tracking</h3>
            <p className="text-gray-600 text-sm">Visualize your improvement with detailed analytics</p>
          </div>
        </motion.div>
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-bold border border-cyan-200 hover:bg-cyan-50 transition shadow-sm"
          >
            ← RETURN TO HOME
          </Link>
        </motion.div>
      </div>
    </div>
  );
}