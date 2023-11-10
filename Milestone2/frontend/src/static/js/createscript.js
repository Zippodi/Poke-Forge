function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addPokemonSprite(node) {
    let dateSpan = document.createElement('span')
    let stringName = "pokesprite pokemon ";
    dateSpan.className = stringName.concat("pikachu");

    insertAfter(node, dateSpan);
}

class HTTPClient {
    static get(url) {
      return fetch(url).then(res => {
        if(!res.ok) {
          throw new Error("error in request");
        }
        return res.json();
      });
    }

    static post(url) {
      return fetch(url).then(res => {
        if(!res.ok) {
          throw new Error("error in request");
        }
        return res.json();
      });
    }
  }
  
  
 
    
HTTPClient.get('/api/pokemon').then(pokemon => {
    var list = document.getElementById('pokemonlist');
    for (key in pokemon) {
        let option = document.createElement('option');
        
            let name = key[0].toUpperCase() + key.slice(1);
            option.value = name;
            list.appendChild(option);
    }

});

HTTPClient.get('/api/moves').then(moves=> {
  var list = document.getElementById('moveslist');
  for (key in moves) {
      let option = document.createElement('option');
      
          let name = key[0].toUpperCase() + key.slice(1);
          option.value = name;
          list.appendChild(option);
  }

});

HTTPClient.get('/api/items').then(items=> {
  var list = document.getElementById('itemslist');
  for (key in items) {
      let option = document.createElement('option');
      
          let name = key[0].toUpperCase() + key.slice(1);
          option.value = name;
          list.appendChild(option);
  }

});

HTTPClient.get('/api/abilities').then(abilities=> {
  var list = document.getElementById('abilitylist');
  for (key in abilities) {
      let option = document.createElement('option');
      
          let name = key[0].toUpperCase() + key.slice(1);
          option.value = name;
          list.appendChild(option);
  }

});

document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.querySelector('form'); 

  form.addEventListener('submit', function (e) {
    e.preventDefault(); 

    // Collecting data for each team slot
    const teamData = [];
    for (let i = 1; i <= 6; i++) {
      teamData.push({
        name: document.getElementById(`teamslot${i}`).value,
        moves: [
          document.getElementById(`teamslot${i}-move1`).value,
          document.getElementById(`teamslot${i}-move2`).value,
          document.getElementById(`teamslot${i}-move3`).value,
          document.getElementById(`teamslot${i}-move4`).value,
        ].filter(move => move !== ''), // Filter out empty strings if moves are not selected
        item: document.getElementById(`teamslot${i}-item`).value,
        ability: document.getElementById(`teamslot${i}-ability`).value
      });
    }

    const formData = {
      name: document.querySelector('[name="teamname"]').value,
      public: document.querySelector('[name="teampublic"]').checked,
      pokemonData: teamData
    };

    HTTPClient.post('/api/teams/create', {
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Team created successfully!', response);
    })
    .catch(error => {
      console.error('Error creating team:', error);
    });
  });
});

// let btn = document.getElementById("mah");
//     btn.addEventListener("input", (e) => {
//     // if (btn.textContent == "Pikachu") {
//     //     addPokemonSprite(document.getElementById("mah"));
//     // }
//     console.log(btn.value);
// });


  
