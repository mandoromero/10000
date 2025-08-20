import { useDispatch } from "react-redux";
import { toggleHold } from "../../redux/diceSlice";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ idx, held }) {
  const dispatch = useDispatch();

  return (
    <button
      className={`${held ? "held-btn" : "hold-btn"}`}
      onClick={() => {
        dispatch(toggleHold(idx));
      }}
    >
      {held ? "Held" : "Hold"}
    </button>
  );
}
