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



// let btn = document.getElementById("mah");
//     btn.addEventListener("input", (e) => {
//     // if (btn.textContent == "Pikachu") {
//     //     addPokemonSprite(document.getElementById("mah"));
//     // }
//     console.log(btn.value);
// });


  
