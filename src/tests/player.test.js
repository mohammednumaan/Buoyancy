const Player = require('../js/player');

const playerOne = new Player(true)
const playerTwo = new Player(false, true);

test("Test: Player's are initialized properly", () => {
    expect(playerOne.isAi).toBe(false);
    expect(playerTwo.isAi).toBe(true);
})

test("Test: Player's turns are changed properly", () => {
    playerOne.changeTurn(playerTwo)
    expect(playerOne.turn).toBe(false);
    expect(playerTwo.turn).toBe(true);
})
