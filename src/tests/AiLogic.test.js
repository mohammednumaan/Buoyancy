const AiLogic = require("../js/logic/AiLogic");
const { Player } = require("../js/logic/player");

let bot = AiLogic();
let enemy = new Player(false, false);

beforeEach(() => {
    bot = AiLogic();
    enemy = new Player(false, false);
})

describe("Test: Generates all possible valid adjacent coords", () => {
    test('Tests whether coords are being generated for an attack in the middle of the board', () => {
        
        bot.lastHitArray.push([4, 5]);
        const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

        let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
        expect(adjChoices).toEqual(expect.arrayContaining([[3, 5], [5, 5], [4, 4], [4, 6]]))

    })

    test('Tests whether coords are being generated for an attack at [0] indexes of the board', () => {
        
        bot.lastHitArray.push([0, 0]);
        const lastHit = bot.lastHitArray[bot.lastHitArray.length - 1];

        let adjChoices = bot.getAdjacentChoices(enemy, lastHit);
        expect(adjChoices).toEqual(expect.arrayContaining([[1, 0], [0, 1]]))

    })

    test('Tests whether coords are being generated for an attack at [9] indexes of the board', () => {
        
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
    test("Tests whether the bot sinks the ship accurately", () => {
        let ship = enemy.allShips[1];
        enemy.gameBoard.placeShip(ship, 0, 0);
        
        enemy.gameBoard.recieveAttack(0, 0)
        bot.lastHitArray.push([0, 0]);
        bot.lastShip = ship;

        enemy.gameBoard.recieveAttack(0, 1)
        bot.lastHitArray.push([0, 1]);

        let [x1, y1] = bot.attack(enemy)
        enemy.gameBoard.recieveAttack(x1, y1)
        expect(bot.hitDirection).toEqual('right');

        bot.attack(enemy)
        expect(bot.hitDirection).toEqual(""); 
        


    })

})