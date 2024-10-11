// imports
const AiLogic = require("../js/logic/AiLogic");
const { Player } = require("../js/logic/player");

// initializing objects
let bot = AiLogic();
let enemy = new Player(false, false);

// helper functions to perform setup and teardown
beforeEach(() => {
  bot = AiLogic();
  enemy = new Player(false, true);
});

// TEST: Proper functioning of the computeHitDirection method (along with edge cases)
describe("Test: Generates all possible valid adjacent coords", () => {
  test("Tests whether valid coords are being generated for an attack in the middle of the board", () => {
    bot.lastHitArray.push([4, 5]);
    const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

    const adjChoices = bot.getAdjacentChoices(enemy, lastHit);
    expect(adjChoices).toEqual(
      expect.arrayContaining([
        [3, 5],
        [5, 5],
        [4, 4],
        [4, 6],
      ]),
    );
  });

  test("Tests whether valid coords are being generated for an attack near an invalid index (near 0) of the board", () => {
    bot.lastHitArray.push([0, 0]);
    const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

    const adjChoices = bot.getAdjacentChoices(enemy, lastHit);
    expect(adjChoices).toEqual(
      expect.arrayContaining([
        [1, 0],
        [0, 1],
      ]),
    );
  });

  test("Tests whether coords are being generated for an attack near an invalid index (near 9) of the board", () => {
    bot.lastHitArray.push([9, 9]);
    const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

    const adjChoices = bot.getAdjacentChoices(enemy, lastHit);
    expect(adjChoices).toEqual(
      expect.arrayContaining([
        [8, 9],
        [9, 8],
      ]),
    );
  });
});

// TEST: Proper functioning of the computeHitDirection method
describe("Test: Determines the direction of hit propoerly", () => {
  test("Tests whether the direction is determined in the x-axis", () => {
    bot.lastHitArray.push([4, 3]);
    bot.lastHitArray.push([3, 3]);
    const hitDirection = bot.computeHitDirection(
      bot.lastHitArray[bot.lastHitArray.length - 1],
    );
    expect(hitDirection).toEqual("up");
  });

  test("Tests whether the direction is determined in the y-axis", () => {
    bot.lastHitArray.push([0, 0]);
    bot.lastHitArray.push([0, 1]);
    const hitDirection = bot.computeHitDirection(
      bot.lastHitArray[bot.lastHitArray.length - 1],
    );
    expect(hitDirection).toEqual("right");
  });
});

// TEST: Tests CASE_01 - Initial hits are at the ends of the ship (along with edge cases)
describe("Test: Initial hit is on the end of the ships", () => {
  test("Tests whether the bot determines the direction and attacks the ship properly", () => {
    const ship = enemy.allShips[4];
    enemy.gameBoard.placeShip(ship, 0, 0);

    enemy.gameBoard.recieveAttack(0, 0);
    bot.lastHitArray.push([0, 0]);
    bot.lastShip = ship;

    enemy.gameBoard.recieveAttack(0, 1);
    bot.lastHitArray.push([0, 1]);
    bot.isSecondHit = true;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);

    expect(bot.hitDirection).toEqual("right");

    const [x2, y2] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x2, y2);
    bot.lastHitArray.push([x2, y2]);

    const [x3, y3] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x3, y3);
    bot.lastHitArray.push([x3, y3]);

    const [x4, y4] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x4, y4);
    bot.lastHitArray.push([x4, y4]);

    expect(ship.isSunk()).toBeTruthy();
  });

  test("Tests whether the bot determines the direction and attacks the ship properly when the ship is placed near the boundary", () => {
    const ship = enemy.allShips[3];
    enemy.gameBoard.placeShip(ship, 0, 0);

    enemy.gameBoard.recieveAttack(0, 2);
    bot.lastHitArray.push([0, 2]);
    bot.lastShip = ship;

    enemy.gameBoard.recieveAttack(0, 1);
    bot.lastHitArray.push([0, 1]);
    bot.isSecondHit = true;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect(x1).toEqual(0);
    expect(y1).toEqual(0);

    const [x2, y2] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x2, y2);
    bot.lastHitArray.push([x2, y2]);
    expect(x2).toEqual(0);
    expect(y2).toEqual(3);
    expect(ship.isSunk()).toBeTruthy();
  });
});

