// @AtteJantunen

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;
import "./styles.css";

const table = document.getElementById("board");
const activePlayerh2 = document.getElementById("activeplayer");

let currentSize = 5;
let winner = false;
let activePlayer;
let boardState = [];
let moves = 0;

function resetBar() {
  setActivePlayer();
  let bar = document.getElementById("inner");
  bar.classList.remove("determinate");
  void bar.offsetWidth; //trigger dom reflow
  bar.classList.add("determinate");
  bar.style.animationPlayState = "initial";
}

function createProgBar(callback) {
  let barInner = document.getElementById("inner");

  if (typeof callback === "function") {
    barInner.addEventListener("animationend", () => callback());
  }
  barInner.style.animationPlayState = "running";
}

function initBoard() {
  let rowIndex = 0;
  let colIndex = 0;
  table.addEventListener("click", cellClick);
  activePlayer = "X";
  activePlayerh2.innerHTML = activePlayer;
  table.innerHTML = "";
  boardState = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ];

  boardState.forEach(row => {
    colIndex = 0;
    const divRow = document.createElement("div");
    divRow.className = "row";
    divRow.id = rowIndex;
    table.appendChild(divRow);
    row.forEach(element => {
      const divCell = document.createElement("div");
      divCell.className = "col";
      divRow.appendChild(divCell);
      divCell.classList.add("cell");
      divCell.id = colIndex;

      divCell.innerHTML = element;
      colIndex++;
    });
    rowIndex++;
  });
}

function resetBoard() {
  let rowIndex = 0;
  let colIndex = 0;
  moves = 0;
  winner = false;
  activePlayer = "X";
  activePlayerh2.innerHTML = activePlayer;
  table.innerHTML = "";
  boardState = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ];

  boardState.forEach(row => {
    colIndex = 0;
    const divRow = document.createElement("div");
    divRow.className = "row";
    divRow.id = rowIndex;
    table.appendChild(divRow);
    row.forEach(element => {
      const divCell = document.createElement("div");
      divCell.className = "col";
      divRow.appendChild(divCell);
      divCell.classList.add("cell");
      divCell.id = colIndex;

      divCell.innerHTML = element;
      colIndex++;
    });
    rowIndex++;
  });
}

function setActivePlayer() {
  if (activePlayer === "X") {
    activePlayer = "O";
  } else {
    activePlayer = "X";
  }
  activePlayerh2.innerHTML = activePlayer;
}

function winDiags(rowIndex, colIndex) {
  // diagonal search
  let xDiagWin = 0;
  let yDiagWin = 0;
  let xDiag2Win = 0;
  let yDiag2Win = 0;
  let xDiag3Win = 0;
  let yDiag3Win = 0;
  let xDiag4Win = 0;
  let yDiag4Win = 0;
  let m = colIndex;
  let n = rowIndex;
  let p = colIndex;
  let c = rowIndex;

  for (let range = 0; range < 5; range++) {
    // UpRightDiag
    if (c >= 0 && m < currentSize) {
      if (boardState[c][m] === "X") {
        yDiag3Win = 0;
        xDiag3Win++;
      } else if (boardState[c][m] === "O") {
        xDiag3Win = 0;
        yDiag3Win++;
      } else {
        xDiag3Win = 0;
        yDiag3Win = 0;
      }
    }
    // DownLeftDiag
    if (n < currentSize && p >= 0) {
      if (boardState[n][p] === "X") {
        yDiag4Win = 0;
        xDiag4Win++;
      } else if (boardState[n][p] === "O") {
        xDiag4Win = 0;
        yDiag4Win++;
      } else {
        xDiag4Win = 0;
        yDiag4Win = 0;
      }
    }
    // UpLeftDiag
    if (c >= 0 && p >= 0) {
      if (boardState[c][p] === "X") {
        yDiag2Win = 0;
        xDiag2Win++;
      } else if (boardState[c][p] === "O") {
        xDiag2Win = 0;
        yDiag2Win++;
      } else {
        xDiag2Win = 0;
        yDiag2Win = 0;
      }
    }
    // DownRightDiag
    if (m < currentSize && n < currentSize) {
      if (boardState[n][m] === "X") {
        yDiagWin = 0;
        xDiagWin++;
      } else if (boardState[n][m] === "O") {
        xDiagWin = 0;
        yDiagWin++;
      } else {
        xDiagWin = 0;
        yDiagWin = 0;
      }
    }
    // Check for win condition
    if (xDiagWin + xDiag2Win > 5) {
      winner = true;
      break;
    } else if (yDiagWin + yDiag2Win > 5) {
      winner = true;
      break;
    }

    if (xDiag3Win + xDiag4Win > 5) {
      winner = true;
      break;
    } else if (yDiag3Win + yDiag4Win > 5) {
      winner = true;
      break;
    }
    m++;
    n++;
    p--;
    c--;
  }
}

