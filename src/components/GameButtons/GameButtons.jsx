import { useDispatch, useSelector } from "react-redux";
import { rollDice } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

/**
 * Displays main game control buttons: Roll, Bank, End Turn.
 * @param {Function} onStart - Function to start the game (unused here).
 * @param {Function} onRoll - Function to roll the dice.
 * @param {boolean} rollDisabled - Disables the Roll button if true.
 */
export default function GameButtons({ onStart, onRoll, rollDisabled }) {
  const gameStarted = useSelector(state => state.dice.gamestarted);

  return (
    <div className="btns-container">
      {/* Roll button */}
      <button
        onClick={onRoll}
        className="roll-btn"
        disabled={rollDisabled}
      >
        Roll
      </button>

      {/* Bank points button */}
      <button className="bank-btn">Bank</button>
    </div>
  );
}
