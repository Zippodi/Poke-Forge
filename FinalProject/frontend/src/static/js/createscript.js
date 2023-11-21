import { typeList } from './types/types.js';
import http from './utils/HTTPClient.js';
import { effectMap, getSpriteName, nameVariants, typeDefenseModifiers } from './utils/PokemonUtils.js';
import { createToggleSmall, small } from './utils/responsive.js';

const SMALL_SIZE = 350;

const spriteClassList = ['mb-3', 'pokesprite', 'pokemon', 'name-sprite', 'd-none'];

/** Gets Pokemon, move, ability, and item data and loads them into respective data lists */
function loadData() {
  return new Promise(async (resolve, reject) => {
    http.get('/api/moves').then(moves => {
      let list = document.getElementById('all-moves-list');
      moves.forEach(m => {
        let option = document.createElement('option');
        option.value = m.name;
        list.appendChild(option);
      });
    }).catch(err => {
      console.error('Could not load move data');
    });
    http.get('/api/abilities').then(abilities => {
      let list = document.getElementById('all-abils-list');
      abilities.forEach(a => {
        let option = document.createElement('option');
        option.value = a.name;
        list.appendChild(option);
      });
    }).catch(err => {
      console.error('Could not load ability data');
    });
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

/** 
 * For when user is done typing in the name of a Pokemon to put into their team.
 * If name is valid it will put insert the pokemon sprite and update data lists to have move/ability values for that pokemon.
 * Otherwise displays mystery image and updates data lists to use all move/ability values
 * */
function updatePokemonEntry(idx, name = null, types = null) {
  let sprite = document.getElementById(`sprite-${idx}`);
  let btn = document.getElementById(`btn-${idx}`);
  let imgs = Array.from(document.getElementsByClassName(`mystery-${idx}`));
  let headRows = Array.from(document.getElementsByClassName('head-row'));
  //get the sprites in offense/defense tables - DOM moment
  let sprites = headRows.map(e => e.children.item(idx + 1).children[1].firstElementChild);
  sprites.push(sprite);
  sprite.classList.forEach(c => {
    if (!spriteClassList.includes(c)) {
      sprites.forEach(s => s.classList.remove(c)); //remove the class of the old pokemon sprite
    }
  });
  if (!name) {
    sprites.forEach(s => { s.classList.add('d-none'); s.parentElement.setAttribute('href', '#'); });
    imgs.forEach(i => i.classList.remove('d-none'));
    btn.innerHTML = `Team Slot ${idx + 1}:`;
    updateTeamEntryData(idx);
  } else {
    btn.innerHTML = `Team Slot ${idx + 1}: ${name}`;
    const ability = document.getElementById(`abilityslot-${idx}`).value.toLowerCase().replaceAll(' ', '');
    const item = document.getElementById(`itemslot-${idx}`).value.toLowerCase().replaceAll(' ', '');
    const newname = getSpriteName(name, ability, item);
    imgs.forEach(i => i.classList.add('d-none'));
    sprites.forEach(s => {
      s.classList.remove('d-none');
      s.parentElement.setAttribute('href', `pokemon/info/${name.toLowerCase().replaceAll(' ', '')}`);
      s.classList.add(newname);
      const shiny = false; //TODO
      if (shiny) {
        s.classList.add('shiny');
      }
    });
    updateTeamEntryData(idx, name.toLowerCase().replaceAll(' ', ''), types);
  }
}

/**
 * Update datalist for moves and abilities given index in team of pokemon and the name. 
 * Null/no name means load all moves/abilities
 * idx not in range of 0-5 (inclusive) = perform action for all indexes
 */
function updateTeamEntryData(idx, name = null, types = null) {
  if (idx < 0 || idx > 5) {
    for (let i = 0; i < 6; i++) {
      updateTeamEntryData(i, name);
    }
  } else {
    let moveList = document.getElementById(`movelist-${idx}`);
    let abilityList = document.getElementById(`abilitylist-${idx}`);
    let abilInput = document.getElementById(`abilityslot-${idx}`);
    let moveInputs = document.querySelectorAll(`input[id^='moveslot-${idx}']`);
    typeList.forEach((type) => {
      resetTypeTotals(type, idx); //reset type totals in case new pokemon name is null and pokemom was only removed
    });
    if (!name) {
      abilInput.setAttribute('list', 'all-abils-list');
      moveInputs.forEach(mi => {
        mi.setAttribute('list', 'all-moves-list');
      });
      if (idx != 0) {
        abilInput.required = false;
        moveInputs.item(0).required = false;
      }
    } else {
      moveList.replaceChildren();
      abilityList.replaceChildren();
      //moves
      http.get(`/api/pokemon/${name}/moves`).then(moves => {
        moves.forEach(m => {
          let option = document.createElement('option');
          option.value = m.name;
          moveList.appendChild(option);
        });
      }).catch(err => {
        console.error(`Error loading move data for ${name}`);
      });
      moveInputs.forEach(mi => {
        mi.setAttribute('list', `movelist-${idx}`);
      });
      //abilities
      http.get(`/api/pokemon/${name}/abilities`).then(abilities => {
        abilities.forEach(a => {
          let option = document.createElement('option');
          option.value = a.name;
          abilityList.appendChild(option);
        });
      }).catch(err => {
        console.error(`Error loading ability data for ${name}`);
      });
      abilInput.setAttribute('list', `abilitylist-${idx}`);
      //type defenses
      http.get(`/api/pokemon/${name}/defenses`).then((defenses) => {
        let item = document.getElementById(`itemslot-${idx}`).value;
        const data = typeDefenseModifiers(defenses, abilInput.value, types, item); //account for abilities and items
        Object.entries(data).forEach(([type, eff]) => {
          const row = document.getElementById(`defense-${type}`);
          const def = row.children.item(idx + 1); //the <td> that displays the value
          const totalWeak = row.children.item(7);
          const totalResist = row.children.item(8);
          let totalWeakNum = parseInt(totalWeak.innerHTML);
          let totalResistNum = parseInt(totalResist.innerHTML);
          //add new effect
          const effect = effectMap(eff);
          if (effect != 'normal-effect') {
            def.classList.add(effect);
            if (eff > 1) {
              totalWeak.innerHTML = totalWeakNum + 1;
              totalWeakNum++;
            } else {
              totalResist.innerHTML = totalResistNum + 1;
              totalResistNum++;
            }
          }
          if (totalResistNum > 0) {
            totalResist.className = 'half-effect';
          } else if (totalResistNum > 2) {
            totalResist.className = 'quarter-effect';
          } else {
            totalResist.className = '';
          }
          if (totalWeakNum > 0) {
            totalWeak.classList.add('double-effect');
            totalWeak.classList.remove('quadruple-effect');
          } else if (totalWeakNum > 2) {
            totalWeak.classList.add('quadruple-effect');
            totalWeak.classList.remove('double-effect')
          } else {
            totalResist.classList.remove('double-effect', 'quadruple-effect');
          }
          def.innerHTML = eff;
        });
      }).catch(err => {
        console.log(err);
        console.error(`Error loading type defense data for ${name}`);
      });
      if (idx != 0) {
        abilInput.required = true;
        moveInputs.item(0).required = true;
      }
    }
  }
}

function resetTypeTotals(type, idx) {
  const row = document.getElementById(`defense-${type}`);
  const def = row.children.item(idx + 1); //the <td> that displays the value
  const totalWeak = row.children.item(7);
  const totalResist = row.children.item(8);
  let totalWeakNum = parseInt(totalWeak.innerHTML);
  let totalResistNum = parseInt(totalResist.innerHTML);
  //undo previous pokemon's effect if one was there
  const oldNum = isNaN(def.innerHTML) ? null : parseFloat(def.innerHTML);
  if (oldNum !== null && oldNum < 1) {
    totalResist.innerHTML = totalResistNum - 1;
    totalResistNum--;
  } else if (oldNum !== null && oldNum > 1) {
    totalWeak.innerHTML = totalWeakNum - 1;
    totalWeakNum--;
  }
  def.innerHTML = '-';
  def.classList.remove(...def.classList);
  if (totalResistNum > 0) {
    totalResist.className = 'half-effect';
  } else if (totalResistNum > 2) {
    totalResist.className = 'quarter-effect';
  } else {
    totalResist.className = '';
  }
  if (totalWeakNum > 0) {
    totalWeak.classList.add('double-effect');
    totalWeak.classList.remove('quadruple-effect');
  } else if (totalWeakNum > 2) {
    totalWeak.classList.add('quadruple-effect');
    totalWeak.classList.remove('double-effect')
  } else {
    totalWeak.classList.remove('double-effect', 'quadruple-effect');
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  //toggles for smaller screens
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
    const nameInputs = Array.from(document.getElementsByClassName('poke-name-input'));
    const abilityInputs = Array.from(document.querySelectorAll(`input[id^='abilityslot']`));
    const itemInputs = Array.from(document.querySelectorAll(`input[id^='itemslot']`));
    updateTeamEntryData(-1); //initialize lists to use all values at start
    if (pokemon) {
      for (let i = 0; i < nameInputs.length; i++) {
        const moveInputs = Array.from(document.querySelectorAll(`input[id^='moveslot-${i}']`));
        const n = nameInputs[i];
        n.addEventListener('change', () => textEntryEvent(pokemon, n, i));
        moveInputs.forEach(m => m.addEventListener('change', () => textEntryEvent(pokemon, n, i)));
        abilityInputs[i].addEventListener('change', () => textEntryEvent(pokemon, n, i));
        itemInputs[i].addEventListener('change', () => textEntryEvent(pokemon, n, i));
      }
    }
    setUpSubmit(); //set up the "form" submission for creating a team
    pokeInfoNav(); //set up the nav showing type defenses / move offenses
  }).catch(err => {
    console.info('Could not load Pokemon data, some features may be unavailable');
    console.log(err);
  });
});

function textEntryEvent(pokemon, n, i) {
  let val = n.value.trim();
  //check if typed in name is empty
  if (!val || val == '') {
    return updatePokemonEntry(i);
  }
  //find name in name list or type variant list
  let find = pokemon.find(({ name }) => name.toLowerCase() === val.toLowerCase());
  if (!find) {
    find = Object.keys(nameVariants).find(e => e.toLowerCase() === val.toLowerCase());
    if (!find) {
      return updatePokemonEntry(i);
    }
    find = pokemon.find(({ name }) => name.toLowerCase() === nameVariants[find].toLowerCase());
  }
  n.value = find.name;
  //using name update button text and show sprite
  const types = find.type2 ? [find.type1, find.type2] : [find.type1];
  updatePokemonEntry(i, find.name, types);
}

function showError(message, serverError = false) {
  let error = document.getElementById('upload-err');
  error.innerHTML = serverError ? `Server Error: ${message}` : message;
  error.classList.remove('d-none');
}

function showSuccess() {
  document.getElementById('upload-err').classList.add('d-none');
  //show modal TODO
  document.getElementById('upload-succ').classList.remove('d-none');
}

function setUpSubmit() {

  document.getElementById('upload-btn').addEventListener('click', (e) => {
    const teamData = [];
    const teamName = document.getElementById('team-name').value.trim();
    if (teamName.length < 2) {
      return showError("Error: Team name must be at least 2 characters");
    }
    for (let i = 0; i < 6; i++) {
      const pokeName = document.getElementById(`teamslot-${i}`).value.trim();
      if (pokeName == '') {
        continue;
      }
      const pokeItem = document.getElementById(`itemslot-${i}`).value.trim();
      const itemName = pokeItem && pokeItem != '' ? pokeItem : null;
      const abilName = document.getElementById(`abilityslot-${i}`).value.trim();
      if (abilName == '') {
        return showError(`Error in Team Slot ${i + 1}: All Pokemon must have an ability`);
      }
      let moveNames = [];
      document.querySelectorAll(`input[id^='moveslot-${i}']`).forEach((m) => {
        if (m.value && m.value.trim() != '') {
          moveNames.push(m.value.trim());
        }
      });
      if (moveNames.length == 0) {
        return showError(`Error in Team Slot ${i + 1}: All Pokemon must have at least one move`);
      }
      teamData.push({
        name: pokeName,
        moves: moveNames,
        item: itemName,
        ability: abilName
      });
    }
    if (teamData.length == 0) {
      return showError("Error: Team must have at least one Pokemon");
    }
    const data = {
      name: teamName,
      public: document.getElementById('public-check').checked,
      pokemon: teamData
    };
    //console.log(data);
    http.post('/api/teams/create', data).then(response => {
      showSuccess();
      console.log('new id', response.id);
    }).catch(error => {
      showError(error, error.status >= 500);
    });
  });
}

function pokeInfoNav() {
  const defense = document.getElementById('defense');
  const offense = document.getElementById('offense');
  const defenseNav = document.getElementById('defense-nav');
  const offenseNav = document.getElementById('offense-nav');
  const hide = document.getElementById('hide-nav');
  //add listeners to switch between offense/defense or hide them
  defenseNav.addEventListener('click', e => {
    defense.classList.remove('d-none');
    offense.classList.add('d-none');
    hide.firstElementChild.classList.remove('active');
    defenseNav.firstElementChild.classList.add('active');
    offenseNav.firstElementChild.classList.remove('active');
  });
  offenseNav.addEventListener('click', e => {
    defense.classList.add('d-none');
    hide.firstElementChild.classList.remove('active');
    offense.classList.remove('d-none');
    offenseNav.firstElementChild.classList.add('active');
    defenseNav.firstElementChild.classList.remove('active');
  });
  hide.addEventListener('click', e => {
    hide.firstElementChild.classList.add('active');
    defenseNav.firstElementChild.classList.remove('active');
    offenseNav.firstElementChild.classList.remove('active');
    offense.classList.add('d-none');
    defense.classList.add('d-none');
  });
}