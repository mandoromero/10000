import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar";
import Rules from "../src/components/Rules/Rules.jsx";
import Score from "../src/components/Score/Score.jsx";
import GameBoard from "../src/components/GameBoard/GameBoard.jsx"
import Header from "./components/Header/Header.jsx";  

function App() {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="main-container">
      <Navbar onShowRules={() => setShowRules(true)} />
      
      {showRules && (
        <div className="rules-score">
          <Rules />
          <Score />
          <div className="exit-container">
            <button 
              className="exit" 
              onClick={() => setShowRules(false)}
            >
              Exit
            </button>
          </div>
        </div>
      )}
      <Header />
      <GameBoard />
    </div>
  );
}

export default App;
