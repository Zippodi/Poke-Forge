import http from './utils/HTTPClient.js';

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
  var list = document.getElementById('pokemonlist');
  for (let key in pokemon) {
    let option = document.createElement('option');
    let name = key[0].toUpperCase() + key.slice(1);
    option.value = name;
    list.appendChild(option);
  }

});

http.get('/api/moves').then(moves => {
  var list = document.getElementById('moveslist');
  for (let key in moves) {
    let option = document.createElement('option');

    let name = key[0].toUpperCase() + key.slice(1);
    option.value = name;
    list.appendChild(option);
  }

});

http.get('/api/items').then(items => {
  var list = document.getElementById('itemslist');
  for (let key in items) {
    let option = document.createElement('option');

    let name = key[0].toUpperCase() + key.slice(1);
    option.value = name;
    list.appendChild(option);
  }

});

http.get('/api/abilities').then(abilities => {
  var list = document.getElementById('abilitylist');
  for (let key in abilities) {
    let option = document.createElement('option');
    let name = key[0].toUpperCase() + key.slice(1);
    option.value = name;
    list.appendChild(option);
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
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



