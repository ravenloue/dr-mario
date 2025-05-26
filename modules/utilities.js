export function advanceStage(board) {
    if (board.end && board.win) {
        if (board.level < 20) board.level++;

        const stageCompleted = document.getElementById("stageCompleted");
        if (stageCompleted) stageCompleted.style.display = "none";
        clearInterval(board.dance_interval);
        board.board_generation();
    }
}

export function controls(e, pill, board, intervals) {
    if (e.keyCode === 32) {
        togglePause(board, pill);
        return;
    }

    if (pill.falls && !pill.throwing) {
        if ((e.keyCode == 37 || e.keyCode == 65) && intervals.nleft) {
            pill.to_left()
            intervals.left = setInterval(pill.to_left, 200)
            intervals.nleft = false
        }
        else if ((e.keyCode == 38 || e.keyCode == 87) && intervals.noleft) {
            pill.turn_left()
            intervals.oleft = setInterval(pill.turn_left, 200)
            intervals.noleft = false
        }
        else if ((e.keyCode == 39 || e.keyCode == 68) && intervals.nright) {
            pill.to_right()
            intervals.right = setInterval(pill.to_right, 200)
            intervals.nright = false
        }
        else if (e.keyCode == 16 && intervals.noright) {
            pill.turn_right()
            intervals.oright = setInterval(pill.turn_right, 200)
            intervals.noright = false
        }
        else if (e.keyCode == 40 || e.keyCode == 83) {
            if (!pill.throwing)
                pill.falling()
        }
    }
}

export function stop(e, intervals) {
    if ((e.keyCode == 37 || e.keyCode == 65) && !intervals.nleft) {
        clearInterval(intervals.left)
        intervals.nleft = true
    }
    else if ((e.keyCode == 38 || e.keyCode == 87) && !intervals.noleft) {
        clearInterval(intervals.oleft)
        intervals.noleft = true
    }
    else if ((e.keyCode == 39 || e.keyCode == 68) && !intervals.nright) {
        clearInterval(intervals.right)
        intervals.nright = true
    }
    else if (e.keyCode == 16 && !intervals.noright) {
        clearInterval(intervals.oright)
        intervals.noright = true
    }
}

export function togglePause(board, pill) {
    board.paused = !board.paused;
    const pauseOverlay = document.getElementById("paused");

    if (board.paused) {
        clearInterval(pill.move);
        clearInterval(board.dance_interval);
        if(pauseOverlay) pauseOverlay.style.display = "inline";
    } else {
        pill.move = setInterval(pill.pill_throw, 1000);
        board.dance_interval = setInterval(board.dance, 200);
        if (pauseOverlay) pauseOverlay.style.display = "none";
    }
}

export function changeStage(board, pill, level) {
    board.level = level;
    const stageCompleted = document.getElementById("stageCompleted")
    const gameOver = document.getElementById("gameOver")
    const gameOver_dr = document.getElementById("gameOver_dr")
    
    if (stageCompleted) stageCompleted.style.display = "none";
    if (gameOver && gameOver_dr) {
        gameOver.style.display = "none";
        gameOver_dr.style.display = "none";
    }
    
    clearInterval(pill.move);
    clearInterval(board.dance_interval);
    board.board_generation();
}