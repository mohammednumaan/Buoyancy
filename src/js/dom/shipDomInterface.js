import Player, { AiPlayer } from "../logic/player";
import domInterface from "./domInterface";

const Gameboard = require("../logic/gameboard");

export default class shipDomInterface {
  static #adjacentCoords = [];

  // an async function that controls the flow of ship plcaement
  static async placeShips(homePlayer, homeDomBoard) {
    let isAllPlaced = false;

    const dashboardContainer = document.querySelector(".dashboard-container");
    const resetBtn = document.getElementById("reset-btn");

    const resetHandler = () => {
      shipDomInterface.#resetPlacement(homePlayer, homeDomBoard);
      resetBtn.disabled = true;
    };

    // create/render the ship containers for placement
    domInterface.createShipContainers(homePlayer);

    // event listener to handle ship placement reset
    resetBtn.addEventListener("click", resetHandler);

    // loop until all ships are placed
    while (!isAllPlaced) {
      resetBtn.disabled = !(
        Array.from(dashboardContainer.children).slice(1).length < 5
      );

      try {
        await shipDomInterface.#delegateShipDrop(homePlayer, homeDomBoard);
        isAllPlaced = !Array.from(dashboardContainer.children).slice(1).length;
      } catch (err) {
        return err;
      }
    }

    // disable and remove the event listener to prevent
    // side effects in a 2-player game and to prevent resetting
    // after all ships have been placed
    resetBtn.disabled = true;
    resetBtn.removeEventListener("click", resetHandler);
    return Promise.resolve("All Ships Placed!");
  }

  // a simple method that marks a placed ship on the domboard
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

  // a simple method that marks an attacked or a missed ship on the domboard
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
      // when its **not** the player's turn
      enemyDomBoard.addEventListener("click", handleClick, { once: true });
    });
  }

  // control flow for attacking enemy ships
  static async attackShip(enemyDomBoard, enemyPlayer) {
    try {
      await shipDomInterface.#delegateShipAttack(enemyDomBoard, enemyPlayer);
    } catch (err) {
      await shipDomInterface.attackShip(enemyDomBoard, enemyPlayer);
    }
  }

  /* eslint-disable consistent-return */
  // delegate AI's ship placement on its board by randomly generating
  // [x, y] tuples to place a ship
  static #delgateAIPlacement(currShip, enemyPlayer) {
    const [x, y] = Player.Player.trampolinedCoords(true);
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
  static attackShipAI(aiPlayer, enemyPlayer, enemyDomBoard) {
    return new Promise((resolve) => {
      setTimeout(() => {

        let coords = (aiPlayer.currentActiveHit.length !== 0) ? aiPlayer.generateAdjacentCoords(enemyPlayer) : Player.Player.trampolinedCoords();

        console.log('Gen Coords: ', coords);
        Player.Player.generatedCoords.push(coords)
        let [x, y] = coords;
        


        if (enemyPlayer.gameBoard.recieveAttack(x, y)) {
          const isShip = enemyPlayer.gameBoard.board[x][y];
          const cell = domInterface.getCellElement(x, y,  enemyDomBoard.className);

          if (!aiPlayer.currentActiveHit.length && isShip){
            aiPlayer.currentActiveHit.push([x, y])
            aiPlayer.aiAttackStatus.currShip = isShip;
          }

          else if (aiPlayer.currentActiveHit.length === 1 && isShip){
            if (isShip.id === aiPlayer.aiAttackStatus.currShip.id){
              aiPlayer.secondHit = true;
              aiPlayer.currentActiveHit.push([x, y])
              aiPlayer.aiAttackStatus.shipQueue.push(isShip);
            }

          }

          else if (aiPlayer.currentActiveHit.length > 1 && isShip){
            if (isShip.id !== aiPlayer.aiAttackStatus.currShip.id){
              aiPlayer.aiAttackStatus.shipQueue.push(isShip);
            }
            else{
              aiPlayer.currentActiveHit.push([x, y])
            }
          }

          aiPlayer.aiAttackStatus.recentHit = [x, y];
          console.log('enddd')
          shipDomInterface.#attackedShipClass(cell);
          resolve();
        }
      }, 500);
    });
  }

  // delegates drop events on the given domboard to place ships via drag and drop
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

  // a simple method that changess the ship direction for placement
  static changeDomShipDirection(currentShip, shipContainer) {
    shipContainer.style["flex-direction"] = currentShip.vertical
      ? "row"
      : "column";
    currentShip.changeDirection();
  }
}
