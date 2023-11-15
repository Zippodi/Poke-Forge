import http from './utils/HTTPClient.js';
const teamList = document.querySelector('#teamsList');


http.get('api/teams/myteams').then(teams => { 
    for (let i = 0; i < teams.length; ++i) {
        const team = document.createElement('div');
        team.className = "container";
        let name = document.createElement('h1');
        name.innerHTML = teams[i].name;
        team.appendChild(name);

        
        for (let a = 0; a < teams[i].pokemon.length; ++a) {
            const pokemon = document.createElement('div');
            pokemon.className = "d-flex justify-content-center align-items-center my-5";

            const pokemonName = document.createElement('h3');
            pokemonName.innerHTML = teams[i].pokemon[a].name;
            pokemon.appendChild(pokemonName);

            const sprite = document.createElement('span')
            let starterSpriteString =  "pokesprite pokemon ";
            
            sprite.className = starterSpriteString.concat(teams[i].pokemon[a].name.toLowerCase());
            console.log(sprite.className);


            pokemon.appendChild(sprite);
            team.appendChild(pokemon);
            
        }
        team.style.backgroundColor = "#091644";
        team.style.borderRadius = "5px";








        teamList.append(team);
        // console.log(teams[i]);
    }

 });

