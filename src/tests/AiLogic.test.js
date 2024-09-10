const AiLogic = require("../js/logic/AiLogic");
const { Player } = require("../js/logic/player");

let bot = AiLogic();
let enemy = new Player(false, false);

beforeEach(() => {
    bot = AiLogic();
    enemy = new Player(false, true);
})

describe("Test: Generates all possible valid adjacent coords", () => {
    test('Tests whether valid coords are being generated for an attack in the middle of the board', () => {
        
        bot.lastHitArray.push([4, 5]);
        const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

        let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
        expect(adjChoices).toEqual(expect.arrayContaining([[3, 5], [5, 5], [4, 4], [4, 6]]))

    })

    test('Tests whether valid coords are being generated for an attack near an invalid index (near 0) of the board', () => {
        
        bot.lastHitArray.push([0, 0]);
        const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

        let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
        expect(adjChoices).toEqual(expect.arrayContaining([[1, 0], [0, 1]]))

    })

    test('Tests whether coords are being generated for an attack near an invalid index (near 9) of the board', () => {
        
        bot.lastHitArray.push([9, 9]);
        const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

        let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
        expect(adjChoices).toEqual(expect.arrayContaining([[8, 9], [9, 8]]))

    })
})

describe("Test: Determines the direction of hit propoerly", () => {
    test('Tests whether the direction is determined in the x-axis', () => {
        bot.lastHitArray.push([4, 3])
        bot.lastHitArray.push([3, 3])
        let hitDirection = bot.computeHitDirection(bot.lastHitArray[bot.lastHitArray.length - 1]);
        expect(hitDirection).toEqual("up");  

    })

    test('Tests whether the direction is determined in the y-axis', () => {
        bot.lastHitArray.push([0, 0])
        bot.lastHitArray.push([0, 1])
        let hitDirection = bot.computeHitDirection(bot.lastHitArray[bot.lastHitArray.length - 1]);
        expect(hitDirection).toEqual("right");  

    })

})


describe("Test: Initial hit is on the end of the ships", () => {
    test("Tests whether the bot determines the direction and attacks the ship properly", () => {
        let ship = enemy.allShips[1];
        enemy.gameBoard.placeShip(ship, 0, 0);
        
        enemy.gameBoard.recieveAttack(0, 0)
        bot.lastHitArray.push([0, 0]);
        bot.lastShip = ship;

        enemy.gameBoard.recieveAttack(0, 1)
        bot.lastHitArray.push([0, 1]);

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        console.log(x1, y1)
        expect(bot.hitDirection).toEqual('right');

        bot.attack(enemy)
        expect(bot.hitDirection).toEqual(""); 
        
    })
})

describe("Test: Initial hit is not on the ends of the ship", () => {
    test("Tests whether the bot flips direction and attacks the ship properly", () => {
        let ship = enemy.allShips[3];
        enemy.gameBoard.placeShip(ship, 4, 3);
        
        enemy.gameBoard.recieveAttack(4, 5)
        bot.lastHitArray.push([4, 5]);
        bot.lastShip = ship;

        enemy.gameBoard.recieveAttack(4, 6)
        bot.lastHitArray.push([4, 6]);

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        expect(x1).toEqual(4); 
        expect(y1).toEqual(7); 

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2])
        expect(x2).toEqual(4); 
        expect(y2).toEqual(4); 


        let [x3, y3] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x3, y3)
        bot.lastHitArray.push([x3, y3])
        expect(x3).toEqual(4); 
        expect(y3).toEqual(3); 

        expect(ship.isSunk()).toBeTruthy();

    })

    test("Tests whether the bot generates an proper adjacent coord when it encounters an already hit square", () => {
        let ship = enemy.allShips[3]; //4

        enemy.gameBoard.placeShip(ship, 4, 4);
        enemy.gameBoard.recieveAttack(4, 6);

        enemy.gameBoard.recieveAttack(4, 4)
        bot.lastHitArray.push([4, 4]);
        bot.lastShip = ship;
        
        enemy.gameBoard.recieveAttack(4, 3)
        bot.lastHitArray.push([4, 3]);

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        expect(x1).toEqual(4); 
        expect(y1).toEqual(5); 

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2])
        expect(x2).toEqual(4); 
        expect(y2).toEqual(7); 

        expect(ship.isSunk()).toBeTruthy();
    })
})

