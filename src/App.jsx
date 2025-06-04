import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WinnerPrediction from "./components/WinnerPrediction";
import { NavLink } from "react-router-dom";

export default function CricketPrediction() {
  return (
    <Router>
      <div className="relative min-h-screen w-full bg-black text-white">
        {/* Background Video */}
        <video
          src="/main.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 z-0"
          autoPlay
          loop
          muted
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 w-full px-4">
          {/* Header/Navigation */}
          <header className="py-6 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tighter">CricketAI</div>
          </header>

          {/* Hero Section */}
          <div className="mt-12 md:mt-24 mb-20 md:mb-32">
            <div className="">
              <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter mb-4">
                READY TO PREDICT
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
                Advanced AI-powered cricket performance prediction system that
                analyzes player data to forecast match outcomes with exceptional
                accuracy.
              </p>
            </div>
          </div>
          {/* Routing Section */}
          <Routes>
            <Route path="/" element={<WinnerPrediction />} />
          </Routes>

          {/* Footer */}
          <footer className="border-t border-gray-800 py-8 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-xl font-bold mb-4 md:mb-0">CricketAI</div>
              <div className="text-sm text-gray-400">
                © 2023 CricketAI. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}
