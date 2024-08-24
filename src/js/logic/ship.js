const { v4: uuidv4 } = require('uuid');

class Ship {
  constructor(length) {
    this.id = uuidv4();
    this.length = length;
    this.hits = 0;
    this.vertical = false;
  }

  static createShips() {
    return [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];
  }

  hit() {
    this.hits += 1;
  }

  changeDirection() {
    this.vertical = !this.vertical;
  }

  isSunk() {
    return this.hits === this.length;
  }
}

module.exports = Ship;
