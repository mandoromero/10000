import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  bankPointsAndEndTurn,
} from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const dice = useSelector((state) => state.dice.dice);
  const activePlayer = useSelector((state) => state.dice.activePlayer);
  const turnTotal = useSelector((state) => state.dice.turnTotal);
  const player1Open = useSelector((state) => state.dice.player1Open);
  const player2Open = useSelector((state) => state.dice.player2Open);
  const winner = useSelector((state) => state.dice.winner);

  const [isRolling, setIsRolling] = useState(false);

  const allDiceUsed = dice.every((d) => d.held);

  const handleRoll = () => {
    if (!gameStarted || winner) return;

    setIsRolling(true);
    dispatch(startRoll());

    // simulate dice animation delay
    setTimeout(() => {
      dispatch(stopRoll());
      setIsRolling(false);
    }, 600);
  };

  const handleBank = () => {
    if (!gameStarted || winner) return;
    dispatch(bankPointsAndEndTurn());
  };

  const bankDisabled =
    !gameStarted ||
    allDiceUsed ||
    (activePlayer === "player1" && !player1Open && turnTotal < 1000) ||
    (activePlayer === "player2" && !player2Open && turnTotal < 1000);

  return (
    <div className="btns-container">
      {/* Roll button */}
      <button
        onClick={handleRoll}
        className="roll-btn"
        disabled={!gameStarted || rollDisabled || isRolling || !!winner}
      >
        {isRolling ? "Rolling..." : "Roll"}
      </button>

      {/* Bank button */}
      <button
        onClick={handleBank}
        className="bank-btn"
        disabled={bankDisabled || !!winner}
      >
        Bank
      </button>
    </div>
  );
}
