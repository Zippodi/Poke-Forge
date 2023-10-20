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
            option.value = key;
            list.appendChild(option);
    }

});


  
