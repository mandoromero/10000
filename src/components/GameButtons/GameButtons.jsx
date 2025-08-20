import { useDispatch, useSelector } from "react-redux";
import { rollDice, bankPointsAndEndTurn } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();
  const gameStarted = useSelector(state => state.dice.gameStarted);

  return (
    <div className="btns-container">
      {/* Roll button */}
      <button
        onClick={() => dispatch(rollDice())}
        className="roll-btn"
        disabled={rollDisabled || !gameStarted}
      >
        Roll
      </button>

      {/* Bank points button */}
      <button 
        onClick={() => dispatch(bankPointsAndEndTurn())}
        className="bank-btn"
        disabled={!gameStarted}
      >
        Bank</button>
    </div>
  );
}
