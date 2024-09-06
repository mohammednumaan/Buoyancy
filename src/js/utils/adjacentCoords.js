export default function generateShipHitCoord(xDiff, yDiff, xCoord = null, yCoord = null, humanPlayer){
    let coords = [];
    if (xDiff){
        switch(xDiff){
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            coords = [xCoord + 1, yCoord]
            if (humanPlayer.gameBoard.boardClone[coords[0]][coords[1]] === true){
              coords = [xCoord + 2, yCoord]
            }
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [xCoord - 1, yCoord]
            if (humanPlayer.gameBoard.boardClone[coords[0]][coords[1]] === true){
              coords = [xCoord - 2, yCoord]
            }
            break
        }
      }

      else if (yDiff){
        switch(yDiff){
          
    
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            coords = [xCoord, yCoord + 1]
            if (humanPlayer.gameBoard.boardClone[coords[0]][coords[1]] === true){
              coords = [xCoord, yCoord + 2]
            }
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [xCoord, yCoord - 1]
            if (humanPlayer.gameBoard.boardClone[coords[0]][coords[1]] === true){
              coords = [xCoord, yCoord - 2]
            }
            break
        }
      }
      console.log('Diff', [xDiff, yDiff], ' Coords', coords)
      return coords;
}
