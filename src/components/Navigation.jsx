import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  
  // Don't show navigation on home page or during intro
  if (location.pathname === "/" || location.pathname === "/intro") {
    return null;
  }
  
  return (
    <nav className="bg-white border-b border-cyan-100 shadow-sm py-3 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-cyan-600 font-bold text-lg flex items-center">
          <span className="mr-2">❤️</span>
          Heart Hero
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-cyan-600 font-medium transition"
          >
            Home
          </Link>
          <Link 
            to="/level" 
            className="text-gray-600 hover:text-cyan-600 font-medium transition"
          >
            Challenges
          </Link>
        </div>
      </div>
    </nav>
  );
}