import gameLogic from '../gameLogic';

const playerOneDiv = document.querySelector('.player-one');

function attachListeners(aiBtn, humanBtn) {
  aiBtn.addEventListener('click', () => {
    gameLogic(true);
    playerOneDiv.style.display = 'block';
    document.querySelector('.starter-screen').remove();
  });

  humanBtn.addEventListener('click', () => {
    gameLogic(false);
    playerOneDiv.style.display = 'block';
    document.querySelector('.starter-screen').remove();
  });
}
    
export default function starterDOM() {
  const starterDiv = document.createElement('div');
  const starterDivContainer = document.createElement('div');
  const modesContainer = document.createElement('div');

  const h1El = document.createElement('h1');
  const aiBtn = document.createElement('button');
  const humanBtn = document.createElement('button');

  starterDiv.className = 'starter-screen';
  starterDivContainer.className = 'starter-screen-container';
  modesContainer.className = 'game-mode-buttons';

  h1El.textContent = 'A Strategic Naval Warfare Game.';
  aiBtn.textContent = 'Play with AI';
  humanBtn.textContent = 'Play with Human';

  Array.from([aiBtn, humanBtn]).forEach((btn) => modesContainer.appendChild(btn));
  Array.from([h1El, modesContainer]).forEach((el) => starterDivContainer.appendChild(el));
  attachListeners(aiBtn, humanBtn);

  starterDiv.appendChild(starterDivContainer);
  document.body.appendChild(starterDiv);
  playerOneDiv.style.display = 'none';
}
