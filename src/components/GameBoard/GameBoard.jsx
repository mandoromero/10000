import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  regularRoll,
  dismissSmokedOverlay,
  bankPointsAndEndTurn,
} from "../../redux/diceSlice.js";

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

  // --- STOP rolling on restart or game end ---
  useEffect(() => {
  if (smoked) {
    const timer = setTimeout(() => {
      dispatch(dismissSmokedOverlay());
      dispatch(bankPointsAndEndTurn());
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [smoked, dispatch]);

  // --- Roll handler ---
  const handleRoll = () => {
    if (!gameStarted || winner || smoked) return;

    setRolling(true);

    setTimeout(() => {
      dispatch(regularRoll());
      setRolling(false);
    }, 600);
  };

  // --- Smoked delay ---
   useEffect(() => {
    if (smoked) {
      // Show rolled dice for 3 seconds, then switch turn
      const timer = setTimeout(() => {
        dispatch(dismissSmokedOverlay());  // hide smoked overlay
        dispatch(bankPointsAndEndTurn()); // end turn automatically
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [smoked, dispatch]);

  return (
    <div className="game-board">
      <ScoreKeeper activePlayer={activePlayer} />
      <Winning />

      <div className={`board-container ${gameOver ? "disabled" : ""}`}>
        <DiceBoard isRolling={rolling} />
        <GameButtons
          onRoll={handleRoll}
          rollDisabled={gameOver || rolling || smoked}
        />
      </div>

      <SmokedModal show={smoked} />
    </div>
  );
}
