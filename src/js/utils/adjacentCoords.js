export default function generateShipHitCoord(xDiff, yDiff, initialPoint, humanPlayer){
    let coords = [];
    if (xDiff){
        switch(xDiff){
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            
            coords = [initialPoint[0] + 1, initialPoint[1]]
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [initialPoint[0] - 1, initialPoint[1]]
            break
        }
      }

      else if (yDiff){
        console.log(yDiff, initialPoint)
        switch(yDiff){
          
    
          case 1:
            // if the diff is 1, shift the attack to the opposite side 
            coords = [initialPoint[0], initialPoint[1] + 1]
            break;
        
          case -1:
            // if the diff is -1, shift the attack to the opposite side
            coords = [initialPoint[0], initialPoint[1] - 1]
            break
        }
      }
      console.log(coords)
      return coords;
}
