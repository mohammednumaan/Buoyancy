export default function generateShipHitCoord(xDiff, yDiff, xCoord = null, yCoord = null, humanPlayer){
    let coords = [];
    if (xDiff){
        switch(xDiff){
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            coords = [xCoord + 1, yCoord]
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [xCoord - 1, yCoord]
            break
        }
      }

      else if (yDiff){
        console.log('in', yDiff, xCoord)
        switch(yDiff){
          
    
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            coords = [xCoord, yCoord + 1]
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [xCoord, yCoord - 1]
            break
        }
      }
      
      return coords;
}
