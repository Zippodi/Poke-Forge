import http from './utils/HTTPClient.js';
import { createToggleSmall, small } from './utils/responsive.js';
const SMALL_SIZE = 650;

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addPokemonSprite(node) {
  let dateSpan = document.createElement('span')
  let stringName = "pokesprite pokemon ";
  dateSpan.className = stringName.concat("pikachu");
  insertAfter(node, dateSpan);
}

http.get('/api/pokemon').then(pokemon => {
  let list = document.getElementById('pokelist');
  pokemon.forEach(p => {
    let option = document.createElement('option');
    option.value = p.name
    list.appendChild(option);
  });
});

http.get('/api/moves').then(moves => {
  let list = document.getElementById('movelist');
  moves.forEach(m => {
    let option = document.createElement('option');
    option.value = m.name
    list.appendChild(option);
  });
});

http.get('/api/items').then(items => {
  let list = document.getElementById('itemlist');
  items.forEach(i => {
    let option = document.createElement('option');
    option.value = i.name
    list.appendChild(option);
  });
});

http.get('/api/abilities').then(abilities => {
  let list = document.getElementById('abilitylist');
  abilities.forEach(a => {
    let option = document.createElement('option');
    option.value = a.name
    list.appendChild(option);
  });
});

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



  const submitBtn = document.getElementById('SaveTeam');
  submitBtn.addEventListener('click', function (e) {
    // Collecting data for each team slot
    const teamData = [];
    for (let i = 1; i <= 6; i++) {
      const itemText = document.getElementById(`teamslot${i}-item`).value;
      const pokeText = document.getElementById(`teamslot${i}`).value;
      if (!pokeText || pokeText == '') {
        continue;
      }
      const item = itemText == '' ? null : itemText;
      teamData.push({
        name: pokeText,
        moves: [
          document.getElementById(`teamslot${i}-move1`).value,
          document.getElementById(`teamslot${i}-move2`).value,
          document.getElementById(`teamslot${i}-move3`).value,
          document.getElementById(`teamslot${i}-move4`).value,
        ].filter(move => move !== ''), // Filter out empty strings if moves are not selected
        item: item,
        ability: document.getElementById(`teamslot${i}-ability`).value
      });
    }

    const formData = {
      name: document.querySelector('[name="teamname"]').value,
      public: document.querySelector('[name="teampublic"]').checked,
      pokemon: teamData
    };
    console.log(formData);
    http.post('/api/teams/create', formData).then(response => {
      console.log('Team created successfully!', response);
    }).catch(error => {
      console.error('Error creating team:', error);
    });
  });
});



