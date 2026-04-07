import { useSelector } from "react-redux";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import Die from "../Die/Die.jsx";
import "./DiceBoard.css";

export default function DiceBoard({ isRolling }) {

  const dice = useSelector((state) => state.dice.dice);
  const smoked = useSelector((state) => state.dice.smoked);
  const winner = useSelector((state) => state.dice.winner);
  const isDecidingFirstPlayer = useSelector(
    state => state.dice.isDecidingFirstPlayer
  );

  return (
    <div className={`dice-board ${winner || isDecidingFirstPlayer ? "disabled" : ""}`}>
      {smoked && <SmokedModal />}
      <div className="dice-row">
        {dice.map((die, idx) => (
          <Die
            key={`${idx}-${die.value}-${die.held}`}
            idx={idx}
            value={die.value}
            sideIndex={die.sideIndex}
            held={die.held}
            isRolling={
              isRolling &&
              !winner &&
              (
                !isDecidingFirstPlayer ||
                (isDecidingFirstPlayer && (idx === 0 || idx === 5))
              )
            }
          />
        ))}
      </div>
    </div>
  );
}