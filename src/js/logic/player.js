const Gameboard = require("./gameboard");
const Ship = require("./ship");
const { default: trampoline } = require("../utils/trampoline");

class Player {
  static #generatedCoords = [[null, null]];
  static currentActiveHit = [];
  static ship;

  constructor(turn, isAi = false) {
    this.gameBoard = new Gameboard();
    this.allShips = Ship.createShips();
    this.isAi = isAi;
    this.turn = turn;
    this.aiAttackStatus = {choices: [] , currentActiveHit: Player.currentActiveHit, secondHit: false, recentHit:[]}
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
      delete this.aiAttackStatus.currentShip
      this.aiAttackStatus.secondHit = false
      Player.currentActiveHit = []
      return Player.trampolinedCoords();
    }


    // retrieve AI's current hit, the ship it's attacking
    let arrayLength = Player.currentActiveHit.length - 1
    let currentHit = Player.currentActiveHit[arrayLength]

    let humanPlayerBoard = humanPlayer.gameBoard.board
    let adjCoord = [];

    this.aiAttackStatus.choices

    const [x, y] = currentHit;

      // retrieve the latest ship hit and check for invalid choices
      // if (x + 1 > 9 || x - 1 < 0) return this.generateAdjacentCoords(humanPlayer);
      // if (y + 1 > 9 || y - 1 < 0) return this.generateAdjacentCoords(humanPlayer);
      // if (x + 1 > 9) return [x - 1, y]
      
    let choices = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    if (!this.aiAttackStatus.choices.length){
      for (let i = 0; i < choices.length; i++){
        
        // if (this.aiAttackStatus.choices.some((coord) => coord[0] === choices[0] && coord[1] === choices[1])) 
        this.aiAttackStatus.choices.push(choices[i])
        
      }
    }
    
    this.aiAttackStatus.choices.forEach((choices, idx) => {

      if (humanPlayer.gameBoard.allAttackCoords.some((coord) => coord[0] === choices[0] && coord[1] === choices[1])){
        this.aiAttackStatus.choices.splice(idx, 1);  
      }
    })

        // if (this.aiAttackStatus.choices.length && this.aiAttackStatus.choices.some((coord) => coord[0] == choice[0] && coord[1] == choice[1])){
        //   this.aiAttackStatus.choices.splice(idx, 1);
        //   return
        // }
    

    if (this.aiAttackStatus.secondHit) {
      let xCoordDifference = currentHit[0] - Player.currentActiveHit[arrayLength - 1][0];
      let yCoordDifference = currentHit[1] - Player.currentActiveHit[arrayLength - 1][1];
      let status = this.aiAttackStatus.recentHit
      let active = Player.currentActiveHit


      let isValid = status[0] === active[arrayLength][0] && status[1] === active[arrayLength][1]
      if (xCoordDifference === 1) {
        adjCoord = (!isValid) ? [Player.currentActiveHit[0][0] - 1, Player.currentActiveHit[0][1]] 
                 : [x + 1, y];

        console.log('1x', adjCoord)
      }
      
      if (xCoordDifference === -1) {
        adjCoord = (!isValid) ? [Player.currentActiveHit[0][0] + 1, Player.currentActiveHit[0][1]] 
                 : [x - 1, y];
        console.log('-1x', adjCoord)
        
      }

      if (yCoordDifference === 1) {
        adjCoord = (!isValid) ? [Player.currentActiveHit[0][0], Player.currentActiveHit[0][1] - 1] 
                 : [x, y + 1];
                 console.log('1y', adjCoord)
        
      }

      if (yCoordDifference === -1) {
        adjCoord = (!isValid) ? [Player.currentActiveHit[0][0], Player.currentActiveHit[0][1] + 1] 
                 : [x, y - 1];
                 console.log('-1y', adjCoord)

      }

      return adjCoord;
    }


    let randomChoice = Math.floor(Math.random() * this.aiAttackStatus.choices.length);
    adjCoord = this.aiAttackStatus.choices[randomChoice];
    return adjCoord;
  }

  static trampolinedCoords(forPlacement = false) {
    const trampolinedFunc = trampoline(Player.#generateRandomCoords);
    return trampolinedFunc(forPlacement);
  }
}

module.exports = Player;
