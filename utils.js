const ROWS = 10;
const COLS = 17;

function generateRandomGrid() {
    const grid = [];
    for(let y = 0; y < ROWS; y++) {
        grid[y] = [];
        for(let x = 0; x < COLS; x++) {
            grid[y][x] = {
            value: Math.floor(Math.random() * 9) + 1,
            lemon: false,
            };
        }
    }

    // 랜덤한 10칸에 레몬 생성
    const lemonSet = new Set();
    while(lemonSet.size < 10) {
        const index = Math.floor(Math.random() * ROWS * COLS);
        if(!lemonSet.has(index)) {
            lemonSet.add(index);
            const y = Math.floor(index / COLS);
            const x = index % COLS;
            grid[y][x].lemon = true;
        }
    }
    return grid;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}