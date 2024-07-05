const { changeDomShipDirection } = require("../gameLogic");

class domInterface {
  static playerOneDiv = document.querySelector(".player-one");

  static playerTwoDiv = document.querySelector(".player-two");

  static continueBtn = document.querySelector(".timeout-screen > button");

  static playerOneTitle = document.createElement("h4");

  static playerTwoTitle = document.createElement("h4");

  /* eslint-disable no-param-reassign */

  // a simple loop to create a 10x10 grid for
  // players to place and attack ships
  static createBoards(playerBoard) {
    playerBoard.style.gridTemplateColumns = "repeat(10, 1fr)";
    playerBoard.style.gridTemplateRows = "repeat(10, 1fr)";

    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const cell = document.createElement("div");
        cell.className = "board-cell";
        cell.dataset.x = i;
        cell.dataset.y = j;
        playerBoard.appendChild(cell);
      }
    }
  }

  // creates ship containers for players to
  // drag and drop ships onto their board
  static createShipContainers(homePlayer) {
    const dashboardContainer = document.querySelector(".dashboard-container");
    const dashboard = document.querySelector(".dashboard");
    dashboard.style.display = "flex";
    dashboardContainer.style.display = "flex";

    for (let i = 0; i < homePlayer.allShips.length; i += 1) {
      const shipContainer = document.createElement("div");
      shipContainer.className = "ship-container";
      shipContainer.draggable = true;

      // set a data-* attribute to identify this container
      // based on the ship's index, which is later used to
      // retrieve and place the ship on the board via drag and drop
      shipContainer.dataset.index = i;

      for (let j = 0; j < homePlayer.allShips[i].length; j += 1) {
        const shipCell = document.createElement("div");
        shipCell.className = "board-cell";
        shipCell.classList.add("ship-cell");
        shipContainer.appendChild(shipCell);
      }
      shipContainer.addEventListener(
        "dragstart",
        domInterface.dragStartHandler,
      );

      shipContainer.addEventListener("click", (e) =>
        changeDomShipDirection(homePlayer.allShips[i], e.currentTarget),
      );
      dashboardContainer.appendChild(shipContainer);
    }
  }

  // render board cells and board view according to the
  // current player's turn (this func is  called when played against a human)
  static renderBoards(homeDomBoard, enemyDomBoard) {
    // remove the existing board state by removing all its children
    [domInterface.playerOneDiv, domInterface.playerTwoDiv].forEach((div) =>
      div.replaceChildren(),
    );

    // render board names appropriately based on the 
    // current player's turn
    domInterface.playerOneTitle.textContent =
      homeDomBoard.className === "player-one-board"
        ? "Player One's Board"
        : "Player Two's Board";
    domInterface.playerTwoTitle.textContent = 
      enemyDomBoard.className === " player-one-board"
        ? "Player One's Board"
        : "Player Two's Board";

    // simple logic to switch the board and its board cells
    // based on the current player's turn.

    // by replacing player-2's board on the left and player-1's
    // board on the right (based on the player's turn)
    domInterface.playerOneDiv.replaceChildren(homeDomBoard);
    domInterface.playerOneDiv.prepend(domInterface.playerOneTitle);

    domInterface.playerTwoDiv.replaceChildren(enemyDomBoard);
    domInterface.playerTwoDiv.prepend(domInterface.playerTwoTitle);

    // update each cell by the current player's turn and each cell's state
    domInterface.updateBoardCells(
      homeDomBoard.childNodes,
      enemyDomBoard.childNodes,
    );
  }

  // renders appropriate classes for each cell based on their state
  static updateBoardCells(homeDomBoard, enemyDomBoard) {
    homeDomBoard.forEach((cell) => {
      cell.style.backgroundColor = cell.classList.contains("attacked-ship")
        ? "#aa2c55"
        : cell.classList.contains("missed-attack")
          ? "#181f4e"
          : cell.classList.contains("placed-ship")
            ? "#957eff"
            : "black";
    });

    enemyDomBoard.forEach((cell) => {
      cell.style.backgroundColor = cell.classList.contains("attacked-ship")
        ? "#aa2c55"
        : cell.classList.contains("missed-attack")
          ? "#181f4e"
          : cell.classList.contains("placed-ship")
            ? "black"
            : "black";
    });
  }

  // renders a continue screen and blurs the background
  // to avoid visibility of current player's gameboard
  // (the func is called when played against a human)
  static createTimeoutScreen(headerText, subHeaderText, isAi = false) {
    const timeoutScreen = document.querySelector(".timeout-screen");
    const timeoutHeader = document.getElementById("timeout-message");
    const timeoutPlayer = document.getElementById("player-turn");
    const continueBtn = document.getElementById("continue-game-btn");

    return new Promise((resolve) => {
      const timerId = setTimeout(() => {
        timeoutScreen.style.display = 'flex'
        timeoutHeader.textContent = headerText
        timeoutPlayer.textContent = (isAi) ? `${subHeaderText}` : `${subHeaderText}'s Turn`
      }, 2000)

      continueBtn.addEventListener('click', (e) => {
        clearTimeout(timerId)  
        timeoutScreen.style.display = 'none'
        resolve(e)
      },{once: true})
    });
  }

  // retrieve the cell element with the x and y coord from the player's board
  static getCellElement(x, y, boardClassName) {
    return document.querySelector(
      `.${boardClassName} > [data-x="${x}"][data-y="${y}"]`,
    );
  }

  // retrieve the x and y coords from the cell element
  static getCellCoords(cell) {
    return domInterface.parseCoords(cell.dataset.x, cell.dataset.y);
  }

  // parses the coord dataset string to an integer
  static parseCoords(x, y) {
    return [parseInt(x, 10), parseInt(y, 10)];
  }

  // an event handler to handle dragstart event
  static dragStartHandler(e) {
    e.dataTransfer.setData("application/index", e.target.dataset.index);
    e.dataTransfer.effectAllowed = "move";
  }

  // an event handler to handle dragover event
  static dragoverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
}

module.exports = domInterface;
