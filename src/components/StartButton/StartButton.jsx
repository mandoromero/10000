import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  startRollForStartingPlayer,
  resetGame,
  lockNames,
  setAnimatedDice,
} from "../../redux/diceSlice.js";
import { useState } from "react";
import "../StartButton/StartButton.css";

export default function StartButton() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);

  const { gameStarted } = useSelector((state) => state.dice);

  const handleStart = () => {
    // If game is already started, restart
    if (gameStarted) {
      dispatch(resetGame());
      return;
    }

    setRolling(true);
    dispatch(startRoll());

    let rolls = 0;
    let firstValue = 1;
    let lastValue = 1;

    const anim = setInterval(() => {
      rolls++;

      firstValue = Math.floor(Math.random() * 6) + 1;
      lastValue = Math.floor(Math.random() * 6) + 1;

      // Only animate dice 0 and 5
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

      dispatch(setAnimatedDice(animatedDice));

      if (rolls >= 10) {
        clearInterval(anim);

        // Ensure no tie
        while (firstValue === lastValue) {
          firstValue = Math.floor(Math.random() * 6) + 1;
          lastValue = Math.floor(Math.random() * 6) + 1;
        }

        // Set official starting player in slice
        dispatch(startRollForStartingPlayer({ firstValue, lastValue }));

        // Lock names after first roll
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
