import { useSelector } from "react-redux";
import Die from "../Die/Die.jsx";
import "./DiceBoard.css";

export default function DiceBoard({ isRolling }) {
  const dice = useSelector((state) => state.dice.dice);
  const winner = useSelector((state) => state.dice.winner);
  const gameStarted = useSelector((state) => state.dice.gameStarted);

  return (
    <div className={`dice-board ${winner ? "disabled" : ""}`}>
      <div className="dice-row">
        {dice.map((die, idx) => (
          <Die
            key={idx}
            idx={idx}
            value={die.value}
            sideIndex={die.sideIndex}
            held={die.held} // Removed die.locked
            isRolling={isRolling && gameStarted && !winner}
          />
        ))}
      </div>
    </div>
  );
}
