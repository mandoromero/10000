import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rollDice } from "../../redux/diceSlice.js";
import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import "../GameBoard/GameBoard.css";

export default function GameBoard() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const startingPlayer = useSelector((state) => state.dice.startingPlayer);

  const handleRoll = () => {
    setRolling(true);

    setTimeout(() => {
      dispatch(rollDice()); // reducer handles randomization
      setRolling(false);
    }, 1000); // match animation duration
  };

  return (
    <div className="game-board">
      <ScoreKeeper activePlayer={startingPlayer} />
      <DiceBoard isRolling={rolling} />
      <GameButtons
        onRoll={handleRoll}
        rollDisabled={!gameStarted || rolling}
      />
    </div>
  );
}
