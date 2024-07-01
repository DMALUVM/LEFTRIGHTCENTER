let players = [];
let currentPlayerIndex = 0;
let centerPot = 0;
const diceSides = ["L", "R", "C", ".", ".", "."];

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("roll-btn").addEventListener("click", rollDice);

function startGame() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const buyIn = parseInt(document.getElementById("buyIn").value);

    players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push({ name: `Player ${i + 1}`, chips: buyIn });
    }

    centerPot = 0;
    currentPlayerIndex = 0;

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    displayPlayers();
    updatePlayerDisplay();
}

function displayPlayers() {
    const playersContainer = document.getElementById("players");
    playersContainer.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.id = `player${index}`;
        playerDiv.className = "player";
        playerDiv.innerHTML = `${player.name}: $<span class="chips">${player.chips}</span>`;
        playersContainer.appendChild(playerDiv);
    });
}

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
                centerPot++;
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
        document.getElementById(`player${index}`).querySelector(".chips").textContent = player.chips;
    });
    document.getElementById("center-pot").querySelector(".chips").textContent = centerPot;
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
