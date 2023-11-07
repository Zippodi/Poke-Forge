const db = require('../DBConnection');
const Pokemon = require('../models/Pokemon');
const { Move } = require('../models/PokeDataModels');
const types = require('../types/types');

function createTeam(team, userId) {
  return new Promise((resolve, reject) => {
    if (!validateTeamBody(team)) {
      reject('Invalid team body');
    }
    let connection = db.getDatabaseConnection();
    connection.getConnection((err, conn) => {
      conn.beginTransaction(async (err) => {
        if (err) {
          reject(err);
        }
        //insert team
        let x = new Date(Date.now());
        let first = x.toISOString().substring(0, x.toISOString().indexOf('T'));
        let last_modified = `${first} ${x.getHours()}:${x.getMinutes()}:00`;
        conn.query('INSERT INTO team(user_id, public, name, last_modified) VALUES (?, ?, ?, ?)', [userId, team.public, team.name, last_modified], async (err, results, fields) => {
          if (err) {
            return conn.rollback(() => { reject(err); });
          }
          const newTeamId = results.insertId;
          for (const p of team.pokemon) {
            try {
              //get ability and pokemon id, while checking that both are valid
              let abilSQL = "SELECT p.id AS pokemon_id, a.id AS ability_id FROM pokemon AS p JOIN pokemon_abilities AS pa ON p.id = pa.pokemon_id ";
              abilSQL += "JOIN ability AS a ON a.id = pa.ability_id WHERE LOWER(REPLACE(p.name, ' ', '')) = ? AND LOWER(REPLACE(a.name, ' ', '')) = ?";
              let abilResults = await executeQuery(conn, abilSQL, [p.name, p.ability]);
              if (abilResults.length === 0) {
                reject(`Ability ${p.ability} is not valid on ${p.name}, or one of these values does not exist`);
              }
              const pokeId = abilResults[0].pokemon_id;
              const abilId = abilResults[0].ability_id;
              //get held item id, checking that it is valid
              let itemId = null;
              if (p.item) {
                let itemResults = await executeQuery(conn, "SELECT id as item_id FROM item WHERE LOWER(REPLACE(name, ' ', '')) = ?", [p.item]);
                if (itemResults.length === 0) {
                  reject(`Item ${p.item} on ${p.name} is not a valid item`);
                }
                itemId = itemResults[0].item_id;
              }
              //create pokemon entry
              const entryValues = [newTeamId, pokeId, itemId, abilId];
              let entryResults = await executeQuery(conn, "INSERT INTO pokemon_entry(team_id, pokemon_id, item_id, ability_id) VALUES (?, ?, ?, ?)", entryValues);
              let entryId = entryResults.insertId;
              //get move IDs
              let moveSelectSQL = "SELECT tm.move_id FROM pokemon AS p JOIN teachable_moves AS tm ON p.id = tm.pokemon_id JOIN move AS m ON m.id = tm.move_id ";
              let where = " WHERE p.id = ? AND (";
              let args = [pokeId];
              const movesLength = p.moves.length;
              for (let i = 0; i < movesLength; i++) {
                if (i === movesLength - 1)
                  where += "LOWER(REPLACE(m.name, ' ', '')) = ?)";
                else
                  where += "LOWER(REPLACE(m.name, ' ', '')) = ? OR ";
                args.push(p.moves[i]);
              }
              moveSelectSQL += where;
              //console.log(moveSelectSQL);
              let moveSelectResults = await executeQuery(conn, moveSelectSQL, args);
              if (moveSelectResults.length !== movesLength) {
                return conn.rollback(() => { reject(`A move on ${p.name} is invalid`); });
              }
              let moveIds = moveSelectResults.map(m => m.move_id);
              //bulk insert into known_moves
              let bulkVals = moveIds.map(mid => [entryId, mid]);
              await executeQuery(conn, "INSERT INTO known_moves VALUES ?", [bulkVals]);
            } catch (err) {
              return conn.rollback(() => { reject(err) });
            }
          }
          conn.commit((err) => {
            if (err) {
              return conn.rollback(() => { reject(err); });
            }
            resolve(newTeamId);
          });
        });
      });
    });
  });
}

function executeQuery(conn, query, params = []) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, results, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

function validateTeamBody(body) {
  if (!body.public || typeof body.public !== 'boolean') {
    return false;
  }
  if (!body.name || typeof body.name !== 'string' || body.name.length < 3) {
    return false;
  }
  if (!body.pokemon || !Array.isArray(body.pokemon) || body.pokemon.length < 1 || body.pokemon.length > 6) {
    return false;
  }
  for (let p of body.pokemon) {
    if (!p.ability || !p.name) {
      return false;
    }
    p.ability = p.ability.replaceAll(' ', '').toLowerCase();
    p.name = p.name.replaceAll(' ', '').toLowerCase();
    if (!p.moves || !Array.isArray(p.moves) || p.moves.length < 1 || p.moves.length > 4) {
      return false;
    }
    p.moves = p.moves.map(m => m.replaceAll(' ', '').toLowerCase());
    p.item = p.item ? p.item.replaceAll(' ', '') : null;
  }
  return true;
}

module.exports = {
  createTeam: createTeam
}