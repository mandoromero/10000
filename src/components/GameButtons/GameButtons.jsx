import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rollDice, bankPointsAndEndTurn } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();
  const gameStarted = useSelector(state => state.dice.gameStarted);
  const dice = useSelector(state => state.dice.dice);

  const [isRolling, setIsRolling] = useState(false);

  const allDiceUsed = dice.every(d => d.held || d.locked);

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 550);
    dispatch(rollDice());
  }

  return (
    <div className="btns-container">
      <button
        onClick={handleRoll}
        className="roll-btn"
        disabled={rollDisabled || !gameStarted}
      >
        Roll
      </button>

      {/* Bank points button */}
      <button 
        onClick={() => dispatch(bankPointsAndEndTurn())}
        className="bank-btn"
        disabled={!gameStarted || allDiceUsed}
      >
        Bank</button>
    </div>
  );
}
