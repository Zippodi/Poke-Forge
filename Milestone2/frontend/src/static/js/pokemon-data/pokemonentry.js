import http from '../utils/HTTPClient.js';
//import Chart from 'chart.js/auto';
import { small, toggleSmall } from '../utils/responsive.js';

const SMALL_SIZE = 600;

addEventListener('DOMContentLoaded', e => {
  const arr = window.location.href.toString().split('/');
  http.get(`/api/pokemon/${arr[arr.length - 1]}`).then(async (pokemon) => {
    if (window.innerWidth < SMALL_SIZE) {
      toggleSmall(window.location.href.toString());
    }
    window.addEventListener('resize', e => {
      if (window.innerWidth < SMALL_SIZE && !small) {
        toggleSmall(window.location.href.toString());
      } else if (window.innerWidth > SMALL_SIZE && small) {
        toggleSmall(window.location.href.toString());
      }
    });
    const pokemonName = pokemon.name;
    const pokemonId = parseInt(pokemon.id);
    const types = [pokemon.type1, pokemon.type2];
    let typeImgs = document.getElementsByClassName('pokemonTypeImg');
    const pokeImg = document.getElementById('poke-img');
    document.getElementsByTagName('title').item(0).innerHTML = pokemonName;
    document.getElementById('poke-name').innerHTML = pokemonName;
    typeImgs.item(0).src = `../../images/types/${types[0]}.png`;
    if (!pokemon.type2) {
      typeImgs.item(1).remove();
    } else {
      typeImgs.item(1).src = `../../images/types/${types[1]}.png`
    }
    let num = pokemonId < 10 ? `00${pokemonId}` : pokemonId < 100 ? `0${pokemonId}` : pokemonId;
    pokeImg.src = `../../images/pokemon/${num}.png`;
    //TODO get chart.js import working
    //makeChart([pokemon.hp, pokemon.attack, pokemon.defense, pokemon.sp_attack, pokemon.sp_defense, pokemon.speed]);
    //Load other data
    const abilitiesP = http.get(`/api/pokemon/${pokemonId}/abilities`);
    const movesP = http.get(`/api/pokemon/${pokemonId}/moves`);
    const defensesP = http.get(`/api/pokemon/${pokemonId}/defenses`);
    Promise.all([abilitiesP, movesP, defensesP]).then((values) => {
      let abilTbl = document.getElementById("abilitiesTbody");
      const abilities = values[0];
      const moves = values[1];
      const defenses = values[2];
      //console.log(abilities, moves, defenses);
      abilities.forEach(a => {
        let tr = document.createElement('tr');
        let nametd = document.createElement('td');
        let desctd = document.createElement('td');
        let hiddentd = document.createElement('td');
        nametd.innerHTML = a.name;
        desctd.innerHTML = a.description;
        hiddentd.innerHTML = a.is_hidden;
        tr.appendChild(nametd);
        tr.appendChild(desctd);
        tr.appendChild(hiddentd);
        abilTbl.appendChild(tr);
      });
    }).catch(err => {
      document.getElementById('error').innerHTML = "An error occured loading data for this Pokemon";
      document.getElementById('error').classList.remove('d-none');
    });
  }).catch(err => {
    document.getElementById('error').classList.remove('d-none');
  });

});

function makeChart(stats) {
  //determine colors based on stats
  let colors = [];
  stats.forEach((element) => {
    if (element >= 150) colors.push("rgba(4, 135, 83, 1)");
    else if (element >= 120) colors.push("rgba(16, 156, 11, 1)");
    else if (element >= 100) colors.push("rgba(70, 184, 13, 1)");
    else if (element >= 80) colors.push("rgba(167, 196, 22, 1)");
    else if (element >= 60) colors.push("rgba(237, 162, 33, 1)");
    else if (element >= 40) colors.push("rgba(219, 87, 15, 1)");
    else colors.push("rgba(227, 31, 14, 1)");
  });
  //create axis labels
  let labels = [
    `HP: ${stats[0]}`,
    `ATTACK: ${stats[1]}`,
    `DEFENSE: ${stats[2]}`,
    `SP ATTACK: ${stats[3]}`,
    `SP DEFENSE: ${stats[4]}`,
    `SPEED: ${stats[5]}`,
  ];
  //create chart
  const ctx = document.getElementById("stats-chart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          data: stats,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          max: 256,
        },
      },
      indexAxis: "y",
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}