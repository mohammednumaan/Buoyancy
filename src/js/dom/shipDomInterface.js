import Player from "../logic/player";
import domInterface from "./domInterface";

const Gameboard = require("../logic/gameboard");

export default class shipDomInterface {
  // an async function that controls the flow of ship plcaement
  static async placeShips(homePlayer, homeDomBoard) {
    // a flag variable to track ship placements
    let isAllPlaced = false;
    // retrieves elements from the dom
    const boardContainer = document.querySelector(".board-container");
    const dashboard = document.querySelector(".dashboard");
    const dashboardContainer = document.querySelector(".dashboard-container");
    const resetBtn = document.getElementById("reset-btn");
    const randomPlacementBtn = document.getElementById("random-btn");
    const continueBtn = document.getElementById("continue-btn");

    /// initialize a resize observer to track the change in dimensions
    const mql = matchMedia("(max-width: 1120px)");

    // check if the screen size is within the mobile range
    /* eslint-disable consistent-return */
    async function shipPlacementObserver(e) {
      if (e.matches) {
        // positions the continue button differently
        // mobile and tablet devices
        if (dashboard?.children[2]) {
          dashboard.removeChild(continueBtn);
          boardContainer.appendChild(continueBtn);
        }

        // enables random placement button for ship placement
        // this option is only available for mobile devices
        randomPlacementBtn.style.display = "block";
        continueBtn.style.display = "block";
        randomPlacementBtn.disabled = false;

        // hide other options (such as dashboard container)
        // that aren't required for tablet and mobile devices
        resetBtn.style.display = "none";
        dashboardContainer.style.display = "none";

        // if (!document.querySelectorAll(
        //   `.${homeDomBoard.className} > .placed-ship`,
        // ).length) {
        //   shipDomInterface.#resetPlacement(homePlayer, homeDomBoard);
        // }

        // on click, it generates random coords for ship
        // placement on the users board
        randomPlacementBtn.addEventListener("click", () => {
          continueBtn.disabled = false;

          const placedShips = document.querySelectorAll(
            `.${homeDomBoard.className} > .placed-ship`,
          );

          // check if there is any placed ships
          // if true, remove them and reset the gameboard
          if (placedShips.length) {
            // remove the placed ships from the board
            placedShips.forEach((ship) => ship.classList.remove("placed-ship"));
            // replace the exisiting gameboard object with a new one
            homePlayer.gameBoard = new Gameboard();
          }

          // places each ship randomly on the users's board
          homePlayer.allShips.forEach((ship) => {
            shipDomInterface.delgateHumanPlayerPlacement(
              homePlayer,
              ship,
              homeDomBoard.className,
            );
          });
        });
      } else {
        // else enable players to drag and drop ships on the board
        // works for desktops and pc's

        // hides and displays relevant dom elements on the board
        dashboard.appendChild(continueBtn);
        resetBtn.style.display = "block";

        continueBtn.style.display = "block";
        randomPlacementBtn.style.display = "none";

        randomPlacementBtn.disabled = true;

        // an event handler to handle ship placement resets
        const resetHandler = () => {
          shipDomInterface.#resetPlacement(homePlayer, homeDomBoard);
          domInterface.createShipContainers(homePlayer);
          continueBtn.disabled = true;
          resetBtn.disabled = true;
          dashboardContainer.children[1].style.display = "none";
        };

        // retrieve the placed ships from the dom
        const placedShipEl = document.querySelectorAll(
          `.${homeDomBoard.className} > .placed-ship`,
        );

        // if there is no ships placed yet, create the ship containers
        // for placing the ships on the board
        if (!placedShipEl.length) {
          domInterface.createShipContainers(homePlayer);
          dashboardContainer.children[1].style.display = "none";
          continueBtn.disabled = true;

        } else {
          // check if all the ships are placed on the board
          // this runs when a (tablet/mobile) device is oriented horizontally
          if (placedShipEl.length === 17) {
            // this indicates that, the user clicked the random-placement button
            // when the screen was in a different orientation, so we simply remove
            // the existing ship containers since all the ships have been placed
            const shipContainers = Array.from(
              dashboardContainer.children,
            ).slice(2);
            shipContainers.forEach((container) => container.remove());
            dashboardContainer.children[1].style.display = "block";
            continueBtn.disabled = false;
          }

          dashboardContainer.style.display = "block";
        }
        // event listener to handle ship placement reset
        resetBtn.addEventListener("click", resetHandler);
        // loop until all ships have been placed
        while (!isAllPlaced) {
          // check if the ship count is less than 5
          // if true, it enables the reset button
          resetBtn.disabled = !(
            Array.from(dashboardContainer.children).slice(2).length < 5
          );

          // try placing the ship on the board via drag and drop
          try {
            await shipDomInterface.#delegateShipDrop(homePlayer, homeDomBoard);
            isAllPlaced = !Array.from(dashboardContainer.children).slice(2)
              .length;
          } catch (err) {
            return err;
          }
        }
        // disable and remove the event listener to prevent
        // side effects in a 2-player game and to prevent resetting
        // after all ships have been placed
        resetBtn.disabled = true;
        continueBtn.disabled = false;
        resetBtn.removeEventListener("click", resetHandler);
      }
    }

    // initial function call to check if the width matches the mql media string
    shipPlacementObserver(mql);
    // attach an event listener to the mql object to track change in dimensions
    mql.addEventListener("change", shipPlacementObserver);
    return new Promise((resolve) => {
      // reolves the promise and controls shifts back to the gameLogic function
      continueBtn.onclick = () => {
        continueBtn.disabled = true;
        randomPlacementBtn.disabled = true;
        mql.removeEventListener("change", shipPlacementObserver);
        resolve("All Ships Placed!");
      };
    });
  }

