// src/components/GameButtons/GameButtons.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  regularRoll,
  toggleHold,
  bankPointsAndEndTurn,
} from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled, onRoll }) {
  const dispatch = useDispatch();

  const {
    gameStarted,
    dice,
    activePlayer,
    turnTotal,
    player1Open,
    player2Open,
    winner,
    smoked,
    heldDiceThisTurn,
    currentRollScoringDice,
    bank,
  } = useSelector((state) => state.dice);

  // Player must hold at least one scoring die to roll again
  const scoringHeld = heldDiceThisTurn.length > 0;
  const allDiceHeld = dice.every(d => d.held);
  
  // ----------------- BUTTON HANDLERS -----------------
  const handleRoll = () => {
    if (!gameStarted || winner || smoked) return;
    if (!scoringHeld && heldDiceThisTurn.length > 0) return; // must hold at least one scoring die
    onRoll(); // animation controlled by GameBoard
  };

  const handleBank = () => {
    if (!gameStarted || winner || smoked) return;
    dispatch(bankPointsAndEndTurn());
  };

  // ----------------- DISABLE LOGIC -----------------
  const firstTurn = activePlayer === "player1" ? !player1Open : !player2Open;

  const rollDisabledComputed =
    !gameStarted || smoked || winner || (allDiceHeld && scoringHeld) || rollDisabled;

  const bankDisabled =
    !gameStarted ||
    smoked ||
    winner ||
    (!scoringHeld) || // must hold at least one scoring die before banking
    (firstTurn && bank < 1000); // first turn must bank 1000+

  return (
    <div className="black-container">
      <div className="btns-container">
        <button
          className="roll-btn"
          onClick={handleRoll}
          disabled={rollDisabledComputed}
        >
          Roll
        </button>

        <button
          className="bank-btn"
          onClick={handleBank}
          disabled={bankDisabled}
        >
          Bank
        </button>
      </div>
    </div>
  );
}