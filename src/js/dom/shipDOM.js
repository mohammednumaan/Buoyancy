const domHelper = require("./domInterface");

class ShipDOM{

    static #highlightShips(event, homePlayer, currentShip, forPlacement = false){

        const [xCoord, yCoord] = domHelper.parseCoords(event.target.dataset.x, event.target.dataset.y);
        const isValid = homePlayer.gameBoard.isValidCoords(currentShip, xCoord, yCoord)
    
        for(let i = 0; i < currentShip.length; i++){
          const cell = (!currentShip.vertical) ? domHelper.getCellElement(xCoord, yCoord + i, event.currentTarget.className) : 
          domHelper.getCellElement(xCoord + i, yCoord, event.currentTarget.className);
    
          if(!cell) return;

          cell.classList.add(isValid ? 'valid' : 'invalid');
          if (forPlacement) cell.classList.add('placed-ship')
        }
    
    }

    static #clearHighlightShips(){
      const highlightedElements = document.querySelectorAll('.valid, .invalid')
      highlightedElements.forEach(element => element.classList.remove('valid', 'invalid'))
    }


    static #delegateShipPlacement(homeDomBoard, homePlayer, currentShip, abortController){
      
      let isAllPlaced = false;
      return new Promise((resolve, reject) => {
        
        const handleClick = (e) => {
          const [xCoord, yCoord] = domHelper.parseCoords(e.target.dataset.x, e.target.dataset.y);

          
          if (homePlayer.gameBoard.isValidCoords(currentShip, xCoord, yCoord)){
            homePlayer.gameBoard.placeShip(currentShip, xCoord, yCoord)
            ShipDOM.#highlightShips(e, homePlayer, currentShip, true)   

            isAllPlaced =  (currentShip.length === 5) ? true : false
            
            resolve(currentShip)
          }
          
          if (isAllPlaced) {  
            abortController.abort()
          } 
        }

        homeDomBoard.addEventListener('click', handleClick, {once: true, signal: abortController.signal})

      })
    }

    
    static async placeShips(player, playerBoardContainer){

      let currentShip = player.allShips[0];
      const abortController = new AbortController()
      const signal = abortController.signal;
      
      const highlightShips = (e) => ShipDOM.#highlightShips(e, player, currentShip)
      const clearHighlight = () => ShipDOM.#clearHighlightShips(player.gameBoard)

      playerBoardContainer.addEventListener('mouseover', highlightShips, {signal})
      playerBoardContainer.addEventListener('mouseout', clearHighlight, {signal})
      
      try{

        for (let i = 0; i < player.allShips.length; i++){
          currentShip = player.allShips[i]
          await ShipDOM.#delegateShipPlacement(playerBoardContainer, player, currentShip, abortController)
        
        } 

        Promise.resolve();

      } catch(err){
        console.log(err)
      }
    }

    static attackedShipClass(cell){
      cell.classList.add(cell.classList.contains('placed-ship') ? 'attacked-ship' : 'missed-attack')
    }

    static #delegateShipAttack(enemyDomBoard, enemyPlayer){

      const abortController = new AbortController();
      return new Promise((resolve, reject) => {


        const handleClick = (e) => {

            const [xCoord, yCoord] = domHelper.parseCoords(e.target.dataset.x, e.target.dataset.y);
          
            if (enemyPlayer.gameBoard.recieveAttack(xCoord, yCoord) === true){
              ShipDOM.attackedShipClass(e.target)
              abortController.abort()
              resolve(e);
            }

        }
        enemyDomBoard.addEventListener('click', handleClick, {signal: abortController.signal})

      })
    }

    static async attackShip(enemyDomBoard, enemyPlayer){
      await ShipDOM.#delegateShipAttack(enemyDomBoard, enemyPlayer)
    }

    
}

module.exports = ShipDOM;