const playersContainer = document.getElementById("players");
const searchInput = document.getElementById("search");
const countElement = document.getElementById("count");

let players = [];

async function loadPlayers() {
  try {
    const response = await fetch("/api/players", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    players = await response.json();
    displayPlayers();
  } catch (error) {
    console.error(error);
    playersContainer.innerHTML =
      '<p class="error">Impossible de charger les joueurs.</p>';
    countElement.textContent = "Erreur";
  }
}

function displayPlayers() {
  const search = searchInput.value.toLowerCase().trim();

  const filteredPlayers = players.filter((player) => {
    return (
      player.username.toLowerCase().includes(search) ||
      player.display_name.toLowerCase().includes(search) ||
      String(player.user_id).includes(search)
    );
  });

  countElement.textContent =
    `${filteredPlayers.length} joueur(s) en ligne`;

  playersContainer.innerHTML = "";

  if (filteredPlayers.length === 0) {
    playersContainer.innerHTML =
      '<p class="empty">Aucun joueur trouvé.</p>';
    return;
  }

  filteredPlayers.forEach((player) => {
    const element = document.createElement("article");
    element.className = "player";

    element.innerHTML = `
      <h2>${escapeHtml(player.display_name)}</h2>
      <p><strong>Username :</strong> ${escapeHtml(player.username)}</p>
      <p><strong>ID Roblox :</strong> ${player.user_id}</p>
      <p><strong>Place ID :</strong> ${player.place_id}</p>
      <p class="online">🟢 En ligne</p>
    `;

    playersContainer.appendChild(element);
  });
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

searchInput.addEventListener("input", displayPlayers);

loadPlayers();

// Actualisation toutes les 5 secondes.
setInterval(loadPlayers, 5000);
