// src/components/HoldButton/HoldButton.jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ idx }) {
  const dispatch = useDispatch();

  // Get dice info from Redux
  const dice = useSelector((state) => state.dice.dice);
  const currentRollScoringDice = useSelector(
    (state) => state.dice.currentRollScoringDice || []
  );

  const held = dice[idx].held;

  // Disable hold button if this die is not scoring
  const isDisabled = !currentRollScoringDice.includes(idx);

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

