const domHelper = require("../domInterface");

class ShipDOM{

    static #highlightShips(optionsObj){
        const {domBoard, playerBoard, currentShip, x, y, isPlaced} = optionsObj;
        const [xCoord, yCoord] = domHelper.parseCoords(x, y);
        const isValid = playerBoard.isValidCoords(currentShip, xCoord, yCoord)
    
        for(let i = 0; i < currentShip.length; i++){
          const cell = (!currentShip.vertical) ? domHelper.findCellElement(xCoord, yCoord + i, domBoard.className) : domHelper.findCellElement(containerName, xCoord + i, yCoord, domBoard.className);
    
          if(!cell) return;
          cell.classList.add(isValid ? 'valid' : 'invalid');
          (isPlaced) ? cell.classList.add('placed-ship') : null;
        }
    
    }

    static #clearHighlightShips(){
      const highlightedElements = document.querySelectorAll('.valid, .invalid')
      highlightedElements.forEach(element => element.classList.remove('valid', 'invalid'))
    }

    static async delegateShipPlacement(){
      return new Promise((resolve, reject) => {
        
      })

    }
    
    static async placeShips(player, playerBoardContainer){
      let isAllPlaced = false;
      let currentShip = player.allShips[0];
      const abortController = new AbortController()
      const signal = abortController.signal;
      
      const highlightShips = (e) => {
        const optionsObj = {domBoard: playerBoardContainer, playerBoard: player.gameBoard, currentShip, x: e.target.dataset.x, y: e.target.dataset.y, isPlaced: false}
        ShipDOM.#highlightShips(optionsObj)
      }

      const clearHighlight = () => ShipDOM.#clearHighlightShips(player.gameBoard)

      playerBoardContainer.addEventListener('mouseover', highlightShips, {signal})
      playerBoardContainer.addEventListener('mouseout', clearHighlight, {signal})
  
      return new Promise((resolve, reject) => {
  
        playerBoardContainer.addEventListener('click', (e) => {
          const [xCoord, yCoord] = domHelper.parseCoords(e.target.dataset.x, e.target.dataset.y);
          
          if (player.gameBoard.isValidCoords(currentShip, xCoord, yCoord)){

            player.gameBoard.placeShip(currentShip, xCoord, yCoord)
            ShipDOM.#highlightShips({domBoard: playerBoardContainer, playerBoard: player.gameBoard, currentShip, x: e.target.dataset.x, y: e.target.dataset.y, isPlaced: true})
            currentShip = ShipDOM.#getNextShip(player);        
          }
  
          if (!player.allShips.length) {
            isAllPlaced = true;
            abortController.abort()
            resolve(isAllPlaced);
          }
        }, {signal})
    
      })
    }

    static #getNextShip(player){
      if (!player.allShips.length) return;
      player.allShips.shift()
      return player.allShips[0]
    }
    
}

module.exports = ShipDOM;