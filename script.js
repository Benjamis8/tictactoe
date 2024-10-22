let board = document.getElementById("board");
let scores = { X: 0, O: 0 };

let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let playerTurn1 = true;
let moveHistory = [];
let currentMoveIndex = -1;

// checks the winning combination
function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
          // Get the values at positions a, b, and c
          const valueA = gameBoard[Math.floor(a / 3)][a % 3]; // a / 3 devides and determines which row it belongs // a % 3 indicates the column within the row
          const valueB = gameBoard[Math.floor(b / 3)][b % 3];
          const valueC = gameBoard[Math.floor(c / 3)][c % 3];
  
          // Check if valueA is not empty or three values are the same
          if (valueA && valueA === valueB && valueA === valueC) {
            updateScore(valueA);
              return valueA, valueB, valueC; // return the winning value ("X" or "O")
          }
      }
      return null; // ends the loop when no winning combination is met
 }

 function updateScore(winner) {
    scores[winner]++;
    document.getElementById("score").textContent = `X: ${scores.X} - O: ${scores.O}`; // Update score display
}


// create grid board with element function 
function createBoard() {
    for (let i = 0; i < 9; i++) {
        let tictactoeGrid = document.createElement("div");
        tictactoeGrid.classList.add("tictactoeBox");
        let gridId = `box${i}`;
        tictactoeGrid.setAttribute("id", gridId);
        board.appendChild(tictactoeGrid);
        tictactoeGrid.addEventListener("click", () => {
            addMove(gridId, i);
        });
    }
}

// gameboard arrays update
function updateBoard(element, boxNumber) { // boxNumber, parameter for i
    let row = Math.floor(boxNumber / 3);
    let column = boxNumber % 3;
    gameBoard[row][column] = element.innerText;
}

function addMove(element, boxNumber) { 
    let specificGrid = document.getElementById(element); // Get the  elemen
    // Prevent overwriting a cell 
    if (!specificGrid.textContent && currentMoveIndex === moveHistory.length - 1) {
        const currentPlayer = playerTurn1 ? "X" : "O"; // Determine current player
        specificGrid.textContent = currentPlayer; // Set the grid content
        updateBoard(specificGrid, boxNumber); // Update the game board 

        //  store move data
        const moveData = {
            player: currentPlayer,
            position: boxNumber,
            boardState: gameBoard.map(row => row.slice()) // copy of the current board state
        };

        moveHistory.push(moveData); // Store move data
        currentMoveIndex++; // increment the move index
        updateControls(); // Enable/disable buttons 
        document.getElementById("currentPlayer").textContent = currentPlayer === "X" ? "O" : "X"; // update current player display
        
        const winner = checkWin(); // Celebrate for the winner
        if (winner) {
            const winnerMessage = document.getElementById("winnerMessage");
            winnerMessage.textContent = `Congratulations! Player ${winner} wins!`;
            winnerMessage.style.display = "block"; // Show the message to the winner // 
            winnerMessage.classList.add("celebrate");

            setTimeout(() => {
                winnerMessage.classList.remove("celebrate");
            }, 1000);

            confetti({
                particleCount: 400,
                spread: 90,
                origin: { y: 0.6 }
            });

            document.querySelectorAll('.tictactoeBox').forEach(box => box.style.pointerEvents = "none"); // Disable clicks
        } else {
            playerTurn1 = !playerTurn1; // Switch player
        }
    }
}

// updates the game board UI stored in the moveHistory and currentMoveIndex
function renderMove() {
    const currentMove = moveHistory[currentMoveIndex];
    gameBoard = currentMove.boardState; // Get the board state from the move data
    for (let i = 0; i < 9; i++) {
        let box = document.getElementById(`box${i}`);
        box.textContent = gameBoard[Math.floor(i / 3)][i % 3];
    }
}

// enables and disables the "next" and "prev" button
function updateControls() {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    prevButton.disabled = currentMoveIndex <= 0;
    nextButton.disabled = currentMoveIndex >= moveHistory.length - 1;
}

document.getElementById("prev").addEventListener("click", () => {
    if (currentMoveIndex > 0) {
        currentMoveIndex--;
        renderMove();
        updateControls();
    }
});

document.getElementById("next").addEventListener("click", () => {
    if (currentMoveIndex < moveHistory.length - 1) {
        currentMoveIndex++;
        renderMove();
        updateControls();
    }
});

// Reset game board
document.getElementById("reset").addEventListener("click", () => {
    gameBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    playerTurn1 = true;
    moveHistory = [];
    currentMoveIndex = -1;
    
    // Clear the display on the board
    document.querySelectorAll('.tictactoeBox').forEach(box => {
        box.textContent = '';
        box.style.pointerEvents = "auto"; // Re-enable clicks
    });
    
    // Hide winner message
    document.getElementById("winnerMessage").style.display = "none";
    
    // Reset current player display
    document.getElementById("currentPlayer").textContent = "Current Player: X";  // first move x 
    updateControls();
});




createBoard();