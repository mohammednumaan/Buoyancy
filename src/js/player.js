const Gameboard = require("./gameboard");
const Ship = require("./ship");
const { default: trampoline } = require("./utils/trampoline");

class Player {

  static #generatedCoords =[[null, null]]

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
  static #generateRandomCoords(forPlacement){
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
    // if the generated coords are for ship placement, do not push
    // them into the generated coords array to avoid **ignoring**
    // the coords during attack
    if (!forPlacement) {
      Player.#generatedCoords.push(coordsArr);
    }
    return coordsArr;
  }

  static trampolinedCoords(forPlacement = false){
    const trampolinedFunc = trampoline(Player.#generateRandomCoords);
    console.log(trampolinedFunc)
    return trampolinedFunc(forPlacement)
  }
}


module.exports = Player;
