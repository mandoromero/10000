import diceImagesGroups from "../diceImageGroups";


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
