export default function calculateScore(values) {
  const counts = {};
  values.forEach(v => (counts[v] = (counts[v] || 0) + 1));

  const scoringDice = [];
  const dieScores = {};
  const combos = [];
  let score = 0;

  // combos (3+ of a kind)
  Object.entries(counts).forEach(([numStr, count]) => {
    const num = Number(numStr);
    if (count >= 3) {
      const base = num === 1 ? 1000 : num * 100;
      const comboScore = base * Math.pow(2, count - 3);

      const indexes = [];
      values.forEach((v, i) => {
        if (v === num && indexes.length < count) {
          indexes.push(i);
          scoringDice.push(i);
          dieScores[i] = comboScore / count;
        }
      });

      combos.push({
        diceIndexes: indexes,
        score: comboScore,
        heldCount: 0,
        fullyHeld: false,
      });
    }
  });

  // singles
  values.forEach((v, i) => {
    if (scoringDice.includes(i)) return;

    if (v === 1 || v === 5) {
      const val = v === 1 ? 100 : 50;
      scoringDice.push(i);
      dieScores[i] = val;

      combos.push({
        diceIndexes: [i],
        score: val,
        heldCount: 0,
        fullyHeld: false,
      });
    }
  });

  score = Object.values(dieScores).reduce((a, b) => a + b, 0);

  return { score, scoringDice, dieScores, combos };
}
