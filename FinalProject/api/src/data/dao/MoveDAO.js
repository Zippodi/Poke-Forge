const db = require('../DBConnection');
const { Move } = require('../models/PokeDataModels');

const types = require('../types/types');
const { constructError } = require('../../utils');

function getAllMoves() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM move ORDER BY name ASC').then(({ results }) => {
      resolve(results.map(data => new Move(data)));
    }).catch(err => {
      reject(constructError(500, 'Problem getting move data'))
    });
  });
}

function getMoveByName(name) {
  return new Promise((resolve, reject) => {
    const q = name.replaceAll(' ', '').toLowerCase();
    db.query("SELECT * FROM move WHERE LOWER(REPLACE(name,' ','')) = ?", [q]).then(({ results }) => {
      if (results[0]) {
        resolve(new Move(results[0]));
      } else {
        reject(constructError(400, 'Could not find move'));
      }
    }).catch(err => {
      reject(constructError(500, 'Could not get move'));
    });
  });
}

function getMoveById(id) {
  return new Promise((resolve, reject) => {
    return db.query("SELECT * FROM move WHERE id = ?", [id]).then(({ results }) => {
      if (results[0]) {
        resolve(new Move(results[0]));
      } else {
        reject(constructError(400, 'Could not find move'));
      }
    }).catch(err => {
      reject(constructError(500, 'Could not get move'));
    });
  });
}

function getMoveByType(type) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM move WHERE type = ? ORDER BY name ASC", [type.toLowerCase()]).then(({ results }) => {
      if (results) {
        resolve(results.map(data => new Move(data)));
      } else {
        reject(constructError(400, 'Could not find move with that type'));
      }
    }).catch(err => {
      if (!types.typeList.includes(type.toLowerCase())) {
        reject(constructError(400, 'Type is not valid'));
      }
      reject(constructError(500, 'Error getting moves'));
    });
  });
}

function getMoveByCategory(category) {
  return new Promise((resolve, reject) => {
    const cat = category.toLowerCase();
    db.query("SELECT * FROM move WHERE category = ? ORDER BY name ASC", [cat]).then(({ results }) => {
      if (results) {
        resolve(results.map(data => new Move(data)));
      } else {
        reject(constructError(400, 'Could not find move with that category'));
      }
    }).catch(err => {
      if (!['status', 'physical', 'special'].includes(cat)) {
        reject(constructError(400, 'Category is not valid'));
      }
      reject(constructError(500, 'Error getting moves'));
    });
  });
}

function getMoveEffectiveness(moves) {
  return new Promise((resolve, reject) => {
    const moveNames = moves.map(m => m.replaceAll(' ', '').toLowerCase());
    const placeholders = moveNames.map(m => '?').join(', ');
    db.query(`SELECT type, power FROM move WHERE LOWER(REPLACE(name,' ','')) IN (${placeholders})`, moveNames).then(({ results }) => {
      if (!results || results.length != moveNames.length) {
        reject(constructError(404, 'At least one of the specified moves do not exist'));
      }
      const filteredTypes = results.reduce((acc, curr) => { if (curr.power > 0) { acc.push(curr.type); } return acc; }, []);
      if (filteredTypes.length == 0) {
        resolve(types.typeList.reduce((pre, curr) => Object.assign(pre, { [curr]: 0 }), {}));
      } else {
        ret = types.getMoveEffectiveness(filteredTypes);
        if (ret === false) {
          reject(constructError(500, "Problem getting move data"));
        }
        resolve(ret);
      }
    });
  });
}

module.exports = {
  getAllMoves: getAllMoves,
  getMoveByName: getMoveByName,
  getMoveById: getMoveById,
  getMoveByType: getMoveByType,
  getMoveByCategory: getMoveByCategory,
  getMoveEffectiveness: getMoveEffectiveness
};