import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  initialRollForStartingPlayer,
  resetGame,
  lockNames,
} from "../../redux/diceSlice.js";
import { useState } from "react";
import "../StartButton/StartButton.css";

export default function StartButton() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);

  const { gameStarted, winner } = useSelector((state) => state.dice);

  const handleStart = () => {
    if (rolling) return;

    // If game is already running → restart everything
    if (gameStarted) {
      dispatch(resetGame());
      return;
    }

    // ---- INITIAL STARTING PLAYER ROLL ----
    setRolling(true);
    dispatch(startRoll());

    let rolls = 0;
    let firstValue = 1;
    let lastValue = 1;

    const anim = setInterval(() => {
      rolls++;

      firstValue = Math.floor(Math.random() * 6) + 1;
      lastValue = Math.floor(Math.random() * 6) + 1;

      // Show animation by updating ONLY die 0 and die 5
      const animatedDice = Array.from({ length: 6 }, (_, idx) => {
        if (idx === 0)
          return {
            value: firstValue,
            sideIndex: Math.floor(Math.random() * 4),
            held: false,
          };
        if (idx === 5)
          return {
            value: lastValue,
            sideIndex: Math.floor(Math.random() * 4),
            held: false,
          };
        return { value: 1, sideIndex: 0, held: false };
      });

      // Store the animation values
      dispatch({
        type: "dice/setAnimatedDice",
        payload: animatedDice,
      });

      if (rolls >= 10) {
        clearInterval(anim);

        // --- ensure no tie ---
        while (firstValue === lastValue) {
          firstValue = Math.floor(Math.random() * 6) + 1;
          lastValue = Math.floor(Math.random() * 6) + 1;
        }

        // Now perform the official logic in the slice
        dispatch(initialRollForStartingPlayer());
        dispatch(lockNames());
        dispatch(stopRoll());
        setRolling(false);
      }
    }, 120);
  };

  return (
    <button className="start-btn" onClick={handleStart} disabled={rolling}>
      {rolling ? "Rolling..." : gameStarted ? "Restart" : "Start"}
    </button>
  );
}
