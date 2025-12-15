// src/components/HoldButton/HoldButton.jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ idx }) {
  const dispatch = useDispatch();

  const dice = useSelector((state) => state.dice.dice);
  const currentRollScoringDice = useSelector(
    (state) => state.dice.currentRollScoringDice
  );

  const held = dice[idx].held;

  // ✅ FIX: allow holds ONLY if scoring dice exist AND this die is one of them
  const isDisabled =
    currentRollScoringDice.length === 0 ||
    !currentRollScoringDice.includes(idx);

  const handleHold = () => {
    dispatch(toggleHold(idx));
  };

  return (
    <button
      className={held ? "held-btn" : "hold-btn"}
      onClick={handleHold}
      disabled={isDisabled}
    >
      {held ? "Held" : "Hold"}
    </button>
  );
}
