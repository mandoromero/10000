import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { regularRoll, dismissSmokedOverlay, bankPointsAndEndTurn } from "../../redux/diceSlice.js";

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

  const gameOver = !!winner || !gameStarted;

  // --- Roll handler ---
  const handleRoll = () => {
    if (!gameStarted || winner) return;

    setRolling(true);

    // Simulate dice rolling animation delay
    setTimeout(() => {
      dispatch(regularRoll());
      setRolling(false);
    }, 600);
  };

  // --- Handle smoked turn ---
  useEffect(() => {
    if (smoked) {
      // Show dice for 3 seconds before switching turn
      const timer = setTimeout(() => {
        dispatch(dismissSmokedOverlay()); // hide smoked overlay
        dispatch(bankPointsAndEndTurn()); // switch turn
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [smoked, dispatch]);

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
          rollDisabled={gameOver || rolling || smoked} // disable roll during smoked delay
        />
      </div>

      {/* Smoked modal */}
      <SmokedModal show={smoked} />
    </div>
  );
}
