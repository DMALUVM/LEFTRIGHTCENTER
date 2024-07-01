const players = [
    { name: "Player 1", chips: 3 },
    { name: "Player 2", chips: 3 },
    { name: "Player 3", chips: 3 },
];

let currentPlayerIndex = 0;
const centerPot = { chips: 0 };
const diceSides = ["L", "R", "C", ".", ".", "."];

document.getElementById("roll-btn").addEventListener("click", rollDice);

function rollDice() {
    const diceResults = [
        diceSides[Math.floor(Math.random() * 6)],
        diceSides[Math.floor(Math.random() * 6)],
        diceSides[Math.floor(Math.random() * 6)]
    ];
    
    updateDiceDisplay(diceResults);
    processDiceResults(diceResults);
    updatePlayerDisplay();
    checkGameOver();
    switchPlayer();
}

function updateDiceDisplay(diceResults) {
    document.getElementById("die1").textContent = diceResults[0];
    document.getElementById("die2").textContent = diceResults[1];
    document.getElementById("die3").textContent = diceResults[2];
}

function processDiceResults(diceResults) {
    let currentPlayer = players[currentPlayerIndex];
    diceResults.forEach(result => {
        if (currentPlayer.chips > 0) {
            if (result === "L") {
                passChips(currentPlayerIndex, (currentPlayerIndex - 1 + players.length) % players.length);
            } else if (result === "R") {
                passChips(currentPlayerIndex, (currentPlayerIndex + 1) % players.length);
            } else if (result === "C") {
                currentPlayer.chips--;
                centerPot.chips++;
            }
        }
    });
}

function passChips(fromIndex, toIndex) {
    if (players[fromIndex].chips > 0) {
        players[fromIndex].chips--;
        players[toIndex].chips++;
    }
}

function updatePlayerDisplay() {
    players.forEach((player, index) => {
        document.getElementById(`player${index + 1}`).querySelector(".chips").textContent = player.chips;
    });
    document.getElementById("center-pot").querySelector(".chips").textContent = centerPot.chips;
}

function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}

function checkGameOver() {
    const activePlayers = players.filter(player => player.chips > 0);
    if (activePlayers.length === 1) {
        document.getElementById("message").textContent = `${activePlayers[0].name} wins the game!`;
        document.getElementById("roll-btn").disabled = true;
    }
}
