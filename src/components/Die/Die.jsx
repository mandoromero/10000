import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDieValue, toggleHold } from "../../redux/diceSlice.js";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ index, shouldRoll, onRollComplete }) {
  const dispatch = useDispatch();
  const die = useSelector((state) => state.dice.dice[index]);
  const firstPlayer = useSelector((state) => state.dice.firstPlayer);

  const [isRolling, setIsRolling] = useState(false);

  // Determine if this die belongs to the active player's turn
  const isPlayerTurn =
    (index >= 0 && index < 3 && firstPlayer === "player1") ||
    (index >= 3 && index < 6 && firstPlayer === "player2");

  useEffect(() => {
    if (!die || !shouldRoll || die.held || isRolling) return;

    let rollCount = 0;
    let finalValue = 1;
    let finalSideIndex = 0;

    setIsRolling(true);

    const interval = setInterval(() => {
      const value = Math.ceil(Math.random() * 6);
      const sideIndex = Math.floor(Math.random() * 4);

      finalValue = value;
      finalSideIndex = sideIndex;

      // Update die visually while rolling
      dispatch(setDieValue({ index, value, sideIndex }));

      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);

        // Slight delay to allow CSS transition to finish
        setTimeout(() => setIsRolling(false), 100);

        // Final value
        dispatch(
          setDieValue({
            index,
            value: finalValue,
            sideIndex: finalSideIndex,
          })
        );

        // Notify parent that rolling is done
        onRollComplete(index, finalValue);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [die, shouldRoll, isRolling, dispatch, index, onRollComplete]);

  if (!die) return null;

  return (
    <div
      className={`die ${isRolling ? "rolling" : ""} ${
        isPlayerTurn ? "active-player" : ""
      }`}
    >
      <DiceImage value={die.value} sideIndex={die.sideIndex} />
      <HoldButton
        isHeld={die.held}
        onToggle={() => {
          if (isPlayerTurn && !isRolling) {
            dispatch(toggleHold(index));
          }
        }}
      />
    </div>
  );
}
