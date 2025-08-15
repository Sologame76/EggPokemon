let clicksRemaining = 10;
let currentEggType = getRandomEggType();

const clickCount = document.getElementById("click-count");
const clickButton = document.getElementById("click-button");
const eggZone = document.getElementById("egg-zone");
const resultZone = document.getElementById("result-zone");
const pokemonName = document.getElementById("pokemon-name");
const pokemonImg = document.getElementById("pokemon-img");
const eggTypeDisplay = document.getElementById("egg-type-display");
const toastContainer = document.getElementById("toast-container");
const eggImg = document.getElementById("egg-img");

function getRandomEggType() {
  const types = Object.keys(eggs);
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomPokemonFromEgg(type) {
  const list = eggs[type].pokemons;
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < list.length; i++) {
    cumulative += list[i].probability;
    if (rand <= cumulative) return list[i].name;
  }
  return list[list.length - 1].name;
}

function getPokemonInfo(name) {
  return pokemons.find(p => p.name === name);
}

function updateClickCount() {
  clickCount.textContent = `Clics restants : ${clicksRemaining}`;
}

function updateEggDisplay() {
  eggTypeDisplay.textContent = `Type d'œuf : ${currentEggType}`;
  const eggData = eggs[currentEggType];
  eggImg.src = eggData?.image || "images/oeuf_neutre.png";
}

function showToast(pokemon, isShiny) {
  const toast = document.createElement("div");
  toast.className = "toast" + (isShiny ? " shiny-toast" : "");

  const img = document.createElement("img");
  img.src = pokemon.image;
  img.alt = pokemon.name;

  const text = document.createElement("span");
  text.textContent = isShiny ? `✨ Shiny ${pokemon.name} ✨` : `+1 ${pokemon.name}`;

  toast.appendChild(img);
  toast.appendChild(text);
  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

function resetEgg() {
  clicksRemaining = 10;
  currentEggType = getRandomEggType();
  updateClickCount();
  updateEggDisplay();
  eggZone.style.display = "block";
  resultZone.style.display = "none";
  clickButton.disabled = false;
  eggImg.classList.remove("shake");
}

updateClickCount();
updateEggDisplay();

clickButton.addEventListener("click", () => {
  if (clicksRemaining > 1) {
    clicksRemaining--;
    updateClickCount();
  } else if (clicksRemaining === 1) {
    clicksRemaining = 0;
    updateClickCount();
    clickButton.disabled = true;

    eggImg.classList.add("shake");

    setTimeout(() => {
      const name = getRandomPokemonFromEgg(currentEggType);
      const basePokemon = getPokemonInfo(name);

      const isShiny = Math.random() < 0.02;

      let image = basePokemon.image;
      if (isShiny) {
        const baseName = name.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "");
        image = `images/${baseName}_shiny.png`;
      }

      const pokemon = {
        ...basePokemon,
        image: image
      };

      pokemonName.innerHTML = isShiny ? `✨ Shiny ${pokemon.name} ✨` : pokemon.name;
      pokemonImg.src = pokemon.image;
      if (isShiny) pokemonImg.classList.add("shiny-glow");
      else pokemonImg.classList.remove("shiny-glow");

      addToPokedex(pokemon.name);
      showToast(pokemon, isShiny);

      eggZone.style.display = "none";
      resultZone.style.display = "block";

      setTimeout(() => {
        resetEgg();
      }, 3000);
    }, 800);
  }
});
