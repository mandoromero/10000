import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setRollDiceCount,
  setRollOffValue,
  clearRollTrigger,
} from "../src/redux/diceSlice.js";

import "../src/App.css";
import ScoreKeeper from "./components/ScoreKeeper/ScoreKeeper.jsx";
import Die from "./components/Die/Die.jsx";
import GameButtons from "./components/GameButtons/GameButtons.jsx";

function App() {
  const dispatch = useDispatch();

  const {
    rollTrigger,
    gameStarted,
    rollOffComplete,
    rollingDiceCount,
    dice,
  } = useSelector((state) => state.dice);

  /**
   * Determine if a die at given index should roll
   * - During roll-off: only index 0 and 5
   * - During game: all dice roll
   */
  const shouldRoll = (index) => {
    if (!rollTrigger) return false;

    if (!gameStarted && (index === 0 || index === 5)) {
      return true;
    }

    if (gameStarted) return true;

    return false;
  };

  /**
   * Called by Die after animation finishes
   */
  const handleDieRollComplete = (index, value) => {
    dispatch(setRollDiceCount(Math.max(0, rollingDiceCount - 1)));

    // Set roll-off values only if game hasn't started yet
    if (!gameStarted && !rollOffComplete) {
      if (index === 0) {
        dispatch(setRollOffValue({ player: "player1", value }));
      } else if (index === 5) {
        dispatch(setRollOffValue({ player: "player2", value }));
      }
    }
  };

  /**
   * Reset rollTrigger just after triggering a roll
   */
  useEffect(() => {
    if (rollTrigger) {
      const timeout = setTimeout(() => {
        dispatch(clearRollTrigger());
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [rollTrigger, dispatch]);

  return (
    <div className="game-board">
      <h1 className="title">10000</h1>
      <ScoreKeeper />
      <div className="dice-container">
        {dice.map((die, index) => (
          <Die
            key={`${index}-${die.value}-${die.sideIndex}`} // Force refresh
            index={index}
            value={die.value}
            sideIndex={die.sideIndex}
            shouldRoll={shouldRoll(index)}
            onRollComplete={handleDieRollComplete}
          />

        ))}
      </div>
      <GameButtons />
    </div>
  );
}

export default App;
