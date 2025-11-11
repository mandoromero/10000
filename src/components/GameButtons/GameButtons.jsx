import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rollDice, bankPointsAndEndTurn } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled }) {
  const dispatch = useDispatch();
  const gameStarted = useSelector(state => state.dice.gameStarted);
  const dice = useSelector(state => state.dice.dice);
  const activePlayer =  useSelector(state => state.dice.activePlayer);
  const bankPoints = useSelector(state => state.dice.bankPoints);
  const player1Open = useSelector(state => state.dice.player1Open);
  const player2Open = useSelector(state => state.dice.player2Open);
  const winner = useSelector((state) => state.dice.winner);

  const [isRolling, setIsRolling] = useState(false);

  const allDiceUsed = dice.every(d => d.held || d.locked);
  
  const handleRoll = () => {
    if (winner) return;
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 550);
    dispatch(rollDice());
  }

  const bankDisabled = 
    !gameStarted || 
    allDiceUsed ||
    (activePlayer === "player1" && !player1Open && bankPoints < 1000)  ||
    (activePlayer === "player2" && !player2Open && bankPoints < 1000); 

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
        disabled={!gameStarted || allDiceUsed || rollDisabled}
      >
        Bank
      </button>
    </div>
  );
}
