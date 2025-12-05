import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { regularRoll, dismissSmokedOverlay } from "../../redux/diceSlice.js";

import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import Winning from "../Winning/Winning.jsx";

import "../GameBoard/GameBoard.css";

export default function GameBoard() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);

  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const activePlayer = useSelector((state) => state.dice.activePlayer);
  const smoked = useSelector((state) => state.dice.smoked);
  const winner = useSelector((state) => state.dice.winner);

  // Roll handler
  const handleRoll = () => {
    if (!gameStarted || winner) return;

    setRolling(true);

    // simulate dice rolling animation delay
    setTimeout(() => {
      dispatch(regularRoll());
      setRolling(false);
    }, 600);
  };

  // Smoked overlay auto-dismiss
  useEffect(() => {
    if (smoked) {
      const timeout = setTimeout(() => {
        dispatch(dismissSmokedOverlay());
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [smoked, dispatch]);

  const gameOver = !!winner || !gameStarted;

  return (
    <div className="game-board">
      {/* Player scores */}
      <ScoreKeeper activePlayer={activePlayer} />

      {/* Winning overlay */}
      <Winning />

      {/* Game area */}
      <div className={`board-container ${gameOver ? "disabled" : ""}`}>
        {/* Dice grid */}
        <DiceBoard isRolling={rolling} />

        {/* Roll & Bank buttons */}
        <GameButtons
          onRoll={handleRoll}
          rollDisabled={gameOver || rolling}
        />
      </div>

      {/* Smoked modal */}
      <SmokedModal show={smoked} />
    </div>
  );
}
