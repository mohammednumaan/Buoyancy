function AiLogic(){

    let lastHitArray = [];
    let hitDirection = '';
    let lastShip = {};
    let directions = ['up', 'down', 'left', 'right'];

    function attack(enemy){

        // CASE:1 - initial attacks are on the end of the ships
        if (this.lastShip.isSunk()){
            this.hitDirection = "";
            return;
        }

        // checks if the last hit was a ship hit 
        if (this.lastHitArray.length > 1){
            // compute the direction of attack
            let lastHit = this.lastHitArray[this.lastHitArray.length - 1]; 
            this.hitDirection = this.computeHitDirection(lastHit);

            // generate the adjacent cell for the computer directioon and return it
            let adjCell = this.getAdjacentCell(lastHit, this.hitDirection)
            return adjCell;
        }
        
        // generate all possible choices for the bot to pick on its initial attack
        let lastHit = this.lastHitArray[this.lastHitArray.length - 1];
        let adjacentChoices = this.getAdjacentChoices(enemy, lastHit);
        let randomIdx = Math.floor(Math.random() * adjacentChoices.length);
        return adjacentChoices[randomIdx];

    }

    function getAdjacentCell(cell, direction){
        let [x, y] = cell;

        switch(direction){
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

    function getAdjacentChoices(enemy, lasthit){
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

    function isValidAdjacentCoord(enemy, lastHit){
        const isSameCoord = enemy.gameBoard.isSameCoord(lastHit[0], lastHit[1]);
        return isSameCoord; 
    }

    function isInBounds(cell){
        let [x, y] = cell;
        if (x < 0 || x > 9) return false;
        if (y < 0 || y > 9) return false;
        return true;
    }

    function computeHitDirection(cell){
        let [x, y] = cell;
        let hitDirection = ""
        const xDiff = x - this.lastHitArray[this.lastHitArray.length - 2][0];
        const yDiff = y - this.lastHitArray[this.lastHitArray.length - 2][1];

        if (xDiff == 1 || xDiff == -1){
            hitDirection = xDiff === 1 ? 'down' : 'up'
        }

        if (yDiff == 1 || yDiff == -1){
            hitDirection = yDiff === 1 ? 'right' : 'left'
        }
        return hitDirection;
    }



    return {lastShip, hitDirection, lastHitArray, attack, getAdjacentCell, isValidAdjacentCoord, getAdjacentChoices, isInBounds, computeHitDirection}
}

module.exports = AiLogic;