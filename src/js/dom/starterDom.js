// imports
import gameLogic from "../logic/gameLogic";

const playerOneDiv = document.querySelector(".player-one");

// attaches listener for game mode buttons
// to begin the game
function attachListeners(aiBtn, humanBtn) {
  aiBtn.addEventListener("click", () => {
    gameLogic(true);
    playerOneDiv.style.display = "block";
    document.querySelector(".starter-screen").remove();
  });

  humanBtn.addEventListener("click", async () => {
    gameLogic(false);
    playerOneDiv.style.display = "block";
    document.querySelector(".starter-screen").remove();
  });
}

// renders the initial game content when a client/user
// visits the site
export default function starterDOM() {
  const starterDiv = document.createElement("div");
  const starterDivContainer = document.createElement("div");
  const modesContainer = document.createElement("div");
  const footer = document.querySelector(".footer");

  const h1El = document.createElement("h1");
  const aiBtn = document.createElement("button");
  const humanBtn = document.createElement("button");

  starterDiv.className = "starter-screen";
  starterDivContainer.className = "starter-screen-container";
  modesContainer.className = "game-mode-buttons";

  h1El.textContent = "A Strategic Naval Warfare Game.";
  aiBtn.textContent = "Play with AI";
  humanBtn.textContent = "Play with Human";

  [h1El, modesContainer].forEach((el) => starterDivContainer.appendChild(el));
  [aiBtn, humanBtn].forEach((btn) => modesContainer.appendChild(btn));
  attachListeners(aiBtn, humanBtn);

  starterDiv.appendChild(starterDivContainer);
  document.body.insertBefore(starterDiv, footer);
  playerOneDiv.style.display = "none";
}
