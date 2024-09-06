const board = document.querySelector('.board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const cells = Array.from(document.querySelectorAll('.cell'));

let boardState = ['', '', '', '', '', '', '', '', ''];
let isUserTurn = true;
let gameActive = true;

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

const checkWinner = () => {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return boardState.includes('') ? null : 'Draw';
};

const handleCellClick = (e) => {
    if (!gameActive) return;
    const cellIndex = e.target.dataset.index;
    if (boardState[cellIndex] !== '' || !isUserTurn) return;

    boardState[cellIndex] = 'X';
    e.target.textContent = 'X';
    e.target.classList.add('x');
    isUserTurn = false;

    const result = checkWinner();
    if (result) {
        endGame(result);
        return;
    }

    setTimeout(aiMove, 500);
};

const aiMove = () => {
    const emptyIndices = boardState
        .map((value, index) => value === '' ? index : null)
        .filter(value => value !== null);

    const bestMove = findBestMove(emptyIndices);
    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('o');

    const result = checkWinner();
    if (result) {
        endGame(result);
    } else {
        isUserTurn = true;
    }
};

const findBestMove = (emptyIndices) => {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

const endGame = (result) => {
    gameActive = false;
    if (result === 'Draw') {
        status.textContent = "It's a Draw!";
    } else {
        status.textContent = `${result === 'X' ? 'You Win!' : 'Machine Wins!'}`;
    }
    setTimeout(startNewGame, 2000);
};

const startNewGame = () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    isUserTurn = true;
    gameActive = true;
    status.textContent = 'Your Turn!';
};

const handleRestart = () => {
    startNewGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestart);

startNewGame(); // Initialize the game on load
