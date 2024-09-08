const AiLogic = require("../js/logic/AiLogic");
const { Player } = require("../js/logic/player");

let bot = AiLogic();
let enemy = new Player(false, false);

beforeEach(() => {
    bot = AiLogic();
    enemy = new Player(false, false);
})

// describe("Test: Generates all possible valid adjacent coords", () => {
//     test('Tests whether coords are being generated for an attack in the middle of the board', () => {
        
//         bot.lastHitArray.push([4, 5]);
//         const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

//         let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
//         expect(adjChoices).toEqual(expect.arrayContaining([[3, 5], [5, 5], [4, 4], [4, 6]]))

//     })

//     test('Tests whether coords are being generated for an attack at [0] indexes of the board', () => {
        
//         bot.lastHitArray.push([0, 0]);
//         const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

//         let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
//         expect(adjChoices).toEqual(expect.arrayContaining([[1, 0], [0, 1]]))

//     })

//     test('Tests whether coords are being generated for an attack at [9] indexes of the board', () => {
        
//         bot.lastHitArray.push([9, 9]);
//         const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

//         let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
//         expect(adjChoices).toEqual(expect.arrayContaining([[8, 9], [9, 8]]))

//     })
// })

// describe("Test: Determines the direction of hit propoerly", () => {
//     test('Tests whether the direction is determined in the x-axis', () => {
//         bot.lastHitArray.push([4, 3])
//         bot.lastHitArray.push([3, 3])
//         let hitDirection = bot.computeHitDirection(bot.lastHitArray[bot.lastHitArray.length - 1]);
//         expect(hitDirection).toEqual("up");  

//     })

//     test('Tests whether the direction is determined in the y-axis', () => {
//         bot.lastHitArray.push([0, 0])
//         bot.lastHitArray.push([0, 1])
//         let hitDirection = bot.computeHitDirection(bot.lastHitArray[bot.lastHitArray.length - 1]);
//         expect(hitDirection).toEqual("right");  

//     })

// })


// describe("Test: Initial hit is on the end of the ships", () => {
//     test("Tests whether the bot determines the direction and attacks the ship properly", () => {
//         let ship = enemy.allShips[1];
//         enemy.gameBoard.placeShip(ship, 0, 0);
        
//         enemy.gameBoard.recieveAttack(0, 0)
//         bot.lastHitArray.push([0, 0]);
//         bot.lastShip = ship;

//         enemy.gameBoard.recieveAttack(0, 1)
//         bot.lastHitArray.push([0, 1]);

//         let [x1, y1] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x1, y1)
//         expect(bot.hitDirection).toEqual('right');

//         bot.attack(enemy)
//         expect(bot.hitDirection).toEqual(""); 
        
//     })
// })

describe("Test: Initial hit is on the middle of the ship and not on the end", () => {
    // test("Tests wheter the bot flips direction and attacks the ship properly", () => {
    //     let ship = enemy.allShips[3];
    //     enemy.gameBoard.placeShip(ship, 4, 3);
        
    //     enemy.gameBoard.recieveAttack(4, 5)
    //     bot.lastHitArray.push([4, 5]);
    //     bot.lastShip = ship;

    //     enemy.gameBoard.recieveAttack(4, 6)
    //     bot.lastHitArray.push([4, 6]);

    //     let [x1, y1] = bot.attack(enemy)
    //     enemy.gameBoard.recieveAttack(x1, y1)
    //     bot.lastHitArray.push([x1, y1])

    //     let [x2, y2] = bot.attack(enemy)
    //     enemy.gameBoard.recieveAttack(x2, y2)
    //     bot.lastHitArray.push([x2, y2])
    //     expect(x2).toEqual(4); 
    //     expect(y2).toEqual(4); 

    //     let [x3, y3] = bot.attack(enemy)
    //     enemy.gameBoard.recieveAttack(x3, y3)
    //     bot.lastHitArray.push([x3, y3])
    //     expect(x3).toEqual(4); 
    //     expect(y3).toEqual(3); 

    //     expect(ship.isSunk()).toBeTruthy();

    // })

    test("Tests whether the bot flips direction and attacks the ship properly when there are more ships as neighbours", () => {
        let shipOne = enemy.allShips[3];
        let shipTwo = enemy.allShips[2];

        enemy.gameBoard.placeShip(shipOne, 4, 4);
        enemy.gameBoard.placeShip(shipTwo, 4, 1);
        enemy.gameBoard.recieveAttack(4, 6);

        enemy.gameBoard.recieveAttack(4, 3)
        bot.lastHitArray.push([4, 3]);
        bot.lastShip = shipTwo;
        
        enemy.gameBoard.recieveAttack(4, 4)
        bot.lastHitArray.push([4, 4]);

        // 4 5
        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        expect(x1).toEqual(4); 
        expect(y1).toEqual(5); 

        // 4 6
        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        console.log(enemy.gameBoard.recieveAttack(x2, y2))
        bot.lastHitArray.push([x2, y2])
        expect(x2).toEqual(4); 
        expect(y2).toEqual(7); 

        let [x3, y3] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x3, y3)
        bot.lastHitArray.push([x3, y3])
        expect(x3).toEqual(4); 
        expect(y3).toEqual(8); 

        let [x4, y4] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x4, y4)
        bot.lastHitArray.push([x4, y4])
        expect(x4).toEqual(4); 
        expect(y4).toEqual(2); 

        let [x5, y5] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x5, y5)
        bot.lastHitArray.push([x5, y5])
        expect(x5).toEqual(4); 
        expect(y5).toEqual(1); 


        expect(shipOne.isSunk()).toBeTruthy();
        expect(shipTwo.isSunk()).toBeTruthy();

    })
})