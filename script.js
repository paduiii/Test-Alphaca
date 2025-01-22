const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
let deck = [];
let playerHand = [];
let botHand = [];
let pile = [];
let playerScore = 0;
let botScore = 0;

// สร้างสำรับไพ่
function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  shuffleDeck();
}

// สับไพ่
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// แจกไพ่ให้ผู้เล่นและบอท
function dealCards() {
  playerHand = [];
  botHand = [];
  for (let i = 0; i < 7; i++) {
    playerHand.push(deck.pop());
    botHand.push(deck.pop());
  }
}

// แสดงไพ่ในมือผู้เล่น
function displayPlayerHand() {
  const playerHandDiv = document.getElementById('player-hand');
  playerHandDiv.innerHTML = '';
  playerHand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
      <div class="rank">${card.rank}</div>
      <div class="suit">${card.suit}</div>
    `;
    cardDiv.setAttribute('data-index', index);
    playerHandDiv.appendChild(cardDiv);
  });
}

// แสดงไพ่ของบอทเป็น "หลังไพ่"
function displayBotHand() {
  const botCardsDiv = document.getElementById('bot-cards');
  botCardsDiv.innerHTML = '';
  botHand.forEach(() => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'bot');
    botCardsDiv.appendChild(cardDiv);
  });
}

function updateHands() {
  // อัปเดตการแสดงไพ่ในมือของผู้เล่น
  const playerHandDiv = document.getElementById('player-hand');
  playerHandDiv.innerHTML = '';
  playerHand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
      <div class="rank">${card.rank}</div>
      <div class="suit">${card.suit}</div>
    `;
    cardDiv.setAttribute('data-index', index);
    playerHandDiv.appendChild(cardDiv);
  });

  // อัปเดตการแสดงไพ่ในมือของบอท
  const botCardsDiv = document.getElementById('bot-cards');
  botCardsDiv.innerHTML = '';
  botHand.forEach(() => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'bot');
    botCardsDiv.appendChild(cardDiv);
  });
}

function playTurn() {
  if (playerHand.length === 0 || botHand.length === 0) {
    endGame(); // ถ้าไพ่หมดมือ ให้จบเกม
    return;
  }

  const playerCard = playerHand.pop(); // หยิบไพ่ใบสุดท้ายของผู้เล่น
  const botCard = botHand.pop(); // หยิบไพ่ใบสุดท้ายของบอท
  pile = [playerCard, botCard]; // วางไพ่ลงในกองกลาง
  updatePile(); // อัปเดตการแสดงกองกลาง

  const playerValue = ranks.indexOf(playerCard.rank); // ค่าของไพ่ผู้เล่น
  const botValue = ranks.indexOf(botCard.rank); // ค่าของไพ่บอท

  if (playerValue < botValue) {
    playerScore++; // ถ้าบอทชนะ เพิ่มคะแนนให้บอท
  } else if (playerValue > botValue) {
    playerScore++; // ถ้าผู้เล่นชนะ เพิ่มคะแนนให้ผู้เล่น
  }

  updateScores(); // อัปเดตคะแนน
  logAction(playerCard, botCard); // บันทึก log การเล่น
  updateHands(); // อัปเดตการแสดงผลไพ่ในมือ
}

// อัปเดตกองกลาง
function updatePile() {
  const pileDiv = document.getElementById('pile');
  pileDiv.innerHTML = '';
  pile.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
      <div class="rank">${card.rank}</div>
      <div class="suit">${card.suit}</div>
    `;
    pileDiv.appendChild(cardDiv);
  });
}

// แสดงคะแนน
function updateScores() {
  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `Player: ${playerScore} | Bot: ${botScore}`;
}


// บันทึกการกระทำ
function logAction(playerCard, botCard) {
  const logDiv = document.getElementById('log');
  logDiv.innerHTML += `ผู้เล่น: ${playerCard.rank}${playerCard.suit}, บอท: ${botCard.rank}${botCard.suit}<br>`;
}

// ฟังก์ชันสำหรับสับเปลี่ยนการแสดงผลของประวัติการเล่น
function toggleLog() {
  const logDiv = document.getElementById('log');
  const toggleButton = document.getElementById('toggle-log');
  if (logDiv.style.display === 'none') {
    logDiv.style.display = 'block';
    toggleButton.textContent = 'Hide Match History';
  } else {
    logDiv.style.display = 'none';
    toggleButton.textContent = 'Show Match History';
  }
}

// เพิ่ม event listener ให้กับปุ่ม toggle-log
document.getElementById('toggle-log').addEventListener('click', toggleLog);

// ฟังก์ชันอื่น ๆ ของเกม...

// เริ่มเกมครั้งแรก
restartGame();


// จบเกม
function endGame() {
  const winner = playerScore > botScore ? 'ผู้เล่นชนะ!' : playerScore < botScore ? 'บอทชนะ!' : 'เสมอ!';
  alert(`เกมจบ! ${winner}`);
}

// เริ่มเกมใหม่
function restartGame() {
  createDeck();
  dealCards();
  displayPlayerHand();
  displayBotHand();
  playerScore = 0;
  botScore = 0;
  updateScores();
  document.getElementById('log').innerHTML = '';
  document.getElementById('pile').innerHTML = '';
}

// ตั้งค่าปุ่ม
document.getElementById('play-turn').addEventListener('click', playTurn);
document.getElementById('restart').addEventListener('click', restartGame);

// เริ่มเกมครั้งแรก
restartGame();