  // a simple method that randomly generates coords and places ships on the given boar
  /* eslint-disable-next-line consistent-return */
  static delgateHumanPlayerPlacement(homePlayer, currShip, domBoardClass) {
    const [x, y] = Player.Player.generateRandomCoords(homePlayer);
    const directionChoice = [0, 1][Math.floor(Math.random() * [0, 1].length)];

    if (directionChoice) currShip.changeDirection();
    if (!homePlayer.gameBoard.isValidCoords(currShip, x, y)) {
      return shipDomInterface.delgateHumanPlayerPlacement(
        homePlayer,
        currShip,
        domBoardClass,
      );
    }
    homePlayer.gameBoard.placeShip(currShip, x, y);
    shipDomInterface.#markPlacedShip(domBoardClass, currShip, x, y);
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
  static #delgateAIPlacement(aiPlayer, currShip) {
    const [x, y] = Player.Player.generateRandomCoords(aiPlayer);
    const directionChoice = [0, 1][Math.floor(Math.random() * [0, 1].length)];

    if (directionChoice) currShip.changeDirection();

    if (!aiPlayer.gameBoard.isValidCoords(currShip, x, y)) {
      return shipDomInterface.#delgateAIPlacement(aiPlayer, currShip);
    }
    aiPlayer.gameBoard.placeShip(currShip, x, y);
    shipDomInterface.#markPlacedShip("player-two-board", currShip, x, y, true);
  }

  // a simple method that places all AI's ships
  static placeAIShips(aiPlayer) {
    aiPlayer.allShips.forEach((ship) =>
      shipDomInterface.#delgateAIPlacement(aiPlayer, ship),
    );
  }

  // a simple method that attacks the enemy player's (homePlayer)
  // board by generating random [x, y] tuples
  static attackShipAI(aiPlayer, enemyPlayer, enemyDomBoard) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // generate a coord to attack, if there is an active attack, return adjacent coords
        // else, simply return a random valid coord
        const coords = aiPlayer.bot.lastHitArray.length
          ? aiPlayer.bot.attack(enemyPlayer)
          : Player.Player.generateRandomCoords(enemyPlayer);

        // destructuring the retrieved coord to use it
        const [x, y] = coords;

        // check if the generated attack is a valid one (missed or hit)
        if (enemyPlayer.gameBoard.recieveAttack(x, y)) {
          // get the value in the [x, y] position of the board
          const isShip = enemyPlayer.gameBoard.board[x][y];
          // retrieve the dom cell element
          const cell = domInterface.getCellElement(
            x,
            y,
            enemyDomBoard.className,
          );

          // check if this is the first valid ship hit
          if (!aiPlayer.bot.lastHitArray.length && isShip) {
            // then, assign this ship to the bot's algorithm
            aiPlayer.bot.lastShip = isShip;
            aiPlayer.bot.lastHitArray.push([x, y]);
          } else if (aiPlayer.bot.lastHitArray.length === 1) {
            // check if the hit was a valid second hit
            // then, set second hit to true
            if (isShip && isShip.id === aiPlayer.bot.lastShip.id) {
              aiPlayer.bot.isSecondHit = true;
              aiPlayer.bot.lastHitArray.push([x, y]);
            } else {
              // else, push it to a availableMoves array to track future hits on this ship
              aiPlayer.bot.availableMoves.push([x, y]);
            }
          } else if (aiPlayer.bot.lastHitArray.length > 1) {
            // check if a curent attack is on going (direction is known) if the attack
            // is not the same ship, push it to the availableMoves array for future tracking
            if (isShip && isShip.id !== aiPlayer.bot.lastShip.id) {
              aiPlayer.bot.availableMoves.push([x, y]);
            }
            aiPlayer.bot.lastHitArray.push([x, y]);
          }

          // highlight the dom cell depending on the attack status
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
        e.stopImmediatePropagation();
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
    const shipContainers = Array.from(dashboardContainer.children).slice(2);

    // remove the placed ships from the board and re-create the ship containers
    placedShips.forEach((ship) => ship.classList.remove("placed-ship"));
    shipContainers.forEach((container) => container.remove());

    // replace the exisiting gameboard object with a new one
    homePlayer.gameBoard = new Gameboard();
  }
}
