const Gameboard = require('./gameboard');
const Ship = require('./ship');

class Player {
  constructor(isAi = false) {
    this.gameBoard = new Gameboard();
    this.allShips = Ship.createShips();
    this.isAi = isAi;
  }
}

module.exports = Player;
