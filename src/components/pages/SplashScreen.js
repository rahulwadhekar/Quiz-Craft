import React from "react";
import "../CSSFiles/SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <h1 className="pulse">🚀 Welcome to QuizCraft</h1>
      <p>Preparing your experience...</p>
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}

export default SplashScreen;
