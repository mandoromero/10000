import { useDispatch, useSelector } from "react-redux";
import { toggleHold } from "../../redux/diceSlice";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ idx, held }) {
  const dispatch = useDispatch();
  const currentRollId = useSelector(state => state.dice.currentRollId);

  // Disable hold buttons until at least one roll has happened
  const isDisabled = currentRollId === null;

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
