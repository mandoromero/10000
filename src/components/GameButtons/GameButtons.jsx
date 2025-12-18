// src/components/GameButtons/GameButtons.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  regularRoll,
  bankPointsAndEndTurn,
} from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled, onRoll }) {
  const dispatch = useDispatch();

  // Redux state
  const {
    gameStarted,
    dice,
    activePlayer,
    turnTotal,
    player1Open,
    player2Open,
    winner,
    smoked,
  } = useSelector((state) => state.dice);

  const allHeld = dice.every((d) => d.held);

  const handleRoll = () => {
    if (!gameStarted || winner || smoked) return;
    onRoll(); // GameBoard controls timing & animation
  };

  const handleBank = () => {
    if (!gameStarted || winner) return;
    dispatch(bankPointsAndEndTurn());
  };

  const bankDisabled =
    !gameStarted ||
    allHeld || // cannot bank if all dice are held
    (activePlayer === "player1" && !player1Open && turnTotal < 1000) ||
    (activePlayer === "player2" && !player2Open && turnTotal < 1000);

  return (
    <div className="black-container">
      <div className="btns-container">
        <button
          className="roll-btn"
          onClick={handleRoll}
          disabled={!gameStarted || rollDisabled || !!winner || smoked}
        >
          Roll
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
