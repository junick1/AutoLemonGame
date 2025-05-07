let grid = [];
let score = 0;
let selected = [];
let firstClick = null;
let timeLeft = 120;
let isGameRunning = false;
let timerInterval = null;

const gridElem = document.getElementById('grid');
const startButton = document.getElementById('start-button');
const autoButton = document.getElementById('auto-button');

function initGame() {
    if(timerInterval) clearInterval(timerInterval);

    grid = generateRandomGrid();
    score = 0;
    selected = [];
    firstClick = null;
    timeLeft = 120;
    isGameRunning = true;

    render();
    startTimer();
    enableDragListeners();
}

function render() {
    gridElem.innerHTML = '';
    for(let y = 0; y < ROWS; y++) {
        for(let x = 0; x < COLS; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if(!grid[y][x]) cell.classList.add('empty');
            if(grid[y][x] && grid[y][x].lemon) cell.classList.add('lemon');
            if(selected.some(p => p.x === x && p.y === y)) cell.classList.add('selected');
            
            cell.textContent = grid[y][x] ? grid[y][x].value : '';
            cell.onclick = () => {
                if(isGameRunning && !isBotRunning) selectCell(x, y);
            };
            gridElem.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = score;
}

function selectCell(x, y, nx = null, ny = null) {
    if(!isGameRunning) return;

    const x1 = nx !== null ? nx : firstClick?.x;
    const y1 = ny !== null ? ny : firstClick?.y;

    if(x1 === undefined || y1 === undefined) {
        if(!firstClick) {
            firstClick = { x, y };
            selected = [{ x, y }];
            render();
        }
        return;
    }

    const xx1 = Math.min(x1, x), xx2 = Math.max(x1, x);
    const yy1 = Math.min(y1, y), yy2 = Math.max(y1, y);
    selected = [];

    let sum = 0, lemonCount = 0;
    for(let yy = yy1; yy <= yy2; yy++) {
        for(let xx = xx1; xx <= xx2; xx++) {
            if(!grid[yy][xx]) continue;
            
            selected.push({ x: xx, y: yy });
            sum += grid[yy][xx].value;
            if(grid[yy][xx].lemon) lemonCount++;
        }
    }

    if(sum === 10) {
        for(const p of selected) {
            grid[p.y][p.x] = null;
        }
        score += selected.length + lemonCount * 4;

        if(!hasValidMove()) {
            grid = generateRandomGrid();
        }
    }

    selected = [];
    firstClick = null;
    render();
}

function hasValidMove() {
    for(let y1 = 0; y1 < ROWS; y1++) {
        for(let x1 = 0; x1 < COLS; x1++) {
            for(let y2 = y1; y2 < ROWS; y2++) {
                for(let x2 = x1; x2 < COLS; x2++) {
                    let sum = 0;
                    let valid = true;
                    for(let yy = y1; yy <= y2 && valid; yy++) {
                        for(let xx = x1; xx <= x2 && valid; xx++) {
                            if(!grid[yy][xx]) valid = false;
                            else sum += grid[yy][xx].value;
                        }
                    }
                    if(valid && sum === 10) return true;
                }
            }
        }
    }
    return false;
}

function startTimer() {
    const timerElem = document.getElementById('timer');
    timerElem.textContent = formatTime(timeLeft);

    timerInterval = setInterval(() => {
        if(timeLeft <= 1) {
            clearInterval(timerInterval);

            timerElem.textContent = '0:00';
            if(isBotRunning) toggleBot();
            isGameRunning = false;
            return;
        }
        timeLeft--;
        timerElem.textContent = formatTime(timeLeft);
    }, 1000);
}
