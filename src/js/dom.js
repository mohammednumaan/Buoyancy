import ShipDOM from './dom/shipDOM';

const domHelper = require('./domInterface');
const Gameboard = require('./gameboard');
const Player = require('./player');

const boardContainer = document.querySelector('.board-container');
const playerOneDiv = document.querySelector('.player-one')
const playerTwoDiv = document.querySelector('.player-two')

const playerOneContainer = document.querySelector('.player-one-board');
const playerTwoContainer = document.querySelector('.player-two-board');


const gameLogic = async (isAi) => {

    const playerOne = new Player(false);
    const playerTwo = new Player(isAi);

    domHelper.createBoards(playerOneContainer);
    await ShipDOM.placeShips(playerOne, playerOneContainer);

    
    if (!isAi){
        

        playerOneDiv.style.display = 'none'
        playerTwoDiv.style.display = 'block'
        
        domHelper.createBoards(playerTwoContainer)
        await ShipDOM.placeShips(playerTwo, playerTwoContainer);
        playerOneDiv.style.display = 'block'


        playerTwoContainer.addEventListener('click', async (e) => {
            domHelper.createTimeoutScreen()
            domHelper.renderBoards(playerTwoContainer, playerOneContainer)
            
        })

        playerOneContainer.addEventListener('click', async (e) => {
            domHelper.createTimeoutScreen()
            domHelper.renderBoards(playerOneContainer, playerTwoContainer)
            
        })
    }


}



export default gameLogic;
