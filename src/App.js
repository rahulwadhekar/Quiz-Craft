import React, { useEffect, useState } from "react";
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from './components/pages/Home';
import About from './components/pages/About';
import Navbar from './components/pages/Navbar';
import Result from './components/pages/Result';
import Quiz from './components/pages/Quiz';
import SplashScreen from './components/pages/SplashScreen';
import Footer from "./components/pages/Footer";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/result" element={<Result />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
