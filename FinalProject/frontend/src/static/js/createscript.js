import http from './utils/HTTPClient.js';
import { getSpriteName, nameVariants } from './utils/PokemonNames.js';
import { createToggleSmall, small } from './utils/responsive.js';
const SMALL_SIZE = 650;

let setPokemon = [];
let validMoves = [[], [], [], [], [], []];
let validAbilities = [[], [], [], [], [], []];

const spriteClassList = ['mb-3', 'pokesprite', 'pokemon', 'name-sprite', 'd-none'];

function loadData() {
  return new Promise(async (resolve, reject) => {
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
  let sprite = document.getElementById(`sprite-${idx}`);
  let btn = document.getElementById(`btn-${idx}`);
  sprite.classList.forEach(c => {
    if (!spriteClassList.includes(c)) {
      sprite.classList.remove(c);
    }
  });
  if (!name) {
    sprite.classList.add('d-none');
    btn.innerHTML = `Team Slot ${idx + 1}:`;
  } else {
    btn.innerHTML = `Team Slot ${idx + 1}: ${name}`;
    let newname = getSpriteName(name);
    //console.log(newname);
    sprite.classList.remove('d-none');
    sprite.classList.add(newname);
    const shiny = false; //TODO
    if (shiny) {
      sprite.classList.add('shiny');
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



