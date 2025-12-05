import { useState, useEffect } from "react";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ idx, value, sideIndex, held, isRolling }) {
  const [rollingValue, setRollingValue] = useState(value);
  const [rollingSide, setRollingSide] = useState(sideIndex);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!isRolling) {
      // Stop animation and show final die face
      setRollingValue(value);
      setRollingSide(sideIndex);
      setIsSpinning(false);
      return;
    }

    const delay = Math.random() * 300; // Stagger start times

    const startRolling = () => {
      setIsSpinning(true);
      let rollCount = 0;
      const maxRolls = 10;

      const interval = setInterval(() => {
        rollCount++;
        setRollingValue(Math.floor(Math.random() * 6) + 1);
        setRollingSide(Math.floor(Math.random() * 4));

        if (rollCount >= maxRolls) {
          clearInterval(interval);
          setTimeout(() => {
            setRollingValue(value);
            setRollingSide(sideIndex);
            setIsSpinning(false);
          }, 150);
        }
      }, 100);
    };

    const timeout = setTimeout(startRolling, delay);

    return () => {
      clearTimeout(timeout);
      setIsSpinning(false);
    };
  }, [isRolling, value, sideIndex]);

  return (
    <div className={`die-container ${isSpinning ? "rolling" : ""}`}>
      <div className="die">
        <DiceImage value={rollingValue} sideIndex={rollingSide} />
      </div>
      {/* Player can hold scoring dice */}
      <HoldButton idx={idx} held={held} />
    </div>
  );
}
