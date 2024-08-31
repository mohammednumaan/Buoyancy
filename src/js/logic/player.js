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
    
    // if the generated coords are for ship placement, do not push
    // them into the generated coords array to avoid **ignoring**
    // the coords during attack
    if (!forPlacement) {
      Player.#generatedCoords.push(coordsArr);
    }
    return coordsArr;
  }

  
  static trampolinedCoords(forPlacement = false) {
    const trampolinedFunc = trampoline(Player.#generateRandomCoords);
    return trampolinedFunc(forPlacement);
  }
}

class AiPlayer extends Player{

  constructor(turn , isAi){
    super(turn, isAi);
    this.currentActiveHit = []
    this.secondHit = false
    this.aiAttackStatus = {choices: [], recentHit:[], shipQueue: [], currShip: {}};
  }

  generateAdjacentCoords(humanPlayer){

    // initialze and retrieve information about the current active hit
    let coords = [];
    let [x, y] = this.currentActiveHit[this.currentActiveHit.length - 1];    
    let currentShip = this.aiAttackStatus.currShip;
    
    if (currentShip && currentShip.isSunk()){
      this.aiAttackStatus = {choices: [], recentHit:[], shipQueue: [], currShip: {}}
      this.currentActiveHit = [];
      this.secondHit = false;
      return Player.trampolinedCoords();
    }

    if (this.secondHit){
      let xDiff = x - this.currentActiveHit[this.currentActiveHit.length - 2][0]  
      let yDiff = y - this.currentActiveHit[this.currentActiveHit.length - 2][1]
      let isIncompleteAttack = this.aiAttackStatus.recentHit[0] === x && this.aiAttackStatus.recentHit[1] === y;

      // CASE 1: initial hit is on the edge of the ships.
      // so, determine the difference and move in that direction
      if ((xDiff === -1 || xDiff === 1) && isIncompleteAttack){
        switch(xDiff){
          case 1:
            coords = [x + 1, y]
            break;

          case -1:
            coords = [x - 1, y]
            break;
        }

        return coords;
      }

      else if ((yDiff === -1 || yDiff === 1) && isIncompleteAttack){
        switch(yDiff){
          case 1:
            coords = [x, y + 1];
            break;

          case -1:
            coords = [x, y - 1];
            break;
        }

        return coords;
      }

      // CASE 2: initial hit is not on the ends of the ship.
      // so, determine the previous succesfull attack and use that to 
      // compute the direction of hit
      else{


        let xDiff = this.currentActiveHit[0][0] - this.currentActiveHit[1][0]
        let yDiff = this.currentActiveHit[0][1] - this.currentActiveHit[1][1]
        console.log('in', xDiff, yDiff, isIncompleteAttack, this.currentActiveHit)
        console.log(this.aiAttackStatus);


        if (!isIncompleteAttack){
          let initialPoint = this.currentActiveHit[0];

          if (xDiff){
            switch(xDiff){
              case 1:
                // if the diff is 1, shift the attack to the opposite side 
                coords = [initialPoint[0] + 1, initialPoint[1]]
                break;
            
              case -1:
                // if the diff is -1, shift the attack to the opposite side
                coords = [initialPoint[0] - 1, initialPoint[1]]
                break
            }
          }

          else if (yDiff){
            console.log(yDiff, initialPoint)
            switch(yDiff){
              
        
              case 1:
                // if the diff is 1, shift the attack to the opposite side 
                coords = [initialPoint[0], initialPoint[1] + 1]
                break;
            
              case -1:
                // if the diff is -1, shift the attack to the opposite side
                coords = [initialPoint[0], initialPoint[1] - 1]
                break
            }
          }
          console.log(coords)
          return coords;
        } 
        
        else{

          let currentHit = this.currentActiveHit[this.currentActiveHit.length - 1]
          if (xDiff){
            switch(xDiff){
              case 1:
                // if the diff is 1, shift the attack to the opposite side 
                coords = [currentHit[0] + 1, currentHit[1]]
                break;
            
              case -1:
                // if the diff is -1, shift the attack to the opposite side
                coords = [currentHit[0] - 1, currentHit[1]]
                break
            }
          }

          else if (yDiff){
            switch(yDiff){
              
              case 1:
                // if the diff is 1, shift the attack to the opposite side 
                coords = [currentHit[0], currentHit[1] + 1]
                break;
            
              case -1:
                // if the diff is -1, shift the attack to the opposite side
                coords = [currentHit[0], currentHit[1] - 1]
                break
            }
          }

          return coords;
        }
      }
    }

    else{

      // generate all possible adjacent coords for the current hit
      let choices = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];

      // on the initial hit, push the possible choices that the bot can pick to attack
      if (!this.aiAttackStatus.choices.length){
        choices.forEach(choice => {
          this.aiAttackStatus.choices.push(choice);
        })
      }

      // checks if the choice is already been used, if true, remove it from the choice array
      this.aiAttackStatus.choices.forEach((choice, idx) => {
        let isSameCoord = humanPlayer.gameBoard.isSameCoord(choice[0], choice[1]);
        if (isSameCoord) this.aiAttackStatus.choices.splice(idx, 1);
      })

      let randomIdx = Math.floor(Math.random() * this.aiAttackStatus.choices.length);
      coords = this.aiAttackStatus.choices[randomIdx];
      return coords;


    }

  }

}

module.exports = { Player, AiPlayer };
