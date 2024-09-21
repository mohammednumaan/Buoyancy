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

      if (this.isSecondHit) {
        this.hitDirection = this.hitDirection || this.computeHitDirection(lastHit);
      }

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
          // back-track the array to find another hit of the same ship
          let prevHit = this.backTrackCoords(enemy);
          // if the coord has been attacked, flip the direction of attack
          if (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
            this.hitDirection = this.flipDirection(this.hitDirection);
            prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
          }
          // if the bot encounters an already hit coord, simply move further until it
          // finds an empty valid coord to attack
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

      // if the last his was a ship hit
      if (
        enemy.gameBoard.boardClone[lastHit[0]][lastHit[1]]
        && this.isSecondHit === true
      ) {
        // generate an adjacent cell to attack
        let adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);
        // check if its a valid coord
        const isValid = this.isInBounds(adjCoord);
        // a flag variable to keep check if its the same ship on the board
        let isSame;

        // if the generated coord is valid
        if (isValid) {
          // then, check if the ship in the coord is same as the current attacking ship
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

        // if it encounters a hit of the same ship, simply move further until the bot finds a valid empty coord to attack
        while (enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true) {
          adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
          // if the coord is an invalid coord, flip the direction of attack
          if (!this.isInBounds(adjCoord)) {
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
          const isValid = this.isInBounds(adjHit);

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

        // else, flip the direction of attack to target
        this.hitDirection = this.flipDirection(this.hitDirection);
        // generate the adjacent coord for the flipped direction
        let adjCoord = this.getAdjacentCell(lastHit, this.hitDirection);
        // loop until we find a valid coord that is empty
        while (enemy.gameBoard.boardClone[adjCoord[0]][adjCoord[1]] === true) {
          adjCoord = this.getAdjacentCell(adjCoord, this.hitDirection);
        }
        return adjCoord;
      }

      // we can now confirm that the bot hasn't found its second valid hit yet
      // so back-track the coords array to generate adjacent cells to attack
      const adjCoord = this.backTrackCoords(enemy);
      const adjacentChoices = this.getAdjacentChoices(enemy, adjCoord);

      // if there is no adjacent cells to attack
      if (!adjacentChoices.length) {
        // then backtrack to retrieve previous hits on this ship
        let prevHit = this.backTrackAvailableMoves(enemy, lastHit);
        // compute the direction with the help of the back-tracked coords
        this.computeDirectionWhenBlocked(enemy, prevHit);

        // generate an adjacent coord for the new computer direction
        prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
        const isValid = this.isInBounds(prevHit);

        // if the cooord is invalid
        if (
          !isValid
          || enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] !== null
        ) {
          // flip the direction of attack and continue to generate adjacent coords
          this.hitDirection = this.flipDirection(this.hitDirection);
          prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
        }
        // if the bot encounters a hit on the same ship, move further until it finds a valid empty attack
        while (enemy.gameBoard.boardClone[prevHit[0]][prevHit[1]] === true) {
          prevHit = this.getAdjacentCell(prevHit, this.hitDirection);
        }
        return prevHit;
      }

      const randomIdx = Math.floor(Math.random() * adjacentChoices.length);
      return adjacentChoices[randomIdx];
    }

    // we can now confirm that, this is the bot's initial attack (i.e it hasn't found a second attack yet)
    // generate all possible choices for the bot to pick on its initial attack
    const lastHit = this.backTrackCoords(enemy);
    const adjacentChoices = this.getAdjacentChoices(enemy, lastHit);

    if (!adjacentChoices.length) {
      let prevHit = this.backTrackAvailableMoves(enemy, lastHit);

      this.computeDirectionWhenBlocked(enemy, lastHit);
      prevHit = this.getAdjacentCell(lastHit, this.hitDirection);

      const isValid = this.isInBounds(prevHit);
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

  // a simple function to get the adjacent cell for the given cell and direction
  function getAdjacentCell(cell, direction) {
    let [x, y] = cell;

    /* eslint-disable-next-line default-case */
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

  // a simple function to flip the direction for the given direction
  /* eslint-disable-next-line consistent-return */
  function flipDirection(direction) {
    /* eslint-disable-next-line default-case */
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

  // a simple function thath generates a list of adjacent hit choices
  // for the bot to use during its initial attacks
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
  // a simple function to check if the generated coord is not the same coord
  function isValidAdjacentCoord(enemy, lastHit) {
    const isSameCoord = enemy.gameBoard.isSameCoord(lastHit[0], lastHit[1]);
    return isSameCoord;
  }

  // a simple function to check if the generated coords are in bounds
  function isInBounds(cell) {
    const [x, y] = cell;
    if (x < 0 || x > 9) return false;
    if (y < 0 || y > 9) return false;
    return true;
  }

  // a simple function that calculates the hit direction by computing
  // the difference between the hits
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

  // a simple functioni that back-tracks the last hit array to find the initial point of attack
  // this function is called when it generates a coord with a different ship hit or an invalid coord
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

  // a simple function that back-tracks available moves to attack/go-to
  // this function is called when the bot has no adjacent hits to attack and
  // when a part of the ship is already attacked before
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

  // a simple functoini to check the vali
  function isInBounds(cell) {
    if (!cell) return false;
    const [x, y] = cell;
    if (x < 0 || x > 9) return false;
    if (y < 0 || y > 9) return false;
    return true;
  }

  // a simple function that computes the direction of attack
  // this function only runs when the bot has no adjacent coords to hit
  // it computes by calculating the difference between the initial attack coord and
  // previouslt hit coords of the same ship
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

  // a simple function to generate random coords
  // this function is called when the current attacking ship is sunk
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
    isSecondHit,
    backTrackAvailableMoves,
    computeDirectionWhenBlocked,
    generateRandomCoords,
  };
}

module.exports = AiLogic;
