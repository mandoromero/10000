import { useDispatch, useSelector } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "./HoldButton.css";

export default function HoldButton({ idx, held, onClick }) {
  const dispatch = useDispatch();

  const {
    gameStarted,
    isRolling,
    smoked,
    winner,
    currentRollScoringDice,
  } = useSelector((state) => state.dice);

  const isScoring = currentRollScoringDice.includes(idx);

  const handleHold = () => {
    if (!gameStarted || isRolling || smoked || winner) return;
    if (!isScoring) return; // ❗ only allow scoring dice

    dispatch(toggleHold(idx));
  };

  return (
    <button
    className={`hold-btn ${held ? "held" : ""}`}
      onClick={handleHold}
      disabled={!isScoring || isRolling || smoked || winner}
    >
      Hold
    </button>
  );
}