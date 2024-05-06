class Gameboard {
  constructor() {
    /* eslint-disable-next-line no-unused-vars */
    this.board = new Array(10).fill(null).map((row) => new Array(10).fill(null));
    this.placedShipCoords = [];
    this.missedAttack = [];
    this.attackedCoords = [];
  }

  isValidCoords(ship, x, y) {
    for (let i = 0; i < ship.length; i++) {
      if (!ship.vertical && (y + i >= this.board.length || this.board[x][y + i] !== null)) return false;
      if (ship.vertical && (x + i >= this.board.length || this.board[x + i][y] !== null)) return false;
    }
    return true;
  }

  placeShip(ship, x, y) {
    const isValid = this.isValidCoords(ship, x, y);
    if (isValid) {
      for (let i = 0; i < ship.length; i++) {
        if(!ship.vertical){
          this.board[x][y + i] = ship
          this.placedShipCoords.push([x, y + i])

        } else{
          this.board[x + i][y] = ship;
          this.placedShipCoords.push([x + i, y])
        }

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
