// imports
import domInterface from "./dom/domInterface";
import shipDomInterface from "./dom/shipDomInterface";
import Gameboard from "./gameboard";

const Player = require("./player");

const dashboard = document.querySelector(".dashboard");

const playerOneDiv = document.querySelector(".player-one");
const playerTwoDiv = document.querySelector(".player-two");

const playerOneContainer = document.querySelector(".player-one-board");
const playerTwoContainer = document.querySelector(".player-two-board");

// a simple async function that handles playerOne's attack turn
async function handlePlayerOneTurn(isAi, playerOne, playerTwo) {
  await shipDomInterface.attackShip(playerTwoContainer, playerTwo);
  if (!isAi) {
    domInterface.updateBoardCells(
      playerOneContainer.childNodes,
      playerTwoContainer.childNodes,
    );
    await domInterface.createTimeoutScreen("Attack", "Player Two");
    domInterface.renderBoards(playerTwoContainer, playerOneContainer);
  }
  playerOne.changeTurn(playerTwo);
}

// a simple async function that handles playerTwo's attack turn
async function handlePlayerTwoTurn(isAi, playerOne, playerTwo) {
  if (!isAi) {
    await shipDomInterface.attackShip(playerOneContainer, playerOne);
    domInterface.updateBoardCells(
      playerTwoContainer.childNodes,
      playerOneContainer.childNodes,
    );

    await domInterface.createTimeoutScreen("Attack", "Player One");

    domInterface.renderBoards(playerOneContainer, playerTwoContainer);
  } else {
    await shipDomInterface.attackShipAI(playerOne, playerOneContainer);
  }

  playerTwo.changeTurn(playerOne);
}

// a simple async function that handles the game's attack flow
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
      gameStatus.gameover = true;
    }

    if (isAi) {
      domInterface.updateBoardCells(
        playerOneContainer.childNodes,
        playerTwoContainer.childNodes,
      );
    }
  }

  return Promise.resolve();
}

// an async function controls the main game flow
export default async function gameLogic(isAi) {
  // intialize players and game status
  const playerOne = new Player(true, false);
  const playerTwo = new Player(false, isAi);
  const gameStatus = { gameover: false, turns: 1 };

  // initialize playerOne's boards and wait for ship placement
  domInterface.createBoards(playerOneContainer);

  if (!isAi)
    await domInterface.createTimeoutScreen("Place Ships", "Player One");
  await shipDomInterface.placeShips(playerOne, playerOneContainer);

  if (!isAi) {
    await domInterface.createTimeoutScreen("Place Ships", "Player Two");

    playerOneDiv.style.display = "none";
    playerTwoDiv.style.display = "block";

    // initialize playerTwo's boards and wait for ship placement
    domInterface.createBoards(playerTwoContainer);
    await shipDomInterface.placeShips(playerTwo, playerTwoContainer);

    await domInterface.createTimeoutScreen("Begin The Battle!", "Player One");
    dashboard.remove();

    // display both the gameboards and start the game
    playerOneDiv.style.display = "block";
    domInterface.renderBoards(playerOneContainer, playerTwoContainer);
    await attackLogic({
      playerOne,
      playerTwo,
      isAi,
      gameStatus,
    });
  } else {
    await domInterface.createTimeoutScreen(
      "Begin The Battle!",
      "Click Continue",
      true,
    );
    domInterface.createBoards(playerTwoContainer);
    shipDomInterface.placeAIShips(playerTwo);

    playerTwoDiv.style.display = "block";
    dashboard.style.display = "none";
    domInterface.renderBoards(playerOneContainer, playerTwoContainer);
    await attackLogic({
      playerOne,
      playerTwo,
      isAi,
      gameStatus,
    });
  }

  if (gameStatus.gameover) {
    const winner = (gameStatus.turns % 2) - 1;
    winner !== 0
      ? domInterface.openGameOverModal("Player One", isAi)
      : domInterface.openGameOverModal("Player Two", isAi);
  }
}
