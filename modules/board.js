// modules/board.js
"use strict";

import settings from './settings.js';

class Board {
    constructor() {
        this.viruses = [];
        this.viruses_count = 4;
        this.level = 0;
        this.viruses_position = [];
        this.collision = false;
        this.end = false;
        this.points = 0;
        this.pill_throw = 0;
        this.dance_interval = 0;
        this.win = false;
        this.virus_beaten = "";
        this.board_colors = ["#901829", "#008267", "#ffb68c", "#837e85", "#123eb2"];
        this.magnifier = {
            graphics: [{ img: document.getElementById("br_magnifier"), color: "br", beaten: false }, { img: document.getElementById("bl_magnifier"), color: "bl", beaten: false }, { img: document.getElementById("yl_magnifier"), color: "yl", beaten: false }],
            positions: [
                [{ left: 2 * settings.cell_size, top: 16 * settings.cell_size }, { left: 6 * settings.cell_size, top: 19 * settings.cell_size }, { left: 7 * settings.cell_size, top: 14 * settings.cell_size }],
                [{ left: 2 * settings.cell_size, top: 17 * settings.cell_size }, { left: 7 * settings.cell_size, top: 19 * settings.cell_size }, { left: 6 * settings.cell_size, top: 14 * settings.cell_size }],
                [{ left: 3 * settings.cell_size, top: 18 * settings.cell_size }, { left: 8 * settings.cell_size, top: 18 * settings.cell_size }, { left: 5 * settings.cell_size, top: 14 * settings.cell_size }],
                [{ left: 3 * settings.cell_size, top: 19 * settings.cell_size }, { left: 8 * settings.cell_size, top: 17 * settings.cell_size }, { left: 4 * settings.cell_size, top: 14 * settings.cell_size }],
                [{ left: 4 * settings.cell_size, top: 19 * settings.cell_size }, { left: 8 * settings.cell_size, top: 16 * settings.cell_size }, { left: 3 * settings.cell_size, top: 15 * settings.cell_size }],
                [{ left: 5 * settings.cell_size, top: 19 * settings.cell_size }, { left: 8 * settings.cell_size, top: 15 * settings.cell_size }, { left: 2 * settings.cell_size, top: 16 * settings.cell_size }],
            ]
        };
        this.i = 0;
        this.position_i = 0;
        this.gameOver_i = 0;
        this.pill = null;
        this.paused = false;
    }

    setup(pillRef) {
        this.pill = pillRef;
    }

    /************************************** Helper Functions **************************************/

    updateMagnifierFrames(frameIndex) {
        for (let j = 0; j < this.magnifier.graphics.length; j++) {
            if (!this.magnifier.graphics[j].beaten) {
                this.magnifier.graphics[j].img.src = `./img/magnifier/${this.magnifier.graphics[j].color}/${frameIndex}.png`;
            }
        }
    }

    updateMagnifierPositions() {
        for (let j = 0; j < this.magnifier.graphics.length; j++) {
            this.magnifier.graphics[j].img.style.left = this.magnifier.positions[this.position_i][j].left + "px";
            this.magnifier.graphics[j].img.style.top = this.magnifier.positions[this.position_i][j].top + "px";
        }
        this.position_i++;
        if (this.position_i == this.magnifier.positions.length) {
            this.position_i = 0;
            this.magnifier.graphics.unshift(this.magnifier.graphics[2]);
            this.magnifier.graphics.pop();
        }
    }

    resetGameState() {
        this.viruses = [];
        this.viruses_position = [];
        this.collision = false;
        this.end = false;
        this.pill_throw = 0;
        this.win = false;
        this.viruses_count = (this.level + 1) * 4;

        this.pill.dont_exist = true;
        this.pill.falls = true;
        this.pill.fell = false;
        this.pill.pills_tab = [];
    }

    setupMagnifiers() {
        for (let i = 0; i < this.magnifier.graphics.length; i++) {
            this.magnifier.graphics[i].img.style.display = "inline";
        }
    }

    setupBoardBackground() {
        let stage_bg_colors = document.getElementsByClassName("background");
        let stage_number = this.level % 5;
        for (let i = 0; i < stage_bg_colors.length; i++) {
            stage_bg_colors[i].style.backgroundColor = this.board_colors[stage_number];
        }
    }

    createGameBoard() {
        document.getElementById("gameDiv").innerHTML = "";
        for (let y = -1; y <= settings.height; y++) {
            for (let x = 0; x <= settings.width; x++) {
                let div = document.createElement("div");
                if (y == settings.height || x == settings.width || (y == -1 && (x == 0 || x == 1 || x == 2 || x == 5 || x == 6 || x == 7))) {
                    div.classList.add("placed");
                }
                div.id = x + "x" + y;
                div.style.width = settings.cell_size + "px";
                div.style.height = settings.cell_size + "px";
                let gameDiv = document.getElementById("gameDiv");
                gameDiv.style.width = settings.cell_size * (settings.width + 1) + "px";
                gameDiv.style.height = settings.cell_size * settings.height + "px";
                gameDiv.appendChild(div);
            }
        }
    }

