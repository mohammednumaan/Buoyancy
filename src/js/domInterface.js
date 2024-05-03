class domHelper {
  static createBoards(playerBoard) {
    playerBoard.style.gridTemplateColumns = 'repeat(10, 1fr)';
    playerBoard.style.gridTemplateRows = 'repeat(10, 1fr)';

    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      playerBoard.appendChild(cell);
    }
  }

  static createShipOverview(currentPlayer) {
    const { allShips } = currentPlayer;

    const dashboardContainer = document.querySelector('.dashboard-container');

    allShips.forEach((ship) => {
      const shipContainer = document.createElement('div');
      shipContainer.className = 'ship-container';
      for (let i = 0; i < ship.length; i++) {
        const shipDiv = document.createElement('div');
        shipDiv.className = 'ship-overview';
        shipContainer.appendChild(shipDiv);
      }
      dashboardContainer.appendChild(shipContainer);
    });
  }
}

module.exports = domHelper;
