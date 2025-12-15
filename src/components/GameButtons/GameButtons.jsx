// src/components/GameButtons/GameButtons.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  regularRoll,
  bankPointsAndEndTurn,
} from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled, onRoll, onBank }) {
  const dispatch = useDispatch();
  const [isRolling, setIsRolling] = useState(false);

  // Redux state
  const {
    gameStarted,
    dice,
    activePlayer,
    turnTotal,
    player1Open,
    player2Open,
    winner,
  } = useSelector((state) => state.dice);

  // ✅ FIXED: correct held check
  const allHeld = dice.every((d) => d.held);

  // Roll button handler
  const handleRoll = () => {
    if (!gameStarted || winner || isRolling) return;

    setIsRolling(true);
    dispatch(startRoll());

    // Simulate dice rolling animation
    setTimeout(() => {
      dispatch(regularRoll()); // slice handles releasing all dice if needed
      dispatch(stopRoll());
      setIsRolling(false);
    }, 600);
  };

  // Bank button handler
  const handleBank = () => {
    if (!gameStarted || winner) return;
    dispatch(bankPointsAndEndTurn());
  };

  // ✅ FIXED: proper bank disable logic
  const bankDisabled =
    !gameStarted ||
    allHeld || // ⬅️ disable bank if all dice are held
    (activePlayer === "player1" && !player1Open && turnTotal < 1000) ||
    (activePlayer === "player2" && !player2Open && turnTotal < 1000);

  return (
    <div className="black-container">
      <div className="btns-container">
        <button
          className="roll-btn"
          onClick={handleRoll}
          disabled={!gameStarted || rollDisabled || isRolling || !!winner}
        >
          {isRolling ? "Rolling..." : "Roll"}
        </button>

        <button
          className="bank-btn"
          onClick={handleBank}
          disabled={bankDisabled || !!winner}
        >
          Bank
        </button>
      </div>
    </div>
  );
}
