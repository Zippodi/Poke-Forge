
// http.get('/api/teams/').then(data => { console.log(data); });
import http from './utils/HTTPClient.js';
const teamList = document.querySelector('#teamsList');


http.get('api/teams/').then(teams => { 
    for (let i = 0; i < teams.length; ++i) {
        const team = document.createElement('div');
        team.className = "container";
        let name = document.createElement('p');
        name.innerHTML = teams[i].name;
        team.appendChild(name);

        // for (p in teams[i].pok)


        team.style.backgroundColor = "#091644";
        team.style.borderRadius = "5px";








        teamList.append(team);
        // console.log(teams[i]);
    }

 });




 
