const db = require('../DBConnection');
const { Move } = require('../models/PokeDataModels');

const types = require('../types/types');

function getAllMoves() {
  return db.query('SELECT * FROM move').then(({ results }) => {
    return results.map(data => new Move(data));
  });
}

function getMoveByName(name) {
  const q = name.replaceAll(' ', '').toLowerCase();
  return db.query("SELECT * FROM move WHERE LOWER(REPLACE(name,' ','')) = ?", [q]).then(({ results }) => {
    if (results[0]) {
      return new Move(results[0]);
    } else {
      throw new Error('Could not find move');
    }
  }).catch(err => {
    throw new Error('Query could not execute');
  });
}

function getMoveById(id) {
  return db.query("SELECT * FROM move WHERE id = ?", [id]).then(({ results }) => {
    if (results[0]) {
      return new Move(results[0]);
    } else {
      throw new Error('Could not find move');
    }
  }).catch(err => {
    throw new Error('Query could not execute');
  });
}

function getMoveByType(type) {
  return db.query("SELECT * FROM move WHERE type = ?", [type.toLowerCase()]).then(({ results }) => {
    if (results) {
      return results.map(data => new Move(data));
    } else {
      throw new Error('Could not find move with that type');
    }
  }).catch(err => {
    if (!types.typeList.includes(type.toLowerCase())) {
      throw new Error('Type is not valid');
    }
    throw new Error('Query could not execute');
  });
}

function getMoveByCategory(category) {
  const cat = category.toLowerCase();
  return db.query("SELECT * FROM move WHERE category = ?", [cat]).then(({ results }) => {
    if (results) {
      return results.map(data => new Move(data));
    } else {
      throw new Error('Could not find move with that category');
    }
  }).catch(err => {
    if (!['status', 'physical', 'special'].includes(cat)) {
      throw new Error('Category is not valid');
    }
    throw new Error('Query could not execute');
  });
}

// return db.query('query').then(({ results }) => {
//   return results.map(data => new Type(data));
// });

module.exports = {
  getAllMoves: getAllMoves,
  getMoveByName: getMoveByName,
  getMoveById: getMoveById,
  getMoveByType: getMoveByType,
  getMoveByCategory: getMoveByCategory
};