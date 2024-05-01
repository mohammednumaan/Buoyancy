class Gameboard {
  constructor() {
    /* eslint-disable-next-line no-unused-vars */
    this.board = new Array(10).fill(null).map((row) => new Array(10).fill(null));
    this.missedAttack = [];
    this.attackedCoords = [];
  }

  isValidCoords(ship, x, y) {
    for (let i = 0; i < ship.length; i++) {
      if ((y + i >= this.board.length) || (!ship.vertical && this.board[x][y + i] !== null)) return false;
      if ((x + i >= this.board.length) || (ship.vertical && this.board[x + i][y] !== null)) return false;
    }
    return true;
  }

  placeShip(ship, x, y) {
    const isValid = this.isValidCoords(ship, x, y);
    if (isValid) {
      for (let i = 0; i < ship.length; i++) {
        (!ship.vertical) ? this.board[x][y + i] = ship : this.board[x + i][y] = ship;
      }
      return true;
    }
    return false;
  }

  recieveAttack(x, y) {
    if (!this.board[x][y]) {
      this.missedAttack.push([x, y]);
      return false;
    }

    this.board[x][y].hit();
    this.attackedCoords.push([x, y]);
    return true;
  }

  allShipSunk(shipArray) {
    return shipArray.every((ship) => ship.isSunk());
  }
}

module.exports = Gameboard;
