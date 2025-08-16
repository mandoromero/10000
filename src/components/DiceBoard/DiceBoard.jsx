import { useSelector } from "react-redux";
import Die from "../Die/Die.jsx";
import "../DiceBoard/DiceBoard.css";

/**
 * Displays the full set of dice on the board.
 * Pulls dice state from Redux and renders one <Die> per item.
 *
 * @param {boolean} isRolling - Whether all dice are currently rolling.
 */
export default function DiceBoard({ isRolling }) {
  // Get dice array from Redux store
  const dice = useSelector((state) => state.dice.dice);
  
  return (
    <div className="dice-board">
      {dice.map((die, index) => (
    
        <Die
          key={index}              // Unique key for each die
          index={index}            // Position in array
          value={die.value}        // Dice face value (1–6)
          sideIndex={die.sideIndex} // Variant image index (0–3)
          held={die.held}          // Whether die is held
          isRolling={isRolling}    // Pass rolling state
        />
      ))}
    </div>
  );
}
