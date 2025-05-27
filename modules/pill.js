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
    
    to_down() {
        const id = this.pills_tab.length - 1;
        const positions = this.getPositionsFromPill(id);
        const nextPositions = this.getNextVerticalPositions(positions);
        
        if (this.arePositionsOccupied(nextPositions)) {
            this.handlePillPlacement(id);
        } else {
            this.put_pill_up();
            this.updatePillPosition(id, nextPositions);
            this.put_pill_down();
        }
    }

    getPositionsFromPill(pillId) {
        return this.pills_tab[pillId].position.map(pos => {
            const [x, y] = pos.split("x");
            return { x: parseInt(x), y: parseInt(y), id: pos };
        });
    }

    getNextVerticalPositions(positions) {
        return positions.map(pos => ({
            x: pos.x,
            y: pos.y + 1,
            id: `${pos.x}x${pos.y + 1}`
        }));
    }

    arePositionsOccupied(positions) {
        return positions.some(pos => 
            document.getElementById(pos.id).classList.contains('placed')
        );
    }

    handlePillPlacement(pillId) {
        const positions = this.getPositionsFromPill(pillId);
        
        // Mark pill as placed
        this.dont_exist = true;
        positions.forEach(pos => {
            document.getElementById(pos.id).classList.add("placed");
        });
        
        // Process pill placement
        this.pill_beat();
        this.pill_reduction();
        this.fell_function();

        // Check win condition
        if (this.board.viruses_count === 0) {
            this.handleWinCondition();
            return;
        }
        
        // Check game over condition
        if (this.isGameOver()) {
            this.handleGameOverCondition();
            return;
        }

        // Continue game if not ended
        if (this.board.end) return;

        // Start next pill
        clearInterval(this.move);
        if (!this.fell) {
            this.pill_throw();
            this.move = setInterval(this.pill_throw.bind(this), 1000);
            this.falls = true;
        }
    }

    handleWinCondition() {
        clearInterval(this.move);
        this.board.end = true;
        this.board.win = true;
        
        if (this.board.points > parseInt(localStorage.getItem("topScore"))) {
            localStorage.setItem("topScore", this.board.points);
        }
        
        document.getElementById("stageCompleted").style.display = "inline";
    }

    isGameOver() {
        const d1 = document.getElementById("3x0");
        const d2 = document.getElementById("4x0");
        return d1.classList.contains('placed') || d2.classList.contains('placed');
    }

    handleGameOverCondition() {
        clearInterval(this.move);
        this.board.end = true;
        
        if (this.board.points > parseInt(localStorage.getItem("topScore"))) {
            localStorage.setItem("topScore", this.board.points);
        }
        
        const gameOver = document.getElementById("gameOver");
        const gameOver_dr = document.getElementById("gameOver_dr");
        clearInterval(this.board.dance_interval);
        this.board.dance_interval = setInterval(this.board.defeat.bind(this), 200);
        gameOver.style.display = "inline";
        gameOver_dr.style.display = "inline";
    }

    updatePillPosition(pillId, newPositions) {
        this.pills_tab[pillId].position = newPositions.map(pos => pos.id);
    }

    pill_throw() {
        if (this.dont_exist) {
            this.initializeNewPill();
        } else {
            this.to_down();
        }
    }

    initializeNewPill() {
        this.throwing = true;
        this.hand();
        this.animateHandAndPill();
    }

    animateHandAndPill() {
        let i = 0;
        const animation = setInterval(() => {
            this.updateHandAnimation(i);
            this.updatePillAnimation(i);
            
            i++;
            if (i === this.board.pill_throw.length) {
                clearInterval(animation);
                this.clearThrowingAnimation();
            }
        }, 20);

        setTimeout(() => {
            this.createNewPill();
            this.resetHandPosition();
            this.updateNextPillPreview();
            this.dont_exist = false;
            this.put_pill_down();
            this.throwing = false;
        }, 500);
    }

    updateHandAnimation(index) {
        const handPosition = this.board.pill_throw[index].hand;
        
        if (handPosition === "up") {
            this.animateUpHand();
        } else if (handPosition === "middle") {
            this.animateMiddleHand();
        } else if (handPosition === "down") {
            this.animateDownHand();
        }
    }

    animateUpHand() {
        document.getElementById("11y7").style.backgroundImage = "";
        for (let y = 1; y < 4; y++) {
            const div = document.getElementById("11y" + (y + 3));
            div.style.backgroundImage = "url(img/hands/up_" + y + ".png)";
            div.style.backgroundSize = settings.cell_size + "px";
        }
    }

    animateMiddleHand() {
        document.getElementById("11y4").style.backgroundImage = "";
        for (let y = 1; y < 3; y++) {
            for (let x = 1; x < 3; x++) {
                const div = document.getElementById((x + 9) + "y" + (y + 4));
                div.style.backgroundImage = "url(img/hands/middle" + y + x + ".png)";
                div.style.backgroundSize = settings.cell_size + "px";
            }
        }
    }

    animateDownHand() {
        document.getElementById("11y5").style.backgroundImage = "";
        document.getElementById("10y5").style.backgroundImage = "";
        document.getElementById("10y6").style.backgroundImage = "";
        
        for (let y = 1; y < 3; y++) {
            const div = document.getElementById("11y" + (y + 5));
            div.style.backgroundImage = "url(img/hands/down_" + y + ".png)";
            div.style.backgroundSize = settings.cell_size + "px";
        }
    }

    updatePillAnimation(index) {
        for (let j = 0; j < 2; j++) {
            if (index > 0) {
                const prevDiv = document.getElementById(this.board.pill_throw[index - 1].position[j]);
                prevDiv.style.backgroundImage = "";
            }
            
            const div = document.getElementById(this.board.pill_throw[index].position[j]);
            div.style.backgroundImage = "url(img/" + this.board.pill_throw[index].color[j] + ")";
            div.style.backgroundSize = settings.cell_size + "px";
        }
    }

    clearThrowingAnimation() {
        document.getElementById("0y6").style.backgroundImage = "";
        document.getElementById("1y6").style.backgroundImage = "";
    }

    createNewPill() {
        this.pills_tab.push({
            colors: this.next,
            change_color: true,
            position: ["3x0", "4x0"],
            direction: "horizontal"
        });
        this.next = [Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 3) + 1];
    }

    resetHandPosition() {
        document.getElementById("11y7").style.backgroundImage = "";
        for (let y = 1; y < 4; y++) {
            const div = document.getElementById("11y" + (y + 3));
            div.style.backgroundImage = "url(img/hands/up_" + y + ".png)";
            div.style.backgroundSize = settings.cell_size + "px";
        }
    }

    updateNextPillPreview() {
        const div1 = document.getElementById("10y3");
        div1.style.backgroundImage = "url(img/" + this.colors2[this.next[0]] + "_left.png)";
        
        const div2 = document.getElementById("11y3");
        div2.style.backgroundImage = "url(img/" + this.colors2[this.next[1]] + "_right.png)";
    }

    put_pill_down() {
        const id = this.pills_tab.length - 1;
        const pill = this.pills_tab[id];
        
        pill.position.forEach((element, index) => {
            const div = document.getElementById(element);
            div.style.backgroundColor = this.colors[pill.colors[index]];
            div.style.backgroundSize = settings.cell_size + "px";
            
            let poz = this.getPillPartPosition(pill.direction, index);
            div.style.backgroundImage = `url(img/${this.colors2[pill.colors[index]]}_${poz}.png)`;
        });
    }

    getPillPartPosition(direction, index) {
        if (direction === "horizontal") {
            return index === 0 ? "left" : "right";
        } else if (direction === "vertical") {
            return index === 0 ? "down" : "up";
        } else {
            return "dot";
        }
    }

    put_pill_up() {
        const id = this.pills_tab.length - 1;
        this.pills_tab[id].position.forEach(element => {
            const div = document.getElementById(element);
            div.style.backgroundColor = "";
            div.style.backgroundImage = "";
        });
    }

    pill_beat() {
        const toRemove = [];
        
        // Check horizontal matches
        this.checkHorizontalMatches(toRemove);
        
        // Check vertical matches
        this.checkVerticalMatches(toRemove);
        
        // Process matches to remove
        this.processMatchesToRemove(toRemove);
    }

    checkHorizontalMatches(toRemove) {
        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width - 1; x++) {
                let i = 0;
                let hasNonVirus = false;
                
                while (this.areSameColor(`${x + i}x${y}`, `${x + i + 1}x${y}`)) {
                    i++;
                    
                    if (!this.isBothVirus(`${x + i}x${y}`, `${x}x${y}`)) {
                        hasNonVirus = true;
                    }
                    
                    if (i >= 3 && !this.areSameColor(`${x + i}x${y}`, `${x + i + 1}x${y}`) && hasNonVirus) {
                        toRemove.push({
                            x: x,
                            y: y,
                            i: i,
                            direction: "horizontal"
                        });
                    }
                }
            }
        }
    }

    checkVerticalMatches(toRemove) {
        for (let x = 0; x < settings.width; x++) {
            for (let y = 0; y < settings.height - 1; y++) {
                let i = 0;
                let hasNonVirus = false;
                
                while (this.areSameColor(`${x}x${y + i}`, `${x}x${y + i + 1}`)) {
                    i++;
                    
                    if (!this.isBothVirus(`${x}x${y + i}`, `${x}x${y}`)) {
                        hasNonVirus = true;
                    }
                    
                    if (i >= 3 && !this.areSameColor(`${x}x${y + i}`, `${x}x${y + i + 1}`) && hasNonVirus) {
                        toRemove.push({
                            x: x,
                            y: y,
                            i: i,
                            direction: "vertical"
                        });
                    }
                }
            }
        }
    }

    areSameColor(pos1, pos2) {
        const div1 = document.getElementById(pos1);
        const div2 = document.getElementById(pos2);
        return div1.style.backgroundColor === div2.style.backgroundColor && div1.style.backgroundColor !== "";
    }

    isBothVirus(pos1, pos2) {
        const div1 = document.getElementById(pos1);
        const div2 = document.getElementById(pos2);
        return div1.classList.contains("wirus") && div2.classList.contains("wirus");
    }

    processMatchesToRemove(toRemove) {
        while (toRemove.length > 0) {
            const match = toRemove[0];
            
            for (let j = 0; j <= match.i; j++) {
                const position = match.direction === "horizontal" 
                    ? `${match.x + j}x${match.y}` 
                    : `${match.x}x${match.y + j}`;
                    
                const div = document.getElementById(position);
                
                if (div.classList.contains("wirus")) {
                    this.handleVirusRemoval(div);
                } else {
                    this.handlePillPartRemoval(div);
                }
                
                // Update pill data structure
                this.pill_division(match.x, match.y, j, match.direction);
            }
            
            toRemove.shift();
            this.fell = true;
        }
    }

    handleVirusRemoval(div) {
        div.classList.remove("wirus");
        this.board.points += 100;
        this.board.viruses_count--;
        this.board.change_points();
        this.board.magnifier_contents_removal(div.style.backgroundColor);
        
        this.animateRemoval(div, "x");
    }

    handlePillPartRemoval(div) {
        this.animateRemoval(div, "o");
    }

    animateRemoval(div, animationType) {
        const color = this.colors.indexOf(div.style.backgroundColor);
        if (color !== 0) {
            div.style.backgroundImage = `url(img/${this.colors2[color]}_${animationType}.png)`;
            setTimeout(() => {
                if (this.isRemovalAnimation(div.style.backgroundImage)) {
                    div.style.backgroundImage = "";
                }
            }, 300);
        }
        
        div.style.backgroundColor = "";
        div.classList.remove("placed");
    }

    isRemovalAnimation(backgroundImage) {
        return /url\("img\/(br|bl|yl)_(x|o)\.png"\)/.test(backgroundImage);
    }

    pill_division(x, y, j, direction) {
        const position = direction === "horizontal" ? `${x + j}x${y}` : `${x}x${y + j}`;
        
        for (let i = 0; i < this.pills_tab.length; i++) {
            const index = this.pills_tab[i].position.indexOf(position);
            if (index !== -1) {
                this.pills_tab[i].position.splice(index, 1);
                this.pills_tab[i].colors.splice(index, 1);
                this.pills_tab[i].direction = "dot";
            }
        }
    }

    pill_reduction() {
        // Remove empty pills
        for (let i = this.pills_tab.length - 1; i >= 0; i--) {
            if (this.pills_tab[i].position.length === 0) {
                this.pills_tab.splice(i, 1);
            }
        }

        // Update single-part pills to dot appearance
        for (let i = 0; i < this.pills_tab.length; i++) {
            if (this.pills_tab[i].direction === "dot") {
                const div = document.getElementById(this.pills_tab[i].position[0]);
                div.style.backgroundImage = `url(img/${this.colors2[this.pills_tab[i].colors[0]]}_dot.png)`;
            }
        }
    }

    to_left() {
        this.movePillHorizontally(-1);
    }

    to_right() {
        this.movePillHorizontally(1);
    }

    movePillHorizontally(direction) {
        this.put_pill_up();
        const id = this.pills_tab.length - 1;
        const positions = this.getPositionsFromPill(id);
        
        // Check if movement is possible
        const canMove = positions.every(pos => {
            const newX = pos.x + direction;
            return newX >= 0 && newX < settings.width && 
                  !document.getElementById(`${newX}x${pos.y}`).classList.contains('placed');
        });
        
        if (canMove) {
            // Update positions
            this.pills_tab[id].position = positions.map(pos => 
                `${pos.x + direction}x${pos.y}`
            );
        }
        
        this.put_pill_down();
    }

    turn_left() {
        const id = this.pills_tab.length - 1;
        const pill = this.pills_tab[id];
        
        if (pill.direction === "horizontal") {
            this.rotateHorizontalToVertical(pill);
        } else {
            this.rotateVerticalToHorizontal(pill, true);
        }
    }

    turn_right() {
        const id = this.pills_tab.length - 1;
        const pill = this.pills_tab[id];
        
        if (pill.direction === "horizontal") {
            this.rotateHorizontalToVertical(pill, true);
        } else {
            this.rotateVerticalToHorizontal(pill);
        }
    }

    rotateHorizontalToVertical(pill, swapColors = false) {
        const [x, y] = pill.position[0].split("x").map(Number);
        const newPos = `${x}x${y-1}`;
        
        if (!document.getElementById(newPos).classList.contains('placed')) {
            this.put_pill_up();
            pill.position[1] = newPos;
            
            if (swapColors) {
                pill.colors.unshift(pill.colors[1]);
                pill.colors.pop();
            }
            
            pill.direction = "vertical";
            this.put_pill_down();
        }
    }

    rotateVerticalToHorizontal(pill, swapColors = false) {
        const [x, y] = pill.position[0].split("x").map(Number);
        let newX = x + 1;
        
        // Handle edge case at right border
        if (newX >= settings.width) {
            newX = x - 1;
            if (!document.getElementById(`${newX}x${y}`).classList.contains('placed')) {
                this.put_pill_up();
                pill.position[1] = pill.position[0];
                pill.position[0] = `${newX}x${y}`;
                
                if (!swapColors) {
                    pill.colors.unshift(pill.colors[1]);
                    pill.colors.pop();
                }
                
                pill.direction = "horizontal";
                this.put_pill_down();
            }
        } else {
            // Normal case
            if (!document.getElementById(`${newX}x${y}`).classList.contains('placed')) {
                this.put_pill_up();
                pill.position[1] = `${newX}x${y}`;
                
                if (swapColors) {
                    pill.colors.unshift(pill.colors[1]);
                    pill.colors.pop();
                }
                
                pill.direction = "horizontal";
                this.put_pill_down();
            }
        }
    }

    falling() {
        clearInterval(this.move);
        this.move = setInterval(this.pill_throw.bind(this), 50);
        this.falls = false;
    }

    fell_function() {
        if (this.fell) {
            const fallInterval = setInterval(() => {
                this.fell = false;
                
                // Process pills from bottom to top
                for (let i = settings.height; i >= 0; i--) {
                    this.processPillsAtRow(i);
                }
                
                if (!this.fell) {
                    clearInterval(fallInterval);
                    this.pill_beat();
                    this.pill_reduction();
                    this.fell_function();
                    
                    if (!this.fell && !this.board.end) {
                        this.after_fell();
                    }
                }
            }, 50);
        }
    }

    processPillsAtRow(row) {
        this.pills_tab.forEach((pill, id) => {
            // Check if any part of the pill is at this row
            const pillPartsAtRow = pill.position.filter(pos => 
                parseInt(pos.split("x")[1]) === row
            );
            
            if (pillPartsAtRow.length > 0) {
                if (pill.direction === "vertical" || pill.direction === "dot") {
                    this.tryMovePillDown(pill, id);
                } else if (pill.direction === "horizontal") {
                    this.tryMoveHorizontalPillDown(pill, id);
                }
            }
        });
    }

    tryMovePillDown(pill, id) {
        // For vertical or dot pills, check if space below is free
        const lowestPart = pill.position[0];
        const [x, y] = lowestPart.split("x").map(Number);
        const posBelow = `${x}x${y+1}`;
        
        if (!document.getElementById(posBelow).classList.contains('placed')) {
            this.movePillDownAndUpdate(pill, id);
        }
    }

    tryMoveHorizontalPillDown(pill, id) {
        // For horizontal pills, check if space below both parts is free
        const canMoveDown = pill.position.every(pos => {
            const [x, y] = pos.split("x").map(Number);
            return !document.getElementById(`${x}x${y+1}`).classList.contains('placed');
        });
        
        if (canMoveDown) {
            this.movePillDownAndUpdate(pill, id);
        }
    }

    movePillDownAndUpdate(pill, id) {
        // Remove current pill visualization
        pill.position.forEach(pos => {
            const div = document.getElementById(pos);
            div.style.backgroundColor = "";
            div.style.backgroundImage = "";
            div.classList.remove("placed");
        });
        
        // Update positions
        pill.position = pill.position.map(pos => {
            const [x, y] = pos.split("x").map(Number);
            return `${x}x${y+1}`;
        });
        
        // Redraw pill at new position
        const poz = this.getPillPartPositions(pill);
        pill.position.forEach((pos, index) => {
            const div = document.getElementById(pos);
            div.style.backgroundColor = this.colors[pill.colors[index]];
            div.style.backgroundSize = settings.cell_size + "px";
            div.style.backgroundImage = `url(./img/${this.colors2[pill.colors[index]]}_${poz[index]}.png)`;
            div.classList.add("placed");
        });
        
        this.fell = true;
    }

    getPillPartPositions(pill) {
        if (pill.direction === "horizontal") {
            return ["left", "right"];
        } else if (pill.direction === "vertical") {
            return ["down", "up"];
        } else {
            return ["dot"];
        }
    }

    after_fell() {
        this.pill_throw();
        this.move = setInterval(this.pill_throw.bind(this), 1000);
        this.falls = true;
    }

    hand() {
        const c1 = this.colors2[this.next[0]];
        const c2 = this.colors2[this.next[1]];
        const left = "_left.png";
        const right = "_right.png";
        const down = "_down.png";
        const up = "_up.png";

        const pill_throw = [];

        // Up positions
        pill_throw.push(
            { hand: "up", color: [c1 + left, c2 + right], position: ["10y3", "11y3"] },
            { hand: "up", color: [c1 + down, c2 + up], position: ["10y3", "10y2"] },
            { hand: "up", color: [c2 + left, c1 + right], position: ["9y2", "10y2"] },
            { hand: "up", color: [c2 + down, c1 + up], position: ["9y2", "9y1"] });

        // Middle positions
        pill_throw.push(
            { hand: "middle", color: [c1 + left, c2 + right], position: ["8y1", "9y1"] },
            { hand: "middle", color: [c1 + down, c2 + up], position: ["8y1", "8y0"] },
            { hand: "middle", color: [c2 + left, c1 + right], position: ["7y1", "8y1"] });

        // Down positions
        pill_throw.push(
            { hand: "down", color: [c2 + down, c1 + up], position: ["7y1", "7y0"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["6y1", "7y1"] },
            { hand: "down", color: [c1 + down, c2 + up], position: ["6y1", "6y0"] },
            { hand: "down", color: [c2 + left, c1 + right], position: ["5y1", "6y1"] },
            { hand: "down", color: [c2 + down, c1 + up], position: ["5y1", "5y0"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["4y1", "5y1"] },
            { hand: "down", color: [c1 + down, c2 + up], position: ["4y1", "4y0"] },
            { hand: "down", color: [c2 + left, c1 + right], position: ["3y1", "4y1"] },
            { hand: "down", color: [c2 + down, c1 + up], position: ["3y1", "3y0"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["2y1", "3y1"] },
            { hand: "down", color: [c1 + down, c2 + up], position: ["2y1", "2y0"] },
            { hand: "down", color: [c2 + left, c1 + right], position: ["1y2", "2y2"] },
            { hand: "down", color: [c2 + down, c1 + up], position: ["1y2", "1y1"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["0y2", "1y2"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["0y3", "1y3"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["0y4", "1y4"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["0y5", "1y5"] },
            { hand: "down", color: [c1 + left, c2 + right], position: ["0y6", "1y6"] });

        this.board.pill_throw = pill_throw;
    }
}

const pill = new Pill();
export default pill;