    generateViruses() {
        for (let i = 0; i < this.viruses_count; i++) {
            this.viruses.push(["brown", "blue", "yellow"][i % 3]);
        }

        const minRow = this.level < 18 ? 6 : (this.level < 20 ? 5 : 4);

        for (let i = 0; i < this.viruses.length; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * settings.width);
                y = Math.floor(Math.random() * (settings.height - minRow)) + minRow;
                
                if (this.viruses_position.length === i) {
                    this.viruses_position.push([x, y]);
                } else {
                    this.viruses_position[i] = [x, y];
                }
                
                this.collision = false;
                for (let j = 0; j < i; j++) {
                    if (this.viruses_position[i].toString() === this.viruses_position[j].toString()) {
                        this.collision = true;
                        break;
                    }
                }
            } while (this.collision);

            let div = document.getElementById(this.viruses_position[i][0] + "x" + this.viruses_position[i][1]);
            div.classList.add("placed", "wirus");
            div.style.backgroundColor = this.viruses[i];
            div.style.backgroundImage = `url(./img/covid_${this.viruses[i]}.png)`;
            div.style.backgroundSize = settings.cell_size + "px";
        }
    }

    updateGameCounters() {
        this.updateCounter("virus", this.viruses_count);
        this.updateCounter("topScore", localStorage.getItem("topScore") || "0");
        this.updateCounter("levelDiv", this.level);
    }

    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        element.innerHTML = "";
        const valueStr = value.toString();
        
        for (let i = 0; i < valueStr.length; i++) {
            let img = document.createElement("img");
            img.src = `./img/numbers/${valueStr[i]}.png`;
            img.style.width = settings.cell_size + "px";
            img.style.height = settings.cell_size + "px";
            element.appendChild(img);
        }
    }

    /************************************** Board Functions ***************************************/

    dance() {
        if (this.i >= 1 && this.i <= 4) {
            const frameIndex = this.i === 4 ? 2 : this.i;
            this.updateMagnifierFrames(frameIndex);
        } else {
            this.i = 0;
            if (this.virus_beaten === "") {
                this.updateMagnifierPositions();
            }
        }
        this.i++;
    }

    defeat() {
        if (this.gameOver_i == 1) {
            this.updateMagnifierFrames(2);
        } else if (this.gameOver_i == 2) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                this.magnifier.graphics[j].img.src = `./img/magnifier/${this.magnifier.graphics[j].color}/4.png`;
            }
        } else {
            this.gameOver_i = 0;
        }
        this.gameOver_i++;
    }

    board_generation() {
        this.resetGameState();
        this.setupMagnifiers();
        this.setupBoardBackground();
        this.createGameBoard();
        this.generateViruses();
        this.updateGameCounters();
        
        this.dance_interval = setInterval(() => this.dance(), 200);
        this.pill_throw_generation();
        this.pill.pill_throw();
        this.pill.move = setInterval(() => this.pill.pill_throw(), 1000);
    }

    change_points() {
        this.updateCounter("virus", this.viruses_count);
        this.updateCounter("score", this.points);
    }

    pill_throw_generation() {
        document.getElementById("pillThrow").innerHTML = "";
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 12; x++) {
                let div = document.createElement("div");
                div.id = x + "y" + y;
                div.style.width = settings.cell_size + "px";
                div.style.height = settings.cell_size + "px";
                let pill_throw = document.getElementById("pillThrow");
                pill_throw.style.width = settings.cell_size * 12 + "px";
                pill_throw.style.height = settings.cell_size * 8 + "px";
                pill_throw.appendChild(div);
            }
        }
    }

    magnifier_contents_removal(color) {
        const colorMap = {
            "brown": "br",
            "blue": "bl",
            "yellow": "yl"
        };
        
        const color_shortcut = colorMap[color];
        this.virus_beaten = color_shortcut;
        
        // Mark the magnifier as beaten
        for (let i = 0; i < this.magnifier.graphics.length; i++) {
            if (this.magnifier.graphics[i].color == color_shortcut) {
                this.magnifier.graphics[i].beaten = true;
            }
        }

        // Count remaining viruses by color
        let viruses = document.getElementsByClassName("wirus");
        let virusCounts = {
            "brown": 0,
            "blue": 0,
            "yellow": 0
        };
        
        for (let i = 0; i < viruses.length; i++) {
            const virusColor = viruses[i].style.backgroundColor;
            if (virusCounts.hasOwnProperty(virusColor)) {
                virusCounts[virusColor]++;
            }
        }

        // Animate the defeated magnifier
        const luppa = document.getElementById(color_shortcut + "_magnifier");
        let i = 0;
        let aua = setInterval(() => {
            luppa.src = `./img/magnifier/${color_shortcut}/d${i === 0 ? 1 : 2}.png`;
            i = 1 - i; // Toggle between 0 and 1
        }, 200);

        // Reset after animation
        setTimeout(() => {
            this.virus_beaten = "";
            
            // Reset beaten status
            for (let i = 0; i < this.magnifier.graphics.length; i++) {
                if (this.magnifier.graphics[i].color == color_shortcut) {
                    this.magnifier.graphics[i].beaten = false;
                }
            }
            
            clearInterval(aua);
            
            // Hide magnifiers for colors with no viruses left
            if (virusCounts.brown === 0) document.getElementById("br_magnifier").style.display = "none";
            if (virusCounts.blue === 0) document.getElementById("bl_magnifier").style.display = "none";
            if (virusCounts.yellow === 0) document.getElementById("yl_magnifier").style.display = "none";
        }, 2000);
    }
}

const board = new Board();
export default board;