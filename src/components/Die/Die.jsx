import { useState, useEffect } from "react";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ idx, value, sideIndex, held, isRolling }) {
  const [rollingValue, setRollingValue] = useState(value);
  const [rollingSide, setRollingSide] = useState(sideIndex);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!isRolling || held) {
      setRollingValue(value);
      setRollingSide(sideIndex);
      setIsSpinning(false);
      return;
    }

    setIsSpinning(true);
    let rollCount = 0;
    const maxRolls = 10;

    const interval = setInterval(() => {
      rollCount++;
      setRollingValue(Math.floor(Math.random() * 6) + 1);
      setRollingSide(Math.floor(Math.random() * 4));

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setRollingValue(value);
        setRollingSide(sideIndex);
        setIsSpinning(false);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isRolling, value, sideIndex, held]);

  return (
    <div className={`die-container ${isSpinning ? "rolling" : ""}`}>
      <div className="die">
        <DiceImage value={rollingValue} sideIndex={rollingSide} />
      </div>

      {/* Hold logic remains 100% unchanged */}
      <HoldButton idx={idx} />
    </div>
  );
}
