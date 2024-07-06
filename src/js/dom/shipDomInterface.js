import domInterface from "./domInterface";

const Gameboard = require("../gameboard");

export default class shipDomInterface {
  static #generatedCoords = [[null, null]];

  // an async function that controls the flow of ship plcaement
  static async placeShips(homePlayer, homeDomBoard) {
    let isAllPlaced = false;
    const dashboardContainer = document.querySelector(".dashboard-container");
    const resetBtn = document.getElementById("reset-btn");

    resetBtn.addEventListener("click", () => {
      shipDomInterface.#resetPlacement(homePlayer, homeDomBoard);
      resetBtn.disabled = true;
    });
    domInterface.createShipContainers(homePlayer);

    while (!isAllPlaced) {
      const dashboardChildren = Array.from(dashboardContainer.children).slice(
        1,
      );
      resetBtn.disabled = !(dashboardChildren.length < 5);

      try {
        await shipDomInterface.#delegateShipDrop(homePlayer, homeDomBoard);
        isAllPlaced = !Array.from(dashboardContainer.children).slice(1).length;
      } catch (err) {
        return err;
      }
    }

    resetBtn.disabled = true;
    return Promise.resolve();
  }

  static #markPlacedShip(domBoardClass, currentShip, x, y, isAi = false) {
    for (let i = 0; i < currentShip.length; i += 1) {
      const cell = !currentShip.vertical
        ? domInterface.getCellElement(x, y + i, domBoardClass)
        : domInterface.getCellElement(x + i, y, domBoardClass);

      if (!cell) return;

      cell.classList.add("placed-ship");
      if (isAi) cell.style.backgroundColor = "black";
    }
  }

  static #attackedShipClass(cell) {
    cell.classList.add(
      cell.classList.contains("placed-ship")
        ? "attacked-ship"
        : "missed-attack",
    );
  }

  // delegates the click event from the gameboard to the appropriate cell
  static #delegateShipAttack(enemyDomBoard, enemyPlayer) {
    return new Promise((resolve, reject) => {
      const handleClick = (e) => {
        const [xCoord, yCoord] = domInterface.parseCoords(
          e.target.dataset.x,
          e.target.dataset.y,
        );

        if (!e.target.classList.contains("board-cell")) {
          return reject(e);
        }
        if (enemyPlayer.gameBoard.recieveAttack(xCoord, yCoord)) {
          shipDomInterface.#attackedShipClass(e.target);
          resolve(e);
        }

        return reject(e);
      };

      // attach click event listener that listens to the event only once
      // to avoid unintentional behaviour such as registering an attack
      // when its **not** the player's turn)
      enemyDomBoard.addEventListener("click", handleClick, { once: true });
    });
  }

  //
  static async attackShip(enemyDomBoard, enemyPlayer) {
    try {
      await shipDomInterface.#delegateShipAttack(enemyDomBoard, enemyPlayer);
    } catch (err) {
      await shipDomInterface.attackShip(enemyDomBoard, enemyPlayer);
    }
  }

  // a simple method that generates unique and random [x, y] tuples
  // for the AI to attack and place ships on its board
  static #generateRandomCoords(forPlacement = false) {
    let coordsArr = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];

    // if the generatedCoords array includes the newly created [x, y] tuple,
    // run this function recursively until it finds a unique one
    shipDomInterface.#generatedCoords.forEach((coord) => {
      if (coord[0] === coordsArr[0] && coord[1] === coordsArr[1]) {
        coordsArr = shipDomInterface.#generateRandomCoords();
      }
    });

    // if the generated coords for ship placement, do not push
    // them into the generated coords array to avoid **ignoring**
    // the coords during attack
    if (!forPlacement) {
      shipDomInterface.#generatedCoords.push(coordsArr);
    }
    console.log(shipDomInterface.#generatedCoords.length);
    return coordsArr;
  }

  /* eslint-disable consistent-return */
  // delegate AI's ship placement on its board by randomly generating
  // [x, y] tuples to place a ship
  static #delgateAIPlacement(currShip, enemyPlayer) {
    const [x, y] = shipDomInterface.#generateRandomCoords(true);
    const directionChoice = [0, 1][Math.floor(Math.random() * [0, 1].length)];

    if (directionChoice) currShip.changeDirection();

    if (!enemyPlayer.gameBoard.isValidCoords(currShip, x, y)) {
      return shipDomInterface.#delgateAIPlacement(currShip, enemyPlayer);
    }
    enemyPlayer.gameBoard.placeShip(currShip, x, y);
    shipDomInterface.#markPlacedShip("player-two-board", currShip, x, y, true);
  }

  // a simple method that places all AI's ships
  static placeAIShips(enemyPlayer) {
    enemyPlayer.allShips.forEach((ship) =>
      shipDomInterface.#delgateAIPlacement(ship, enemyPlayer),
    );
  }

  // a simple method that attacks the enemy player's (homePlayer)
  // board by generating random [x, y] tuples
  static attackShipAI(enemyPlayer, enemyDomBoard) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const [x, y] = shipDomInterface.#generateRandomCoords();
        console.log([x, y]);
        if (enemyPlayer.gameBoard.recieveAttack(x, y)) {
          const cell = domInterface.getCellElement(
            x,
            y,
            enemyDomBoard.className,
          );
          shipDomInterface.#attackedShipClass(cell);
          resolve();
        }
      }, 500);
    });
  }

  static async #delegateShipDrop(homePlayer, homeDomBoard) {
    // create an abort controller to handle removal of event listeners
    const abortController = new AbortController();

    return new Promise((resolve) => {
      const dropHandler = (e) => {
        e.preventDefault();

        // retrieve the dragged element's index
        const index = e.dataTransfer.getData("application/index");

        // retrieve the corresponding shipContainer based on the retrieved index
        const shipContainer = document.querySelector(`[data-index="${index}"]`);
        const shipCells = [...shipContainer.children];

        if (!e.target.classList.contains("board-cell")) return;

        const [x, y] = domInterface.getCellCoords(e.target);
        const currentShip = homePlayer.allShips[Number(index)];

        if (!homePlayer.gameBoard.isValidCoords(currentShip, x, y)) return;

        // if the selected drop coords is valid, begin placing the ship
        for (let i = 0; i < currentShip.length; i += 1) {
          // retrieve the cell element from the board based on the ship's direction
          const cell = !currentShip.vertical
            ? domInterface.getCellElement(x, y + i, homeDomBoard.className)
            : domInterface.getCellElement(x + i, y, homeDomBoard.className);

          // retrieve the shipCell from the shipContainer and assign it [x, y] dataset coords
          shipCells[i].dataset.x = !currentShip.vertical ? x : x + i;
          shipCells[i].dataset.y = !currentShip.vertical ? y + i : y;
          shipCells[i].classList.remove("ship-cell");

          // replace the homeDomBoard's cell with [x, y] coord with the retrieved shipCell
          cell.replaceWith(shipCells[i]);
        }

        homePlayer.gameBoard.placeShip(currentShip, x, y);

        // remove the shipContainer from the dashboard as an indication of it being placed
        shipContainer.remove();
        shipDomInterface.#markPlacedShip(
          homeDomBoard.className,
          currentShip,
          x,
          y,
        );

        abortController.abort();
        resolve(e);
      };
      homeDomBoard.addEventListener("dragover", domInterface.dragoverHandler, {
        signal: abortController.signal,
      });
      homeDomBoard.addEventListener("drop", dropHandler, {
        signal: abortController.signal,
      });
    });
  }

  // resets the board for ship placement by removing
  // existing ships and recreating the ship containers
  static #resetPlacement(homePlayer, homeDomBoard) {
    const dashboardContainer = document.querySelector(".dashboard-container");

    // retrieve all the placed ships
    const placedShips = document.querySelectorAll(
      `.${homeDomBoard.className} > .placed-ship`,
    );
    const shipContainers = Array.from(dashboardContainer.children).slice(1);

    // remove the placed ships from the board and re-create the ship containers
    placedShips.forEach((ship) => ship.classList.remove("placed-ship"));
    shipContainers.forEach((container) => container.remove());
    domInterface.createShipContainers(homePlayer);

    // replace the exisiting gameboard object with a new one
    homePlayer.gameBoard = new Gameboard();
  }

  static changeDomShipDirection(currentShip, shipContainer) {
    shipContainer.style["flex-direction"] = currentShip.vertical
      ? "row"
      : "column";
    currentShip.changeDirection();
  }
}
