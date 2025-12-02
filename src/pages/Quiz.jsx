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
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]); // Track wrong answers for heart visualization
  const [streak, setStreak] = useState(0); // Track correct answer streak
  const [wrongCount, setWrongCount] = useState(0); // Track number of wrong answers
  const [powerUps, setPowerUps] = useState({ 
    healthBoost: { quantity: 1, used: false },
    streakMultiplier: { quantity: 1, used: false },
    timeExtension: { quantity: 1, used: false }
  }); // Track power-ups
  const [timeLeft, setTimeLeft] = useState(30); // Timer for each question
  const [timerActive, setTimerActive] = useState(true); // Timer active state
  const [combo, setCombo] = useState(0); // Combo counter for consecutive correct answers
  const [energy, setEnergy] = useState(100); // Energy meter for special abilities
  const [shieldActive, setShieldActive] = useState(false); // Shield protection
  const [shieldUses, setShieldUses] = useState(1); // Number of shield uses remaining
  const [heartAnimation, setHeartAnimation] = useState({ scale: 1, rotate: 0 }); // Heart animation state
  const [battleEffects, setBattleEffects] = useState([]); // Battle effects like explosions, sparks, etc.
  const [screenShake, setScreenShake] = useState(false); // Screen shake effect for critical moments
  const [glowPulse, setGlowPulse] = useState(false); // Glow pulse effect for correct answers
  const [criticalWarning, setCriticalWarning] = useState(false); // Critical health warning
  const [feedback, setFeedback] = useState(null);

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
    
    // Heart shake animation for wrong answer
    setHeartAnimation({ scale: [1, 0.9, 1], rotate: [0, -5, 5, 0] });
    
    // Add battle effect for wrong answer
    addBattleEffect('timeUp');
    
    // Screen shake effect
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
    
    setTimeout(() => setHeartAnimation({ scale: 1, rotate: 0 }), 1000);
    
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
        navigate("/result", { state: { score, total, level: id, streak, wrongCount: wrongCount + 1, combo } });
      }
    }, 2000);
  };

  // Add battle effect
  const addBattleEffect = (type) => {
    const newEffect = {
      id: Date.now(),
      type,
      x: Math.random() * 100,
      y: Math.random() * 100,
    };
    setBattleEffects(prev => [...prev, newEffect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setBattleEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 2000);
  };

  // Critical health warning effect
  useEffect(() => {
    if (health <= 20) {
      setCriticalWarning(true);
    } else {
      setCriticalWarning(false);
    }
  }, [health]);

  useEffect(() => {
    setIdx(0);
    setHealth(100);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setWrongAnswers([]);
    setStreak(0);
    setWrongCount(0);
    setTimeLeft(30);
    setTimerActive(true);
    setCombo(0);
    setEnergy(100);
    setShieldActive(false);
    setShieldUses(1);
    setPowerUps({
      healthBoost: { quantity: 1, used: false },
      streakMultiplier: { quantity: 1, used: false },
      timeExtension: { quantity: 1, used: false }
    });
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
          addBattleEffect('healthBoost');
          
          // Glow pulse effect
          setGlowPulse(true);
          setTimeout(() => setGlowPulse(false), 1000);
          break;
        case 'timeExtension':
          setTimeLeft(t => t + 10);
          setFeedback({
            message: "Time Extension activated! +10 seconds",
            type: "success"
          });
          addBattleEffect('timeExtension');
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

  // Activate shield
  const activateShield = () => {
    if (shieldUses > 0 && !shieldActive) {
      setShieldActive(true);
      setShieldUses(prev => prev - 1);
      setFeedback({
        message: "🛡️ Shield activated! Protected from one wrong answer",
        type: "success"
      });
      addBattleEffect('shield');
      
      // Screen flash effect
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      
      // Shield deactivates after 30 seconds
      setTimeout(() => {
        setShieldActive(false);
        setFeedback({
          message: "🛡️ Shield deactivated",
          type: "info"
        });
        
        setTimeout(() => {
          setFeedback(null);
        }, 1500);
      }, 30000);
    }
  };

  // Use energy ability
  const useEnergyAbility = () => {
    if (energy >= 30) {
      setEnergy(e => e - 30);
      setTimeLeft(t => t + 15);
      setFeedback({
        message: "⚡ Energy Burst! +15 seconds",
        type: "success"
      });
      addBattleEffect('energyBurst');
      
      // Screen flash effect
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 500);
      
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
      // Heart glow animation for correct answer
      setHeartAnimation({ scale: [1, 1.1, 1], rotate: 0 });
      
      // Add battle effect for correct answer
      addBattleEffect('correct');
      
      // Screen flash effect
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 500);
      
      setTimeout(() => setHeartAnimation({ scale: 1, rotate: 0 }), 1000);
      
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
      setEnergy(e => Math.min(100, e + 5)); // Gain energy for correct answers
      
      setFeedback({
        message: `${current.feedback.correct} ${streakBonus > 0 ? `(+${streakBonus} streak bonus!)` : ''} ${timeBonus > 0 ? `(+${timeBonus} time bonus!)` : ''} ${comboBonus > 0 ? `(+${comboBonus} combo bonus!)` : ''} ${multiplier > 1 ? `(2x multiplier!)` : ''}`,
        type: "success"
      });
      
      // Check for achievements
      if (newStreak === 3) {
        addBattleEffect('achievement');
      }
      if (newCombo === 5) {
        addBattleEffect('combo');
      }
    } else {
      // Heart shake animation for wrong answer
      setHeartAnimation({ scale: [1, 0.9, 1], rotate: [0, -5, 5, 0] });
      
      // Add battle effect for wrong answer
      addBattleEffect('wrong');
      
      // Screen shake effect
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
      
      setTimeout(() => setHeartAnimation({ scale: 1, rotate: 0 }), 1000);
      
      // Wrong answer logic
      if (shieldActive) {
        // Shield protects from damage
        setShieldActive(false);
        setFeedback({
          message: "🛡️ Shield protected you from damage!",
          type: "info"
        });
      } else {
        setStreak(0); // Reset streak on wrong answer
        setCombo(0); // Reset combo on wrong answer
        setWrongCount(prev => prev + 1); // Increment wrong answer count
        setHealth(h => Math.max(0, h - 15));
        setFeedback({
          message: current.feedback.incorrect,
          type: "error"
        });
      }
      
      // Track wrong answers for heart visualization
      const heartPointMap = {};
      questions.forEach((q, i) => {
        heartPointMap[q.id] = i + 1;
      });
      
      const pointId = heartPointMap[current.id];
      if (pointId && !wrongAnswers.includes(pointId) && !shieldActive) {
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

  // Get timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600";
    if (timeLeft > 10) return "text-yellow-600";
    return "text-red-600 animate-pulse";
  };

  // Get energy color
  const getEnergyColor = () => {
    if (energy > 70) return "from-green-400 to-emerald-500";
    if (energy > 40) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-red-500";
  };

  // Calculate progress percentage
  const progressPercentage = ((idx + 1) / total) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 p-6 relative overflow-hidden ${screenShake ? 'animate-shake' : ''} ${glowPulse ? 'animate-glow' : ''}`}>
      {/* Custom animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #38bdf8, 0 0 20px #38bdf8; }
          100% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #38bdf8, 0 0 40px #38bdf8; }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-glow {
          animation: glow 0.5s ease-in-out infinite alternate;
        }
        ${criticalWarning && `
          @keyframes pulse-border {
            0% { border-color: #ef4444; }
            50% { border-color: #fecaca; }
            100% { border-color: #ef4444; }
          }
          .critical-warning {
            animation: pulse-border 1s infinite;
          }
        `}
      `}</style>
      
      {/* Soft radial glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-200/30 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl"></div>
      </div>
      
      {/* Battle Effects */}
      <AnimatePresence>
        {battleEffects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {effect.type === 'correct' && <div className="text-4xl">✨</div>}
            {effect.type === 'wrong' && <div className="text-4xl">💥</div>}
            {effect.type === 'healthBoost' && <div className="text-4xl">💚</div>}
            {effect.type === 'timeExtension' && <div className="text-4xl">⏰</div>}
            {effect.type === 'shield' && <div className="text-4xl">🛡️</div>}
            {effect.type === 'energyBurst' && <div className="text-4xl">⚡</div>}
            {effect.type === 'timeUp' && <div className="text-4xl">⏱️</div>}
            {effect.type === 'achievement' && <div className="text-4xl">🏆</div>}
            {effect.type === 'combo' && <div className="text-4xl">🔥</div>}
          </motion.div>
        ))}
      </AnimatePresence>
      
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
          
          {/* Timer */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">⏰</span>
            <span className={`text-lg font-bold ${getTimerColor()}`}>{timeLeft}s</span>
          </div>
        </div>
        
        {/* Main Content - Split Screen */}
        <div className="flex flex-1 gap-8 h-[calc(100vh-120px)]">
          {/* Left Side - Heart Character (40%) */}
          <div className="w-2/5 flex flex-col items-center justify-center">
            <motion.div
              className="relative"
              animate={heartAnimation}
              transition={{ duration: 0.5 }}
            >
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-400 rounded-full blur-2xl opacity-40 -z-10"></div>
              
              {/* Heart character */}
              <div className="relative">
                <div className="relative w-64 h-64">
                  <img 
                    src="/src/assets/heart.png" 
                    alt="Heart Character" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Heart pulse animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-400 rounded-full blur-xl opacity-30 -z-10"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
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
            
            {/* Power-ups Section */}
            <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
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
            
            {/* Shield and Energy Burst */}
            <div className="mt-4 flex gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={activateShield}
                className={`relative p-3 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg cursor-pointer ${
                  shieldUses === 0 ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="text-xl mr-2">🛡️</div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-xs">Shield</div>
                  </div>
                  {shieldUses > 0 && (
                    <div className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                      {shieldUses}
                    </div>
                  )}
                </div>
                
                {shieldUses === 0 && (
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">LOCKED</span>
                  </div>
                )}
                
                {shieldActive && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={useEnergyAbility}
                className={`relative p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg cursor-pointer ${
                  energy < 30 ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="text-xl mr-2">⚡</div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-xs">Burst</div>
                  </div>
                </div>
                
                {energy < 30 && (
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">LOW</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Right Side - Question & Options (60%) */}
          <div className="w-3/5 flex flex-col">
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 flex-1 flex flex-col ${criticalWarning ? 'border-red-500 border-2' : ''}`}
            >
              {/* Question Counter and Stats */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-cyan-600 font-medium">Question {idx + 1} of {total}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">🔥</span>
                    <span className="text-sm font-bold text-amber-600">{streak}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">⚡</span>
                    <span className="text-sm font-bold text-blue-600">{energy}%</span>
                  </div>
                </div>
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
                      : feedback.type === "error"
                      ? "bg-red-100 border border-red-200 text-red-800"
                      : "bg-blue-100 border border-blue-200 text-blue-800"
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

// PowerUp component inline
const PowerUp = ({ type, isActive, onClick, quantity }) => {
  const powerUpData = {
    healthBoost: {
      icon: "💊",
      name: "Health",
      description: "Restores 20 health",
      color: "from-green-400 to-emerald-500"
    },
    streakMultiplier: {
      icon: "✨",
      name: "Streak",
      description: "2x points",
      color: "from-yellow-400 to-orange-500"
    },
    timeExtension: {
      icon: "⏰",
      name: "Time",
      description: "+10 seconds",
      color: "from-blue-400 to-cyan-500"
    }
  };

  const data = powerUpData[type] || powerUpData.healthBoost;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-2 rounded-lg bg-gradient-to-br ${data.color} shadow cursor-pointer ${
        !isActive ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="text-lg">{data.icon}</div>
        <div className="font-bold text-white text-xs mt-1">{data.name}</div>
        {quantity > 0 && (
          <div className="bg-white/30 rounded-full w-4 h-4 flex items-center justify-center text-white text-[8px] font-bold mt-1">
            {quantity}
          </div>
        )}
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">LOCKED</span>
        </div>
      )}
    </motion.div>
  );
};