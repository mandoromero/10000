import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rollDice, dismissSmokedOverlay, endTurn } from "../../redux/diceSlice.js";
import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import "../GameBoard/GameBoard.css";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import Winning from "../Winning/Winning.jsx";

export default function GameBoard() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false); // Tracks rolling animation
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const startingPlayer = useSelector((state) => state.dice.startingPlayer);
  const smoked = useSelector((state) => state.dice.smoked);


  const handleRoll = () => {
    setRolling(true);

    setTimeout(() => {
      dispatch(rollDice()); // Randomizes dice in Redux
      setRolling(false);
    }, 1000); // Matches CSS roll animation duration
  };

useEffect(() => {
  if (smoked) {
    const timeout = setTimeout(() => {
      dispatch(dismissSmokedOverlay());
    }, 2000)
    return () => clearTimeout(timeout)
  }
}, [smoked, dispatch])


  return (
    <div className="game-board">
      <ScoreKeeper activePlayer={useSelector(state => state.dice.activePlayer)} />
      <Winning />
      <DiceBoard isRolling={rolling} />
      <GameButtons
        onRoll={handleRoll}
        rollDisabled={!gameStarted || rolling}
      />
      <SmokedModal
        show={smoked}
      />
    </div>
  );
}
