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
    }

    setup(pillRef) {
        this.pill = pillRef;
    }

    dance() {
        if (this.i == 1) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                if (!this.magnifier.graphics[j].beaten)
                    this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/1.png"
            }
        } else if (this.i == 2) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                if (!this.magnifier.graphics[j].beaten)
                    this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/2.png"
            }

        } else if (this.i == 3) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                if (!this.magnifier.graphics[j].beaten)
                    this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/3.png"
            }

        } else if (this.i == 4) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                if (!this.magnifier.graphics[j].beaten)
                    this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/2.png"
            }

        } else {
            this.i = 0
            if (this.virus_beaten == "") {
                for (let j = 0; j < this.magnifier.graphics.length; j++) {
                    this.magnifier.graphics[j].img.style.left = this.magnifier.positions[this.position_i][j].left + "px"
                    this.magnifier.graphics[j].img.style.top = this.magnifier.positions[this.position_i][j].top + "px"
                }
                this.position_i++
                if (this.position_i == this.magnifier.positions.length) {
                    this.position_i = 0
                    this.magnifier.graphics.unshift(this.magnifier.graphics[2])
                    this.magnifier.graphics.pop()
                }
            }
        }
        this.i++
    }

    defeat() {
        if (this.gameOver_i == 1) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/2.png"
            }
        } else if (this.gameOver_i == 2) {
            for (let j = 0; j < this.magnifier.graphics.length; j++) {
                this.magnifier.graphics[j].img.src = "./img/magnifier/" + this.magnifier.graphics[j].color + "/4.png"
            }
        } else {
            this.gameOver_i = 0
        }
        this.gameOver_i++
    }

    board_generation() {
        this.viruses = []
        this.viruses_position = []
        this.collision = false
        this.end = false
        this.pill_throw = 0
        this.win = false
        this.viruses_count = (this.level + 1) * 4

        this.pill.dont_exist = true
        this.pill.falls = true
        this.pill.fell = false
        this.pill.pills_tab = []

        for (let i = 0; i < this.magnifier.graphics.length; i++) {
            this.magnifier.graphics[i].img.style.display = "inline"
        }

        let stage_bg_colors = document.getElementsByClassName("background")
        let stage_number = this.level
        while (stage_number > 4) stage_number -= 5
        for (let i = 0; i < stage_bg_colors.length; i++) {
            stage_bg_colors[i].style.backgroundColor = this.board_colors[stage_number]
        }

        this.dance_interval = setInterval(() => this.dance(), 200)
        this.pill_throw_generation()
        //add viruses count
        let virus = document.getElementById("virus")
        virus.innerHTML = ""
        let viruses = "" + this.viruses_count
        for (let i = 0; i < viruses.length; i++) {
            let img = document.createElement("img")
            img.src = "./img/numbers/" + viruses[i] + ".png"
            img.style.width = settings.cell_size + "px"
            img.style.height = settings.cell_size + "px"
            virus.appendChild(img)
        }

        if (localStorage.getItem("topScore") == null)
            localStorage.setItem("topScore", 0)

        //add topScore
        let topScore = document.getElementById("topScore")
        topScore.innerHTML = ""
        let points = localStorage.getItem("topScore")
        for (let i = 0; i < points.length; i++) {
            let img = document.createElement("img")
            img.src = "./img/numbers/" + points[i] + ".png"
            img.style.width = settings.cell_size + "px"
            img.style.height = settings.cell_size + "px"
            topScore.appendChild(img)
        }
        //add level
        let levelDiv = document.getElementById("levelDiv")
        levelDiv.innerHTML = ""
        let level = "" + this.level
        for (let i = 0; i < level.length; i++) {
            let img = document.createElement("img")
            img.src = "./img/numbers/" + level[i] + ".png"
            img.style.width = settings.cell_size + "px"
            img.style.height = settings.cell_size + "px"
            levelDiv.appendChild(img)
        }

        document.getElementById("gameDiv").innerHTML = ""
        for (let y = -1; y <= settings.height; y++) {
            for (let x = 0; x <= settings.width; x++) {
                let div = document.createElement("div")
                if (y == settings.height || x == settings.width || (y == -1 && (x == 0 || x == 1 || x == 2 || x == 5 || x == 6 || x == 7))) {
                    div.classList.add("placed")
                }
                div.id = x + "x" + y
                div.style.width = settings.cell_size + "px"
                div.style.height = settings.cell_size + "px"
                let gameDiv = document.getElementById("gameDiv")
                gameDiv.style.width = settings.cell_size * (settings.width + 1) + "px"
                gameDiv.style.height = settings.cell_size * settings.height + "px"
                gameDiv.appendChild(div)
            }
        }
        // viruses colors draw
        for (let i = 0; i < this.viruses_count; i++) {
            if (i % 3 == 0)
                this.viruses.push("brown")
            if (i % 3 == 1)
                this.viruses.push("blue")
            if (i % 3 == 2)
                this.viruses.push("yellow")
        }
        for (let i = 0; i < this.viruses.length; i++) {
            if (this.level < 18) {
                var fields = 6
            } else if (this.level < 20) {
                var fields = 5
            } else if (this.level == 20) {
                var fields = 4
            }
            let x = Math.floor(Math.random() * settings.width)
            let y = Math.floor(Math.random() * (settings.height - fields)) + fields
            this.viruses_position.push([x, y])
            if (this.viruses_position.length > 1) {
                do {
                    this.collision = false
                    for (let j = 0; j < this.viruses_position.length; j++) {
                        if (this.viruses_position[this.viruses_position.length - 1].toString() == this.viruses_position[j].toString() && j != this.viruses_position.length - 1) {
                            this.collision = true
                            let xx = Math.floor(Math.random() * settings.width)
                            let yy = Math.floor(Math.random() * (settings.height - fields)) + fields
                            this.viruses_position[this.viruses_position.length - 1] = [xx, yy]
                        }
                    }
                } while (this.collision)
            }
            let div = document.getElementById(this.viruses_position[i][0] + "x" + this.viruses_position[i][1])
            div.classList.add("placed")
            div.classList.add("wirus")
            div.style.backgroundColor = this.viruses[i]
            div.style.backgroundImage = "url(./img/covid_" + this.viruses[i] + ".png)"
            div.style.backgroundSize = settings.cell_size + "px"
        }
        this.pill.pill_throw()
        this.pill.move = setInterval(() => this.pill.pill_throw(), 1000)
    }

    change_points() {
        //virus
        let virus = document.getElementById("virus")
        virus.innerHTML = ""
        let viruses = "" + this.viruses_count
        for (let i = 0; i < viruses.length; i++) {
            let img = document.createElement("img")
            img.src = "./img/numbers/" + viruses[i] + ".png"
            img.style.width = settings.cell_size + "px"
            img.style.height = settings.cell_size + "px"
            virus.appendChild(img)
        }

        //score
        let score = document.getElementById("score")
        score.innerHTML = ""
        let points = "" + this.points
        for (let i = 0; i < points.length; i++) {
            let img = document.createElement("img")
            img.src = "./img/numbers/" + points[i] + ".png"
            img.style.width = settings.cell_size + "px"
            img.style.height = settings.cell_size + "px"
            score.appendChild(img)
        }
    }

    pill_throw_generation() {
        document.getElementById("pillThrow").innerHTML = ""
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 12; x++) {
                let div = document.createElement("div")
                div.id = x + "y" + y
                div.style.width = settings.cell_size + "px"
                div.style.height = settings.cell_size + "px"
                let pill_throw = document.getElementById("pillThrow")
                pill_throw.style.width = settings.cell_size * 12 + "px"
                pill_throw.style.height = settings.cell_size * 8 + "px"
                pill_throw.appendChild(div)
            }
        }
    }

    magnifier_contents_removal(color) {
        let color_shortcut = ""
        if (color == "brown") color_shortcut = "br"
        if (color == "blue") color_shortcut = "bl"
        if (color == "yellow") color_shortcut = "yl"
        this.virus_beaten = color_shortcut
        for (let i = 0; i < this.magnifier.graphics.length; i++) {
            if (this.magnifier.graphics[i].color == color_shortcut) {
                this.magnifier.graphics[i].beaten = true
            }
        }

        let viruses = document.getElementsByClassName("wirus")
        let br = 0
        let bl = 0
        let yl = 0
        for (let i = 0; i < viruses.length; i++) {
            if (viruses[i].style.backgroundColor == "brown") br++
            if (viruses[i].style.backgroundColor == "blue") bl++
            if (viruses[i].style.backgroundColor == "yellow") yl++
        }
        let br_magnifier = document.getElementById("br_magnifier")
        let bl_magnifier = document.getElementById("bl_magnifier")
        let yl_magnifier = document.getElementById("yl_magnifier")

        let i = 0
        let luppa = document.getElementById(color_shortcut + "_magnifier")
        let aua = setInterval(() => {
            if (i == 0) {
                i = 1
                luppa.src = "./img/magnifier/" + color_shortcut + "/d1.png"
            } else {
                i = 0
                luppa.src = "./img/magnifier/" + color_shortcut + "/d2.png"
            }
        }, 200)

        setTimeout(() => {
            this.virus_beaten = ""
            for (let i = 0; i < this.magnifier.graphics.length; i++) {
                if (this.magnifier.graphics[i].color == color_shortcut) {
                    this.magnifier.graphics[i].beaten = false
                }
            }
            clearInterval(aua)
            if (br == 0) br_magnifier.style.display = "none"
            if (bl == 0) bl_magnifier.style.display = "none"
            if (yl == 0) yl_magnifier.style.display = "none"
        }, 2000);
    }
}

// Create and export a single instance
const board = new Board();
export default board;