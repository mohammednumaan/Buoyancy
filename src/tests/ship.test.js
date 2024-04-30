const Ship = require("../js/ship");

let shipOne, shipTwo;
beforeEach(() => {
     shipOne = Ship.createShips()[0];
     shipTwo = Ship.createShips()[1];
})

afterEach(() => {
    shipOne.hits, shipTwo.hits = 0
})


test('Check if Ship Object is Initialized Properly', () => {

    expect(shipOne).toHaveProperty('length', 2)
    expect(shipOne).toHaveProperty('hits', 0)

    expect(shipTwo).toHaveProperty('length', 3)
    expect(shipTwo).toHaveProperty('hits', 0)

})

test('Check if Ship Object Is Hit Properly', () => {

    shipOne.hit()
    shipOne.hit()
    shipTwo.hit()
    shipTwo.hit()

    expect(shipOne.hits).toBe(2);
    expect(shipTwo.hits).toBe(2);
})

test('Check if Ship Object is Sunk', () => {
    shipOne.hit()
    shipOne.hit()
    shipTwo.hit()
    shipTwo.hit()

    expect(shipOne.isSunk()).toBe(true);
    expect(shipTwo.isSunk()).toBe(false);
})