import { useDispatch, useSelector } from "react-redux";
import { triggerRoll } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";


function GameButtons() {
    const dispatch = useDispatch();
    const rollingDiceCount = useSelector((state) => state.dice.rollingDiceCount);

    const handleRollClick = () => {
        dispatch(triggerRoll());
    };

    return (
        <div className="btns-container">
            <button className="roll" onClick={handleRollClick} disabled={rollingDiceCount > 0}>
                Roll
            </button>
            <button className="bank">Bank</button>
        </div>
    );
}

export default GameButtons;