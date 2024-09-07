const Gameboard = require("./gameboard");
const Ship = require("./ship");


class Player {

  constructor(turn, isAi = false) {
    this.gameBoard = new Gameboard();
    this.allShips = Ship.createShips();
    this.isAi = isAi;
    this.turn = turn;
  }

  changeTurn(enemyPlayer) {
    this.turn = false;
    enemyPlayer.turn = true;
  }

  // a simple method that generates unique and random [x, y] tuples
  // for the AI to attack and place ships on its board
  static generateRandomCoords(humanPlayer) {
    const nullCoords = []
    humanPlayer.gameBoard.boardClone.forEach((xCoord, xIdx) => {
      xCoord.forEach((yCoord, yIdx) => {
        if (yCoord === null) nullCoords.push([xIdx, yIdx]);
      })
    })
    const randomIdx = Math.floor(Math.random() * nullCoords.length);
    return nullCoords[randomIdx];
  }

}

class AiPlayer extends Player{
  constructor(turn , isAi){
    super(turn, isAi);
  }
}

module.exports = { Player, AiPlayer };