const domHelper = require("./domInterface");

class ShipDOM {
  static #generatedCoords = [];

  static #highlightShips(event, homePlayer, currentShip, forPlacement = false) {
    const [xCoord, yCoord] = domHelper.parseCoords(
      event.target.dataset.x,
      event.target.dataset.y,
    );
    const isValid = homePlayer.gameBoard.isValidCoords(
      currentShip,
      xCoord,
      yCoord,
    );

    for (let i = 0; i < currentShip.length; i += 1) {
      const cell = !currentShip.vertical
        ? domHelper.getCellElement(
            xCoord,
            yCoord + i,
            event.currentTarget.className,
          )
        : domHelper.getCellElement(
            xCoord + i,
            yCoord,
            event.currentTarget.className,
          );

      if (!cell) return;

      cell.classList.add(isValid ? "valid" : "invalid");
      if (forPlacement) cell.classList.add("placed-ship");
    }
  }

  static #clearHighlightShips() {
    const highlightedElements = document.querySelectorAll(".valid, .invalid");
    highlightedElements.forEach((element) =>
      element.classList.remove("valid", "invalid"),
    );
  }

  static #delegateShipPlacement(homeDomBoard, homePlayer, currentShip) {
    return new Promise((resolve, reject) => {
      const handleClick = (e) => {
        const [xCoord, yCoord] = domHelper.parseCoords(
          e.target.dataset.x,
          e.target.dataset.y,
        );

        if (!e.target.classList.contains("board-cell")) {
          return reject(currentShip);
        }

        if (homePlayer.gameBoard.isValidCoords(currentShip, xCoord, yCoord)) {
          homePlayer.gameBoard.placeShip(currentShip, xCoord, yCoord);
          console.log(homeDomBoard.className);
          ShipDOM.#markPlacedShip(
            homeDomBoard.className,
            currentShip,
            xCoord,
            yCoord,
          );

          resolve(currentShip);
        }

        return reject(currentShip);
      };

      homeDomBoard.addEventListener("click", handleClick, { once: true });
    });
  }

  static async placeShips(currentShip, player, playerBoardContainer) {
    const abortController = new AbortController();
    const { signal } = abortController;

    const highlightShips = (e) =>
      ShipDOM.#highlightShips(e, player, currentShip);
    const clearHighlight = () => ShipDOM.#clearHighlightShips(player.gameBoard);

    playerBoardContainer.addEventListener("mouseover", highlightShips, {
      signal,
    });
    playerBoardContainer.addEventListener("mouseout", clearHighlight, {
      signal,
    });

    try {
      await ShipDOM.#delegateShipPlacement(
        playerBoardContainer,
        player,
        currentShip,
      );
    } catch (err) {
      await ShipDOM.placeShips(currentShip, player, playerBoardContainer);
    }
    abortController.abort();
  }

  static #attackedShipClass(cell) {
    cell.classList.add(
      cell.classList.contains("placed-ship")
        ? "attacked-ship"
        : "missed-attack",
    );
  }

  static #markPlacedShip(domBoardClass, currentShip, x, y, isAi = false) {
    for (let i = 0; i < currentShip.length; i += 1) {
      const cell = !currentShip.vertical
        ? domHelper.getCellElement(x, y + i, domBoardClass)
        : domHelper.getCellElement(x + i, y, domBoardClass);

      if (!cell) return;

      cell.classList.add("placed-ship");
      if (isAi) cell.style.backgroundColor = "black";
    }
  }

  static #delegateShipAttack(enemyDomBoard, enemyPlayer) {
    return new Promise((resolve, reject) => {
      const handleClick = (e) => {
        const [xCoord, yCoord] = domHelper.parseCoords(
          e.target.dataset.x,
          e.target.dataset.y,
        );

        if (!e.target.classList.contains("board-cell")) {
          return reject(e);
        }

        if (enemyPlayer.gameBoard.recieveAttack(xCoord, yCoord)) {
          ShipDOM.#attackedShipClass(e.target);
          resolve(e);
        }

        return reject(e);
      };
      enemyDomBoard.addEventListener("click", handleClick, { once: true });
    });
  }

  static async attackShip(enemyDomBoard, enemyPlayer) {
    try {
      await ShipDOM.#delegateShipAttack(enemyDomBoard, enemyPlayer);
    } catch (err) {
      await ShipDOM.attackShip(enemyDomBoard, enemyPlayer);
    }
  }

  static #generateRandomCoords() {
    const coordsArr = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    !ShipDOM.#generatedCoords.includes(coordsArr)
      ? ShipDOM.#generatedCoords.push(coordsArr)
      : ShipDOM.#generateRandomCoords();
    return coordsArr;
  }

  static #delgateAIPlacement(currShip, enemyPlayer) {
    const [x, y] = ShipDOM.#generateRandomCoords();

    if (!enemyPlayer.gameBoard.isValidCoords(currShip, x, y)) {
      return ShipDOM.#delgateAIPlacement(currShip, enemyPlayer);
    }
    enemyPlayer.gameBoard.placeShip(currShip, x, y);
    ShipDOM.#markPlacedShip("player-two-board", currShip, x, y, true);
  }

  static placeAIShips(enemyPlayer) {
    enemyPlayer.allShips.forEach((ship) =>
      ShipDOM.#delgateAIPlacement(ship, enemyPlayer),
    );
  }

  static attackShipAI(enemyPlayer, enemyDomBoard) {
    const [x, y] = ShipDOM.#generateRandomCoords();
    if (enemyPlayer.gameBoard.recieveAttack(x, y)) {
      const cell = domHelper.getCellElement(x, y, enemyDomBoard.className);
      ShipDOM.#attackedShipClass(cell);
    } else {
      ShipDOM.attackShipAI(enemyPlayer, enemyDomBoard);
    }
  }

  static async placeShipsDrop(homePlayer, homeDomBoard) {
    domHelper.createShipContainers(homePlayer);
    let isAllPlaced = false;
    const dashboard = document.querySelector(".dashboard-container");

    while (!isAllPlaced) {
      try {
        await ShipDOM.#delegateShipDrop(homePlayer, homeDomBoard);
        isAllPlaced = !Array.from(dashboard.children).slice(1).length;
      } catch (err) {
        console.log(err);
      }
    }

    return Promise.resolve();
  }

  static async #delegateShipDrop(homePlayer, homeDomBoard) {
    return new Promise((resolve, reject) => {
      const dropHandler = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/my-app");

        const shipContainer = document.getElementById(data);
        const shipCell = [...shipContainer.children];

        if (!e.target.classList.contains("board-cell")) return;
        const [x, y] = domHelper.getCellCoords(e.target);

        const obj = {
          length: data === "33" ? 3 : Number(data),
          vertical: false,
        };
        if (!homePlayer.gameBoard.isValidCoords(obj, x, y)) return;

        for (let j = 0; j < Number(data === "33" ? "3" : data); j++) {
          const cell = domHelper.getCellElement(
            x,
            y + j,
            e.currentTarget.className,
          );
          shipCell[j].dataset.x = x;
          shipCell[j].dataset.y = y + j;
          cell.replaceWith(shipCell[j]);
        }
        shipContainer.remove();
        homePlayer.gameBoard.placeShip(
          homePlayer.allShips[Number(shipContainer.dataset.index)],
          x,
          y,
        );
        ShipDOM.#markPlacedShip(homeDomBoard.className, obj, x, y);
        homeDomBoard.removeEventListener("dragover", ShipDOM.#dragoverHandler);
        homeDomBoard.removeEventListener("drop", dropHandler);

        return resolve(e);
      };
      homeDomBoard.addEventListener("dragover", ShipDOM.#dragoverHandler);
      homeDomBoard.addEventListener("drop", dropHandler);
    });
  }

  static #dragoverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // static #dropHandler(e, homePlayer) {
  //   e.preventDefault();
  //   let data = e.dataTransfer.getData("application/my-app");
  //   let index = e.dataTransfer.getData("application/index");
  //   const shipCell = [...document.getElementById(data).children];
  //   const shipContainer = document.getElementById(data);

  //   if (!e.target.classList.contains("board-cell")) return;
  //   const [x, y] = domHelper.getCellCoords(e.target);

  //   const obj = { length: data === "33" ? 3 : Number(data), vertical: false };
  //   if (!homePlayer.gameBoard.isValidCoords(obj, x, y)) return;

  //   for (let j = 0; j < Number(data === "33" ? "3" : data); j++) {
  //     const cell = domHelper.getCellElement(
  //       x,
  //       y + j,
  //       e.currentTarget.className,
  //     );
  //     shipCell[j].dataset.x = x;
  //     shipCell[j].dataset.y = y + j;
  //     cell.replaceWith(shipCell[j]);

  //   }
  //   shipContainer.remove()
  //   homePlayer.gameBoard.placeShip(homePlayer.allShips[Number(index)], x, y);
  // }
}

module.exports = ShipDOM;
