document.addEventListener("DOMContentLoaded", () => {
  const pokedexList = document.getElementById("pokedex-list");
  const tabButtons = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const searchInput = document.getElementById("search-bar");

  let unlockedPokemons = [];

  function addToPokedex(name) {
    if (!unlockedPokemons.includes(name)) {
      unlockedPokemons.push(name);
      renderPokedex(searchInput.value);
    }
  }

  function renderPokedex(filter = "") {
  pokedexList.innerHTML = "";

  pokemons.forEach(pokemon => {
    const isUnlocked = unlockedPokemons.includes(pokemon.name);
    const nameToCheck = pokemon.name.toLowerCase();

    // Si on est en recherche et que le Pokémon n’est pas débloqué, on l’ignore
    if (filter && !isUnlocked) return;

    // Si on est en recherche et que le nom ne correspond pas, on ignore
    if (!pokemon.name.toLowerCase().includes(filter.toLowerCase())) return;

    const entry = document.createElement("div");
    entry.classList.add("pokedex-entry");
    if (!isUnlocked) entry.classList.add("locked");

    const number = document.createElement("span");
    number.textContent = `#${pokemon.id}`;
    number.style.width = "40px";

    const img = document.createElement("img");
    img.src = pokemon.image;
    img.alt = pokemon.name;
    img.width = 50;

    const name = document.createElement("span");
    name.textContent = isUnlocked ? pokemon.name : "???";

    entry.appendChild(number);
    entry.appendChild(img);
    entry.appendChild(name);
    pokedexList.appendChild(entry);
  });

  // Si rien n'est affiché, on montre un message
  if (pokedexList.children.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Aucun Pokémon débloqué ne correspond à votre recherche.";
    pokedexList.appendChild(msg);
  }
}


  searchInput.addEventListener("input", (e) => {
    renderPokedex(e.target.value);
  });

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const tabName = button.dataset.tab;
      tabContents.forEach(content => {
        content.classList.add("hidden");
      });
      document.getElementById(`${tabName}-tab`).classList.remove("hidden");
    });
  });

  renderPokedex();
  window.addToPokedex = addToPokedex; // rend la fonction accessible globalement
});
