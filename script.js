const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const rollBtn = document.getElementById('rollBtn');
const playerTokenSelect = document.getElementById('playerToken');
const message = document.getElementById('message');
const gameArea = document.getElementById('gameArea');

let playerPos = 1;
let botPos = 1;
let playerToken = "🍳";
let botToken = "🐔";
let playerTurn = true;
let totalCells = 100;

const availableTokens = ["🍳", "🐔", "🧋", "🥥", "🥚"];

// Petak khas
const questionTiles = [7, 14, 28, 44, 63];
const forwardTiles = { 5: 3, 13: 2, 26: 4, 67: 3 };
const backwardTiles = { 9: 2, 22: 3, 35: 4, 79: 2 };

// Tangga & Ular
const ladders = { 3: 22, 11: 26, 20: 29 };
const snakes = { 17: 4, 21: 9, 27: 1 };

startBtn.addEventListener("click", () => {
  playerToken = playerTokenSelect.value;
  const botOptions = availableTokens.filter(t => t !== playerToken);
  botToken = botOptions[Math.floor(Math.random() * botOptions.length)];

  gameArea.style.display = "block";
  renderBoard();
  updatePosition();
});

rollBtn.addEventListener("click", () => {
  const roll = Math.floor(Math.random() * 6) + 1;
  message.textContent = `${playerTurn ? "Anda" : "Bot"} roll: ${roll}`;

  if (playerTurn) {
    playerPos += roll;
    if (playerPos > 100) playerPos = 100;
    applySpecialTile("player");
    playerPos = checkSnakeOrLadder(playerPos);
    if (playerPos >= 100) return endGame("🎉 Anda menang!");
  } else {
    botPos += roll;
    if (botPos > 100) botPos = 100;
    applySpecialTile("bot");
    botPos = checkSnakeOrLadder(botPos);
    if (botPos >= 100) return endGame("🤖 Bot menang!");
  }

  updatePosition();
  playerTurn = !playerTurn;

  if (!playerTurn) {
    setTimeout(() => rollBtn.click(), 1000); // Bot auto roll
  }
});

function applySpecialTile(who) {
  let pos = who === "player" ? playerPos : botPos;

  if (questionTiles.includes(pos) && who === "player") {
    const success = askQuestion();
    if (!success) {
      message.textContent = "❌ Salah jawapan! Token tidak bergerak.";
      playerPos -= Math.floor(Math.random() * 2); // optional penalty
    }
  }

  if (forwardTiles[pos]) {
    const jump = forwardTiles[pos];
    message.textContent = `🟢 Bonus! Maju +${jump}`;
    if (who === "player") playerPos += jump;
    else botPos += jump;
  }

  if (backwardTiles[pos]) {
    const back = backwardTiles[pos];
    message.textContent = `🔴 Malang! Mundur -${back}`;
    if (who === "player") playerPos -= back;
    else botPos -= back;
  }

  if (playerPos < 1) playerPos = 1;
  if (botPos < 1) botPos = 1;
}

function askQuestion() {
  const qList = [
    { q: "5 + 3 =", a: "8" },
    { q: "Tahun Merdeka Malaysia?", a: "1957" },
    { q: "Planet ke-3 dari Matahari?", a: "Bumi" },
    { q: "7 × 6 =", a: "42" },
    { q: "Siapa Perdana Menteri Pertama?", a: "Tunku Abdul Rahman" },
  ];
  const pick = qList[Math.floor(Math.random() * qList.length)];
  const userAnswer = prompt(`❓ Soalan: ${pick.q}`);
  return userAnswer && userAnswer.trim().toLowerCase() === pick.a.toLowerCase();
}

function checkSnakeOrLadder(pos) {
  if (ladders[pos]) {
    message.textContent = "🪜 Naik tangga!";
    return ladders[pos];
  }
  if (snakes[pos]) {
    message.textContent = "🐍 Kena patuk ular!";
    return snakes[pos];
  }
  return pos;
}

function endGame(msg) {
  updatePosition();
  message.textContent = msg;
  rollBtn.disabled = true;
}

function renderBoard() {
  board.innerHTML = "";
  for (let i = totalCells; i >= 1; i--) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = "cell-" + i;

    if (questionTiles.includes(i)) cell.classList.add("blue");
    if (forwardTiles[i]) cell.classList.add("green");
    if (backwardTiles[i]) cell.classList.add("red");

    cell.textContent = i;
    board.appendChild(cell);
  }
}

function updatePosition() {
  document.querySelectorAll(".player, .bot").forEach(el => el.remove());

  if (playerPos <= 100) {
    const playerEl = document.createElement("div");
    playerEl.className = "player";
    playerEl.textContent = playerToken;
    document.getElementById("cell-" + playerPos).appendChild(playerEl);
  }

  if (botPos <= 100) {
    const botEl = document.createElement("div");
    botEl.className = "bot";
    botEl.textContent = botToken;
    document.getElementById("cell-" + botPos).appendChild(botEl);
  }
}
