function calculateScore(dice) {
  if (!Array.isArray(dice) || dice.length === 0) {
    return { score: 0, scoringDice: [] };
  }

  const counts = {};
  dice.forEach((die) => {
    counts[die] = (counts[die] || 0) + 1;
  });

  let score = 0;
  const scoringDice = [];

  // Straight (1-6)
  if (dice.length === 6 && [1, 2, 3, 4, 5, 6].every((n) => counts[n] === 1)) {
    return { score: 1500, scoringDice: [0, 1, 2, 3, 4, 5] };
  }

  // Three pairs
  if (Object.values(counts).length === 3 && Object.values(counts).every((c) => c === 2)) {
    return { score: 750, scoringDice: [0, 1, 2, 3, 4, 5] };
  }

  // Triples or more
  Object.entries(counts).forEach(([numStr, count]) => {
    const num = Number(numStr);
    if (count >= 3) {
      const baseScore = num === 1 ? 1000 : num * 100;
      const multiplier = Math.pow(2, count - 3);
      score += baseScore * multiplier;

      // Add indexes of the first 'count' matching dice
      let added = 0;
      dice.forEach((die, idx) => {
        if (die === num && added < count) {
          scoringDice.push(idx);
          added++;
        }
      });
    }
  });

  // Singles (1s and 5s) not part of triples
  dice.forEach((die, idx) => {
    if ((die === 1 || die === 5) && !scoringDice.includes(idx)) {
      if (die === 1) score += 100;
      if (die === 5) score += 50;
      scoringDice.push(idx);
    }
  });

  return { score, scoringDice };
}

export default calculateScore;
