
export function calculateScore(dice) {
  if (!Array.isArray(dice) || dice.length === 0) return 0;

  // Sort dice for easier pattern detection
  const sortedDice = [...dice].sort((a, b) => a - b);

  // Count occurrences of each dice value
  const counts = {};
  for (const die of sortedDice) {
    counts[die] = (counts[die] || 0) + 1;
  }

  const countValues = Object.values(counts);
  const countKeys = Object.keys(counts).map(Number);

  const isStraight = sortedDice.length === 6 && 
    sortedDice.every((val, i) => val === i + 1);

  const isThreePairs = countValues.length === 3 && countValues.every(c => c === 2);

  if (isStraight) {
    return 1500;
  }

  if (isThreePairs) {
    return 750;
  }

  let score = 0;

  // Check six, five, four, three of a kind with doubling for extras above three

  for (const [numStr, count] of Object.entries(counts)) {
    const num = Number(numStr);

    // Scoring base for three of a kind
    // 3x1 = 1000, 3x2=200, 3x3=300, ... 3x6=600
    let baseScore = 0;
    if (num === 1) baseScore = 1000;
    else baseScore = num * 100;

    if (count >= 3) {
      // For count >= 3, score = baseScore * 2^(count - 3)
      // Doubling for each extra die beyond 3
      const multiplier = Math.pow(2, count - 3);
      score += baseScore * multiplier;
    } else {
      // singles: 1s = 100, 5s = 50
      if (num === 1) score += count * 100;
      else if (num === 5) score += count * 50;
    }
  }

  return score;
}
