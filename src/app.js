// import stylesheet from "./style.css";

document.addEventListener("DOMContentLoaded", function() {
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const howToPlay = document.getElementById("how-to-play");
  const howToScoreBtn = document.getElementById("how-to-score-btn");
  const howToScore = document.getElementById("how-to-score");
  const rollButton = document.getElementById("roll-btn");
  const bankButton = document.getElementById("bank-btn");
  const playerScoreDisplay = document.getElementById("player-score");
  const bankDisplay = document.getElementById("bank");

  let bankedScore = 0;
  let firstTurn = true;

  const diceElements = document.querySelectorAll(".die");
  const holdButtons = document.querySelectorAll(".hold-button");
  let diceState = Array(diceElements.length).fill(false);
  let heldDiceValues = [];
  
  rollButton.addEventListener("click", function() {
    let rolledValues = [];

    // Reset held dice values at the start of a new roll
    heldDiceValues = [];

    // If all dice are held, unlock them but DO NOT reset the banked score
    if (diceState.every(state => state)) {
        diceState.fill(false);
        holdButtons.forEach(button => {
            button.textContent = "Hold";
            button.style.backgroundColor = "#007bff";
        });
    }

    // Roll dice that are not held
    diceElements.forEach((die, index) => {
        if (!diceState[index]) {
            const roll = Math.floor(Math.random() * 6) + 1;
            die.textContent = roll;
        }
        rolledValues[index] = parseInt(die.textContent);
    });

    // Now call calculateScore() after rolling
    calculateScore();
});


  howToPlayBtn.addEventListener("click", () => toggleDisplay(howToPlay));
  howToScoreBtn.addEventListener("click", () => toggleDisplay(howToScore));

  function toggleDisplay(element) {
    element.style.display =
      element.style.display === "none" || element.style.display === ""
        ? "block"
        : "none";
  }

  holdButtons.forEach((button, index) => {
    button.addEventListener("click", function() {
      const dieValue = parseInt(diceElements[index].textContent);

      if (!diceState[index]) {
        // Holding die: Store value and update score
        diceState[index] = true;
        heldDiceValues.push(dieValue);
        button.textContent = "Held";
        button.style.backgroundColor = "#28a745";
        adjustBankScore(true, dieValue);
      } else {
        // Unholding die: Remove score
        diceState[index] = false;
        button.textContent = "Hold";
        button.style.backgroundColor = "#007bff";
        adjustBankScore(false, dieValue);
        heldDiceValues.splice(heldDiceValues.indexOf(dieValue), 1);
      }

      calculateScore();
    });
  });

  bankButton.addEventListener("click", function() {
    if (firstTurn && bankedScore < 1000) {
      alert("You must score at least 1000 points on your first turn!");
      return;
    }

    // Add banked score to player score
    playerScoreDisplay.textContent =
      parseInt(playerScoreDisplay.textContent) + bankedScore;

    // Reset the banked score
    bankedScore = 0;
    bankDisplay.textContent = "0";

    // Check if the player has won
    if (parseInt(playerScoreDisplay.textContent) >= 10000) {
      alert("Congratulations! You won!");
      resetGame();
    } else {
      firstTurn = false;
      resetDice();
    }
  });

  function calculateScore() {
    const counts = Array(6).fill(0);
    heldDiceValues.forEach(value => {
        counts[value - 1]++;
    });

    let newBankScore = 0;
    let anyScoringDice = false;

    // Three-of-a-kind or more scoring
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] >= 3) {
            let score = i === 0 ? 1000 : (i + 1) * 100;
            newBankScore += score;
            anyScoringDice = true;
            counts[i] -= 3; // Remove counted dice
        }
    }

    // Single 1s and 5s (only count remaining ones not used in three-of-a-kind)
    if (counts[0] > 0) {
        newBankScore += counts[0] * 100;
        anyScoringDice = true;
    }
    if (counts[4] > 0) {
        newBankScore += counts[4] * 50;
        anyScoringDice = true;
    }

    // Check for a straight (1-6)
    if (counts.every(count => count === 1)) {
        newBankScore = 1500;
        anyScoringDice = true;
    }

    // Check for three pairs
    const pairs = counts.filter(count => count === 2).length;
    if (pairs === 3) {
        newBankScore = 750;
        anyScoringDice = true;
    }

    // Update the bank score only if dice were held
    if (heldDiceValues.length > 0) {
        bankedScore = newBankScore;
    }

    updateScoreDisplay();

    // ** Fix: Only trigger "No scoring dice" alert AFTER a roll and when no scoring dice exist **
    if (!anyScoringDice && heldDiceValues.length === 0 && rolledDiceValues.length > 0) {
        alert(`No scoring dice! Your roll: ${rolledDiceValues.join(", ")}`);
    }
}


  function adjustBankScore(isHeld, dieValue) {
    let scoreChange = 0;

    if (dieValue === 1) {
      scoreChange = 100;
    } else if (dieValue === 5) {
      scoreChange = 50;
    }

    if (isHeld) {
      bankedScore += scoreChange;
    } else {
      bankedScore -= scoreChange;
    }

    updateScoreDisplay();
  }

  function updateScoreDisplay() {
    bankDisplay.textContent = bankedScore;
  }

  function resetGame() {
    bankedScore = 0;
    firstTurn = true;
    playerScoreDisplay.textContent = "0";
    bankDisplay.textContent = "0";
    resetDice();
  }

  function resetDice() {
    diceState.fill(false);
    heldDiceValues = [];
    holdButtons.forEach(button => {
      button.textContent = "Hold";
      button.style.backgroundColor = "#007bff";
    });
  }
});
