import { useDispatch } from "react-redux";
import{ rollDice } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";


function GameButtons() {
    const dispatch = useDispatch();

    return (
        <div className="btns-container">
            <button 
                className="roll"
                onClick={() => dispatch(rollDice())}
            >
                Roll
            </button>
            <button className="bank">Bank</button>
        </div>
    );
}

export default GameButtons;