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

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();
  const [isRolling, setIsRolling] = useState(false);

  // Redux state
  const { gameStarted, dice, activePlayer, turnTotal, player1Open, player2Open, winner } =
    useSelector((state) => state.dice);

  const allDiceHeld = dice.every((d) => d.held);

  // Roll button handler
  const handleRoll = () => {
    if (!gameStarted || winner || isRolling) return;

    setIsRolling(true);
    dispatch(startRoll());

    // Simulate dice rolling animation
    setTimeout(() => {
      dispatch(regularRoll());
      dispatch(stopRoll());
      setIsRolling(false);
    }, 600); // match your dice animation timing
  };

  // Bank button handler
  const handleBank = () => {
    if (!gameStarted || winner) return;
    dispatch(bankPointsAndEndTurn());
  };

  // Determine if bank button should be disabled
  const bankDisabled =
    !gameStarted ||
    allDiceHeld ||
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
