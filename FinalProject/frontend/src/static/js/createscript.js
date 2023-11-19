import http from './utils/HTTPClient.js';
import { getSpriteName, nameVariants } from './utils/PokemonNames.js';
import { createToggleSmall, small } from './utils/responsive.js';
const SMALL_SIZE = 350;

const spriteClassList = ['mb-3', 'pokesprite', 'pokemon', 'name-sprite', 'd-none'];

function loadData() {
  return new Promise(async (resolve, reject) => {
    http.get('/api/moves').then(moves => {
      let list = document.getElementById('all-moves-list');
      moves.forEach(m => {
        let option = document.createElement('option');
        option.value = m.name;
        list.appendChild(option);
      });
    }).catch(err => {
      console.error('Could not load move data');
    });
    http.get('/api/abilities').then(abilities => {
      let list = document.getElementById('all-abils-list');
      abilities.forEach(a => {
        let option = document.createElement('option');
        option.value = a.name;
        list.appendChild(option);
      });
    }).catch(err => {
      console.error('Could not load ability data');
    });
    let pokemon = await http.get('/api/pokemon').catch(err => {
      console.error("Could not load Pokemon data");
      console.error(`Error message: ${err.message}`);
      reject(err);
    });
    if (!pokemon) {
      reject('Pokemon data not received');
    }
    let pokelist = document.getElementById('pokelist');
    pokemon.forEach(p => {
      let option = document.createElement('option');
      option.value = p.name
      pokelist.appendChild(option);
    });
    //append more options for different variations of names
    Object.keys(nameVariants).forEach(k => {
      let option = document.createElement('option');
      option.value = k;
      pokelist.appendChild(option);
    });
    http.get('/api/items').then(items => {
      let list = document.getElementById('itemlist');
      items.forEach(i => {
        let option = document.createElement('option');
        option.value = i.name;
        list.appendChild(option);
      });
    }).catch(err => {
      console.error('Could not load item data');
    });
    resolve(pokemon);

  });
}

function updatePokemonEntry(idx, name = null) {
  //console.log('NAME:', name);
  let sprite = document.getElementById(`sprite-${idx}`);
  let btn = document.getElementById(`btn-${idx}`);
  let img = document.getElementById(`mystery-${idx}`);
  sprite.classList.forEach(c => {
    if (!spriteClassList.includes(c)) {
      sprite.classList.remove(c);
    }
  });
  if (!name) {
    sprite.classList.add('d-none');
    sprite.parentElement.setAttribute('href', '#');
    img.classList.remove('d-none');
    btn.innerHTML = `Team Slot ${idx + 1}:`;
    updateLists(idx);
  } else {
    btn.innerHTML = `Team Slot ${idx + 1}: ${name}`;
    let newname = getSpriteName(name);
    //console.log(newname);
    sprite.classList.remove('d-none');
    img.classList.add('d-none');
    sprite.classList.add(newname);
    sprite.parentElement.setAttribute('href', `pokemon/info/${name.toLowerCase().replaceAll(' ', '')}`);
    const shiny = false; //TODO
    if (shiny) {
      sprite.classList.add('shiny');
    }
    updateLists(idx, name.toLowerCase().replaceAll(' ', ''));
  }
}

/**
 * Update datalist for moves and abilities given index in team of pokemon and the name. 
 * No/null name means load all moves/abilities
 * idx not in range of 0-5 (inclusive) - perform action for all indexes
 */
