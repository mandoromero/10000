import { useState } from "react";
import { useDispatch } from "react-redux";
import { rollDice } from "../../redux/diceSlice.js";
import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import "../GameBoard/GameBoard.css";

export default function GameBoard() {
    const dispatch = useDispatch();
    const [rolling, setRolling] = useState(false);

    const handleRoll = () => {
    setRolling(true);
    setTimeout(() => {
      dispatch(rollDice());
      setRolling(false);
    }, 1000); // delay matches animation
  };

    return (
        <div className="game-board">
            <ScoreKeeper />
            <DiceBoard />
            <GameButtons />
        </div>
    )
}