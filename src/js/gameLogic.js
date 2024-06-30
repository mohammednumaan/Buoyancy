import ShipDOM from "./dom/shipDOM";
import Gameboard from "./gameboard";

const domHelper = require("./dom/domInterface");
const Player = require("./player");

const playerOneDiv = document.querySelector(".player-one");
const playerTwoDiv = document.querySelector(".player-two");

const playerOneContainer = document.querySelector(".player-one-board");
const playerTwoContainer = document.querySelector(".player-two-board");

async function handlePlayerOneTurn(isAi, playerOne, playerTwo) {
  await ShipDOM.attackShip(playerTwoContainer, playerTwo);
  if (!isAi) {
    domHelper.updateBoardCells(
      playerOneContainer.childNodes,
      playerTwoContainer.childNodes,
    );
    await domHelper.createTimeoutScreen();
    domHelper.renderBoards(playerTwoContainer, playerOneContainer);
  }
  playerOne.changeTurn(playerTwo);
}

async function handlePlayerTwoTurn(isAi, playerOne, playerTwo) {
  if (!isAi) {
    await ShipDOM.attackShip(playerOneContainer, playerOne);
    domHelper.updateBoardCells(
      playerTwoContainer.childNodes,
      playerOneContainer.childNodes,
    );

    await domHelper.createTimeoutScreen();
    domHelper.renderBoards(playerOneContainer, playerTwoContainer);
  } else {
    ShipDOM.attackShipAI(playerOne, playerOneContainer);
  }

  playerTwo.changeTurn(playerOne);
}

async function attackLogic(gameState) {
  const { playerOne, playerTwo, isAi, gameStatus } = gameState;

  while (!gameStatus.gameover) {
    if (
      Gameboard.allShipSunk(playerOne.allShips) ||
      Gameboard.allShipSunk(playerTwo.allShips)
    ) {
      gameStatus.gameover = true;
      break;
    }

    if (playerOne.turn) {
      await handlePlayerOneTurn(isAi, playerOne, playerTwo);
      gameStatus.turns += 1;
    } else {
      await handlePlayerTwoTurn(isAi, playerOne, playerTwo);
      gameStatus.turns += 1;
    }

    if (isAi) {
      domHelper.updateBoardCells(
        playerOneContainer.childNodes,
        playerTwoContainer.childNodes,
      );
    }
  }
  return Promise.resolve();
}

async function gameLogic(isAi) {
  const playerOne = new Player(true, false);
  const playerTwo = new Player(false, isAi);
  const gameStatus = { gameover: false, turns: 1 };

  domHelper.createBoards(playerOneContainer);
  await ShipDOM.placeShipsDrop(playerOne, playerOneContainer);

  if (!isAi) {
    await domHelper.createTimeoutScreen();
    playerOneDiv.style.display = "none";
    playerTwoDiv.style.display = "block";

    domHelper.createBoards(playerTwoContainer);
    await ShipDOM.placeShipsDrop(playerTwo, playerTwoContainer);

    await domHelper.createTimeoutScreen();

    playerOneDiv.style.display = "block";
    domHelper.renderBoards(playerOneContainer, playerTwoContainer);
    await attackLogic({
      playerOne,
      playerTwo,
      isAi,
      gameStatus,
    });
  } else {
    domHelper.createBoards(playerTwoContainer);
    ShipDOM.placeAIShips(playerTwo);

    playerTwoDiv.style.display = "block";
    domHelper.renderBoards(playerOneContainer, playerTwoContainer);
    await attackLogic({
      playerOne,
      playerTwo,
      isAi,
      gameStatus,
    });
  }

  if (gameStatus.gameover) {
    const winner = (gameStatus.turns % 2) - 1;
    /* eslint-disable-next-line no-console */
    winner !== 0 ? console.log("pplayerOne") : console.log("playerTo");
  }
}

export default gameLogic;
