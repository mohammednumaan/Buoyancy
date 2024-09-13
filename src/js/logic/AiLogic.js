function AiLogic() {
  const lastHitArray = [];
  const hitDirection = '';
  const lastShip = {};
  const isSecondHit = false;
  const isFlipped = false;
  const directions = ['up', 'down', 'left', 'right'];
  const availableMoves = [];

  function attack(enemy) {
    // CASE:1 - initial attacks are on the end of the ships
    if (this.lastShip.isSunk()) {
      this.hitDirection = '';
      this.lastHitArray = [];
      this.isFlipped = false;
      this.lastShip = {};
      this.isSecondHit = false;
      return this.generateRandomCoords(enemy);
    }

    // checks if the last hit was a ship hit
    if (this.lastHitArray.length > 1) {
      // get the latest adjacent hit and the curent hit ship on the board
      const lastHit = this.lastHitArray[this.lastHitArray.length - 1];
      const currentShip = enemy.gameBoard.board[lastHit[0]][lastHit[1]];

      // check if the last hit ship is the same as the ship on its initial attack
      const isSameShip = currentShip
        ? currentShip.id === this.lastShip.id
        : true;
      // compute the direction of attack

      if (this.isSecondHit) this.hitDirection = this.hitDirection || this.computeHitDirection(lastHit);

      // check if the recet hit was a different hit
      if (!isSameShip) {
        // push it to available attacks for future reference
        // then, stop attacking in that direction
        const adjCoord = this.backTrackCoords(enemy);
        let allAdjacentCells = this.getAdjacentChoices(enemy, adjCoord);
        allAdjacentCells = allAdjacentCells.filter(
          (coord) => enemy.gameBoard.board[coord[0]][coord[1]] !== null,
        );

        // if there are no adjacent hits, retrieve the previous attack coords on this ship
        if (!allAdjacentCells.length) {
          // generate an adjacent cell with the new computer direction
          let prevHit = this.backTrackCoords(enemy);
          if (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
            this.hitDirection = this.flipDirection(this.hitDirection);
            prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
          }
          while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
            prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
          }
          return prevHit;
        }

        // else, simply select the new adjacent coord
        const randomIdx = Math.floor(Math.random() * allAdjacentCells.length);
        let adjHit = allAdjacentCells[randomIdx];
        // generate a new adjacent cell with the new direction if it encounters a hit square
        while (enemy.gameBoard.boardClone[adjHit[0]][adjHit[1]] === true) {
          adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
        }
        return adjHit;
      }

      // if the last his was a ship it
      if (
        enemy.gameBoard.boardClone[lastHit[0]][lastHit[1]]
        && this.isSecondHit === true
      ) {
        // generate an adjacent cell to attack
        let adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);
        const isValid = this.checkSquare(adjCoord);
        let isSame;

        if (isValid) {
          const ship = enemy.gameBoard.board[adjCoord[0]][adjCoord[1]];
          isSame = ship ? this.lastShip.id === ship.id : true;
        }
        // if the new cell is invalid, i.e out of bounds, flip the direction of attack
        if (
          !isValid
          || (!isSame
            && enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true)
          || enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === false
        ) {
          this.hitDirection = this.flipDirection(this.hitDirection);
          adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
        }
        while (enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true) {
          adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
          if (!this.checkSquare(adjCoord)) {
            this.hitDirection = this.flipDirection(this.hitDirection);
            adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
          }
        }
        return adjCoord;
      }

      // check if the last hit was not a ship hit
      if (
        enemy.gameBoard.boardClone[lastHit[0]][lastHit[1]] === false
        && this.isSecondHit === true
      ) {
        // if the direction is flipped and it still is not a ship hit
        if (this.isFlipped) {
          // then backtrack the lasthit array to find the initial point of attack of this ship
          const adjCoord = this.backTrackCoords(enemy);
          const adjCells = this.getAdjacentChoices(enemy, adjCoord);
          const randomIdx = Math.floor(Math.random() * adjCells.length);
          let adjHit = adjCells[randomIdx];
          const isValid = this.checkSquare(adjHit);

          if (
            !isValid
            || enemy.gameBoard.boardClone[adjHit[0]][adjHit[1]] === false
          ) {
            this.hitDirection = this.flipDirection(this.hitDirection);
            adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
          }

          while (enemy.gameBoard.boardClone[adjHit[0]][adjHit[1]] === true) {
            adjHit = this.getAdjacentCell(adjHit, this.hitDirection);
          }
          this.hitDirection = this.computeHitDirection(adjHit, adjCoord);

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
        return adjCoord;
      }
      const adjCoord = this.backTrackCoords(enemy);
      const adjacentChoices = this.getAdjacentChoices(enemy, adjCoord);
      if (!adjacentChoices.length) {
        let prevHit = this.backTrackAvailableMoves(enemy, lastHit);

        this.computeDirectionWhenBlocked(enemy, prevHit);
        prevHit = this.getAdjacentCell(prevHit, this.hitDirection);

        const isValid = this.checkSquare(prevHit);
        if (
          !isValid
          || enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] !== null
        ) {
          this.hitDirection = this.flipDirection(this.hitDirection);
          prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
        }
        while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
          prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
        }
        return prevHit;
      }

      const randomIdx = Math.floor(Math.random() * adjacentChoices.length);
      return adjacentChoices[randomIdx];
    }

    // generate all possible choices for the bot to pick on its initial attack
    const lastHit = this.backTrackCoords(enemy);
    const adjacentChoices = this.getAdjacentChoices(enemy, lastHit);

    if (!adjacentChoices.length) {
      let prevHit = this.backTrackAvailableMoves(enemy, lastHit);

      this.computeDirectionWhenBlocked(enemy, lastHit);
      prevHit = this.getAdjacentCell(lastHit, this.hitDirection);

      const isValid = this.checkSquare(prevHit);
      if (
        !isValid
        || enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] !== null
      ) {
        this.hitDirection = this.flipDirection(this.hitDirection);
        prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
      }
      while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
        prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
      }
      return prevHit;
    }

    const randomIdx = Math.floor(Math.random() * adjacentChoices.length);
    return adjacentChoices[randomIdx];
  }

  function getAdjacentCell(cell, direction) {
    let [x, y] = cell;

    switch (direction) {
      case 'up':
        x -= 1;
        break;

      case 'down':
        x += 1;
        break;

      case 'left':
        y -= 1;
        break;

      case 'right':
        y += 1;
        break;
    }
    return [x, y];
  }

  /* eslint-disable-next-line consistent-return */
  function flipDirection(direction) {
    switch (direction) {
      case 'up':
        return 'down';
      case 'down':
        return 'up';

      case 'left':
        return 'right';

      case 'right':
        return 'left';
    }
    this.isFlipped = true;
  }

  function getAdjacentChoices(enemy, lasthit) {
    const choices = [];
    directions.forEach((direction) => {
      const adjCell = this.getAdjacentCell(lasthit, direction);
      const isSameCoord = this.isValidAdjacentCoord(enemy, adjCell);
      const inBound = this.isInBounds(adjCell);

      if (isSameCoord || !inBound) return;
      choices.push(adjCell);
    });
    return choices;
  }

  function isValidAdjacentCoord(enemy, lastHit) {
    const isSameCoord = enemy.gameBoard.isSameCoord(lastHit[0], lastHit[1]);
    return isSameCoord;
  }

  function isInBounds(cell) {
    const [x, y] = cell;
    if (x < 0 || x > 9) return false;
    if (y < 0 || y > 9) return false;
    return true;
  }

  function computeHitDirection(cell, backTrackedCell = null) {
    const [x, y] = cell;
    let direction = '';
    const xDiff = backTrackedCell
      ? x - backTrackedCell[0]
      : x - this.lastHitArray[this.lastHitArray.length - 2][0];
    const yDiff = backTrackedCell
      ? y - backTrackedCell[1]
      : y - this.lastHitArray[this.lastHitArray.length - 2][1];

    if (xDiff) {
      direction = xDiff < 1 ? 'up' : 'down';
    } else if (yDiff) {
      direction = yDiff < 1 ? 'left' : 'right';
    }
    return direction;
  }

  /* eslint-disable-next-line consistent-return */
  function backTrackCoords(enemy) {
    for (let i = this.lastHitArray.length - 1; i >= 0; i -= 1) {
      const [x, y] = this.lastHitArray[i];
      const ship = enemy.gameBoard.board[x][y];
      if (ship && this.lastShip.id === ship.id) {
        return [x, y];
      }
    }
  }
  /* eslint-disable-next-line consistent-return */
  function backTrackAvailableMoves(enemy) {
    for (let i = this.availableMoves.length - 1; i >= 0; i -= 1) {
      const [x, y] = this.availableMoves[i];
      const ship = enemy.gameBoard.board[x][y];
      if (ship && this.lastShip.id === ship.id) {
        return this.availableMoves[i];
      }
    }
  }

  function generateRandomCoords(humanPlayer) {
    const nullCoords = [];
    humanPlayer.gameBoard.boardClone.forEach((xCoord, xIdx) => {
      xCoord.forEach((yCoord, yIdx) => {
        if (yCoord === null) nullCoords.push([xIdx, yIdx]);
      });
    });
    const randomIdx = Math.floor(Math.random() * nullCoords.length);
    return nullCoords[randomIdx];
  }

  function checkSquare(cell){
    if (!cell) return false;
    const [x, y] = cell;
    if (x < 0 || x > 9) return false;
    if (y < 0 || y > 9) return false;
    return true;
  }

  function computeDirectionWhenBlocked(enemy, cell) {
    const coords = [];
    for (let i = this.availableMoves.length - 1; i >= 0; i -= 1) {
      const [x, y] = this.availableMoves[i];
      const ship = enemy.gameBoard.board[x][y];
      const isSame = cell[0] === x && cell[1] === y;
      if (ship && this.lastShip.id === ship.id && !isSame) {
        coords.push([x, y]);
      }
    }
    const adjHit = coords[Math.floor(Math.random() * coords.length)];
    this.hitDirection = this.computeHitDirection(cell, adjHit);
  }

  return {
    availableMoves,
    isFlipped,
    lastShip,
    hitDirection,
    lastHitArray,
    attack,
    getAdjacentCell,
    isValidAdjacentCoord,
    getAdjacentChoices,
    isInBounds,
    computeHitDirection,
    flipDirection,
    backTrackCoords,
    generateRandomCoords,
    isSecondHit,
    backTrackAvailableMoves,
    computeDirectionWhenBlocked,
    checkSquare
  };
}

module.exports = AiLogic;