// TEST: Tests CASE_02 - Initial hit is not at the ends of the ship (along with edge cases)
describe("Test: Initial hit is not on the ends of the ship", () => {
  test("Tests whether the bot flips direction and attacks the ship properly", () => {
    const ship = enemy.allShips[3];
    enemy.gameBoard.placeShip(ship, 4, 3);

    enemy.gameBoard.recieveAttack(4, 5);
    bot.lastHitArray.push([4, 5]);
    bot.lastShip = ship;

    enemy.gameBoard.recieveAttack(4, 6);
    bot.lastHitArray.push([4, 6]);
    bot.isSecondHit = true;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect(x1).toEqual(4);
    expect(y1).toEqual(7);

    const [x2, y2] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x2, y2);
    bot.lastHitArray.push([x2, y2]);
    expect(x2).toEqual(4);
    expect(y2).toEqual(4);

    const [x3, y3] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x3, y3);
    bot.lastHitArray.push([x3, y3]);
    expect(x3).toEqual(4);
    expect(y3).toEqual(3);

    expect(ship.isSunk()).toBeTruthy();
  });

  test("Tests whether the bot generates an proper adjacent coord when it encounters an already hit square", () => {
    const ship = enemy.allShips[3];

    enemy.gameBoard.placeShip(ship, 4, 4);

    enemy.gameBoard.recieveAttack(4, 6);
    bot.availableMoves.push([4, 6]);

    enemy.gameBoard.recieveAttack(4, 4);
    bot.lastHitArray.push([4, 4]);
    bot.lastShip = ship;

    enemy.gameBoard.recieveAttack(4, 5);
    bot.lastHitArray.push([4, 5]);
    bot.isSecondHit = true;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect(x1).toEqual(4);
    expect(y1).toEqual(7);

    expect(ship.isSunk()).toBeTruthy();
  });

  test("Tests whether the bot sinks the ship when it encounters 2 consecutive hit squares", () => {
    const ship = enemy.allShips[4];

    enemy.gameBoard.placeShip(ship, 4, 4);

    enemy.gameBoard.recieveAttack(4, 5);
    bot.availableMoves.push([4, 5]);

    enemy.gameBoard.recieveAttack(5, 8);
    enemy.gameBoard.recieveAttack(3, 8);

    enemy.gameBoard.recieveAttack(4, 6);
    bot.availableMoves.push([4, 6]);

    enemy.gameBoard.recieveAttack(4, 8);
    bot.lastHitArray.push([4, 8]);
    bot.lastShip = ship;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect([
      [4, 9],
      [5, 8],
      [3, 8],
      [4, 7],
    ]).toEqual(expect.arrayContaining([[x1, y1]]));

    if (x1 === 4 && y1 === 9) {
      const [x2, y2] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x2, y2);
      bot.lastHitArray.push([x2, y2]);
      expect(x2).toEqual(4);
      expect(y2).toEqual(7);

      const [x3, y3] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x3, y3);
      bot.lastHitArray.push([x3, y3]);

      const [x4, y4] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x4, y4);
      bot.lastHitArray.push([x4, y4]);

      const [x5, y5] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x5, y5);
      bot.lastHitArray.push([x5, y5]);

      const [x6, y6] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x6, y6);
      bot.lastHitArray.push([x6, y6]);

      expect(ship.isSunk()).toBeTruthy();
    }
  });

  test("Tests whether the bot generates a valid adjacent coord when its initial attack has no adjacent choices but a part of the ship has been attacked before", () => {
    const ship = enemy.allShips[4];
    ship.changeDirection();
    enemy.gameBoard.placeShip(ship, 5, 4);

    enemy.gameBoard.recieveAttack(4, 4);
    enemy.gameBoard.recieveAttack(5, 3);
    enemy.gameBoard.recieveAttack(5, 5);

    enemy.gameBoard.recieveAttack(6, 4);
    bot.availableMoves.push([6, 4]);

    enemy.gameBoard.recieveAttack(5, 4);
    bot.lastHitArray.push([5, 4]);
    bot.lastShip = ship;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect(x1).toEqual(7);
    expect(y1).toEqual(4);
    bot.isSecondHit = true;

    const [x2, y2] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x2, y2);
    bot.lastHitArray.push([x2, y2]);

    const [x3, y3] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x3, y3);
    bot.lastHitArray.push([x3, y3]);

    expect(ship.isSunk()).toBeTruthy();
  });

  test("Test whether the bot generates valid coords when it encounters an attack near the boundary", () => {
    const ship = enemy.allShips[4];
    enemy.gameBoard.placeShip(ship, 0, 0);

    enemy.gameBoard.recieveAttack(0, 1);
    bot.availableMoves.push([0, 1]);

    enemy.gameBoard.recieveAttack(1, 0);

    enemy.gameBoard.recieveAttack(0, 0);
    bot.lastHitArray.push([0, 0]);
    bot.lastShip = ship;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    bot.isSecondHit = true;
    expect(x1).toEqual(0);
    expect(y1).toEqual(2);

    const [x3, y3] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x3, y3);
    bot.lastHitArray.push([x3, y3]);
    expect(x3).toEqual(0);
    expect(y3).toEqual(3);
  });
});

