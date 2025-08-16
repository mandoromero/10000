import diceImagesGroups from "../diceImageGroups";

/**
 * Renders a single dice image.
 * @param {number} value - Dice face value (1–6).
 * @param {number} sideIndex - Which image variant to use (0–3).
 */
export default function DiceImage({ value, sideIndex }) {
  // Get the correct image URL based on value and variant index
  const imageSrc = diceImagesGroups[value - 1]?.[sideIndex];

  return (
    <img
      src={imageSrc}
      alt={`Die showing ${value}`}
      style={{ width: "90px", height: "90px" }}
    />
  );
}