function updateLists(idx, name = null) {
  if (idx < 0 || idx > 5) {
    for (let i = 0; i < 6; i++) {
      updateLists(i, name);
    }
  } else {
    let moveList = document.getElementById(`movelist-${idx}`);
    let abilityList = document.getElementById(`abilitylist-${idx}`);
    let abilInput = document.getElementById(`abilityslot-${idx}`);
    let moveInputs = document.querySelectorAll(`input[id^='moveslot-${idx}']`);
    if (!name) {
      abilInput.setAttribute('list', 'all-abils-list');
      moveInputs.forEach(mi => {
        mi.setAttribute('list', 'all-moves-list');
      });
      if (idx != 0) {
        abilInput.required = false;
        moveInputs.item(0).required = false;
      }
    } else {
      abilInput.setAttribute('list', `abilitylist-${idx}`);
      moveList.replaceChildren();
      abilityList.replaceChildren();
      http.get(`/api/pokemon/${name}/moves`).then(moves => {
        moves.forEach(m => {
          let option = document.createElement('option');
          option.value = m.name;
          moveList.appendChild(option);
        });
      }).catch(err => {
        console.error(`Error loading move data for ${name}`);
      });
      moveInputs.forEach(mi => {
        mi.setAttribute('list', `movelist-${idx}`);
      });
      http.get(`/api/pokemon/${name}/abilities`).then(abilities => {
        abilities.forEach(a => {
          let option = document.createElement('option');
          option.value = a.name;
          abilityList.appendChild(option);
        });
      }).catch(err => {
        console.error(`Error loading ability data for ${name}`);
      });
      if (idx != 0) {
        abilInput.required = true;
        moveInputs.item(0).required = true;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const submitBtn = document.getElementById('upload-btn');
  if (window.innerWidth < SMALL_SIZE) {
    createToggleSmall();
  }
  window.addEventListener('resize', e => {
    if (window.innerWidth < SMALL_SIZE && !small) {
      createToggleSmall();
    } else if (window.innerWidth > SMALL_SIZE && small) {
      createToggleSmall();
    }
  });
  loadData().then(pokemon => {
    const pokemonNames = pokemon ? pokemon.map(p => p.name) : false;
    let nameInputs = document.getElementsByClassName('poke-name-input');
    updateLists(-1);
    //console.log('pokemonNames?', pokemonNames);
    if (pokemonNames) {
      for (let i = 0; i < nameInputs.length; i++) {
        let n = nameInputs[i];
        n.addEventListener('change', e => {
          let val = n.value.trim();
          //check if typed in name is empty
          if (!val || val == '') {
            return updatePokemonEntry(i);
          }
          //find name in name list or type variant list
          let find = pokemonNames.filter(n => n.toLowerCase() === val.toLowerCase())[0];
          if (!find) {
            find = Object.keys(nameVariants).find(e => e.toLowerCase() === val.toLowerCase());
            if (!find) {
              return updatePokemonEntry(i);
            }
            find = nameVariants[find];
          }
          n.value = find;
          //using name update button text and show sprite
          updatePokemonEntry(i, find);
        });
      }
    }
    submitBtn.addEventListener('click', (e) => {
      const teamData = [];
      const teamName = document.getElementById('team-name').value.trim();
      if (teamName.length < 2) {
        return showError("Error: Team name must be at least 2 characters");
      }
      for (let i = 0; i < 6; i++) {
        const pokeName = document.getElementById(`teamslot-${i}`).value.trim();
        if (pokeName == '') {
          continue;
        }
        const pokeItem = document.getElementById(`itemslot-${i}`).value.trim();
        const itemName = pokeItem && pokeItem != '' ? pokeItem : null;
        const abilName = document.getElementById(`abilityslot-${i}`).value.trim();
        if (abilName == '') {
          return showError(`Error in Team Slot ${i + 1}: All Pokemon must have an ability`);
        }
        let moveNames = [];
        document.querySelectorAll(`input[id^='moveslot-${i}']`).forEach((m) => {
          if (m.value && m.value.trim() != '') {
            moveNames.push(m.value.trim());
          }
        });
        if (moveNames.length == 0) {
          return showError(`Error in Team Slot ${i + 1}: All Pokemon must have at least one move`);
        }
        teamData.push({
          name: pokeName,
          moves: moveNames,
          item: itemName,
          ability: abilName
        });
      }
      if (teamData.length == 0) {
        return showError("Error: Team must have at least one Pokemon");
      }
      const data = {
        name: teamName,
        public: document.getElementById('public-check').checked,
        pokemon: teamData
      };
      console.log(data);
      http.post('/api/teams/create', data).then(response => {
        showSuccess();
        console.log('new id', response.id);
      }).catch(error => {
        showError(error, error.status >= 500);
      });
    });
  }).catch(err => {
    console.info('Could not load Pokemon data, some features may be unavailable');
    console.log(err);
  });
});

function showError(message, serverError = false) {
  let error = document.getElementById('upload-err');
  error.innerHTML = serverError ? `Server Error: ${message}` : message;
  error.classList.remove('d-none');
}

function showSuccess() {
  document.getElementById('upload-err').classList.add('d-none');
  //show modal TODO
  document.getElementById('upload-succ').classList.remove('d-none');
}
