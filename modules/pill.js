// modules/pill.js
import settings from './settings.js';

class Pill {
    constructor() {
        this.pills_tab = [];
        this.dont_exist = true;
        this.throwing = true;
        this.falls = true;
        this.fell = false;
        this.colors = ["", "brown", "blue", "yellow"];
        this.colors2 = ["", "br", "bl", "yl"];
        this.move = 0;
        this.next = [Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 3) + 1];
        this.board = null;
    }

    setup(boardRef) {
        this.board = boardRef;
    }
    
    to_down () {
        let id = this.pills_tab.length - 1
        let pom0 = this.pills_tab[id].position[0].split("x")
        let pom1 = this.pills_tab[id].position[1].split("x")
        let div0 = document.getElementById(pom0.join("x"))
        let div1 = document.getElementById(pom1.join("x"))
        pom0[1]++
        pom1[1]++
        let spr0 = document.getElementById(pom0.join("x"))
        let spr1 = document.getElementById(pom1.join("x"))
        if (spr0.classList.contains('placed') || spr1.classList.contains('placed')) {
            this.dont_exist = true
            div0.classList.add("placed")
            div1.classList.add("placed")
            this.pill_beat()
            this.pill_reduction()
            this.fell_function()

            if (this.board.viruses_count == 0) {
                clearInterval(this.move)
                this.board.end = true
                this.board.win = true
                if (this.board.points > parseInt(localStorage.getItem("topScore")))
                    localStorage.setItem("topScore", this.board.points)
                let stageCompletedDiv = document.getElementById("stageCompleted")
                stageCompletedDiv.style.display = "inline"
            }
            let d1 = document.getElementById("3x0")
            let d2 = document.getElementById("4x0")
            if (d1.classList.contains('placed') || d2.classList.contains('placed')) {
                clearInterval(this.move)
                this.board.end = true
                if (this.board.points > parseInt(localStorage.getItem("topScore")))
                    localStorage.setItem("topScore", this.board.points)
                let gameOver = document.getElementById("gameOver")
                let gameOver_dr = document.getElementById("gameOver_dr")
                clearInterval(this.board.dance_interval)
                this.board.dance_interval = setInterval(this.board.defeat.bind(this), 200)
                gameOver.style.display = "inline"
                gameOver_dr.style.display = "inline"
            }

            if (this.board.end) return

            //starting again
            clearInterval(this.move)
            if (!this.fell) {
                this.pill_throw()
                this.move = setInterval(this.pill_throw.bind(this), 1000)
                this.falls = true
            }
        }
        else {
            this.put_pill_up()
            let id = this.pills_tab.length - 1
            this.pills_tab[id].position.forEach((element, index) => {
                let pom = element.split("x")
                pom[1]++
                this.pills_tab[id].position[index] = pom.join("x")
            })
            this.put_pill_down()
        }
    }

    pill_throw () {
        if (this.dont_exist) {
            this.throwing = true
            this.hand()
            let i = 0
            let xD = setInterval(() => {
                if (this.board.pill_throw[i].hand == "up") {
                    document.getElementById("11y7").style.backgroundImage = ""
                    for (let y = 1; y < 4; y++) {
                        let div = document.getElementById("11y" + (y + 3))
                        div.style.backgroundImage = "url(img/hands/up_" + y + ".png)"
                        div.style.backgroundSize = settings.cell_size + "px"
                    }
                } else if (this.board.pill_throw[i].hand == "middle") {
                    document.getElementById("11y4").style.backgroundImage = ""
                    for (let y = 1; y < 3; y++) {
                        for (let x = 1; x < 3; x++) {
                            let div = document.getElementById((x + 9) + "y" + (y + 4))
                            div.style.backgroundImage = "url(img/hands/middle" + y + x + ".png)"
                            div.style.backgroundSize = settings.cell_size + "px"
                        }
                    }
                } else if (this.board.pill_throw[i].hand == "down") {
                    let div = document.getElementById("11y5").style.backgroundImage = ""
                    div = document.getElementById("10y5").style.backgroundImage = ""
                    div = document.getElementById("10y6").style.backgroundImage = ""
                    for (let y = 1; y < 3; y++) {
                        let div = document.getElementById("11y" + (y + 5))
                        div.style.backgroundImage = "url(img/hands/down_" + y + ".png)"
                        div.style.backgroundSize = settings.cell_size + "px"
                    }
                }
                for (let j = 0; j < 2; j++) {
                    if (i > 0) {
                        let del = document.getElementById(this.board.pill_throw[i - 1].position[j])
                        del.style.backgroundImage = ""
                    }
                    let div = document.getElementById(this.board.pill_throw[i].position[j])
                    div.style.backgroundImage = "url(img/" + this.board.pill_throw[i].color[j] + ")"
                    div.style.backgroundSize = settings.cell_size + "px"
                }

                i++
                if (i == this.board.pill_throw.length) {
                    clearInterval(xD)
                    let del = document.getElementById("0y6")
                    del.style.backgroundImage = ""
                    del = document.getElementById("1y6")
                    del.style.backgroundImage = ""
                }
            }, 20)
            setTimeout(() => {
                this.pills_tab.push({
                    colors: this.next,
                    change_color: true,
                    position: ["3x0", "4x0"],
                    direction: "horizontal"
                })
                this.next = [Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 3) + 1]

                document.getElementById("11y7").style.backgroundImage = ""
                for (let y = 1; y < 4; y++) {
                    let div = document.getElementById("11y" + (y + 3))
                    div.style.backgroundImage = "url(img/hands/up_" + y + ".png)"
                    div.style.backgroundSize = settings.cell_size + "px"
                }
                let div1 = document.getElementById("10y3")
                div1.style.backgroundImage = "url(img/" + this.colors2[this.next[0]] + "_left.png)"
                let div2 = document.getElementById("11y3")
                div2.style.backgroundImage = "url(img/" + this.colors2[this.next[1]] + "_right.png)"


                this.dont_exist = false
                this.put_pill_down()
                this.throwing = false
            }, 500)
        }
        else {
            this.to_down()
        }
    }

    put_pill_down () {
        let id = this.pills_tab.length - 1
        let poz = "left"
        this.pills_tab[id].position.forEach((element, index) => {
            let div = document.getElementById(element)
            div.style.backgroundColor = this.colors[this.pills_tab[id].colors[index]]
            div.style.backgroundSize = settings.cell_size + "px"
            if (this.pills_tab[id].direction == "horizontal") {
                if (index == 0) poz = "left"
                if (index == 1) poz = "right"
            } else if (this.pills_tab[id].direction == "vertical") {
                if (index == 0) poz = "down"
                if (index == 1) poz = "up"
            } else if (this.pills_tab[id].direction == "dot") {
                poz = "dot"
            }
            div.style.backgroundImage = "url(img/" + this.colors2[this.pills_tab[id].colors[index]] + "_" + poz + ".png)"
        })
    }

    put_pill_up () {
        let id = this.pills_tab.length - 1
        this.pills_tab[id].position.forEach((element) => {
            let div = document.getElementById(element)
            div.style.backgroundColor = ""
            div.style.backgroundImage = ""
        })
    }

    pill_beat () {
        //const board = require('./this.board.js');
        let toRemove = []
        //horizontal
        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width - 1; x++) {
                let i = 0
                let yes = false
                while (document.getElementById(x + i + "x" + y).style.backgroundColor == document.getElementById(x + i + 1 + "x" + y).style.backgroundColor && document.getElementById(x + i + "x" + y).style.backgroundColor != "") {
                    i++

                    if (!document.getElementById(x + i + "x" + y).classList.contains("wirus") || !document.getElementById(x + "x" + y).classList.contains("wirus")) {
                        yes = true
                    }

                    if (i >= 3 && document.getElementById(x + i + "x" + y).style.backgroundColor != document.getElementById(x + i + 1 + "x" + y).style.backgroundColor && yes) {
                        toRemove.push({
                            x: x,
                            y: y,
                            i: i,
                            direction: "horizontal"
                        })
                    }
                }
            }
        }
        //vertical
        for (let x = 0; x < settings.width; x++) {
            for (let y = 0; y < settings.height - 1; y++) {
                let i = 0
                let yes = false
                while (document.getElementById(x + "x" + (y + i)).style.backgroundColor == document.getElementById(x + "x" + (y + i + 1)).style.backgroundColor && document.getElementById(x + "x" + (y + i)).style.backgroundColor != "") {
                    i++

                    if (!document.getElementById(x + "x" + (y + i)).classList.contains("wirus") || !document.getElementById(x + "x" + y).classList.contains("wirus")) {
                        yes = true
                    }

                    if (i >= 3 && document.getElementById(x + "x" + (y + i)).style.backgroundColor != document.getElementById(x + "x" + (y + i + 1)).style.backgroundColor && yes) {
                        toRemove.push({
                            x: x,
                            y: y,
                            i: i,
                            direction: "vertical"
                        })
                    }
                }
            }
        }
        //toRemove
        while (toRemove.length > 0) {
            for (let j = 0; j <= toRemove[0].i; j++) {
                if (toRemove[0].direction == "horizontal") {
                    let div = document.getElementById(toRemove[0].x + j + "x" + toRemove[0].y)
                    if (div.classList.contains("wirus")) {
                        div.classList.remove("wirus")
                        this.board.points += 100
                        this.board.viruses_count--
                        this.board.change_points()
                        this.board.magnifier_contents_removal(div.style.backgroundColor)

                        let color = this.colors.indexOf(div.style.backgroundColor)
                        if (!color == "") {
                            div.style.backgroundImage = "url(img/" + this.colors2[color] + "_x.png)"
                            setTimeout(function () {
                                if (div.style.backgroundImage == 'url("img/br_x.png")' || div.style.backgroundImage == 'url("img/bl_x.png")' || div.style.backgroundImage == 'url("img/yl_x.png")' || div.style.backgroundImage == 'url("img/br_o.png")' || div.style.backgroundImage == 'url("img/bl_o.png")' || div.style.backgroundImage == 'url("img/yl_o.png")') {
                                    div.style.backgroundImage = ""
                                }
                            }, 300)
                        }
                    } else {
                        let color = this.colors.indexOf(div.style.backgroundColor)
                        if (!color == "") {
                            div.style.backgroundImage = "url(img/" + this.colors2[color] + "_o.png)"
                            setTimeout(function () {
                                if (div.style.backgroundImage == 'url("img/br_x.png")' || div.style.backgroundImage == 'url("img/bl_x.png")' || div.style.backgroundImage == 'url("img/yl_x.png")' || div.style.backgroundImage == 'url("img/br_o.png")' || div.style.backgroundImage == 'url("img/bl_o.png")' || div.style.backgroundImage == 'url("img/yl_o.png")') {
                                    div.style.backgroundImage = ""
                                }
                            }, 300)
                        }
                    }
                    div.style.backgroundColor = ""
                    div.classList.remove("placed")
                    this.pill_division(toRemove[0].x, toRemove[0].y, j, toRemove[0].direction)
                }
                else {
                    let div = document.getElementById(toRemove[0].x + "x" + (toRemove[0].y + j))
                    if (div.classList.contains("wirus")) {
                        div.classList.remove("wirus")
                        this.board.points += 100
                        this.board.viruses_count--
                        this.board.change_points()
                        this.board.magnifier_contents_removal(div.style.backgroundColor)

                        let color = this.colors.indexOf(div.style.backgroundColor)
                        if (!color == "") {
                            div.style.backgroundImage = "url(img/" + this.colors2[color] + "_x.png)"
                            setTimeout(function () {
                                if (div.style.backgroundImage == 'url("img/br_x.png")' || div.style.backgroundImage == 'url("img/bl_x.png")' || div.style.backgroundImage == 'url("img/yl_x.png")' || div.style.backgroundImage == 'url("img/br_o.png")' || div.style.backgroundImage == 'url("img/bl_o.png")' || div.style.backgroundImage == 'url("img/yl_o.png")') {
                                    div.style.backgroundImage = ""
                                }
                            }, 300)
                        }
                    } else {
                        let color = this.colors.indexOf(div.style.backgroundColor)
                        if (!color == "") {
                            div.style.backgroundImage = "url(img/" + this.colors2[color] + "_o.png)"
                            setTimeout(function () {
                                if (div.style.backgroundImage == 'url("img/br_x.png")' || div.style.backgroundImage == 'url("img/bl_x.png")' || div.style.backgroundImage == 'url("img/yl_x.png")' || div.style.backgroundImage == 'url("img/br_o.png")' || div.style.backgroundImage == 'url("img/bl_o.png")' || div.style.backgroundImage == 'url("img/yl_o.png")') {
                                    div.style.backgroundImage = ""
                                }
                            }, 300)
                        }
                    }
                    div.style.backgroundColor = ""
                    div.classList.remove("placed")
                    this.pill_division(toRemove[0].x, toRemove[0].y, j, toRemove[0].direction)
                }
            }
            toRemove.shift()
            this.fell = true
        }
    }

    pill_division (x, y, j, direction) {
        if (direction == "horizontal") {
            for (let i = 0; i < this.pills_tab.length; i++) {
                this.pills_tab[i].position.forEach((element, index) => {
                    if (element == (x + j) + "x" + y) {
                        this.pills_tab[i].position.splice(index, 1)
                        this.pills_tab[i].colors.splice(index, 1)
                        this.pills_tab[i].direction = "dot"
                    }
                })

            }
        }
        else {
            for (let i = 0; i < this.pills_tab.length; i++) {
                this.pills_tab[i].position.forEach((element, index) => {
                    if (element == x + "x" + (y + j)) {
                        this.pills_tab[i].position.splice(index, 1)
                        this.pills_tab[i].colors.splice(index, 1)
                        this.pills_tab[i].direction = "dot"
                    }
                })
            }
        }
    }

    pill_reduction () {
        for (let i = this.pills_tab.length - 1; i >= 0; i--) {
            if (this.pills_tab[i].position.length == 0) {
                this.pills_tab.splice(i, 1)
            }
        }

        for (let i = 0; i < this.pills_tab.length; i++) {
            if (this.pills_tab[i].direction == "dot") {
                let div = document.getElementById(this.pills_tab[i].position[0])
                div.style.backgroundImage = "url(img/" + this.colors2[this.pills_tab[i].colors[0]] + "_dot.png)"
            }
        }
    }

    to_left () {
        this.put_pill_up()
        let id = this.pills_tab.length - 1
        let pom0 = this.pills_tab[id].position[0].split("x")
        let pom1 = this.pills_tab[id].position[1].split("x")
        if (pom0[0] > 0 && pom1[0] > 0) {
            pom0[0]--
            pom1[0]--
            let spr0 = document.getElementById(pom0.join("x"))
            let spr1 = document.getElementById(pom1.join("x"))
            if (!spr0.classList.contains('placed') && !spr1.classList.contains('placed')) {
                this.pills_tab[id].position[0] = pom0.join("x")
                this.pills_tab[id].position[1] = pom1.join("x")
            }
        }
        this.put_pill_down()
    }

    to_right () {
        this.put_pill_up()
        let id = this.pills_tab.length - 1
        let pom0 = this.pills_tab[id].position[0].split("x")
        let pom1 = this.pills_tab[id].position[1].split("x")
        if (pom0[0] < settings.width - 1 && pom1[0] < settings.width - 1) {
            pom0[0]++
            pom1[0]++
            let spr0 = document.getElementById(pom0.join("x"))
            let spr1 = document.getElementById(pom1.join("x"))
            if (!spr0.classList.contains('placed') && !spr1.classList.contains('placed')) {
                this.pills_tab[id].position[0] = pom0.join("x")
                this.pills_tab[id].position[1] = pom1.join("x")
            }
        }
        this.put_pill_down()
    }

    turn_left () {
        let id = this.pills_tab.length - 1
        if (this.pills_tab[id].direction == "horizontal") {
            let pom = this.pills_tab[id].position[0].split("x")
            pom[1]--
            let spr = document.getElementById(pom.join("x"))
            if (!spr.classList.contains('placed')) {
                this.put_pill_up()
                this.pills_tab[id].position[1] = pom.join("x")
                this.pills_tab[id].direction = "vertical"
                this.put_pill_down()
            }
        }
        else {
            let pom = this.pills_tab[id].position[0].split("x")
            if (pom[0] == settings.width - 1) {
                pom[0]--
                let spr = document.getElementById(pom.join("x"))
                if (!spr.classList.contains('placed')) {
                    this.put_pill_up()
                    this.pills_tab[id].position[1] = this.pills_tab[id].position[0]
                    this.pills_tab[id].position[0] = pom.join("x")
                    this.pills_tab[id].colors.unshift(this.pills_tab[id].colors[1])
                    this.pills_tab[id].colors.pop()
                    this.pills_tab[id].direction = "horizontal"
                    this.put_pill_down()
                }
            }
            else {
                pom[0]++
                let spr = document.getElementById(pom.join("x"))
                if (!spr.classList.contains('placed')) {
                    this.put_pill_up()
                    this.pills_tab[id].position[1] = pom.join("x")
                    this.pills_tab[id].colors.unshift(this.pills_tab[id].colors[1])
                    this.pills_tab[id].colors.pop()
                    this.pills_tab[id].direction = "horizontal"
                    this.put_pill_down()
                }
            }
        }
    }

    turn_right () {
        let id = this.pills_tab.length - 1
        if (this.pills_tab[id].direction == "horizontal") {
            let pom = this.pills_tab[id].position[0].split("x")
            pom[1]--
            let spr = document.getElementById(pom.join("x"))
            if (!spr.classList.contains('placed')) {
                this.put_pill_up()
                this.pills_tab[id].position[1] = pom.join("x")
                this.pills_tab[id].colors.unshift(this.pills_tab[id].colors[1])
                this.pills_tab[id].colors.pop()
                this.pills_tab[id].direction = "vertical"
                this.put_pill_down()
            }
        }
        else {
            let pom = this.pills_tab[id].position[0].split("x")
            if (pom[0] == settings.width - 1) {
                pom[0]--
                let spr = document.getElementById(pom.join("x"))
                if (!spr.classList.contains('placed')) {
                    this.put_pill_up()
                    this.pills_tab[id].position[1] = this.pills_tab[id].position[0]
                    this.pills_tab[id].position[0] = pom.join("x")
                    this.pills_tab[id].direction = "horizontal"
                    this.put_pill_down()
                }
            }
            else {
                pom[0]++
                let spr = document.getElementById(pom.join("x"))
                if (!spr.classList.contains('placed')) {
                    this.put_pill_up()
                    this.pills_tab[id].position[1] = pom.join("x")
                    this.pills_tab[id].direction = "horizontal"
                    this.put_pill_down()
                }
            }
        }
    }

    falling () {
        clearInterval(this.move)
        this.move = setInterval(this.pill_throw.bind(this), 50)
        this.falls = false
    }

    fell_function () {
        if (this.fell) {
            let opad = setInterval(() =>  {
                this.fell = false
                for (let i = settings.height; i >= 0; i--) {
                    this.pills_tab.forEach((element, id) => {
                        if (element.position[0].split("x")[1] == i) {
                            if (element.direction == "vertical" || element.direction == "dot") {

                                let pom = element.position[0].split("x")
                                pom[1]++
                                let spr = document.getElementById(pom.join("x"))
                                if (!spr.classList.contains('placed')) {
                                    //put_pill_up()
                                    element.position.forEach((el) => {
                                        let div = document.getElementById(el)
                                        div.style.backgroundColor = ""
                                        div.style.backgroundImage = ""
                                        div.classList.remove("placed")
                                    })

                                    element.position.forEach((el, index) => {
                                        let pom = el.split("x")
                                        pom[1]++
                                        element.position[index] = pom.join("x")
                                    })

                                    //put_pill_down()
                                    let poz = "left"
                                    element.position.forEach((el, index) => {
                                        let div = document.getElementById(el)
                                        div.style.backgroundColor = this.colors[this.pills_tab[id].colors[index]]
                                        div.style.backgroundSize = settings.cell_size + "px"
                                        if (this.pills_tab[id].direction == "horizontal") {
                                            if (index == 0) poz = "left"
                                            if (index == 1) poz = "right"
                                        } else if (this.pills_tab[id].direction == "vertical") {
                                            if (index == 0) poz = "down"
                                            if (index == 1) poz = "up"
                                        } else if (this.pills_tab[id].direction == "dot") {
                                            poz = "dot"
                                        }
                                        div.style.backgroundImage = "url(./img/" + this.colors2[this.pills_tab[id].colors[index]] + "_" + poz + ".png)"
                                        div.classList.add("placed")
                                    })
                                    this.fell = true
                                }
                            }
                            else if (element.direction == "horizontal") {
                                let pom0 = element.position[0].split("x")
                                let pom1 = element.position[1].split("x")
                                pom0[1]++
                                pom1[1]++
                                let spr0 = document.getElementById(pom0.join("x"))
                                let spr1 = document.getElementById(pom1.join("x"))
                                if (!spr0.classList.contains('placed') && !spr1.classList.contains('placed')) {
                                    //put_pill_up()
                                    element.position.forEach((el) => {
                                        let div = document.getElementById(el)
                                        div.style.backgroundColor = ""
                                        div.style.backgroundImage = ""
                                        div.classList.remove("placed")
                                    })

                                    element.position.forEach((el, index) => {
                                        let pom = el.split("x")
                                        pom[1]++
                                        element.position[index] = pom.join("x")
                                    })

                                    //put_pill_down()
                                    let poz = "left"
                                    element.position.forEach((el, index) => {
                                        let div = document.getElementById(el)
                                        div.style.backgroundColor = this.colors[this.pills_tab[id].colors[index]]
                                        div.style.backgroundSize = settings.cell_size + "px"
                                        if (this.pills_tab[id].direction == "horizontal") {
                                            if (index == 0) poz = "left"
                                            if (index == 1) poz = "right"
                                        } else if (this.pills_tab[id].direction == "vertical") {
                                            if (index == 0) poz = "down"
                                            if (index == 1) poz = "up"
                                        } else if (this.pills_tab[id].direction == "dot") {
                                            poz = "dot"
                                        }
                                        div.style.backgroundImage = "url(./img/" + this.colors2[this.pills_tab[id].colors[index]] + "_" + poz + ".png)"
                                        div.classList.add("placed")
                                    })
                                    this.fell = true
                                }
                            }
                        }
                    })
                }
                if (!this.fell) {
                    clearInterval(opad)
                    this.pill_beat()
                    this.pill_reduction()
                    this.fell_function()
                    if (!this.fell && !this.board.end)
                        this.after_fell()
                }
            }, 50)
        }

    }
    after_fell () {
        this.pill_throw()
        this.move = setInterval(this.pill_throw.bind(this), 1000)
        this.falls = true
    }

    hand () {
        this.board.pill_throw = [
            { hand: "up", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["10y3", "11y3"] },
            { hand: "up", color: [this.colors2[this.next[0]] + "_down.png", this.colors2[this.next[1]] + "_up.png"], position: ["10y3", "10y2"] },
            { hand: "up", color: [this.colors2[this.next[1]] + "_left.png", this.colors2[this.next[0]] + "_right.png"], position: ["9y2", "10y2"] },
            { hand: "up", color: [this.colors2[this.next[1]] + "_down.png", this.colors2[this.next[0]] + "_up.png"], position: ["9y2", "9y1"] },

            { hand: "middle", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["8y1", "9y1"] },
            { hand: "middle", color: [this.colors2[this.next[0]] + "_down.png", this.colors2[this.next[1]] + "_up.png"], position: ["8y1", "8y0"] },
            { hand: "middle", color: [this.colors2[this.next[1]] + "_left.png", this.colors2[this.next[0]] + "_right.png"], position: ["7y1", "8y1"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_down.png", this.colors2[this.next[0]] + "_up.png"], position: ["7y1", "7y0"] },

            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["6y1", "7y1"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_down.png", this.colors2[this.next[1]] + "_up.png"], position: ["6y1", "6y0"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_left.png", this.colors2[this.next[0]] + "_right.png"], position: ["5y1", "6y1"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_down.png", this.colors2[this.next[0]] + "_up.png"], position: ["5y1", "5y0"] },

            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["4y1", "5y1"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_down.png", this.colors2[this.next[1]] + "_up.png"], position: ["4y1", "4y0"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_left.png", this.colors2[this.next[0]] + "_right.png"], position: ["3y1", "4y1"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_down.png", this.colors2[this.next[0]] + "_up.png"], position: ["3y1", "3y0"] },

            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["2y1", "3y1"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_down.png", this.colors2[this.next[1]] + "_up.png"], position: ["2y1", "2y0"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_left.png", this.colors2[this.next[0]] + "_right.png"], position: ["1y2", "2y2"] },
            { hand: "down", color: [this.colors2[this.next[1]] + "_down.png", this.colors2[this.next[0]] + "_up.png"], position: ["1y2", "1y1"] },

            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["0y2", "1y2"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["0y3", "1y3"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["0y4", "1y4"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["0y5", "1y5"] },
            { hand: "down", color: [this.colors2[this.next[0]] + "_left.png", this.colors2[this.next[1]] + "_right.png"], position: ["0y6", "1y6"] }
        ]
    }

}

const pill = new Pill();
export default pill;