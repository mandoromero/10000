
// calculateScore.js
function calculateScore(dice) {
  if (!Array.isArray(dice) || dice.length === 0) return 0;

  // count occurrences
  const counts = {};
  for (const die of dice) {
    counts[die] = (counts[die] || 0) + 1;
  }

  let score = 0;

  // check straight (1–6)
  if (dice.length === 6 && [1,2,3,4,5,6].every(n => counts[n] === 1)) {
    return 1500;
  }

  // check three pairs
  if (Object.values(counts).length === 3 && Object.values(counts).every(c => c === 2)) {
    return 750;
  }

  for (const [numStr, count] of Object.entries(counts)) {
    const num = Number(numStr);

    if (count >= 3) {
      // base score for triples
      let baseScore = 0;
      if (num === 1) baseScore = 1000;
      else baseScore = num * 100;

      // extras beyond 3 double each time
      const multiplier = Math.pow(2, count - 3);
      score += baseScore * multiplier;
    } else {
      // singles: only 1s and 5s
      if (num === 1) score += count * 100;
      if (num === 5) score += count * 50;
    }
  }

  return score;
}

export default calculateScore;
