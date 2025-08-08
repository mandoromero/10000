import { useDispatch, useSelector } from "react-redux";
import{ rollDice } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";


export default function GameButtons({ onStart, onRoll, rollDisabled  }) {
    const gameStarted = useSelector(state => state.dice.gamestarted);
    return (
        <div className="btns-container">
            <button
                onClick={onRoll} 
                className="roll-btn"
                disabled={rollDisabled}
            >
                Roll
            </button>
            <button className="bank-btn">Bank</button>
            <button className="end-btn">End Turn</button>
        </div>
    );
}

