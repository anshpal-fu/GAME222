import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Level from "./pages/Level";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import GameIntro from "./components/GameIntro";
import GameIntroWithAvatar from "./components/GameIntroWithAvatar";
import Navigation from "./components/Navigation";

export default function App() {
  const [showAnimatedIntro, setShowAnimatedIntro] = useState(true);
  const [showAvatarIntro, setShowAvatarIntro] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);

  useEffect(() => {
    // Check if intro has been completed in this session
    const isIntroCompleted = sessionStorage.getItem('introCompleted');
    
    if (isIntroCompleted) {
      // Intro already completed in this session, don't show again
      setShowAnimatedIntro(false);
      setIntroCompleted(true);
    }
  }, []);

  const handleAnimatedIntroComplete = () => {
    setShowAnimatedIntro(false);
    setShowAvatarIntro(true);
  };

  const handleAvatarIntroComplete = () => {
    setShowAvatarIntro(false);
    setIntroCompleted(true);
    // Mark intro as completed in sessionStorage
    sessionStorage.setItem('introCompleted', 'true');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyan-50">
        {showAnimatedIntro && <GameIntro onIntroComplete={handleAnimatedIntroComplete} />}
        {showAvatarIntro && <GameIntroWithAvatar onComplete={handleAvatarIntroComplete} />}
        {!showAnimatedIntro && !showAvatarIntro && (
          <>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/level" element={<Level />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}