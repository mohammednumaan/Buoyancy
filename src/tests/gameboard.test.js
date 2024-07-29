const Gameboard = require('../js/gameboard');
const Ship = require('../js/ship');

let gameBoard;
let allShips;
let shipOne;
let shipTwo;

beforeEach(() => {
  gameBoard = new Gameboard();
  allShips = Ship.createShips();

  shipOne = allShips[0]; // eslint-disable-line prefer-destructuring
  shipTwo = allShips[2]; // eslint-disable-line prefer-destructuring
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test: Valid coordinates for ship placement', () => {
  test('Check if the ship coordinates are valid in the horizontal direction', () => {
    expect(gameBoard.isValidCoords(shipOne, 0, 0)).toBe(true);
    expect(gameBoard.isValidCoords(shipTwo, 0, 8)).toBe(false);
  });

  test('Check if ships coordinates are valid in the vertical direction', () => {
    shipOne.changeDirection();
    shipTwo.changeDirection();
    expect(gameBoard.isValidCoords(shipOne, 0, 0)).toBe(true);
    expect(gameBoard.isValidCoords(shipTwo, 8, 4)).toBe(false);
  });
});

describe('Test: Placement of Ships on the Gameboard', () => {
  test('Check if ship placement is valid in the horizontal direction', () => {
    const isValidFunc = jest.spyOn(gameBoard, 'isValidCoords');
    expect(gameBoard.placeShip(shipOne, 0, 0)).toBe(true);
    expect(gameBoard.placeShip(shipTwo, 0, 8)).toBe(false);

    expect(isValidFunc).toHaveBeenCalled();
    expect(isValidFunc).toHaveBeenCalled();
  });

  test('Check if ship placement is valid in the vertical direction', () => {
    shipOne.changeDirection();
    shipTwo.changeDirection();
    expect(gameBoard.placeShip(shipOne, 0, 0)).toBe(true);
    expect(gameBoard.placeShip(shipTwo, 8, 4)).toBe(false);
  });

  test('Check if a ship attempting to overlap a ship is a valid placement', () => {
    gameBoard.placeShip(shipOne, 0, 0);
    expect(gameBoard.placeShip(shipTwo, 0, 1)).toBe(false);

    shipOne.changeDirection();
    gameBoard.placeShip(shipOne, 2, 4);
    expect(gameBoard.placeShip(shipTwo, 2, 2)).toBe(false);
  });
});

describe('Test: Attack Ships on the Gameboard', () => {
  test('Check if ships recieve attack', () => {
    const spyHitFunc = jest.spyOn(shipOne, 'hit');
    gameBoard.placeShip(shipOne, 0, 0);

    expect(gameBoard.recieveAttack(0, 1)).toBe(true);
    expect(spyHitFunc).toHaveBeenCalled();
  });

  test('Check whether the attack has missed.', () => {
    const spyHitFunc = jest.spyOn(shipTwo, 'hit');
    gameBoard.placeShip(shipTwo, 5, 6);
    expect(gameBoard.recieveAttack(2, 3));
    expect(spyHitFunc).toHaveBeenCalledTimes(0);
  });
});

describe('Test: All ships are sunk', () => {
  test('Return false if all ships are not sunk', () => {
    gameBoard.placeShip(shipOne, 0, 0);
    gameBoard.placeShip(shipTwo, 4, 0);

    gameBoard.recieveAttack(0, 0);
    gameBoard.recieveAttack(0, 1);

    expect(Gameboard.allShipSunk([shipOne, shipTwo])).toBe(false);
  });

  test('Return true if all ships are sunk', () => {
    gameBoard.placeShip(shipOne, 0, 0);
    gameBoard.placeShip(shipTwo, 4, 0);

    gameBoard.recieveAttack(0, 0);
    gameBoard.recieveAttack(0, 1);

    gameBoard.recieveAttack(4, 0);
    gameBoard.recieveAttack(4, 1);
    gameBoard.recieveAttack(4, 2);

    expect(Gameboard.allShipSunk([shipOne, shipTwo])).toBe(true);
  });
});
