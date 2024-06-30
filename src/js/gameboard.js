class Gameboard {
  constructor() {
    /* eslint-disable-next-line no-unused-vars */
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.missedAttack = [];
    this.attackedCoords = [];
    this.allAttackCoords = [];
  }

  isValidCoords(ship, x, y) {
    for (let i = 0; i < ship.length; i += 1) {
      if (
        !ship.vertical &&
        (y + i >= this.board.length || this.board[x][y + i] !== null)
      )
        return false;

      if (
        ship.vertical &&
        (x + i >= this.board.length || this.board[x + i][y] !== null)
      )
        return false;
    }
    return true;
  }

  placeShip(ship, x, y) {
    const isValid = this.isValidCoords(ship, x, y);
    if (isValid) {
      for (let i = 0; i < ship.length; i += 1) {
        if (!ship.vertical) {
          this.board[x][y + i] = ship;
        } else {
          this.board[x + i][y] = ship;
        }
      }
      return true;
    }
    return false;
  }

  recieveAttack(x, y) {
    let isSameCoord = false;
    this.allAttackCoords.forEach((coord) => {
      if (coord[0] === x && coord[1] === y) {
        isSameCoord = true;
      }
    });

    if (isSameCoord) return false;

    if (!this.board[x][y]) {
      this.missedAttack.push([x, y]);
      this.allAttackCoords.push([x, y]);
      return true;
    }

    this.board[x][y].hit();
    this.attackedCoords.push([x, y]);
    this.allAttackCoords.push([x, y]);

    return true;
  }

  static allShipSunk(shipArray) {
    return shipArray.every((ship) => ship.isSunk());
  }
}

module.exports = Gameboard;
