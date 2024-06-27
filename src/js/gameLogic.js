import ShipDOM from './dom/shipDOM';

const domHelper = require('./dom/domInterface');
const Player = require('./player');

const playerOneDiv = document.querySelector('.player-one');
const playerTwoDiv = document.querySelector('.player-two');

const playerOneContainer = document.querySelector('.player-one-board');
const playerTwoContainer = document.querySelector('.player-two-board');

const gameLogic = async (isAi) => {
  const playerOne = new Player(true, false);
  const playerTwo = new Player(false, isAi);
  let isGameOver = false;

  domHelper.createBoards(playerOneContainer);

  for (let i = 0; i < playerOne.allShips.length; i++){
    const currentShip = playerOne.allShips[i]
    await ShipDOM.placeShips(currentShip, playerOne, playerOneContainer)
  }
  

  if (!isAi) {
    await domHelper.createTimeoutScreen();
    playerOneDiv.style.display = 'none';
    playerTwoDiv.style.display = 'block';

    domHelper.createBoards(playerTwoContainer);
    await ShipDOM.placeShips(playerTwo, playerTwoContainer);
    await domHelper.createTimeoutScreen();

    playerOneDiv.style.display = 'block';
    domHelper.renderBoards(playerOneContainer, playerTwoContainer);

    await (async () => {
      while (!isGameOver) {
        if (playerOne.gameBoard.allShipSunk(playerOne.allShips)
            || playerTwo.gameBoard.allShipSunk(playerTwo.allShips)) {
          isGameOver = true;
          continue
        }

        if (playerOne.turn) {
          await ShipDOM.attackShip(playerTwoContainer, playerTwo);
          domHelper.updateBoardCells(playerOneContainer.childNodes, playerTwoContainer.childNodes);

          await domHelper.createTimeoutScreen();
          domHelper.renderBoards(playerTwoContainer, playerOneContainer);
          playerOne.changeTurn(playerTwo);
        } else {
          await ShipDOM.attackShip(playerOneContainer, playerOne);
          domHelper.updateBoardCells(playerTwoContainer.childNodes, playerOneContainer.childNodes);

          await domHelper.createTimeoutScreen();
          domHelper.renderBoards(playerOneContainer, playerTwoContainer);
          playerTwo.changeTurn(playerOne);  
        }
      }
    })();
  } else {
    domHelper.createBoards(playerTwoContainer);
    ShipDOM.placeAIShips(playerTwo);

    playerTwoDiv.style.display = 'block';
    domHelper.renderBoards(playerOneContainer, playerTwoContainer);

    await (async () => {
      while (!isGameOver) {
        if (playerOne.gameBoard.allShipSunk(playerOne.allShips)
            || playerTwo.gameBoard.allShipSunk(playerTwo.allShips)) {
          isGameOver = true;
          continue
        }
        if (playerOne.turn) {
          await ShipDOM.attackShip(playerTwoContainer, playerTwo);
          playerOne.changeTurn(playerTwo);
        } else {
          ShipDOM.attackShipAI(playerOne, playerOneContainer);
          playerTwo.changeTurn(playerOne);
        }
        domHelper.updateBoardCells(playerOneContainer.childNodes, playerTwoContainer.childNodes);
      }
    })();
  }
};

export default gameLogic;
