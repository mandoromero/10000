import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { regularRoll, dismissSmokedOverlay, endTurnNoScore } from "../../redux/diceSlice.js";

import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
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

  const handleRoll = () => {
    if (!gameStarted || winner || smoked || rolling) return;

    setRolling(true);

    setTimeout(() => {
      dispatch(regularRoll());
      setRolling(false);
    }, 600);
  };

  console.log("RENDER smoked:", smoked);
  
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

     
    </div>
  );
}