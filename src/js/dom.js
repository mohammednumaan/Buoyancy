const domHelper = require('./domInterface');
const Gameboard = require('./gameboard');
const Player = require('./player');

const boardContainer = document.querySelector('.board-container');
const playerOneContainer = document.querySelector('.player-one-board');
const playerTwoContainer = document.querySelector('.player-two-board');

// initialize players and boards
const playerOne = new Player(false);
const playerTwo = new Player(true);

// create initial gameboard for both the players
domHelper.createBoards(playerOneContainer);
domHelper.createBoards(playerTwoContainer);

domHelper.createShipOverview(playerOne);

export default boardContainer;
