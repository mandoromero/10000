import diceImagesGroups from "../diceImageGroups";

export default function DiceImage ({ value, sideIndex })  {
    return (
        <img
            src={diceImagesGroups[value - 1][sideIndex]}
            alt={`Die showing ${value}`}
            style={{ width: "90px" }}
        />    
    );
}