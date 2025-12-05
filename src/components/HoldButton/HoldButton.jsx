import { useDispatch, useSelector } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ idx, held }) {
  const dispatch = useDispatch();

  // Get the indexes of scoring dice from current roll
  const scoringDice = useSelector((state) => state.dice.currentRollScoringDice || []);

  // Disable hold button if this die is not scoring
  const isDisabled = !scoringDice.includes(idx);

  return (
    <button
      className={held ? "held-btn" : "hold-btn"}
      onClick={() => dispatch(toggleHold(idx))}
      disabled={isDisabled}
    >
      {held ? "Held" : "Hold"}
    </button>
  );
}
