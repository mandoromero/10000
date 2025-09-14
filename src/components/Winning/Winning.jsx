import { useDispatch, useSelector } from "react-redux";
import { resetGame } from "../../redux/diceSlice.js";
import Confetti from "react-confetti";
import "./Winning.css";

export default function Winning() {
  const dispatch = useDispatch();

  const winner = useSelector((state) => state.dice.winner);

  if (!winner) return null;

  return (
    <div className="winning-overlay">
      <Confetti />
      <div className="winning-modal">
        {winner === "It's a tie!" ? (
          <h2>It&apos;s a tie!</h2>
        ) : (
          <h2>{winner} wins!!!</h2>
        )}
        <button
          className="reset-button"
          onClick={() => dispatch(resetGame())}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
