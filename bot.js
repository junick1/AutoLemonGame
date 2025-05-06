let isBotRunning = false;

function toggleBot() {
    if(!isGameRunning) return;

    isBotRunning = !isBotRunning;

    const autoButton = document.getElementById('auto-button');
    autoButton.textContent = isBotRunning ? "자동화 정지" : "자동화 시작";

    if(isBotRunning) runBotLoop();
}

function runBotLoop() {
    if(!isGameRunning || !isBotRunning) return;

    const move = findBestMove();
    if(!move) {
        console.log("no move!");
        return;
    }

    firstClick = { x: move.x1, y: move.y1 };
    selectCell(move.x2, move.y2);

    setTimeout(runBotLoop, 300);
}

function findBestMove() {
    let best = null;
    let bestScore = -1;

    for(let y1 = 0; y1 < ROWS; y1++) {
        for(let x1 = 0; x1 < COLS; x1++) {
            for(let y2 = 0; y2 < ROWS; y2++) {
                for(let x2 = 0; x2 < COLS; x2++) {
                    let sum = 0, count = 0, lemons = 0;

                    for(let y = y1; y <= y2; y++) {
                        for(let x = x1; x <= x2; x++) {
                            const cell = grid[y][x];
                            if(!cell) continue;

                            sum += cell.value;
                            count++;
                            if(cell.lemon) lemons++;
                        }
                    }

                    if(sum === 10) {
                        const score = count + lemons * 4;
                        if(score > bestScore) {
                            bestScore = score;
                            best = { x1, y1, x2, y2 };
                        }
                    }
                }
            }
        }
    }
    return best;
}
