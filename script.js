// Global variables
let currentPlayer = "X";
let board = ["","","","","","","","",""];
let gameActive = false;
let mode = "";
let xScore = 0;
let oScore = 0;

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

// Winning conditions
const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Preload sounds
const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
const winSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3");
const drawSound = new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3");

clickSound.volume = 0.3;
winSound.volume = 0.5;
drawSound.volume = 0.4;

// Event listeners
cells.forEach(cell => cell.addEventListener("click", handleClick));

// Set game mode
function setMode(selectedMode) {
    mode = selectedMode;
    restartGame();
    gameActive = true;
    statusDisplay.textContent = "Player X's Turn";
}

// Handle click on cell
function handleClick() {
    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    // AI move if mode is AI
    if (mode === "ai" && currentPlayer === "O" && gameActive) {
        setTimeout(aiMove, 500);
    }
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player);
    playClickSound();
    checkWinner();

    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// AI move
function aiMove() {
    if (!gameActive) return;

    // 1️⃣ Try to win
    let move = findBestMove("O");
    if (move === null) {
        // 2️⃣ Block player X if they can win next
        move = findBestMove("X");
    }
    if (move === null) {
        // 3️⃣ Pick a random empty cell
        let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    makeMove(move, "O");
}

// Function to find winning/blocking move for a player
function findBestMove(player) {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        let line = [board[a], board[b], board[c]];
        // If two in line and third empty, take it
        if (line.filter(v => v === player).length === 2 && line.includes("")) {
            return [a, b, c][line.indexOf("")];
        }
    }
    return null;
}


// Check winner
function checkWinner() {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");
            statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
            updateScore(currentPlayer);
            playWinSound();
            gameActive = false;
            return;
        }
    }

    if (!board.includes("")) {
        statusDisplay.textContent = "Draw!";
        playDrawSound();
        gameActive = false;
    }
}

// Update scoreboard
function updateScore(player) {
    if (player === "X") {
        xScore++;
        document.getElementById("xScore").textContent = xScore;
    } else {
        oScore++;
        document.getElementById("oScore").textContent = oScore;
    }
}

// Restart game
function restartGame() {
    board = ["","","","","","","","",""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
        cell.classList.remove("X");
        cell.classList.remove("O");
    });
    currentPlayer = "X";
    gameActive = false;
    statusDisplay.textContent = "Choose Mode";
}

// Play sounds
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function playWinSound() {
    winSound.currentTime = 0;
    winSound.play();
}

function playDrawSound() {
    drawSound.currentTime = 0;
    drawSound.play();
}
