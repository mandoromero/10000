import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar.jsx";
import Rules from "./components/Rules/Rules.jsx";
import Score from "./components/Score/Score.jsx";
import GameBoard from "./components/GameBoard/GameBoard.jsx"

function App() {
  const dispatch = useDispatch();
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
      <GameBoard />
    </div>
  );
}

export default App;
