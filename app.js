"use strict";

import settings from './modules/settings.js';
import board from './modules/board.js';
import pill from './modules/pill.js';
import { controls, stop, advanceStage, changeStage } from './modules/utilities.js';


board.setup(pill);
pill.setup(board);
let intervals = {
    left: 0,
    nleft: true,
    oleft: 0,
    noleft: true,
    right: 0,
    nright: true,
    oright: 0,
    noright: true,
}

const changeStageBtn = document.getElementById("changeStage");
if (changeStageBtn) {
  changeStageBtn.addEventListener("click", function () {
    const level = parseInt(document.getElementById("level").value);
    changeStage(board, pill, level);
  });
}

if (typeof window !== 'undefined' && document.getElementById("gameDiv")) {
  board.board_generation();
  document.addEventListener("keydown", (e) => controls(e, pill, board, intervals));
  document.addEventListener("keyup", (e) => stop(e, intervals));

  setInterval(() => advanceStage(board), 10000);
}


export { board, pill, settings };