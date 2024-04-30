class Ship{

    constructor(length){
        this.length = length;
        this.hits = 0;
    }

    static createShips(){
        return [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];
    }

    hit(){
        this.hits += 1
    }

    isSunk(){
        return this.hits === this.length;
    }
}

module.exports = Ship;

