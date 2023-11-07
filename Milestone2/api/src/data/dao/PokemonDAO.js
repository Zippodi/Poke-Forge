const db = require('../DBConnection');
const Pokemon = require('../models/Pokemon');
const { Move } = require('../models/PokeDataModels');
const types = require('../types/types');

function getAllPokemon() {
  return db.query('SELECT * FROM pokemon').then(({ results }) => {
    return results.map(data => new Pokemon(data));
  });
}

function getPokemonByName(name, getDefenses = false) {
  const q = name.replaceAll(' ', '').toLowerCase();
  return db.query("SELECT * FROM pokemon WHERE LOWER(REPLACE(name,' ','')) = ?", [q]).then(({ results }) => {
    if (results[0]) {
      if (getDefenses) {
        const p = new Pokemon(results[0]);
        return p.getTypeDefenses();
      }
      return new Pokemon(results[0]);
    } else {
      return null;
    }
  }).catch(err => {
    throw new Error('Query could not execute');
  });
}

function getPokemonById(id, getDefenses = false) {
  return db.query("SELECT * FROM pokemon WHERE id = ?", [id]).then(({ results }) => {
    if (results[0]) {
      if (getDefenses) {
        const p = new Pokemon(results[0]);
        return p.getTypeDefenses();
      }
      return new Pokemon(results[0]);
    } else {
      return null;
    }
  }).catch(err => {
    throw new Error('Query could not execute');
  });
}

function getPokemonByType(type) {
  let q = type.toLowerCase();
  return db.query("SELECT * FROM pokemon WHERE type1 = ? OR type2 = ?", [q, q]).then(({ results }) => {
    if (results) {
      return results.map(data => new Pokemon(data));
    } else {
      throw new Error('Pokemon with that type not found');
    }
  }).catch(err => {
    if (!types.typeList.includes(q)) {
      throw new Error('Type is not valid');
    }
    throw new Error('Query could not execute');
  });
}

function getPokemonMoves(identifier, isName) {
  const field = isName ? 'name' : 'id';
  return db.query(`SELECT m.* FROM pokemon AS p JOIN teachable_moves AS tm ON tm.pokemon_id = p.id JOIN move AS m ON m.id = tm.move_id WHERE p.${field} = ?`,
    [identifier]).then(({ results }) => {
      if (results && results.length > 1) {
        return results.map(data => new Move(data));
      } else {
        throw new Error('Could not find moves for that Pokemon');
      }
    }).catch(err => {
      throw new Error('Query could not execute');
    });
}

function getPokemonAbilities(identifier, isName) {
  const field = isName ? 'name' : 'id';
  return db.query(`SELECT a.*, pa.is_hidden FROM pokemon AS p JOIN pokemon_abilities AS pa ON pa.pokemon_id = p.id JOIN ability AS a ON a.id = pa.ability_id WHERE p.${field} = ?`,
    [identifier]).then(({ results }) => {
      if (results) {
        return results.map(data => ({ id: data.id, name: data.name, is_hidden: data.is_hidden == 1 ? true : false, description: data.description }));
      } else {
        return null;
      }
    }).catch(err => {
      throw new Error('Query could not execute');
    });
}

// return db.query('query').then(({ results }) => {
//   return results.map(data => new Type(data));
// });

module.exports = {
  getAllPokemon: getAllPokemon,
  getPokemonByName: getPokemonByName,
  getPokemonById: getPokemonById,
  getPokemonByType: getPokemonByType,
  getPokemonMoves: getPokemonMoves,
  getPokemonAbilities: getPokemonAbilities
};