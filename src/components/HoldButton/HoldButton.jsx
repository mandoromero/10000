import { useDispatch } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js";
import "../HoldButton/HoldButton.css";

export default function HoldButton({ index, held }) {
    const dispatch = useDispatch();

    return (
        <button 
            className={`btn btn-sm ${held ? "btn-warning" : "btn-secondary"}`} 
            onClick={() => dispatch(toggleHold(index))}
        >
            {held ? "Held" : "Hold"}
        </button>
    );
}