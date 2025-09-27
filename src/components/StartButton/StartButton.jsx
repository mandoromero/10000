import { useDispatch, useSelector } from "react-redux";
import { startRoll, setDice, setStartingPlayer, resetGame } from "../../redux/diceSlice.js";
import { useState } from "react";
import "../StartButton/StartButton.css";

export default function StartButton() {
  const dispatch = useDispatch();
  const [rolling, setRolling] = useState(false);
  const gameStarted = useSelector((state) => state.dice.gameStarted);

  const handleStart = () => {
    if (rolling) return;

    if (gameStarted) {
      // 🔄 If game is already running → reset only (don’t auto-start)
      dispatch(resetGame());
      return;
    }

    // 🎲 If game not started → do the start roll animation
    setRolling(true);
    dispatch(startRoll()); // reset state and set gameStarted = true

    let rotations = 0;
    let firstRoll, lastRoll;

    const rollAnimation = setInterval(() => {
      firstRoll = Math.floor(Math.random() * 6) + 1;
      lastRoll = Math.floor(Math.random() * 6) + 1;

      const animatedDice = Array.from({ length: 6 }, (_, idx) => {
        if (idx === 0)
          return { value: firstRoll, sideIndex: Math.floor(Math.random() * 4), held: false };
        if (idx === 5)
          return { value: lastRoll, sideIndex: Math.floor(Math.random() * 4), held: false };
        return { value: 1, sideIndex: 0, held: false };
      });

      dispatch(setDice(animatedDice));

      rotations++;
      if (rotations >= 10) {
        clearInterval(rollAnimation);

        while (firstRoll === lastRoll) {
          firstRoll = Math.floor(Math.random() * 6) + 1;
          lastRoll = Math.floor(Math.random() * 6) + 1;
        }

        const finalDice = Array.from({ length: 6 }, (_, idx) => {
          if (idx === 0)
            return { value: firstRoll, sideIndex: Math.floor(Math.random() * 4), held: false };
          if (idx === 5)
            return { value: lastRoll, sideIndex: Math.floor(Math.random() * 4), held: false };
          return { value: 1, sideIndex: 0, held: false };
        });

        dispatch(setDice(finalDice));
        dispatch(setStartingPlayer(firstRoll > lastRoll ? "player1" : "player2"));
        setRolling(false);
      }
    }, 150);
  };

  return (
    <button className="start-btn" onClick={handleStart} disabled={rolling}>
      {rolling ? "Rolling..." : gameStarted ? "Restart" : "Start"}
    </button>
  );
}
