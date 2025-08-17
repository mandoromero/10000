import calculateScore from "../calculateScore.js";

export default function calculateScoreStrict(freshDice, heldDiceFromPrevious) {
    let score = 0;

    score += calculateScore(freshDice);

    for (const die of heldDiceFromPrevious) {
        if (die=== 1) score += 100;
        else if (die === 5) score += 50;
    }

    return score;
}