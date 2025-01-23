const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
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

// แสดงไพ่ของบอท
function displayBotHand() {
  const botCardsDiv = document.getElementById('bot-cards');
  botCardsDiv.innerHTML = '';
  botHand.forEach(() => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'bot');
    botCardsDiv.appendChild(cardDiv);
  });
}

// อัปเดตการแสดงกองกลางพร้อมจำนวนการ์ด
function updatePile() {
  const pileDiv = document.getElementById('pile');
  pileDiv.innerHTML = '';

  // การ์ดในกองกลาง
  pile.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
      <div class="rank">${card.rank}</div>
      <div class="suit">${card.suit}</div>
    `;
    pileDiv.appendChild(cardDiv);
  });

  // แสดงจำนวนการ์ดที่เหลือในกอง (Deck)
  const deckCountDiv = document.createElement('div');
  deckCountDiv.classList.add('card', 'bot'); // ใช้สไตล์ "การ์ดคว่ำ"
  deckCountDiv.innerHTML = `<div style="font-size: 16px;">${deck.length} Cards</div>`;
  pileDiv.appendChild(deckCountDiv);
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

// ฟังก์ชันสำหรับการแสดงผลของประวัติการเล่น
function toggleLog() {
  const logDiv = document.getElementById('log');
  const toggleButton = document.getElementById('toggle-log');
    logDiv.style.display = 'Block';
    toggleButton.textContent = 'Show Match History';
}

document.getElementById('toggle-log').addEventListener('click', toggleLog);

// ฟังก์ชันเปิด Modal
function openLogModal() {
  const modal = document.getElementById('logModal');
  modal.style.display = 'block';
}

// ฟังก์ชันปิด Modal
function closeLogModal() {
  const modal = document.getElementById('logModal');
  modal.style.display = 'none';
}

// ตั้งค่าปุ่มปิด Modal
document.querySelector('.close').addEventListener('click', closeLogModal);

// ปิด Modal เมื่อคลิกข้างนอก
window.addEventListener('click', (event) => {
  const modal = document.getElementById('logModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// เพิ่มปุ่มสำหรับเปิด Modal
document.getElementById('toggle-log').addEventListener('click', openLogModal);

// ฟังก์ชันสำหรับเล่นแต่ละเทิร์น
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

  if (playerValue > botValue) {
    playerScore++;
  } else if (playerValue < botValue) {
    botScore++;
  } else {
    // กรณีเสมอ จั่วการ์ดใหม่แบบสุ่ม
    if (deck.length >= 2) { // ตรวจสอบว่ามีการ์ดเพียงพอให้จั่ว
      playerHand.push(deck.pop()); // ผู้เล่นจั่วการ์ดใหม่
      botHand.push(deck.pop()); // บอทจั่วการ์ดใหม่
    }
  }

  updateScores(); // อัปเดตคะแนน
  logAction(playerCard, botCard); // บันทึก log การเล่น
  updateHands(); // อัปเดตการแสดงผลไพ่ในมือ
}

function updateHands() {
  displayPlayerHand();
  displayBotHand();
}

// จบเกม
function endGame() {
  const winner = playerScore > botScore ? 'ผู้เล่นชนะ!' : playerScore < botScore ? 'บอทชนะ!' : 'เสมอ!';
  alert(`เกมจบ! ${winner}`);
}

// เริ่มเกมใหม่
function restartGame() {
  createDeck();
  dealCards();
  pile = [];
  document.getElementById('pile').innerHTML = ''; // ล้างการแสดงผลใน UI
  displayPlayerHand();
  displayBotHand();
  playerScore = 0;
  botScore = 0;
  updateScores();
  document.getElementById('log').innerHTML = ''; // ล้างประวัติการเล่น
  updatePile(); // อัปเดตกองกลาง
}

// ตั้งค่าปุ่ม
document.getElementById('play').addEventListener('click', playTurn);
document.getElementById('restart').addEventListener('click', restartGame);

// เริ่มเกมครั้งแรก
restartGame();