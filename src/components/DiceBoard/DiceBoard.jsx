import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { bankPointsAndEndTurn } from "../../redux/diceSlice.js";
import Die from "../Die/Die.jsx";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import "./DiceBoard.css";

export default function DiceBoard({ isRolling }) {
  const dispatch = useDispatch();

  const dice = useSelector((state) => state.dice.dice);
  const winner = useSelector((state) => state.dice.winner);
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const smoked = useSelector(state => state.dice.smoked);
  const isDecidingFirstPlayer = useSelector(
    state => state.dice.isDecidingFirstPlayer
  );

  useEffect(() => {
    if (smoked) {
      const timer = setTimeout(() => {
        dispatch(bankPointsAndEndTurn());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [smoked, dispatch]);

  return (
    <div className={`dice-board ${winner || isDecidingFirstPlayer ? "disabled" : ""}`}>
      <div className="dice-row">
        {smoked && <SmokedModal />}

        {dice.map((die, idx) => (
          <Die
            key={idx}
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