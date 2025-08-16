import { useDispatch } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "../HoldButton/HoldButton.css";

/**
 * Button to toggle whether a die is held.
 * @param {number} index - Index of the die in the dice array.
 * @param {boolean} held - Current hold state of the die.
 */
export default function HoldButton({ index, held }) {
  const dispatch = useDispatch();

  return (
    <button
      className={`btn btn-lg ${held ? "btn-warning" : "btn-secondary"}`}
      onClick={() => dispatch(toggleHold(index))}
    >
      {held ? "Held" : "Hold"}
    </button>
  );
}
