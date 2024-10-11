// imports
const Player = require("../js/logic/player");

// initialize player objects
const playerOne = new Player.Player(true);
const playerTwo = new Player.AiPlayer(false, true);

// TEST: Proper initialization of player objects
test("Test: Player's are initialized properly", () => {
  expect(playerOne.isAi).toBe(false);
  expect(playerTwo.isAi).toBe(true);
});

// TEST: Proper functioning of the changeTurn method
test("Test: Player's turns are changed properly", () => {
  playerOne.changeTurn(playerTwo);
  expect(playerOne.turn).toBe(false);
  expect(playerTwo.turn).toBe(true);
});
