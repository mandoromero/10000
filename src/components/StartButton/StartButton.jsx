import { useDispatch, useSelector } from "react-redux";
import {
  startRoll,
  stopRoll,
  startRollForStartingPlayer,
  resetGame,
  lockNames,
  setAnimatedDice,
  startGame,
  setDecidingFirstPlayer,
} from "../../redux/diceSlice.js";
import { useState } from "react";
import "../StartButton/StartButton.css";

export default function StartButton() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);

  // ✅ Get state from Redux
  const {
    gameStarted,
    isDecidingFirstPlayer,
    isRolling,
    smoked,
  } = useSelector((state) => state.dice);

  const rollDisabled =
    !gameStarted ||
    isDecidingFirstPlayer ||
    isRolling ||
    smoked;

  const handleStart = () => {
    if (gameStarted) {
      dispatch(resetGame());
      return;
    }

    setRolling(true);
    dispatch(startRoll());
    dispatch(setDecidingFirstPlayer(true));

    let rolls = 0;
    let firstValue = 1;
    let lastValue = 1;

    const anim = setInterval(() => {
      rolls++;

      firstValue = Math.floor(Math.random() * 6) + 1;
      lastValue = Math.floor(Math.random() * 6) + 1;

      const animatedDice = Array.from({ length: 6 }, (_, idx) => {
        if (idx === 0)
          return { value: firstValue, sideIndex: Math.floor(Math.random() * 4), held: false };
        if (idx === 5)
          return { value: lastValue, sideIndex: Math.floor(Math.random() * 4), held: false };
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

        dispatch(startRollForStartingPlayer({ firstValue, lastValue }));
        dispatch(lockNames());
        dispatch(startGame());
        dispatch(stopRoll());
        dispatch(setDecidingFirstPlayer(false));

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
