let players = [];
let currentPlayerIndex = 0;
let centerPot = 0;
const diceSides = ["L", "R", "C", ".", ".", "."];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("numPlayers").addEventListener("change", updatePlayerInputs);
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("roll-btn").addEventListener("click", rollDice);
    updatePlayerInputs(); // Initialize player inputs
});

function updatePlayerInputs() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const playerNamesDiv = document.getElementById("playerNames");
    playerNamesDiv.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `playerName${i}`;
        input.placeholder = `Player ${i + 1} Name`;
        playerNamesDiv.appendChild(input);
    }
}

function startGame() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const buyInPerSpot = parseInt(document.getElementById("buyIn").value);
    
    if (numPlayers < 2 || numPlayers > 10) {
        showMessage("Please enter a number of players between 2 and 10.", "error");
        return;
    }
    
    if (buyInPerSpot < 1) {
        showMessage("Please enter a buy-in amount of at least 1 per spot.", "error");
        return;
    }
    
    const totalBuyIn = buyInPerSpot * 3; // 3 spots per player
    
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`playerName${i}`).value.trim() || `Player ${i + 1}`;
        players.push({ name: playerName, chips: totalBuyIn });
    }
    
    centerPot = 0;
    currentPlayerIndex = 0;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    displayPlayers();
    updatePlayerDisplay();
    updateCurrentPlayerDisplay();
    document.getElementById("roll-btn").disabled = false;
    showMessage(`Game started! Each player starts with $${totalBuyIn}. ${players[currentPlayerIndex].name}'s turn.`, "info");
}

function displayPlayers() {
    const playersContainer = document.getElementById("players");
    playersContainer.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.id = `player${index}`;
        playerDiv.className = "player";
        playerDiv.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-chips">
                <div class="chip-stack"></div>
                <span class="chips-count">$${player.chips}</span>
            </div>
        `;
        playersContainer.appendChild(playerDiv);
    });
}

function rollDice() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.chips === 0) {
        switchPlayer();
        updateCurrentPlayerDisplay();
        return;
    }

    const diceResults = Array.from({length: Math.min(currentPlayer.chips, 3)}, () => diceSides[Math.floor(Math.random() * 6)]);
    
    updateDiceDisplay(diceResults);
    processDiceResults(diceResults);
    updatePlayerDisplay();
    checkGameOver();
    
    if (!document.getElementById("roll-btn").disabled) {
        switchPlayer();
        updateCurrentPlayerDisplay();
    }
}

function updateDiceDisplay(diceResults) {
    const diceContainer = document.getElementById("dice");
    diceContainer.innerHTML = '';
    diceResults.forEach((result, index) => {
        const dieElement = document.createElement("div");
        dieElement.className = "die";
        dieElement.id = `die${index + 1}`;
        dieElement.textContent = result;
        diceContainer.appendChild(dieElement);
    });
}

function processDiceResults(diceResults) {
    let currentPlayer = players[currentPlayerIndex];
    let message = `${currentPlayer.name} rolled: ${diceResults.join(', ')}. `;
    
    diceResults.forEach(result => {
        if (currentPlayer.chips > 0) {
            if (result === "L") {
                passChips(currentPlayerIndex, (currentPlayerIndex - 1 + players.length) % players.length);
                message += "Passed left. ";
            } else if (result === "R") {
                passChips(currentPlayerIndex, (currentPlayerIndex + 1) % players.length);
                message += "Passed right. ";
            } else if (result === "C") {
                currentPlayer.chips--;
                centerPot++;
                message += "To center. ";
            }
        }
    });
    
    showMessage(message, "info");
}

function passChips(fromIndex, toIndex) {
    if (players[fromIndex].chips > 0) {
        players[fromIndex].chips--;
        players[toIndex].chips++;
    }
}

function updatePlayerDisplay() {
    players.forEach((player, index) => {
        const playerElement = document.getElementById(`player${index}`);
        const chipsCount = playerElement.querySelector(".chips-count");
        const chipStack = playerElement.querySelector(".chip-stack");
        
        chipsCount.textContent = `$${player.chips}`;
        
        // Update the chip stack
        chipStack.innerHTML = '';
        const numChips = Math.min(10, Math.ceil(player.chips / 3)); // Max 10 chips in stack
        for (let i = 0; i < numChips; i++) {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chipStack.appendChild(chip);
        }
        
        playerElement.classList.toggle("active", index === currentPlayerIndex);
    });
    document.getElementById("center-pot").querySelector(".chips").textContent = centerPot;
}

function updateCurrentPlayerDisplay() {
    const currentPlayer = players[currentPlayerIndex];
    document.getElementById("current-player").textContent = `Current Turn: ${currentPlayer.name}`;
}

function switchPlayer() {
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].chips === 0 && !isGameOver());
}

function isGameOver() {
    return players.filter(player => player.chips > 0).length <= 1;
}

function checkGameOver() {
    if (isGameOver()) {
        const winner = players.find(player => player.chips > 0) || {name: "No one"};
        showMessage(`Game Over! ${winner.name} wins the game!`, "success");
        document.getElementById("roll-btn").disabled = true;
    }
}

function showMessage(text, type) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}
