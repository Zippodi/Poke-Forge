
import http from './utils/HTTPClient.js';
const teamList = document.querySelector('#teamsList');


http.get('api/teams/').then(teams => { 
    for (let i = 0; i < teams.length; ++i) {
        const team = document.createElement('div');
        team.className = "container";
        let name = document.createElement('h1');
        name.innerHTML = teams[i].name;
        team.appendChild(name);

        // for (p in teams[i].pok)
        
        for (let a = 0; a < teams[i].pokemon.length; ++a) {
            const pokemon = document.createElement('div');
            pokemon.className = "d-flex justify-content-center align-items-center my-5";

            const pokemonName = document.createElement('h3');
            pokemonName.innerHTML = teams[i].pokemon[a].name;
            pokemon.appendChild(pokemonName);



            let img = document.createElement('img');
           
            img.classList.add('mx-4', 'mb-1', 'entry-img');
            // let id = parseInt(teams[i].pokemon[a].id);
            // let num = id < 10 ? `00${id}` : id < 100 ? `0${id}` : id;
            // console.log(num);
            // console.log(teams[i].pokemon[a].id);
            img.src = `images/pokemon/001.png`;
            // img.src = `images/pokemon/001.png`;
            img.alt = teams[i].pokemon[a].name;
            // // const sprite = document.createElement('span')
            // // let starterSpriteString =  "pokesprite pokemon ";
            
            // // sprite.className = starterSpriteString.concat(teams[i].pokemon[a].name.toLowerCase());
            // // console.log(sprite.className);
            let ability = document.createElement('h4');
            ability.innerHTML =  teams[i].pokemon[a].ability;

            // // pokemon.appendChild(sprite);
            pokemon.appendChild(img);
            pokemon.appendChild(ability);
            team.appendChild(pokemon);
            
        }
        team.style.backgroundColor = "#091644";
        team.style.borderRadius = "5px";








        teamList.append(team);
        // console.log(teams[i]);
    }

 });




 
