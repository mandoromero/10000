import diceImagesGroups from "./diceImageGroups";

export default function DiceImage ({ value, sideIndex })  {
    const image = diceImagesGroups[value - 1][sideIndex];
    
    return (
        <img
            src={image}
            alt={`Die showing ${value}`}
            style={{ width: "60px" }}
        />    
    );
}