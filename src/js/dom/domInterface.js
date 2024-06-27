class domHelper {
  static playerOneDiv = document.querySelector('.player-one');

  static playerTwoDiv = document.querySelector('.player-two');

  static continueBtn = document.querySelector('.timeout-screen > button');

  static playerOneTitle = document.createElement('h4');

  static playerTwoTitle = document.createElement('h4');

  static createBoards(playerBoard) {
    playerBoard.style.gridTemplateColumns = 'repeat(10, 1fr)';
    playerBoard.style.gridTemplateRows = 'repeat(10, 1fr)';

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.x = i;
        cell.dataset.y = j;
        playerBoard.appendChild(cell);
      }
    }
  }

  static renderBoards(homeDomBoard, enemyDomBoard) {
    [domHelper.playerOneDiv, domHelper.playerTwoDiv].forEach((div) => div.replaceChildren());
    domHelper.playerOneTitle.textContent = 'Your Gameboard';
    domHelper.playerTwoTitle.textContent = "Opponent's Gameboard";

    domHelper.playerOneDiv.replaceChildren(homeDomBoard);
    domHelper.playerOneDiv.prepend(domHelper.playerOneTitle);

    domHelper.playerTwoDiv.replaceChildren(enemyDomBoard);
    domHelper.playerTwoDiv.prepend(domHelper.playerTwoTitle);

    domHelper.updateBoardCells(homeDomBoard.childNodes, enemyDomBoard.childNodes);
  }

  static updateBoardCells(homeDomBoard, enemyDomBoard) {
    enemyDomBoard.forEach((cell) => cell.style.backgroundColor = (cell.classList.contains('attacked-ship')) ? '#aa2c55'
      : (cell.classList.contains('missed-attack')) ? '#181f4e'
        : (cell.classList.contains('placed-ship')) ? 'black' : 'black');

    homeDomBoard.forEach((cell) => {
      cell.style.backgroundColor = (cell.classList.contains('attacked-ship')) ? '#aa2c55'
        : (cell.classList.contains('missed-attack')) ? '#181f4e'
          : (cell.classList.contains('placed-ship')) ? '#957eff' : 'black';
    });
  }

  static createTimeoutScreen() {
    let count = 4;
    const timeoutScreen = document.querySelector('.timeout-screen');

    return new Promise((resolve) => {
      setTimeout(() => {
        timeoutScreen.style.display = 'flex';
        domHelper.continueBtn.display = 'flex';
      }, 1000);
      timeoutScreen.textContent = `Hand it over: ${count}!`;

      const timer = setInterval(() => {
        count -= 1;
        timeoutScreen.textContent = `Hand it over: ${count}!`;

        if (count === 0) {
          clearInterval(timer);
          timeoutScreen.style.display = 'none';
          resolve();
        }
      }, 1000);
    });
  }

  static getCellElement(x, y, boardClassName) {
    return document.querySelector(`.${boardClassName} > [data-x="${x}"][data-y="${y}"]`);
  }

  static getCellCoords(cell) {
    return domHelper.parseCoords(cell.dataset.x, cell.dataset.y);
  }

  static parseCoords(x, y) {
    return [parseInt(x), parseInt(y)];
  }
}

module.exports = domHelper;
