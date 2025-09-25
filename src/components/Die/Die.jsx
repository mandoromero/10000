import { useState, useEffect } from "react";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ idx, value, sideIndex, held, isRolling }) {
  const [rollingValue, setRollingValue] = useState(value);
  const [rollingSide, setRollingSide] = useState(sideIndex);

  useEffect(() => {
    if (!isRolling) {
      setRollingValue(value);
      setRollingSide(sideIndex);
      return;
    }

    let rollCount = 0;
    const maxRolls = 10;
    const delay = Math.random() * 200; // random stagger 0–200ms
    let interval;

    const startRolling = () => {
      interval = setInterval(() => {
        rollCount += 1;
        setRollingValue(Math.floor(Math.random() * 6) + 1);
        setRollingSide(Math.floor(Math.random() * 4));

        if (rollCount >= maxRolls) {
          clearInterval(interval);
          setRollingValue(value);      // final Redux value
          setRollingSide(sideIndex);
        }
      }, 50);
    };

    const timeout = setTimeout(startRolling, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isRolling, value, sideIndex]);

  return (
    <div className={`die-container ${isRolling ? "die-rolling" : ""}`}>
      <div className="die">
        <DiceImage value={rollingValue} sideIndex={rollingSide} />
      </div>
      <HoldButton idx={idx} held={held} />
    </div>
  );
}
