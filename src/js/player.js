const Gameboard = require('./gameboard');
const Ship = require('./ship');

class Player {
  constructor(turn, isAi = false) {
    this.gameBoard = new Gameboard();
    this.allShips = Ship.createShips();
    this.isAi = isAi;
    this.turn = turn;
  }

  changeTurn(enemyPlayer) {
    this.turn = false;
    /* eslint-disable no-param-reassign */
    enemyPlayer.turn = true;
  }
}

module.exports = Player;
