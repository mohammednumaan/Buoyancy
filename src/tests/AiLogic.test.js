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
        let ship = enemy.allShips[4];
        enemy.gameBoard.placeShip(ship, 0, 0);
        
        enemy.gameBoard.recieveAttack(0, 0)
        bot.lastHitArray.push([0, 0]);
        bot.lastShip = ship;

        enemy.gameBoard.recieveAttack(0, 1)
        bot.lastHitArray.push([0, 1]);
        bot.isSecondHit = true;

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1]);

        expect(bot.hitDirection).toEqual('right');
        console.log(x1, y1)

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2]);


        let [x3, y3] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x3, y3)
        bot.lastHitArray.push([x3, y3]);


        let [x4, y4] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x4, y4)
        bot.lastHitArray.push([x4, y4]);

        expect(ship.isSunk()).toBeTruthy()
        
    })

    test("Tests whether the bot determines the direction and attacks the ship properly when the ship is placed near the boundary", () => {
        let ship = enemy.allShips[3];
        enemy.gameBoard.placeShip(ship, 0, 0);
        
        enemy.gameBoard.recieveAttack(0, 2)
        bot.lastHitArray.push([0, 2]);
        bot.lastShip = ship;


        enemy.gameBoard.recieveAttack(0, 1)
        bot.lastHitArray.push([0, 1]);
        bot.isSecondHit = true

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1]);
        expect(x1).toEqual(0)
        expect(y1).toEqual(0)

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2]);
        expect(x2).toEqual(0)
        expect(y2).toEqual(3)
        expect(ship.isSunk()).toBeTruthy(); 
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
        bot.isSecondHit = true;

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
        let ship = enemy.allShips[3]; //44 45 46 47

        enemy.gameBoard.placeShip(ship, 4, 4);

        enemy.gameBoard.recieveAttack(4, 6);
        bot.availableMoves.push([4, 6])
        
        enemy.gameBoard.recieveAttack(4, 4);
        bot.lastHitArray.push([4, 4]);
        bot.lastShip = ship;
        
        enemy.gameBoard.recieveAttack(4, 5)
        bot.lastHitArray.push([4, 5]);   
        bot.isSecondHit = true

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        expect(x1).toEqual(4); 
        expect(y1).toEqual(3); 

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2])
        console.log(x2, y2)
        expect(x2).toEqual(4); 
        expect(y2).toEqual(7); 

        expect(ship.isSunk()).toBeTruthy();
    })

    test("Tests whether the bot generates a valid adjacent coord when its initial attack has no adjacent choices but a part of the ship has been attacked before", () => {
        let ship = enemy.allShips[4];
        enemy.gameBoard.placeShip(ship, 5, 4);

        enemy.gameBoard.recieveAttack(5, 6)
        bot.availableMoves.push([5, 5])
        // enemy.gameBoard.recieveAttack(5, 7)
        // bot.availableMoves.push([5, 7])

        enemy.gameBoard.recieveAttack(5, 7)
        bot.lastHitArray.push([5, 7]);
        bot.lastShip = ship;

        enemy.gameBoard.recieveAttack(5, 8)
        bot.lastHitArray.push([5, 8]);
        bot.isSecondHit = true

        const [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1]);
        console.log(x1, y1, 'I------------')
        expect(x1).toEqual(5)
        expect(y1).toEqual(9)

        const [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2]);
        bot.isSecondHit = true
        expect(x2).toEqual(5)
        expect(y2).toEqual(5)

        const [x3, y3] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x3, y3)
        bot.lastHitArray.push([x3, y3]);
        bot.isSecondHit = true
        expect(x3).toEqual(5)
        expect(y3).toEqual(4)
        expect(ship.isSunk()).toBeTruthy();
        

    })

    test("Test whether the bot generates valid coords when it encounters an attack near the boundary", () => {
        let ship = enemy.allShips[4];
        enemy.gameBoard.placeShip(ship, 0, 0);

        enemy.gameBoard.recieveAttack(0, 1)
        bot.availableMoves.push([0, 1])
        
        enemy.gameBoard.recieveAttack(1, 0)

        // enemy.gameBoard.recieveAttack(5, 7)
        // bot.availableMoves.push([5, 7])

        enemy.gameBoard.recieveAttack(0, 0)
        bot.lastHitArray.push([0, 0]);
        bot.lastShip = ship;
        const [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1]);
        expect(x1).toEqual(0)
        expect(y1).toEqual(2)



    })
})

describe("Test: Tests whether the bot properly generates adjacent coords when there are nearby ships", () => {   

    test("Tests proper attack when multiple ships are present in its neighbouring cells", () => {
        let shipOne = enemy.allShips[3]
        let shipTwo = enemy.allShips[2]
        let shipThree = enemy.allShips[4]

        shipTwo.changeDirection();
        enemy.gameBoard.placeShip(shipOne, 9, 5)
        enemy.gameBoard.placeShip(shipTwo, 7, 4)
        enemy.gameBoard.placeShip(shipThree, 8, 5)

        enemy.gameBoard.recieveAttack(8, 4)
        bot.lastHitArray.push([8, 4])
        bot.lastShip = shipTwo

        enemy.gameBoard.recieveAttack(8, 5)
        bot.lastHitArray.push([8, 5])

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        expect([[7, 4], [9, 4]]).toEqual(expect.arrayContaining([[x1, y1]]))

        
        if (x1 === 7 && y1 === 4){
            bot.isSecondHit = true
            let [x3, y3] = bot.attack(enemy)
            enemy.gameBoard.recieveAttack(x3, y3)
            bot.lastHitArray.push([x3, y3])

            let [x5, y5] = bot.attack(enemy)
            enemy.gameBoard.recieveAttack(x5, y5)
            bot.lastHitArray.push([x5, y5])
            expect([[9, 4]]).toEqual(expect.arrayContaining([[x5, y5]]))
            expect(shipTwo.isSunk()).toBeTruthy();  
        }

        if (x1 === 9 && y1 === 4){
            console.log('SECONNN')
            bot.isSecondHit = true
            let [x3, y3] = bot.attack(enemy)
            enemy.gameBoard.recieveAttack(x3, y3)
            bot.lastHitArray.push([x3, y3])
            expect(shipTwo.isSunk()).toBeTruthy();  
        }
        
    })
    test("Test whether the direction is flipped when encountering a different ship hit", () => {
        let shipOne = enemy.allShips[3]
        let shipTwo = enemy.allShips[2]

        shipTwo.changeDirection();
        enemy.gameBoard.placeShip(shipOne, 5, 5)
        enemy.gameBoard.placeShip(shipTwo, 4, 9)

        enemy.gameBoard.recieveAttack(4, 9)
        enemy.gameBoard.recieveAttack(5, 9)
        enemy.gameBoard.recieveAttack(6, 9)
        expect(shipTwo.isSunk()).toBeTruthy();

        enemy.gameBoard.recieveAttack(5, 7)
        bot.lastHitArray.push([5, 7])
        bot.lastShip = shipOne

        enemy.gameBoard.recieveAttack(5, 8)
        bot.lastHitArray.push([5, 8])
        bot.isSecondHit = true;
        

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        bot.lastHitArray.push([x1, y1])
        console.log('YOOOO', x1, y1)

        let [x2, y2] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x2, y2)
        bot.lastHitArray.push([x2, y2])

        expect(shipOne.isSunk()).toBeTruthy()

    })
})