// describe("Test: Tests whether the bot properly generates adjacent coords when there are 1 or more ships near it", () => {
//     test("Tests whether the bot properly generates a coord when it encounters an already hit square", () => {
//         let shipOne = enemy.allShips[2];
//         let shipTwo = enemy.allShips[3];

//         enemy.gameBoard.placeShip(shipOne, 3, 4);
//         enemy.gameBoard.placeShip(shipTwo, 4, 4);

//         enemy.gameBoard.recieveAttack(3, 4)
//         bot.lastHitArray.push([3, 4])
//         bot.lastShip = shipOne

//         enemy.gameBoard.recieveAttack(4, 4)
//         bot.lastHitArray.push([4, 4])

//         let [x1, y1] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x1, y1)
//         bot.lastHitArray.push([x1, y1])
//         expect(x1).toEqual(2); 
//         expect(y1).toEqual(4); 

//         let [x2, y2] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x2, y2)
//         bot.lastHitArray.push([x2, y2])
//         expect(x2).toEqual(5); 
//         expect(y2).toEqual(4);
        
        

//         let [x3, y3] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x3, y3)
//         bot.lastHitArray.push([x3, y3])
//         expect([[3, 3], [3, 5]]).toEqual(expect.arrayContaining([[x3, y3]]))
        
//         if (x3 === 3 && y3 === 5){
//             let [x4, y4] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x4, y4)
//             bot.lastHitArray.push([x4, y4])
//             expect(shipOne.isSunk()).toBeTruthy()
//         }
//         else{
//             let [x4, y4] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x4, y4)
//             bot.lastHitArray.push([x4, y4])
//             let [x5, y5] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x5, y5)
//             bot.lastHitArray.push([x5, y5])
//             expect(shipOne.isSunk()).toBeTruthy()

//         }
                
//     })

//     test("Tests proper attack when multiple ships are present in its neighbouring cells", () => {
//         let shipOne = enemy.allShips[3]
//         let shipTwo = enemy.allShips[2]
//         let shipThree = enemy.allShips[4]

//         shipTwo.changeDirection();
//         enemy.gameBoard.placeShip(shipOne, 9, 5)
//         enemy.gameBoard.placeShip(shipTwo, 7, 4)
//         enemy.gameBoard.placeShip(shipThree, 8, 5)

//         enemy.gameBoard.recieveAttack(8, 4)
//         bot.lastHitArray.push([8, 4])
//         bot.lastShip = shipTwo


//         enemy.gameBoard.recieveAttack(8, 5)
//         bot.lastHitArray.push([8, 5])

//         let [x1, y1] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x1, y1)
//         bot.lastHitArray.push([x1, y1])
//         expect(x1).toEqual(8); 
//         expect(y1).toEqual(3);
        
//         let [x2, y2] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x2, y2)
//         bot.lastHitArray.push([x2, y2])
        
//         expect(x2).toEqual(8); 
//         expect(y2).toEqual(6);

//         let [x3, y3] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x3, y3)
//         bot.lastHitArray.push([x3, y3])

//         let [x4, y4] = bot.attack(enemy)
//         enemy.gameBoard.recieveAttack(x4, y4)
//         bot.lastHitArray.push([x4, y4])

//         if (x4 === 9 && y4 === 4){
//             let [x5, y5] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x5, y5)
//             bot.lastHitArray.push([x5, y5])
            
//             let [x6, y6] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x6, y6)
//             bot.lastHitArray.push([x6, y6])
//             expect(shipTwo.isSunk()).toBeTruthy();

//         } 

//         else{
//             let [x5, y5] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x5, y5)
//             bot.lastHitArray.push([x5, y5])
            
//             let [x6, y6] = bot.attack(enemy)
//             enemy.gameBoard.recieveAttack(x6, y6)
//             bot.lastHitArray.push([x6, y6])
//             expect(shipTwo.isSunk()).toBeTruthy();

//         }
//     })
// })
