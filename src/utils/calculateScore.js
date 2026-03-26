export default function calculateScore(values) {
  const counts = {};
  values.forEach(v => (counts[v] = (counts[v] || 0) + 1));

  const scoringDice = [];
  const dieScores = {};
  const combos = [];
  let score = 0;
  let autoWin = false; // new flag for 6 ones

  // ---------- 3–6 OF A KIND ----------
  Object.entries(counts).forEach(([numStr, count]) => {
    const num = Number(numStr);

    if (count >= 3) {
      const indexes = [];
      values.forEach((v, i) => {
        if (v === num && indexes.length < count) {
          indexes.push(i);
          scoringDice.push(i);
        }
      });

      let comboScore;
      let conditional = false;

      if (num === 1) {
        switch (count) {
          case 3:
            comboScore = 1000;
            break;
          case 4:
            comboScore = 2000;
            break;
          case 5:
            comboScore = 4000;
            break;
          case 6:
            comboScore = 0; // points irrelevant; trigger auto-win elsewhere
            autoWin = true;
            break;
        }
      } else {
        // 3–6 of other numbers
        switch (count) {
          case 3:
            comboScore = 100 * num;
            break;
          case 4:
            comboScore = 2 * 100 * num;
            break;
          case 5:
            comboScore = 4 * 100 * num;
            break;
          case 6:
            comboScore = 8 * 100 * num;
            break;
        }
        conditional = true; // only score when all held
      }

      indexes.forEach(i => {
        dieScores[i] = conditional ? 0 : comboScore / count;
      });

      combos.push({
        diceIndexes: indexes,
        score: comboScore,
        heldCount: 0,
        fullyHeld: false,
        conditional,
      });
    }
  });

  // ---------- SINGLES (1s and 5s) ----------
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
        conditional: false,
      });
    }
  });

  score = Object.values(dieScores).reduce((a, b) => a + b, 0);

  return { score, scoringDice, dieScores, combos, autoWin };
}