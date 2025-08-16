import { useState, useEffect } from "react";
import { toggleHold } from "../../redux/diceSlice.js";
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

/**
 * Represents a single die in the game.
 * @param {number} index - Position of the die in the dice array.
 * @param {number} value - Dice face value (1–6).
 * @param {number} sideIndex - Variant index for image (0–3).
 * @param {boolean} held - Whether the die is held.
 * @param {boolean} isRolling - Whether the die is currently rolling.
 */
export default function Die({ index, value, sideIndex, held, isRolling }) {
  return (
    <div className={`die-container ${isRolling ? "die-rolling" : ""}`}>
      {/* Die face image */}
      <div className="die">
        <DiceImage value={value} sideIndex={sideIndex} />
      </div>

      {/* Button to toggle held state */}
      <HoldButton index={index} held={held} />
    </div>
  );
}
