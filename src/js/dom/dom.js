import ShipDOM, { attackShipAI } from './shipDOM';

const domHelper = require('./domInterface');
const Gameboard = require('../gameboard');
const Player = require('../player');

const boardContainer = document.querySelector('.board-container');
const playerOneDiv = document.querySelector('.player-one')
const playerTwoDiv = document.querySelector('.player-two')

const playerOneContainer = document.querySelector('.player-one-board');
const playerTwoContainer = document.querySelector('.player-two-board');


const gameLogic = async (isAi) => {

    const playerOne = new Player(false, true);
    const playerTwo = new Player(isAi, false);
    let isGameOver = false;
    
    domHelper.createBoards(playerOneContainer);
    await ShipDOM.placeShips(playerOne, playerOneContainer);
    
    
    if (!isAi){
        
        await domHelper.createTimeoutScreen()
        playerOneDiv.style.display = 'none'
        playerTwoDiv.style.display = 'block'
        
        domHelper.createBoards(playerTwoContainer)
        await ShipDOM.placeShips(playerTwo, playerTwoContainer);
        await domHelper.createTimeoutScreen() 

        playerOneDiv.style.display = 'block'
        domHelper.renderBoards(playerOneContainer, playerTwoContainer)

        await (async () =>{
                
            while(true){
                console.log('h')
                if (playerOne.gameBoard.allShipSunk(playerOne.allShips) || playerTwo.gameBoard.allShipSunk(playerTwo.allShips)){
                    isGameOver = true
                    break
                }
                
                if (playerOne.turn){
                    await ShipDOM.attackShip(playerTwoContainer, playerTwo)
                    domHelper.updateBoardCells(playerOneContainer.childNodes, playerTwoContainer.childNodes)

                    await domHelper.createTimeoutScreen()
                    domHelper.renderBoards(playerTwoContainer, playerOneContainer)
                    playerOne.changeTurn(playerTwo);
                    
                }
                
                else{
                    await ShipDOM.attackShip(playerOneContainer, playerOne)
                    domHelper.updateBoardCells(playerTwoContainer.childNodes, playerOneContainer.childNodes)

                    await domHelper.createTimeoutScreen()                    
                    domHelper.renderBoards(playerOneContainer, playerTwoContainer)
                    playerTwo.changeTurn(playerOne);
                }  
                
            }
            
        })(); 
    }

    else{
        domHelper.createBoards(playerTwoContainer)
        ShipDOM.placeAIShips(playerTwo)

        playerTwoDiv.style.display = 'block'
        domHelper.renderBoards(playerOneContainer, playerTwoContainer)

        

        await (async () => {
            while(true){

                if (playerOne.gameBoard.allShipSunk(playerOne.allShips) || playerTwo.gameBoard.allShipSunk(playerTwo.allShips)){
                    isGameOver = true
                    break
                }

                if (playerOne.turn){
                    await ShipDOM.attackShip(playerTwoContainer, playerTwo)
                    playerOne.changeTurn(playerTwo);
                    
                }

                else{
                    
                    ShipDOM.attackShipAI(playerOne, playerOneContainer)
                    playerTwo.changeTurn(playerOne)
                }
                domHelper.updateBoardCells(playerOneContainer.childNodes, playerTwoContainer.childNodes)
                
            }

        })()

    }
    
}



export default gameLogic;   
