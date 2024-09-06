import generateShipHitCoord from "./adjacentCoords";

export default function handleSameCoords(humanPlayer){
   
        let xDiff = this.currentActiveHit[0][0] - this.currentActiveHit[1][0]
        let yDiff = this.currentActiveHit[0][1] - this.currentActiveHit[1][1]
        let initialPoint = this.currentActiveHit[0];
        return generateShipHitCoord(xDiff, yDiff, initialPoint[0], initialPoint[1], humanPlayer);
    
}