import { useDispatch } from "react-redux";
import{ rollDice } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";


export default function GameButtons() {
    const dispatch = useDispatch();

    return (
        <div className="btns-container">
            <button 
                className="roll-btn"
                onClick={() => dispatch(rollDice())}
            >
                Roll
            </button>
            <button className="bank-btn">Bank</button>
        </div>
    );
}

