import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { regularRoll } from "../../redux/diceSlice.js";

import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import Winning from "../Winning/Winning.jsx";

import "../GameBoard/GameBoard.css";

export default function GameBoard() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);

  const {
    gameStarted,
    activePlayer,
    smoked,
    winner,
  } = useSelector((state) => state.dice);

  const gameOver = !!winner || !gameStarted;

  // ✅ FIXED roll handler
  const handleRoll = () => {
    if (!gameStarted || winner || smoked || rolling) return;

    setRolling(true);

    // 🔥 IMPORTANT: roll dice FIRST
    dispatch(regularRoll());

    // then let animation play
    setTimeout(() => {
      setRolling(false);
    }, 600);
  };

  return (
    <div className="game-board">
      <ScoreKeeper activePlayer={activePlayer} />
      <Winning />

      <div className={`board-container ${gameOver ? "disabled" : ""}`}>
        <DiceBoard isRolling={rolling} />
        <GameButtons
          onRoll={handleRoll}
          rollDisabled={rolling || smoked}
        />
      </div>

      <SmokedModal show={smoked} />
    </div>
  );
}
