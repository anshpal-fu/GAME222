import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QUESTIONS from "../data/questions";
import HealthBar from "../components/HealthBar";
import Avatar from "../components/Avatar";
import Confetti from "../components/Confetti";
import ProgressBar from "../components/ProgressBar";
import CrackingHeart from "../components/CrackingHeart";
import DoctorAvatar from "../components/DoctorAvatar";
import PowerUp from "../components/PowerUp";
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
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isHeartAttack, setIsHeartAttack] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]); // Track wrong answers for heart visualization
  const [streak, setStreak] = useState(0); // Track correct answer streak
  const [achievements, setAchievements] = useState([]); // Track unlocked achievements
  const [wrongCount, setWrongCount] = useState(0); // Track number of wrong answers
  const [powerUps, setPowerUps] = useState({ 
    healthBoost: { quantity: 1, used: false },
    streakMultiplier: { quantity: 1, used: false },
    timeExtension: { quantity: 1, used: false }
  }); // Track power-ups
  const [timeLeft, setTimeLeft] = useState(30); // Timer for each question
  const [timerActive, setTimerActive] = useState(true); // Timer active state
  const [combo, setCombo] = useState(0); // Combo counter for consecutive correct answers

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      // Time's up - treat as wrong answer
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, isAnswered]);

  // Handle time up
  const handleTimeUp = () => {
    setIsAnswered(true);
    setWrongCount(prev => prev + 1);
    setHealth(h => Math.max(0, h - 15));
    setFeedback({
      message: "Time's up! Better luck next time.",
      type: "error"
    });
    
    // Track wrong answers for heart visualization
    const heartPointMap = {};
    questions.forEach((q, i) => {
      heartPointMap[q.id] = i + 1;
    });
    
    const current = questions[idx];
    const pointId = heartPointMap[current.id];
    if (pointId && !wrongAnswers.includes(pointId)) {
      setWrongAnswers(prev => [...prev, pointId]);
    }
    
    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setCombo(0); // Reset combo on wrong answer
      if (idx + 1 < total && wrongCount < 2) { // Continue if less than 3 wrong answers
        setIdx(i => i + 1);
      } else {
        navigate("/result", { state: { score, total, level: id, streak, wrongCount: wrongCount + 1 } });
      }
    }, 2000);
  };

  useEffect(() => {
    setIdx(0);
    setHealth(100);
    setScore(0);
    setIsHeartAttack(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setWrongAnswers([]);
    setStreak(0);
    setAchievements([]);
    setWrongCount(0);
    setTimeLeft(30);
    setTimerActive(true);
    setCombo(0);
    setPowerUps({
      healthBoost: { quantity: 1, used: false },
      streakMultiplier: { quantity: 1, used: false },
      timeExtension: { quantity: 1, used: false }
    });
  }, [id]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg border border-cyan-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">CHALLENGE NOT AVAILABLE</h2>
          <p className="text-gray-600 mb-6">This challenge doesn't have any questions yet. Contact mission control!</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition shadow-md"
          >
            RETURN TO HOME
          </button>
        </motion.div>
      </div>
    );
  }

  const current = questions[idx];

  // Use power-up function
  const usePowerUp = (type) => {
    if (powerUps[type].quantity > 0 && !powerUps[type].used) {
      setPowerUps(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          quantity: prev[type].quantity - 1,
          used: true
        }
      }));
      
      switch (type) {
        case 'healthBoost':
          setHealth(h => Math.min(100, h + 20));
          setFeedback({
            message: "Health Boost activated! +20 health points",
            type: "success"
          });
          break;
        case 'timeExtension':
          setTimeLeft(t => t + 10);
          setFeedback({
            message: "Time Extension activated! +10 seconds",
            type: "success"
          });
          break;
        default:
          break;
      }
      
      // Clear feedback after a delay
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  function onSelect(choiceIndex) {
    if (isAnswered) return;
    
    setTimerActive(false); // Stop the timer
    setSelectedOption(choiceIndex);
    setIsAnswered(true);
    
    const correct = choiceIndex === current.answer;
    if (correct) {
      // Calculate streak bonus
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Update combo
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Base points
      let points = 1;
      
      // Streak bonus
      const streakBonus = Math.min(newStreak * 2, 10); // Max 10 bonus points
      
      // Time bonus
      const timeBonus = Math.floor(timeLeft / 3);
      
      // Combo bonus
      const comboBonus = newCombo >= 3 ? newCombo * 2 : 0;
      
      // Power-up multiplier
      const multiplier = powerUps.streakMultiplier.quantity > 0 && !powerUps.streakMultiplier.used ? 2 : 1;
      
      // Calculate total points
      const totalPoints = (points + streakBonus + timeBonus + comboBonus) * multiplier;
      
      setScore(s => s + totalPoints);
      setHealth(h => Math.min(100, h + 10 + Math.floor(streakBonus / 2)));
      
      setFeedback({
        message: `${current.feedback.correct} ${streakBonus > 0 ? `(+${streakBonus} streak bonus!)` : ''} ${timeBonus > 0 ? `(+${timeBonus} time bonus!)` : ''} ${comboBonus > 0 ? `(+${comboBonus} combo bonus!)` : ''} ${multiplier > 1 ? `(2x multiplier!)` : ''}`,
        type: "success"
      });
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
      
      // Check for achievements
      const newAchievements = [...achievements];
      if (newStreak === 3 && !newAchievements.includes('3-in-a-row')) {
        newAchievements.push('3-in-a-row');
      }
      if (idx === 4 && !newAchievements.includes('halfway')) {
        newAchievements.push('halfway');
      }
      if (newCombo === 5 && !newAchievements.includes('combo-master')) {
        newAchievements.push('combo-master');
      }
      if (newAchievements.length > achievements.length) {
        setAchievements(newAchievements);
      }
    } else {
      setStreak(0); // Reset streak on wrong answer
      setCombo(0); // Reset combo on wrong answer
      setWrongCount(prev => prev + 1); // Increment wrong answer count
      setHealth(h => Math.max(0, h - 15));
      setFeedback({
        message: current.feedback.incorrect,
        type: "error"
      });
      
      // Track wrong answers for heart visualization
      const heartPointMap = {};
      questions.forEach((q, i) => {
        heartPointMap[q.id] = i + 1;
      });
      
      const pointId = heartPointMap[current.id];
      if (pointId && !wrongAnswers.includes(pointId)) {
        setWrongAnswers(prev => [...prev, pointId]);
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setTimerActive(true);
      // Reset power-up usage for next question
      setPowerUps(prev => ({
        healthBoost: { ...prev.healthBoost, used: false },
        streakMultiplier: { ...prev.streakMultiplier, used: false },
        timeExtension: { ...prev.timeExtension, used: false }
      }));
      if (idx + 1 < total && wrongCount < 3) { // Continue if less than 3 wrong answers
        setIdx(i => i + 1);
      } else {
        // go to result with state
        navigate("/result", { state: { score: correct ? score + 1 : score, total, level: id, streak, wrongCount, combo } });
      }
    }, 2000);
  }

  // if health drops to 0 or 3 wrong answers -> "heart attack" event
  useEffect(() => {
    if ((health <= 0 || wrongCount >= 3) && !isHeartAttack) {
      setIsHeartAttack(true);
      setTimeout(() => {
        navigate("/result", { state: { score, total, level: id, heartAttack: true, streak, wrongCount, combo } });
      }, 3000);
    }
  }, [health, isHeartAttack, navigate, score, total, id, streak, wrongCount, combo]);

  // Get avatar message based on health and progress
  const getAvatarMessage = () => {
    const progress = (idx + 1) / total;
    
    if (health > 70) {
      if (streak >= 3) return `AMAZING STREAK! ${streak} correct in a row!`;
      if (combo >= 5) return `COMBO MASTER! ${combo} correct answers in a row!`;
      if (progress > 0.8) return "EXCELLENT! Almost there, champion!";
      if (progress > 0.5) return "GREAT JOB! You're halfway to becoming a Heart Hero!";
      return "EXCELLENT! Keep up the stellar work, champion!";
    }
    if (health > 40) {
      if (progress > 0.7) return "STRONG FINISH! Just a bit more to go!";
      return "STEADY ON! Just stay focused and you'll ace this challenge!";
    }
    if (health > 15) {
      if (streak >= 2) return `NICE RECOVERY! You're back on track!`;
      return "WARNING! Critical systems failing! Make every shot count!";
    }
    return "SYSTEM FAILURE IMMINENT! One more mistake and...";
  };

  // Health status indicator
  const getHealthStatus = () => {
    if (health > 70) return { text: "OPTIMAL", color: "text-green-600" };
    if (health > 40) return { text: "STABLE", color: "text-blue-600" };
    if (health > 15) return { text: "CRITICAL", color: "text-orange-600" };
    return { text: "FATAL", color: "text-red-600" };
  };

  const healthStatus = getHealthStatus();
  
  // Get achievement message
  const getAchievementMessage = () => {
    if (achievements.includes('3-in-a-row') && achievements.indexOf('3-in-a-row') === achievements.length - 1) {
      return "🔥 Achievement Unlocked: 3 in a Row!";
    }
    if (achievements.includes('halfway') && achievements.indexOf('halfway') === achievements.length - 1) {
      return "⭐ Achievement Unlocked: Halfway There!";
    }
    if (achievements.includes('combo-master') && achievements.indexOf('combo-master') === achievements.length - 1) {
      return "🎯 Achievement Unlocked: Combo Master!";
    }
    return "";
  };

  // Get timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600";
    if (timeLeft > 10) return "text-yellow-600";
    return "text-red-600 animate-pulse";
  };

  // Get combo message
  const getComboMessage = () => {
    if (combo >= 5) return `${combo}x Combo!`;
    if (combo >= 3) return `${combo}x Combo Active!`;
    return "";
  };

  if (isHeartAttack) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-3xl border border-red-200 max-w-2xl shadow-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-6xl mb-6"
          >
            💔
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">CHALLENGE FAILED!</h1>
          <p className="text-xl text-red-600 mb-6">
            {wrongCount >= 3 
              ? "Three wrong answers! Your avatar couldn't survive the challenge..." 
              : "Your avatar couldn't survive the challenge..."}
          </p>
          <p className="text-lg text-gray-700 mb-8">
            But don't worry! You can try again and do better next time.
          </p>
          <div className="animate-pulse text-2xl text-red-500">
            Redirecting to results...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-cyan-200/30 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-blue-200/30 blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-indigo-200/30 blur-xl animate-pulse"></div>
      </div>
      
      {showConfetti && <Confetti />}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Challenge Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HEART HEALTH CHALLENGE</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-600">Question {idx + 1} of {total}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">⏰</span>
                <span className={`text-sm font-bold ${getTimerColor()}`}>{timeLeft}s</span>
              </div>
              {getComboMessage() && (
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {getComboMessage()}
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className={`font-bold ${healthStatus.color}`}>{healthStatus.text}</p>
              <p className="text-xs text-gray-600">Life Support: {health}%</p>
            </div>
            <div className="w-32">
              <HealthBar health={health} />
            </div>
          </div>
        </motion.div>

        {/* Progress Bar, Streak, and Power-ups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((idx) / total) * 100)}%
            </span>
          </div>
          <ProgressBar current={idx} total={total} />
          
          <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">🔥 Streak:</span>
              <div className="flex">
                {[...Array(Math.min(streak, 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold ml-1"
                  >
                    🔥
                  </motion.div>
                ))}
                {streak > 5 && (
                  <span className="ml-2 text-sm font-bold text-yellow-600">+{streak - 5}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">⭐ Score:</span>
              <span className="text-sm font-bold text-gray-800">{score}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">❤️ Lives:</span>
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 mx-1 ${i < wrongCount ? 'text-gray-300' : 'text-red-500'}`}
                  >
                    {i < wrongCount ? '🤍' : '❤️'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Power-ups Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-2">POWER-UPS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <PowerUp 
              type="healthBoost" 
              isActive={powerUps.healthBoost.quantity > 0} 
              onClick={() => usePowerUp('healthBoost')}
              quantity={powerUps.healthBoost.quantity}
            />
            <PowerUp 
              type="streakMultiplier" 
              isActive={powerUps.streakMultiplier.quantity > 0} 
              onClick={() => usePowerUp('streakMultiplier')}
              quantity={powerUps.streakMultiplier.quantity}
            />
            <PowerUp 
              type="timeExtension" 
              isActive={powerUps.timeExtension.quantity > 0} 
              onClick={() => usePowerUp('timeExtension')}
              quantity={powerUps.timeExtension.quantity}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Panel with Enhanced Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-bl-full opacity-50"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-semibold text-gray-800">HEART HEALTH CHALLENGE</h2>
                <div className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-xs font-bold">
                  Q{idx + 1}
                </div>
              </div>
              
              <div className="relative z-10">
                <motion.h3 
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {current.question}
                </motion.h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {current.options.map((o, i) => {
                      const isSelected = selectedOption === i;
                      const isCorrect = i === current.answer;
                      let optionStyle = "p-4 rounded-xl border-2 border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all text-left font-medium text-gray-700 relative overflow-hidden";
                      
                      if (isAnswered) {
                        if (isCorrect) {
                          optionStyle = "p-4 rounded-xl border-2 border-green-500 bg-green-50 text-green-800 font-bold relative overflow-hidden";
                        } else if (isSelected && !isCorrect) {
                          optionStyle = "p-4 rounded-xl border-2 border-red-500 bg-red-50 text-red-800 font-bold relative overflow-hidden";
                        }
                      } else if (isSelected) {
                        optionStyle = "p-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-800 relative overflow-hidden";
                      }
                      
                      return (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i + 0.6 }}
                          whileHover={!isAnswered ? { scale: 1.02 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                          onClick={() => onSelect(i)}
                          className={optionStyle}
                          disabled={isAnswered}
                        >
                          {/* Animated background for selected options */}
                          {isSelected && !isAnswered && (
                            <motion.div 
                              className="absolute inset-0 bg-blue-200 opacity-30"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          <span className="font-bold text-gray-500 mr-2 relative z-10">{String.fromCharCode(65 + i)}.</span>
                          <span className="relative z-10">{o}</span>
                          
                          {/* Checkmark or X for answered options */}
                          {isAnswered && (
                            <div className="absolute top-3 right-3 text-xl">
                              {isCorrect ? "✅" : (isSelected ? "❌" : "")}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
              
              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-4 rounded-xl relative overflow-hidden ${
                      feedback.type === "success" 
                        ? "bg-green-50 border border-green-200 text-green-800" 
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {/* Animated background for feedback */}
                    {feedback.type === "success" ? (
                      <motion.div 
                        className="absolute inset-0 bg-green-200 opacity-20"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <motion.div 
                        className="absolute inset-0 bg-red-200 opacity-20"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    
                    <div className="flex items-start relative z-10">
                      <span className="text-xl mr-2">
                        {feedback.type === "success" ? "✅" : "❌"}
                      </span>
                      <p>{feedback.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Achievement Notification */}
              <AnimatePresence>
                {getAchievementMessage() && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-xl text-center relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-yellow-200 opacity-30"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="font-bold text-orange-700 relative z-10">🎉 {getAchievementMessage()}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Heart Visualization and Doctor Avatar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CrackingHeart 
                crackedPoints={wrongAnswers} 
                totalPoints={10}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <DoctorAvatar 
                healthStatus={health}
                message={getAvatarMessage()}
                wrongAnswers={wrongAnswers.length}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}