function matrixColumn(matrix, n) {
  return matrix.map(x => x[n]);
}

function winCol(colIndex, rowIndex) {
  let xColWin = 0;
  let yColWin = 0;
  let scoreArray = [];
  let startIndex = rowIndex - 4;
  let endIndex = rowIndex + 4;

  if (startIndex < 0) {
    startIndex = 0;
  }
  if (endIndex > currentSize) {
    endIndex = currentSize;
  }
  scoreArray = matrixColumn(
    boardState.slice(startIndex, endIndex + 1),
    colIndex
  );
  const range = scoreArray.length;

  for (let j = startIndex; j <= range; j++) {
    // check col, reset Y if X found
    if (scoreArray[j] === "X") {
      yColWin = 0;
      xColWin++;
    } else if (scoreArray[j] === "O") {
      xColWin = 0;
      yColWin++;
    } else {
      xColWin = 0;
      yColWin = 0;
    }

    if (xColWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    } else if (yColWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    }
  }
}

function winRow(colIndex, rowIndex) {
  let xRowWin = 0;
  let yRowWin = 0;
  let scoreArray = [];
  let startIndex = colIndex - 4;
  let endIndex = colIndex + 4;

  if (startIndex < 0) {
    startIndex = 0;
  }

  if (endIndex > currentSize) {
    endIndex = currentSize;
  }
  scoreArray = boardState[rowIndex].slice(startIndex, endIndex + 1);
  const range = scoreArray.length;

  for (let i = startIndex; i <= range; i++) {
    // check row, reset X if Y found
    if (scoreArray[i] === "X") {
      yRowWin = 0;
      xRowWin++;
    } else if (scoreArray[i] === "O") {
      xRowWin = 0;
      yRowWin++;
      // If empty cell between reset both
    } else {
      xRowWin = 0;
      yRowWin = 0;
    }

    if (xRowWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    } else if (yRowWin >= 5) {
      scoreArray = [];
      winner = true;
      break;
    }
  }
}

function processMove(clickedCell) {
  const rowIndex = clickedCell.id;
  const colIndex = clickedCell.parentElement.id;
  if (clickedCell.innerHTML === "") {
    clickedCell.innerHTML = activePlayer;
    if (activePlayer === "X") {
      clickedCell.classList.add("x");
    } else if (activePlayer === "O") {
      clickedCell.classList.add("o");
    }
    neighborAlgo(rowIndex, colIndex);
    // if (colIndex < (currentSize - 3)) {
    //   growBorder('right')
    // }
  }
}

function neighborAlgo(rowIndex, colIndex) {
  boardState[rowIndex][colIndex] = activePlayer;
  winRow(colIndex, rowIndex);
  winCol(colIndex, rowIndex);
  winDiags(rowIndex, colIndex);
  if (winner === true) {
    if (activePlayer === "X") {
      alertPlayer("Player 1 won!");
    } else {
      alertPlayer("Player 2 won!");
    }
    resetBoard();
    winner = false;
  } else {
    moves++;
    if (moves < Math.pow(currentSize, 2)) {
      resetBar();
    } else {
      alert("Draw");
      resetBoard();
      createProgBar(resetBar);
      winner = false;
    }
  }
}

function alertPlayer(msg) {
  let bar = document.getElementById("inner");
  bar.style.animationPlayState = "paused";
  alert(msg);
}

function cellClick(cellClickEvent) {
  const clickedCell = cellClickEvent.target;
  processMove(clickedCell);
}
initBoard();
createProgBar(resetBar);
