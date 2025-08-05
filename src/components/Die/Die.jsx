import { useState, useEffect } from "react";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ index, value, sideIndex, held }) {
  const [isRolling, setIsRolling] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isRolling) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRotation (prev => prev + 360);

        if (count >+ 10) {
          clearInterval(interval);
          setIsRolling(false);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [setIsRolling]);

  useEffect (() => {
    setIsRolling(true);
  }, [value, sideIndex]);

  return (
    <div className="die-container">
      <div 
        className={`die ${isRolling ? "rolling" : ""}`}
        style={{ transform: `rotate(${rotation}deg)` }}
    >   
        <DiceImage
          value={value}
          sideIndex={sideIndex}
       />
      </div>
      <HoldButton 
        index={index} 
        held={held}
      />
    </div>
  );
}
