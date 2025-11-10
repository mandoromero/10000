import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rollDice, dismissSmokedOverlay } from "../../redux/diceSlice.js";
import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import "../GameBoard/GameBoard.css";
import SmokedModal from "../SmokedModal/SmokedModal.jsx";
import Winning from "../Winning/Winning.jsx";

export default function GameBoard() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);
  
  const gameStarted = useSelector((state) => state.dice.gameStarted);
  const activePlayer = useSelector((state) => state.dice.activePlayer);
  const smoked = useSelector((state) => state.dice.smoked);
  const winner = useSelector((state) => state.dice.winner);

  const handleRoll = () => {
    if (!gameStarted || winner) return; // disable roll if game ended
    setRolling(true);

    setTimeout(() => {
      dispatch(rollDice());
      setRolling(false);
    }, 1000);
  };

  // Handle smoked overlay timeout
  useEffect(() => {
    if (smoked) {
      const timeout = setTimeout(() => {
        dispatch(dismissSmokedOverlay());
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [smoked, dispatch]);

  const gameOver = !!winner || !gameStarted;

  return (
    <div className="game-board">
      <ScoreKeeper activePlayer={activePlayer} />
      <Winning /> {/* Always mounted */}

      {/* Disable the board when game ends */}
      <div className={`board-container ${gameOver ? "disabled" : ""}`}>
        <DiceBoard isRolling={rolling} />
        <GameButtons
          onRoll={handleRoll}
          rollDisabled={gameOver || rolling}
        />
      </div>

      <SmokedModal show={smoked} />
    </div>
  );
}
