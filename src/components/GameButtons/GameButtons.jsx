import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  regularRoll,
  bankPointsAndEndTurn,
  nextTurn,
  dismissSmokedOverlay,
} from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();

  // Redux state
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const dice = useSelector((state) => state.dice.dice);
  const activePlayer = useSelector((state) => state.dice.activePlayer);
  const turnTotal = useSelector((state) => state.dice.turnTotal);
  const player1Open = useSelector((state) => state.dice.player1Open);
  const player2Open = useSelector((state) => state.dice.player2Open);
  const winner = useSelector((state) => state.dice.winner);
  const currentRollScore = useSelector((state) => state.dice.currentRollScore);

  const [isRolling, setIsRolling] = useState(false);

  const allDiceUsed = dice.every((d) => d.held);

  // Handle rolling dice
  const handleRoll = () => {
    if (!gameStarted || winner) return;

    setIsRolling(true);
    dispatch(startRoll());

    setTimeout(() => {
      dispatch(regularRoll());
      dispatch(stopRoll());
      setIsRolling(false);

      // Automatically end turn if no scoring dice
      if (currentRollScore === 0) {
        dispatch(nextTurn());
        dispatch(dismissSmokedOverlay());
      }
    }, 600);
  };

  // Handle banking points
  const handleBank = () => {
    if (!gameStarted || winner) return;
    dispatch(bankPointsAndEndTurn());
  };

  // Determine if bank button should be disabled
  const bankDisabled =
    !gameStarted ||
    allDiceUsed ||
    (activePlayer === "player1" && !player1Open && turnTotal < 1000) ||
    (activePlayer === "player2" && !player2Open && turnTotal < 1000);

  return (
    <div className="black-container">
      <div className="btns-container">
        {/* Roll Button */}
        <button
          onClick={handleRoll}
          className="roll-btn"
          disabled={!gameStarted || rollDisabled || isRolling || !!winner}
        >
          {isRolling ? "Rolling..." : "Roll"}
        </button>

        {/* Bank Button */}
        <button
          onClick={handleBank}
          className="bank-btn"
          disabled={bankDisabled || !!winner}
        >
          Bank
        </button>
      </div>
    </div>
  );
}
