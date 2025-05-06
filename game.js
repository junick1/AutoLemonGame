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
}

function render() {
    gridElem.innerHTML = '';
    for(let y = 0; y < ROWS; y++) {
        for(let x = 0; x < COLS; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

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

function selectCell(x, y) {
    if(!isGameRunning) return;

    if(!firstClick) {
        firstClick = { x, y };
        selected = [{ x, y }];
        render();
        return;
    }

    const x1 = Math.min(firstClick.x, x), x2 = Math.max(firstClick.x, x);
    const y1 = Math.min(firstClick.y, y), y2 = Math.max(firstClick.y, y);
    selected = [];

    let sum = 0, lemonCount = 0;
    for(let yy = y1; yy <= y2; yy++) {
        for(let xx = x1; xx <= x2; xx++) {
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
        if(timeLeft <= 0) {
            clearInterval(interval);

            timerElem.textContent = '0:00';
            if(isBotRunning) toggleBot();
            isGameRunning = false;

            alert(`게임 종료! 최종 점수: ${score}`);
            return;
        }
        timeLeft--;
        timerElem.textContent = formatTime(timeLeft);
    }, 1000);
}
