function AiLogic() {

    let lastHitArray = [];
    let hitDirection = '';
    let lastShip = {};
    let isSecondHit = false;
    let isFlipped = false;
    let directions = ['up', 'down', 'left', 'right'];
    let availableMoves = []

    function attack(enemy) {

        // CASE:1 - initial attacks are on the end of the ships
        if (this.lastShip.isSunk()) {
            this.hitDirection = "";
            this.lastHitArray = []
            this.isFlipped = false
            this.lastShip = {}
            this.isSecondHit = false
            return this.generateRandomCoords(enemy);
        }   



        // checks if the last hit was a ship hit 
        if (this.lastHitArray.length > 1) {
            // get the latest adjacent hit and the curent hit ship on the board
            let lastHit = this.lastHitArray[this.lastHitArray.length - 1];
            let currentShip = enemy.gameBoard.board[lastHit[0]][lastHit[1]];
            console.log('lastt',lastHit)

            // check if the last hit ship is the same as the ship on its initial attack
            let isSameShip = currentShip ? currentShip.id === this.lastShip.id : true
            // compute the direction of attack

            if (this.isSecondHit) this.hitDirection = this.hitDirection || this.computeHitDirection(lastHit);
            console.log(this.hitDirection, 'first', lastHit)

            // check if the recet hit was a different hit
            if (!isSameShip) {
                // push it to available attacks for future reference
                this.availableMoves.push(lastHit);
                // then, stop attacking in that direction
                let adjCoord = this.backTrackCoords(enemy);
                let allAdjacentCells = this.getAdjacentChoices(enemy, adjCoord);

                let adjacentChoices = allAdjacentCells.filter((choice) => {
                    let ship = enemy.gameBoard.board[choice[0]][choice[1]];
                    return ship && ship.id === this.lastShip.id
                })
                console.log('choices',  adjacentChoices)
                // if there are no adjacent hits, retrieve the previous attack coords on this ship
                if (!adjacentChoices.length){
                    // generate an adjacent cell with the new computer direction
                    let prevHit = this.backTrackAvailableMoves(enemy, lastHit);
                    this.computeDirectionWhenBlocked(enemy, lastHit);
                    while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
                        prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
                    }
                    console.log(prevHit)
                    return prevHit;
                } 
                
                // else, simply select the new adjacent coord 
                let randomIdx = Math.floor(Math.random() * adjacentChoices.length)
                let adjHit = adjacentChoices[randomIdx]
                // generate a new adjacent cell with the new direction if it encounters a hit square
                while (enemy.gameBoard.boardClone[adjHit[   0]][adjHit[1]] === true) {
                    adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
                }
                return adjHit;
            }
            
            // if the last his was a ship it
            if (enemy.gameBoard.boardClone[lastHit[0]][lastHit[1]] && this.isSecondHit === true) {
                // generate an adjacent cell to attack
                let adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);    
                let isValid = enemy.gameBoard.checkSquare(adjCoord);
                
                // if the new cell is invalid, i.e out of bounds, flip the direction of attack
                if (!isValid || enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === false || (!isSameShip && enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true)) {
                    this.hitDirection = this.flipDirection(this.hitDirection);
                    adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);
                    console.log('NO-------------', adjCoord, this.hitDirection)
                }
                // console.log('IN11---', this.hitDirection, adjCoord)
                // this.hitDirection = this.computeHitDirection(adjCoord)
                // then, loop until we find a valid coord that is empty only if the new coords has a hit square
                while (enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true) {
                    adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
                }

                // console.log('IN222---', this.hitDirection, adjCoord)
                return adjCoord 
            }


            // check if the last hit was not a ship hit
            if (enemy.gameBoard.boardClone[lastHit[0]][lastHit[1]] === false && this.isSecondHit === true) {
                // if the direction is flipped and it still is not a ship hit
                if (this.isFlipped) {
                    // then backtrack the lasthit array to find the initial point of attack of this ship
                    let adjCoord = this.backTrackCoords(enemy);
                    let adjCells = this.getAdjacentChoices(enemy, adjCoord);
                    let randomIdx = Math.floor(Math.random() * adjCells.length)
                    let adjHit = adjCells[randomIdx]
                    let isValid = enemy.gameBoard.checkSquare(adjHit);
                    console.log(adjHit)

                    if (!isValid || enemy.gameBoard.boardClone[adjHit[0]][adjHit[1]] === false) {
                        this.hitDirection = this.flipDirection(this.hitDirection);
                        adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
                    }

                    while (enemy.gameBoard.boardClone[adjHit[0]][adjHit[1]] === true) {
                        adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
                    }
                    this.hitDirection = this.computeHitDirection(adjHit, adjCoord)

                    return adjHit;

                }

                // flip the direction of attack to target
                this.hitDirection = this.flipDirection(this.hitDirection);
                // generate the adjacent coord for the flipped direction 
                let adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);
                // loop until we find a valid coord that is empty  
                while (enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true) {
                    adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
                }
                return adjCoord

            }
            let adjCoord = this.backTrackCoords(enemy);
            let adjacentChoices = this.getAdjacentChoices(enemy, adjCoord);
    
            if (!adjacentChoices.length){
                let prevHit = this.backTrackAvailableMoves(enemy, adjCoord);
                // generate an adjacent cell with the new computer direction
                while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
                    prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
                }
                return prevHit;
            } 
    
            let randomIdx = Math.floor(Math.random() * adjacentChoices.length);
            console.log(adjacentChoices, 'soihfdaskn', this.hitDirection)
            return adjacentChoices[randomIdx];
    
        }

        // generate all possible choices for the bot to pick on its initial attack
        let lastHit = this.backTrackCoords(enemy);
        let adjacentChoices = this.getAdjacentChoices(enemy, lastHit);

        if (!adjacentChoices.length){
            let prevHit = this.backTrackAvailableMoves(enemy, lastHit);
            this.computeDirectionWhenBlocked(enemy, lastHit);
            // generate an adjacent cell with the new computer direction
            while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
                prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
            }
            return prevHit;
        } 

        let randomIdx = Math.floor(Math.random() * adjacentChoices.length);
        console.log(adjacentChoices, 'in', this.hitDirection)
        return adjacentChoices[randomIdx];

    }

    function getAdjacentCell(cell, direction) {
        let [x, y] = cell;

        switch (direction) {
            case 'up':
                x--;
                break;

            case 'down':
                x++;
                break;

            case 'left':
                y--;
                break;

            case 'right':
                y++;
                break;
        }
        return [x, y];
    }

    function flipDirection(direction) {
        switch (direction) {
            case "up":
                return "down";
            case "down":
                return "up"

            case "left":
                return "right"

            case "right":
                return "left"
        }
        this.isFlipped = true;
    }

    function getAdjacentChoices(enemy, lasthit) {
        let choices = [];
        directions.forEach(direction => {
            const adjCell = this.getAdjacentCell(lasthit, direction);
            const isSameCoord = this.isValidAdjacentCoord(enemy, adjCell);
            const isInBounds = this.isInBounds(adjCell);

            if (isSameCoord || !isInBounds) return;
            choices.push(adjCell);
        })
        return choices;
    }

    function isValidAdjacentCoord(enemy, lastHit) {
        const isSameCoord = enemy.gameBoard.isSameCoord(lastHit[0], lastHit[1]);
        return isSameCoord;
    }

    function isInBounds(cell) {
        let [x, y] = cell;
        if (x < 0 || x > 9) return false;
        if (y < 0 || y > 9) return false;
        return true;
    }

    function computeHitDirection(cell, backTrackedCell = null) {
        let [x, y] = cell;
        let hitDirection = ""
        const xDiff = (backTrackedCell) ? x - backTrackedCell[0] : x - this.lastHitArray[this.lastHitArray.length - 2][0];
        const yDiff = (backTrackedCell) ? y - backTrackedCell[1] : y - this.lastHitArray[this.lastHitArray.length - 2][1];

        if (xDiff) {
            hitDirection = xDiff < 1 ? 'up' : 'down'
        }

        else if (yDiff) {
            hitDirection = yDiff < 1 ? 'left' : 'right'
        } 
        console.log('hi', hitDirection, xDiff, yDiff, cell, backTrackedCell)
        return hitDirection;
    }

    function backTrackCoords(enemy) {
        for (let i = this.lastHitArray.length - 1; i >= 0; i--) {
            let [x, y] = this.lastHitArray[i];
            let ship = enemy.gameBoard.board[x][y]
            if (ship && this.lastShip.id === ship.id) {
                return [x, y]
            }
        }
    }

    function backTrackAvailableMoves(enemy, cell){
        for (let i = this.availableMoves.length - 1; i >= 0; i--){
            let [x, y] = cell;
            let ship = enemy.gameBoard.board[x][y]
            if (ship && this.lastShip.id === ship.id) {
                return [x, y]
            }
        }
    }

    function generateRandomCoords(humanPlayer) {
        const nullCoords = []
        humanPlayer.gameBoard.boardClone.forEach((xCoord, xIdx) => {
            xCoord.forEach((yCoord, yIdx) => {
                if (yCoord === null) nullCoords.push([xIdx, yIdx]);
            })
        })
        const randomIdx = Math.floor(Math.random() * nullCoords.length);
        return nullCoords[randomIdx];
    }

    function computeDirectionWhenBlocked(enemy, cell){
        let coords = []
        for (let i = this.availableMoves.length - 1; i >= 0; i--){
            let [x, y] = this.availableMoves[i];
            let ship = enemy.gameBoard.board[x][y]
            if (ship && this.lastShip.id === ship.id) {
                coords.push([x, y]);
            }
        }
        let adjHit = coords[Math.floor(Math.random() * coords.length)]
        console.log(adjHit, cell, coords)
        this.hitDirection = this.computeHitDirection(cell, adjHit)
    }



    return {
        availableMoves, isFlipped, lastShip, hitDirection, lastHitArray, attack,
        getAdjacentCell, isValidAdjacentCoord, getAdjacentChoices, isInBounds,
        computeHitDirection, flipDirection, backTrackCoords, generateRandomCoords,
        isSecondHit, backTrackAvailableMoves, computeDirectionWhenBlocked
    }
}

module.exports = AiLogic;