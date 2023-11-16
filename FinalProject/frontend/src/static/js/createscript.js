import http from './utils/HTTPClient.js';
import { getSpriteName, nameVariants } from './utils/PokemonNames.js';
import { createToggleSmall, small } from './utils/responsive.js';
const SMALL_SIZE = 650;

var setPokemon = [];

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
    sprite.parentElement.setAttribute('href', `pokemon/`);
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
  if (idx > 0) return; //TEMP
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
    }
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
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
  }).catch(err => {
    console.info('Could not load Pokemon data, some features may be unavailable');
    console.log(err);
  });
});

// const submitBtn = document.getElementById('SaveTeam');
// submitBtn.addEventListener('click', function (e) {
//   // Collecting data for each team slot
//   const teamData = [];
//   for (let i = 1; i <= 6; i++) {
//     const itemText = document.getElementById(`teamslot${i}-item`).value;
//     const pokeText = document.getElementById(`teamslot${i}`).value;
//     if (!pokeText || pokeText == '') {
//       continue;
//     }
//     const item = itemText == '' ? null : itemText;
//     teamData.push({
//       name: pokeText,
//       moves: [
//         document.getElementById(`teamslot${i}-move1`).value,
//         document.getElementById(`teamslot${i}-move2`).value,
//         document.getElementById(`teamslot${i}-move3`).value,
//         document.getElementById(`teamslot${i}-move4`).value,
//       ].filter(move => move !== ''), // Filter out empty strings if moves are not selected
//       item: item,
//       ability: document.getElementById(`teamslot${i}-ability`).value
//     });
//   }

//   const formData = {
//     name: document.querySelector('[name="teamname"]').value,
//     public: document.querySelector('[name="teampublic"]').checked,
//     pokemon: teamData
//   };
//   console.log(formData);
//   http.post('/api/teams/create', formData).then(response => {
//     console.log('Team created successfully!', response);
//   }).catch(error => {
//     console.error('Error creating team:', error);
//   });
// });



