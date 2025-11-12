import diceImagesGroups from "../diceImageGroups";

export default function DiceImage({ value, sideIndex }) {
  const imageSrc = diceImagesGroups[value - 1]?.[sideIndex];

  return (
    <img
      src={imageSrc}
      alt={`Die showing ${value}`}
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "8px",
        userSelect: "none",
      }}
      draggable={false}
    />
  );
}
