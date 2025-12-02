import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import CrackingHeart from "../components/CrackingHeart";

export default function Result() {
  const { state } = useLocation();
  const score = state?.score ?? 0;
  const total = state?.total ?? 0;
  const level = state?.level ?? "Unknown";
  const heartAttack = state?.heartAttack ?? false;
  const streak = state?.streak ?? 0;
  const wrongCount = state?.wrongCount ?? 0;
  const combo = state?.combo ?? 0;
  
  // Calculate base score (without streak bonuses)
  const baseScore = Math.min(score, total); // Simplified for display
  const percentage = total > 0 ? Math.round((baseScore / total) * 100) : 0;
  
  // Determine performance message
  const getPerformanceMessage = () => {
    if (heartAttack) {
      if (wrongCount >= 3) {
        return "Three wrong answers ended your challenge!";
      }
      return "Your avatar suffered a catastrophic system failure!";
    }
    if (percentage >= 90) return "OUTSTANDING! You're a Heart Hero elite!";
    if (percentage >= 70) return "EXCELLENT WORK! Challenge accomplished!";
    if (percentage >= 50) return "GOOD EFFORT! Room for improvement.";
    return "CHALLENGE FAILED! Need more training, soldier!";
  };
  
  // Determine performance color
  const getPerformanceColor = () => {
    if (heartAttack) return "text-red-600";
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-orange-600";
  };

  // Determine medal based on score
  const getMedal = () => {
    if (heartAttack) return "💔";
    if (percentage >= 90) return "🥇";
    if (percentage >= 70) return "🥈";
    if (percentage >= 50) return "🥉";
    return "📚";
  };

  // Determine rank based on score
  const getRank = () => {
    if (heartAttack) return "FAILED";
    if (percentage >= 90) return "ELITE";
    if (percentage >= 70) return "VETERAN";
    if (percentage >= 50) return "CADET";
    return "RECRUIT";
  };

  // Generate cracked points based on wrong answers
  const generateCrackedPoints = () => {
    const wrongCount = total - Math.min(baseScore, total);
    // For demo purposes, we'll crack the first N points
    return Array.from({length: Math.min(wrongCount, 10)}, (_, i) => i + 1);
  };

  const crackedPoints = generateCrackedPoints();

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className={`rounded-3xl shadow-xl p-8 text-center ${
          heartAttack 
            ? "bg-gradient-to-br from-red-100 to-red-50 border border-red-200" 
            : "bg-white border border-cyan-100"
        }`}>
          {heartAttack ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="text-6xl mb-4">💔</div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">CHALLENGE FAILED!</h1>
              <p className="text-xl mb-6 text-red-600">
                {wrongCount >= 3 
                  ? "THREE WRONG ANSWERS!" 
                  : "SYSTEM CRITICAL - AVATAR LOST"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">
                {getMedal()}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">CHALLENGE COMPLETE!</h1>
              <p className="text-xl mb-6 text-gray-700">Rank Achieved: {getRank()}</p>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-5xl font-bold my-6 ${
              heartAttack ? "text-red-600" : getPerformanceColor()
            }`}
          >
            {baseScore}<span className="text-2xl">/{total}</span>
          </motion.div>
          
          {/* Stats Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Streak Display */}
            {streak > 0 && !heartAttack && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-yellow-300"
              >
                <div className="font-bold text-orange-700">🔥 Best Streak: {streak}</div>
              </motion.div>
            )}
            
            {/* Combo Display */}
            {combo > 0 && !heartAttack && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border border-purple-300"
              >
                <div className="font-bold text-indigo-700">🎯 Best Combo: {combo}</div>
              </motion.div>
            )}
            
            {/* Wrong Count Display */}
            {wrongCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border border-red-300"
              >
                <div className="font-bold text-red-700">❌ Wrong Answers: {wrongCount}/3</div>
              </motion.div>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
              <div 
                className={`h-6 rounded-full flex items-center justify-end pr-3 ${
                  heartAttack 
                    ? "bg-red-500" 
                    : percentage >= 80 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                      : percentage >= 60 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                        : percentage >= 40
                          ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                          : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}
                style={{ width: `${Math.max(percentage, 5)}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {percentage}%
                </span>
              </div>
            </div>
            <p className={`font-medium ${heartAttack ? "text-red-600" : "text-gray-600"}`}>
              {percentage}% ACCURACY
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-xl mb-8 ${heartAttack ? "text-red-600" : "text-gray-700"}`}
          >
            {getPerformanceMessage()}
          </motion.p>
          
          {/* Heart Visualization Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">HEART SYSTEM ANALYSIS</h3>
            <div className="flex justify-center">
              <CrackingHeart crackedPoints={crackedPoints} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/" 
              className={`px-6 py-3 rounded-lg font-bold text-center ${
                heartAttack 
                  ? "bg-white text-red-700 border border-red-200 hover:bg-red-50" 
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
              } transition shadow-md`}
            >
              RETURN TO HOME
            </Link>
            {!heartAttack && (
              <Link 
                to={`/quiz/${level}`} 
                className="px-6 py-3 bg-white text-gray-700 rounded-lg font-bold text-center border border-cyan-200 hover:bg-cyan-50 transition shadow-sm"
              >
                RETRY CHALLENGE
              </Link>
            )}
            <Link 
              to="/level" 
              className={`px-6 py-3 rounded-lg font-bold text-center ${
                heartAttack 
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600" 
                  : "bg-white text-gray-700 border border-cyan-200 hover:bg-cyan-50"
              } transition shadow-sm`}
            >
              {heartAttack ? "NEW CHALLENGE" : "ALL CHALLENGES"}
            </Link>
          </motion.div>
        </div>
        
        {!heartAttack && percentage >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-6 text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl border border-green-200"
          >
            <p className="font-bold">🌟 ELITE PERFORMANCE! Ready for your next challenge, Heart Hero?</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}