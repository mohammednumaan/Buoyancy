const Ship = require('../js/ship');

let shipOne;
let shipTwo;
beforeEach(() => {
  [shipOne, shipTwo] = Ship.createShips();
});

afterEach(() => {
  shipOne.hits = 0;
  shipTwo.hits = 0;
});

test('Check if Ship Object is Initialized Properly', () => {
  expect(shipOne).toHaveProperty('length', 2);
  expect(shipOne).toHaveProperty('hits', 0);
  expect(shipOne).toHaveProperty('vertical', false);

  expect(shipTwo).toHaveProperty('length', 3);
  expect(shipTwo).toHaveProperty('hits', 0);
  expect(shipTwo).toHaveProperty('vertical', false);
});

test('Check if Ship Object can change direction', () => {
  shipOne.changeDirection();
  expect(shipOne.vertical).toBe(true);

  shipOne.changeDirection();
  expect(shipOne.vertical).toBe(false);
});

test('Check if Ship Object Is Hit Properly', () => {
  shipOne.hit();
  shipOne.hit();
  shipTwo.hit();
  shipTwo.hit();

  expect(shipOne.hits).toBe(2);
  expect(shipTwo.hits).toBe(2);
});

test('Check if Ship Object is Sunk', () => {
  shipOne.hit();
  shipOne.hit();
  shipTwo.hit();
  shipTwo.hit();

  expect(shipOne.isSunk()).toBe(true);
  expect(shipTwo.isSunk()).toBe(false);
});
