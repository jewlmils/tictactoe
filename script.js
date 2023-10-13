const boardCells = document.querySelectorAll(".board-cell");
const turn = document.querySelector(".turn");
const result = document.querySelector(".result");

// symbol
const playerX = "X";
const playerO = "O";

let gameIsOver = false;

// board array
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// history
let history = [];
let historyCounter = 0;

const hisMsg = document.querySelector("#historyMessage");
const hisBtns = document.querySelector("#historyButtons");
const hisBtn = document.querySelector("#hisBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const resBtn = document.querySelector("#resBtn");
const resBtn2 = document.querySelector("#resBtn2");
const hisMsgTxtElement = document.querySelector("[data-history-message-text]");

// event listener , prev btn, next btn, restart sa screen
resBtn.addEventListener("click", restartGame);
prevBtn.addEventListener("click", prevHistory);
nextBtn.addEventListener("click", nextHistory);

// itago ang prev and next history habang in game
prevBtn.style.display = "none";
nextBtn.style.display = "none";

// event listener history and restart button sa modal
hisBtn.addEventListener("click", showHistory);
resBtn2.addEventListener("click", function () {
  location.reload();
});

// modal and start intro
const modal = document.querySelector("#startModal");
const xBtn = document.querySelector("#startWithX");
const oBtn = document.querySelector("#startWithO");

const titleIntro = document.querySelector(".title-intro");
const startIntro = document.querySelector(".start");

const gameIntro = document.querySelector(".game-intro");
const gameBoard = document.querySelector(".game-board");

modal.style.display = "none";
titleIntro.style.display = "block";
hisMsg.style.display = "none";
turn.style.display = "none";
gameIntro.style.display = "none";
gameBoard.style.display = "none";

startIntro.addEventListener("click", function () {
  modal.style.display = "block";
  titleIntro.style.display = "none";
  hisMsg.style.display = "block";
  turn.style.display = "block";
  gameIntro.style.display = "block";
  gameBoard.style.display = "block";
});

// event listener for the starting buttons
xBtn.addEventListener("click", function () {
  turn.innerHTML = "Player X";
  modal.style.display = "none";
  startGame();
});

oBtn.addEventListener("click", function () {
  turn.innerHTML = "Player O";
  modal.style.display = "none";
  startGame();
});


// start game function
function startGame() {
  historyCounter = 0;
  console.log(board);
  console.log(historyCounter);
  gameIsOver = false;
  boardCells.forEach((cell, index) => {
    cell.innerHTML = "";
    cell.addEventListener("click", handleClick.bind(null, cell, index));
  });
}

// handle click
function handleClick(cell, index) {
  if (gameIsOver) {
    return;
  }

  const cellValue = cell.innerHTML;
  if (cellValue === "") {
    if (turn.innerHTML === "Player X") {
      cell.innerHTML = playerX;
      turn.innerHTML = "Player O";
      // insert into array
      board[Math.floor(index / 3)][index % 3] = playerX;
      saveState(index, playerX); // Store the move
    } else {
      cell.innerHTML = playerO;
      turn.innerHTML = "Player X";
      // insert into array
      board[Math.floor(index / 3)][index % 3] = playerO;
      saveState(index, playerO); // Store the move
    }
    // check if someone won
    checkWinner();
  }
}

function checkWinner() {
  // check for rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2] &&
      board[i][0] !== ""
    ) {
      showResult(board[i][0]);
      gameIsOver = true;
      return;
    }
  }
  // check for columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i] &&
      board[0][i] !== ""
    ) {
      showResult(board[0][i]);
      gameIsOver = true;
      return;
    }
  }
  // check for diagonals
  if (
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2] &&
    board[0][0] !== ""
  ) {
    showResult(board[0][0]);
    gameIsOver = true;
    return;
  }
  if (
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0] &&
    board[0][2] !== ""
  ) {
    showResult(board[0][2]);
    gameIsOver = true;
    return;
  }
  // check for a tie
  // if all cells are filled and no winner
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] != "") {
        count++;
      }
    }
  }
  if (count == 9) {
    showResult("Tie");
    gameIsOver = true;
    return;
  }
}

// save state, dito mag push sa array ng board
function saveState(index, playerSymbol) {
  history.push({ index, playerSymbol });
}

function showHistory() {
  eModal.style.display = "none";
  historyCounter = history.length - 1;
  nextBtn.disabled = true;

  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
}

// Function to navigate to the previous state in history
function prevHistory() {
  if (historyCounter > 0) {
    resetBoard(); // Clear the board
    const { index, playerSymbol } = history[--historyCounter];
    replayMoves(historyCounter);
  }
  nextBtn.disabled = false;
  if (historyCounter === 0) {
    prevBtn.disabled = true;
  }
}

function nextHistory() {
  if (historyCounter < history.length) {
    const { index, playerSymbol } = history[historyCounter++];
    replayMoves(historyCounter);
  }

  prevBtn.disabled = false;
  if (historyCounter === history.length) {
    nextBtn.disabled = true;
  }
}
// Helper function to clear the board without resetting cell innerHTML
function resetBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

// Helper function to replay moves up to a given index in history
function replayMoves(targetIndex) {
  // Clear the board
  boardCells.forEach((cell) => {
    cell.innerHTML = "";
  });

  history.slice(0, targetIndex).forEach(({ index, playerSymbol }) => {
    const cell = boardCells[index];
    cell.innerHTML = playerSymbol;
    turn.innerHTML = "This is how you won!";
    // const nextPlayer = playerSymbol === playerX ? playerO : playerX;
    // turn.innerHTML = `Player ${nextPlayer}`;
  });
}

const eModal = document.querySelector("#endModal");

function showResult(symbol) {
  if (symbol === playerX) {
    result.innerHTML = "Player X Win!";
  } else if (symbol === playerO) {
    result.innerHTML = "Player O Win!";
  } else {
    result.innerHTML = "Tie!";
  }
  console.log(board);
  result.style.display = "flex";
  turn.innerHTML = "Game Over";
  eModal.style.display = "block";
}

function restartGame() {
  console.log(board);
  result.style.display = "none";
  turn.innerHTML = "Every move counts!";

  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  history.length = 0;
  startGame();
  const modal = document.querySelector("#startModal");
  modal.style.display = "block";
  eModal.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  titleIntro.style.display = "none";
}

startGame();
