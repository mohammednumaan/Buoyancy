const Gameboard = require("./gameboard");
const Ship = require("./ship");
const { default: trampoline } = require("../utils/trampoline");

class Player {
  static #generatedCoords = [[null, null]];
  static currentActiveHit = [];
  static succ = false;
  static ship;

  constructor(turn, isAi = false) {
    this.gameBoard = new Gameboard();
    this.allShips = Ship.createShips();
    this.isAi = isAi;
    this.turn = turn;
    this.aiAttackStatus = {choices: [] , currentActiveHit: Player.currentActiveHit}
  }

  changeTurn(enemyPlayer) {
    this.turn = false;
    enemyPlayer.turn = true;
  }

  // a simple method that generates unique and random [x, y] tuples
  // for the AI to attack and place ships on its board
  static #generateRandomCoords(forPlacement) {
    let coordsArr = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];

    // if the generatedCoords array includes the newly created [x, y] tuple,
    // return a callback of this function which will be called later (trampolining recursion)
    Player.#generatedCoords.forEach((coord) => {
      if (coord[0] === coordsArr[0] && coord[1] === coordsArr[1]) {
        coordsArr = () => Player.#generateRandomCoords(forPlacement);
        return coordsArr;
      }
    });

    if (!forPlacement) {
      Player.#generatedCoords.push(coordsArr);
    }
    return coordsArr;
    // if the generated coords are for ship placement, do not push
    // them into the generated coords array to avoid **ignoring**
    // the coords during attack
  }

  generateAdjacentCoords(humanPlayer) {
    if (!this.isAi) return;

    if (this.aiAttackStatus.hasOwnProperty('currentShip') && this.aiAttackStatus.currentShip.isSunk()){
      this.aiAttackStatus.choices = [];
      this.aiAttackStatus.currentShip = {}
      return Player.trampolinedCoords();
    }

    // retrieve AI's current hit, the ship it's attacking
    let arrayLength = Player.currentActiveHit.length - 1
    let currentHit = Player.currentActiveHit[arrayLength]
    let currentShip = humanPlayer.gameBoard.board[currentHit[0]][currentHit[1]]
    let adjCoord;

    if (arrayLength === 1) this.aiAttackStatus.currentShip = currentShip;


    const [x, y] = currentHit;
    let choices = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    if (!this.aiAttackStatus.choices.length){
      choices.forEach((choice) => {
        this.aiAttackStatus.choices.push(choice)
      })
    }

    // retrieve the latest ship hit and check for invalid choices
    // if (x + 1 > 9 || x - 1 < 0) generateAdjacentCoords(player, enemyPlayer);
    // if (y + 1 > 9 || y - 1 < 0) generateAdjacentCoords(player, enemyPlayer);


    let randomChoice = Math.floor(Math.random() * this.aiAttackStatus.choices.length);
    let attack = humanPlayer.gameBoard.board
    adjCoord = this.aiAttackStatus.choices[randomChoice];
    this.aiAttackStatus.choices.splice(randomChoice, 1)


        
    if (Player.succ) {
      let xCoordDifference = currentHit[0] - Player.currentActiveHit[arrayLength - 1][0];
      let yCoordDifference = currentHit[1] - Player.currentActiveHit[arrayLength - 1][1];

      if (xCoordDifference === 1) {
      }
      if (xCoordDifference === - 1) {
        adjCoord = [x - 1, y];
      }
      if (yCoordDifference === 1) {

        if (!attack[x][y + 1]){
          adjCoord = [Player.currentActiveHit[0][0], Player.currentActiveHit[0][1] - 1]
        } else{

          adjCoord = [x, y + 1];
        }
      }
      if (yCoordDifference === - 1) {
        if (!attack[x][y - 1]){
          adjCoord = [Player.currentActiveHit[0][0], Player.currentActiveHit[0][1] + 1]
        } else{

          adjCoord = [x, y - 1];
        }
        }

      console.log('inner', adjCoord, this)
      return adjCoord;
    }

    console.log('outer', adjCoord, this)


    return adjCoord;
  }

  static trampolinedCoords(forPlacement = false) {
    const trampolinedFunc = trampoline(Player.#generateRandomCoords);
    console.log(trampolinedFunc);
    return trampolinedFunc(forPlacement);
  }
}

module.exports = Player;
