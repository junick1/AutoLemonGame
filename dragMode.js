let isDragMode = true;
let dragStart = null;
let lastHoveredCell = null;

function toggleDragMode() {
    isDragMode = !isDragMode;
    const btn = document.querySelector('#drag-mode-button');
    btn.textContent = isDragMode ? '🖱 클릭' : '✋ 드래그';
}

function enableDragListeners() {
    const gridEl = document.getElementById('grid');

    gridEl.addEventListener('mousedown', e => {
        if(!isGameRunning || !isDragMode) return;

        const target = e.target;
        if(!target.classList.contains('cell')) return;

        const idx = Array.from(gridEl.children).indexOf(target);
        dragStart = { x: idx % COLS, y: Math.floor(idx / COLS) };

        selected = [{ x: dragStart.x, y: dragStart.y }];
        render();
    });

    gridEl.addEventListener('mousemove', e => {
        if(!isDragMode || dragStart === null) return;

        const target = e.target;
        if(!target.classList.contains('cell')) return;

        const idx = Array.from(gridEl.children).indexOf(target);
        const x = idx % COLS;
        const y = Math.floor(idx / COLS);
        lastHoveredCell = { x, y };

        const x1 = Math.min(dragStart.x, x), x2 = Math.max(dragStart.x, x);
        const y1 = Math.min(dragStart.y, y), y2 = Math.max(dragStart.y, y);

        selected = [];
        for(let yy = y1; yy <= y2; yy++) {
            for(let xx = x1; xx <= x2; xx++) {
                selected.push({ x: xx, y: yy });
            }
        }

        render();
    });
}

document.addEventListener('mouseup', () => {
    if(!isDragMode || dragStart === null) {
        dragStart = null;
        lastHoveredCell = null;
        return;
    }

    if(lastHoveredCell) {
        const x1 = Math.min(dragStart.x, lastHoveredCell.x);
        const x2 = Math.max(dragStart.x, lastHoveredCell.x);
        const y1 = Math.min(dragStart.y, lastHoveredCell.y);
        const y2 = Math.max(dragStart.y, lastHoveredCell.y);

        selected = [];
        dragStart = null;
        lastHoveredCell = null;
        render();

        selectCell(x2, y2, x1, y1);
    }
    else {
        dragStart = null;
        selected = [];
        render();
    }
});