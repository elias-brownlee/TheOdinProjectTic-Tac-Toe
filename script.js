// Get DOM elements
const container = document.getElementById("game-board"); // Container for the game board
const modalBg = document.querySelector(".modal-bg"); // Modal background
const boardSpaces = document.getElementsByClassName("board-space"); // Spaces on the game board

// Function to add CSS styling to an item
const addCSS = (item) => {
    item.style.cursor = "default";
    item.style.animationName = "text"; // Apply animation
    item.style.animationDuration = "0.5s"; // Animation duration
    item.style.pointerEvents = "none"; // Disable pointer events
    
    // Set color based on the content of the item ("X" or "O")
    item.style.color = item.textContent === "X" ? "#3DBBFE" : "#F49CC8";
};

// Module to initialize game board display
const displayGameBoard = (() => {
    for (let i = 0; i < 3; i++) {
        let firstIdx = i.toString();
        for (let j = 0; j < 3; j++) {
            let secondIdx = j;
            let index = firstIdx + secondIdx;
            const button = document.createElement("button");
            button.classList.add("board-space");
            button.setAttribute("data-index", index);
            container.appendChild(button); // Append button to the container
        }
    }
})();

// Module to initialize game board array
const Board = (() => {
    // Initialize game board array
    let gameBoard = Array.from(boardSpaces).map(space => space.dataset.index);

    // Function to remove index from the game board array
    const removeIndex = (index) => {
        gameBoard.splice(index, 1);
    };

    // Function to check if a player has won
    const checkIfWon = (mark) => {
        // Get the content of the board spaces
        let board = Array.from(boardSpaces).map(space => space.textContent);

        // Function to check if a player has won based on indexes
        const checkWin = (indexes) => {
            return indexes.every(index => board[index] === mark);
        };

        // Define winning conditions (rows, columns, and diagonals)
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // Check if any winning condition is satisfied
        return winningConditions.some(condition => checkWin(condition));
    };

    // Function to check if the game is tied
    const checkIfTie = () => {
        // Check if all board spaces are filled
        return [...boardSpaces].every(space => space.textContent !== "");
    };

    return { gameBoard, removeIndex, checkIfWon, checkIfTie };
})();

// Factory function to create a player object
const Player = (name, mark) => {
    // Function to make a move
    const makeMove = (board, boardSpace) => {
        // Check if the board space is empty
        if (boardSpace.textContent === "") {
            // Place the mark on the board space
            boardSpace.textContent = mark;
            // Remove the index from the game board array
            board.removeIndex(board.gameBoard.indexOf(boardSpace.dataset.index));
            // Add CSS styling to the board space
            addCSS(boardSpace);
        }
    };
    return { name, mark, makeMove };
};

// Factory function to create a computer player object
const CompPlayer = (name, mark) => {
    // Function to make a move
    const makeMove = (board) => {
        const max = board.gameBoard.length;
        // Generate a random index
        let randomIndex = Math.floor(Math.random() * max);
        let compChoice = board.gameBoard[randomIndex];

        // Place the mark on the board space
        for (const space of boardSpaces) {
            if (compChoice === space.dataset.index) {
                space.textContent = mark;
                addCSS(space);
                break;
            }
        }

        // Remove the index from the game board array
        board.removeIndex(board.gameBoard.indexOf(compChoice));
    };
    return { name, mark, makeMove };
};

// Module to manage the game flow
const Game = (() => {
    let player = Player("Player", "X"); // Human player
    let computer = CompPlayer("Bot", "O"); // Computer player

    let currentPlayer = player; // Current player

    // Function to run the game
    const runGame = (e) => {
        if (currentPlayer === player) {
            // Human player's turn
            player.makeMove(Board, e.target);
            if (Board.checkIfWon(player.mark)) {
                displayModal(player.name); // Display modal if player wins
                return;
            }
            currentPlayer = computer; // Switch to computer player's turn
        }

        // Computer player's turn
        setTimeout(() => {
            computer.makeMove(Board);
            if (Board.checkIfWon(computer.mark)) {
                displayModal(computer.name); // Display modal if computer wins
                return;
            }
            currentPlayer = player; // Switch to human player's turn
            
            // Check for tie
            if (Board.checkIfTie()) {
                displayModal("tie"); // Display modal if game is tied
            }
        }, 800);
    };

    // Event listener for board spaces
    for (const space of boardSpaces) {
        space.addEventListener("click", runGame);
    }
})();

// Function to reset the game
const resetGame = () => {
    location.reload();
};

// Function to display the modal
const displayModal = (name) => {
    modalBg.style.display = "block";
    const winnerDisplay = document.getElementById("winner");
    // Set modal message based on game result
    winnerDisplay.textContent = name === "tie" ? "It's a tie!" : `${name} wins!`;
    const restartBtn = document.getElementById("restart");
    restartBtn.addEventListener("click", resetGame); // Add event listener to restart button
};