// TEST: Tests CASE_03 - The bot encounters a cell of the same ship
// which was already attacked (along with edge cases)
describe("Test: Tests whether the bot properly generates adjacent coords when there are nearby ships", () => {
  test("Tests proper attack when multiple ships are present in its neighbouring cells", () => {
    const shipOne = enemy.allShips[3];
    const shipTwo = enemy.allShips[2];
    const shipThree = enemy.allShips[4];

    shipTwo.changeDirection();
    enemy.gameBoard.placeShip(shipOne, 9, 5);
    enemy.gameBoard.placeShip(shipTwo, 7, 4);
    enemy.gameBoard.placeShip(shipThree, 8, 5);

    enemy.gameBoard.recieveAttack(8, 4);
    bot.lastHitArray.push([8, 4]);
    bot.lastShip = shipTwo;

    enemy.gameBoard.recieveAttack(8, 5);
    bot.lastHitArray.push([8, 5]);

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);
    expect([
      [7, 4],
      [9, 4],
    ]).toEqual(expect.arrayContaining([[x1, y1]]));

    if (x1 === 7 && y1 === 4) {
      bot.isSecondHit = true;
      const [x3, y3] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x3, y3);
      bot.lastHitArray.push([x3, y3]);

      const [x5, y5] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x5, y5);
      bot.lastHitArray.push([x5, y5]);
      expect([[9, 4]]).toEqual(expect.arrayContaining([[x5, y5]]));
      expect(shipTwo.isSunk()).toBeTruthy();
    }

    if (x1 === 9 && y1 === 4) {
      bot.isSecondHit = true;
      const [x3, y3] = bot.attack(enemy);
      enemy.gameBoard.recieveAttack(x3, y3);
      bot.lastHitArray.push([x3, y3]);
      expect(shipTwo.isSunk()).toBeTruthy();
    }
  });
  test("Test whether the direction is flipped when encountering a different ship hit", () => {
    const shipOne = enemy.allShips[3];
    const shipTwo = enemy.allShips[2];

    shipTwo.changeDirection();
    enemy.gameBoard.placeShip(shipOne, 5, 5);
    enemy.gameBoard.placeShip(shipTwo, 4, 9);

    enemy.gameBoard.recieveAttack(4, 9);
    enemy.gameBoard.recieveAttack(6, 9);

    enemy.gameBoard.recieveAttack(5, 7);
    bot.lastHitArray.push([5, 7]);
    bot.lastShip = shipOne;

    enemy.gameBoard.recieveAttack(5, 8);
    bot.lastHitArray.push([5, 8]);
    bot.isSecondHit = true;

    const [x1, y1] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x1, y1);
    bot.lastHitArray.push([x1, y1]);

    const [x2, y2] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x2, y2);
    bot.lastHitArray.push([x2, y2]);

    const [x3, y3] = bot.attack(enemy);
    enemy.gameBoard.recieveAttack(x3, y3);
    bot.lastHitArray.push([x3, y3]);
    expect(shipOne.isSunk()).toBeTruthy();
  });
});
