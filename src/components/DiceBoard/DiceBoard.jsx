import { useDispatch, useSelector } from "react-redux";
import Die from "../Die/Die.jsx";
import "../DiceBoard/DiceBoard.css";

export default function DiceBoard({ isRolling }) {
  const dispatch = useDispatch();
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
