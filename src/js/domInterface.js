class domHelper {

  static playerOneDiv = document.querySelector('.player-one');
  static playerTwoDiv = document.querySelector('.player-two');


  static createBoards(playerBoard) {
    playerBoard.style.gridTemplateColumns = 'repeat(10, 1fr)';
    playerBoard.style.gridTemplateRows = 'repeat(10, 1fr)';

    for (let i = 0; i < 10; i++) {
      for(let j = 0; j < 10; j++){
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.x = i;
        cell.dataset.y = j;
        playerBoard.appendChild(cell);
      }
    }
  }

  static renderBoards(homeDomBoard, enemyDomBoard){

    [domHelper.playerOneDiv, domHelper.playerTwoDiv].forEach(div => div.replaceChildren());
    domHelper.playerOneDiv.replaceChildren(homeDomBoard);
    domHelper.playerTwoDiv.replaceChildren(enemyDomBoard);
    domHelper.#updateBoardCells(homeDomBoard.childNodes, enemyDomBoard.childNodes)

  }

  static #updateBoardCells(homeDomBoard, enemyDomBoard){
    enemyDomBoard.forEach(cell => cell.style.backgroundColor = (cell.classList.contains('placed-ship')) ? 'white' : 'white')
    homeDomBoard.forEach(cell => {
      cell.style.backgroundColor = (cell.classList.contains('placed-ship')) ? 'yellow' :
        (cell.classList.contains('missed-attack')) ? 'aqua' : 
        (cell.classList.contains('attacked-ship')) ? 'red' : ''
    })
  }



  static createTimeoutScreen(){   

    let count = 3;
    const timeoutScreen = document.querySelector('.timeout-screen')
    
    timeoutScreen.style.display = 'flex';
    timeoutScreen.textContent = `Hand it over: ${count}!`;
    
    const timer = setInterval(() => {
      count -= 1;
      timeoutScreen.textContent = `Hand it over: ${count}!`;
      
      if(count === 0) {
        clearInterval(timer)
        timeoutScreen.style.display = 'none';
      }

    }, 1000)    
  }

  static findCellElement(x, y, boardClassName){
    return document.querySelector(`.${boardClassName} > [data-x="${x}"][data-y="${y}"]`);
  }

  static parseCoords(x, y){
    return [parseInt(x), parseInt(y)];
  }

}

module.exports = domHelper;
