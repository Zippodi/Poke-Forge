const express = require('express');
const router = express.Router();
const a = require('./authentication/auth-middleware');
router.use(a.auth);

//data
const pokemon = require("./_data/pokemon.json");
const types = require("./types/types");
const items = require('./_data/items.json');

//mimic retrieving from database
const testTeam1 =
{
  "username": "testuser",
  "userid": 1,
  "teamid": 1,
  "public": true,
  "pokemon": [
    {
      "name": "mankey",
      "moves": ["focuspunch", "bulldoze", "scratch", "dig"],
      "ability": "Vital Spirit",
      "item": null
    },
    {
      "name": "mankey",
      "moves": ["seismictoss", "swift", "u-turn"],
      "ability": "Vital Spirit",
      "item": "leftovers"
    },
    {
      "name": "arceus",
      "moves": ["judgement", "perishsong", "earthpower", "extremespeed"],
      "ability": "multitype",
      "item": "earthplate"
    }
  ]
}

const testTeam2 =
{
  "username": "testuser",
  "userid": 1,
  "teamid": 2,
  "public": false,
  "pokemon": [
    {
      "name": "charizard",
      "moves": ["airslash", "flamethrower", "fly", "dragonclaw"],
      "ability": "blaze",
      "item": "charizarditex"
    }
  ]
}

const testTeam3 =
{
  "username": "testuser2",
  "userid": 2,
  "teamid": 3,
  "public": true,
  "pokemon": [
    {
      "name": "charizard",
      "moves": ["flareblitz", "heatwave", "fly", "aerialace"],
      "ability": "solarpower",
      "item": "leftovers"
    },
    {
      "name": "pikachu",
      "moves": ["thunderbolt", "irontail", "quickattack"],
      "ability": "static",
      "item": "lightball"
    }
  ]
}

const mockData = [testTeam1, testTeam2, testTeam3];

//get all (public) teams
/**
 * TODO: User query p to filter by containing pokemon
 * EX:
 * ?p=pikachu
 * ?p=charizard&p=blastoise&p=venusaur
 */
router.get('/', (req, res) => {
  let q = req.query.p;
  if (!Array.isArray(q)) {
    q = [q];
  }
  let pokeNames = q.filter((p) => pokemon[p]);
  let arr = [];
  mockData.forEach((t) => {
    if (t.public) {
      arr.push(t);
    }
  });
  if (arr.length > 0) {
    res.status(200).json({ "teams": arr });
  } else {
    res.status(404).json({ "error": "no teams found" });
  }
});

//create a new team
router.post('/create', (req, res) => {
  validateTeam(req).then(result => {
    //save team to database
    res.status(200).json({ "success": true });
  }).catch(error => {
    res.status(400).json({ "error": error });
  });
});

//edit specific existing team
router.put('/id/:teamid', (req, res) => {
  const id = req.params.teamid;
  //TODO test if team already exists and belongs to the logged in user
  validateTeam(req).then(result => {
    //save team to database
    res.status(200).json({ "success": true });
  }).catch(error => {
    res.status(400).json({ "error": error });
  });
});

//get team via the teamid
router.get('/id/:teamid', (req, res) => {
  const id = req.params.teamid;
  for (const t of mockData) {
    if (t.teamid == id) {
      if (t.public || userBelongsToTeam(req.user, id)) {
        return res.status(200).json(t);
      } else {
        return res.status(403).json({ "error": "you are not authorized to view this team" });
      }
    }
  }
  res.status(404).json({ "error": "team with that ID not found" });
});

//delete team TODO: clean up and implement after database introduced
router.delete('/id/:teamid', (req, res) => {
  const id = req.params.teamid;
  if (userBelongsToTeam(req.user, id)) {
    //can response change if needed
    res.status(200).json({ "deleted": id });
  } else {
    res.status(400).json({ "error": "could not delete team" });
  }
});

//get all public teams for a specific user
router.get('/user/:username', (req, res) => {
  const username = req.params.username;
  let arr = [];
  mockData.forEach((t) => { if (t.public && t.username === username) arr.push(t) });
  if (arr.length > 0) {
    res.status(200).json({ "teams": arr });
  } else {
    res.status(404).json({ "error": "no teams found" });
  }
});

//get all teams (public and private) for the logged in user
router.get('/myteams', (req, res) => {
  const userId = req.user.id;
  let arr = [];
  mockData.forEach((t) => { if (t.userid === userId) arr.push(t) });
  if (arr.length > 0) {
    res.status(200).json({ "teams": arr });
  } else {
    res.status(404).json({ "error": "no teams found" });
  }
});

//probably gonna get replaced later so wont bother with proper error checking yet
function userBelongsToTeam(user, teamId) {
  let team = null;
  mockData.forEach((t) => { if (t.teamid == teamId) team = t });
  return team && team.userid == user.id;
}

async function validateTeam(req) {
  return new Promise((resolve, reject) => {
    //TODO: verify that userid and username exist as users and match each other
    const body = req.body;
    if (typeof body.public !== 'boolean') {
      reject("Invalid request");
    }
    if (body.pokemon && Array.isArray(body.pokemon)) {
      body.pokemon.forEach((p) => {
        //valid pokemon name check
        if (!pokemon[p.name]) {
          reject(`${p.name} is not a valid Pokemon name`);
        }
        //valid held item check
        if (p.item !== null && !items[p.item]) {
          reject(`${p.item} is not a valid item`);
        }
        //valid ability check
        let abils = pokemon[p.name].abilities.split(',');
        if (pokemon[p.name].hidden_abilities) {
          abils = abils.concat(pokemon[p.name].hidden_abilities.split(','));
        }
        //can comment out for testing team creation itself if needed so you dont need to look up valid abilities
        if (!abils.includes(p.ability)) {
          reject(`${p.ability} is not a valid ability on this Pokemon`);
        }
        //valid moves check
        if (!p.moves || !Array.isArray(p.moves) || !p.moves[0]) {
          reject("Pokemon must have at least one move");
        }
        //can comment out for testing team creation itself if needed so you dont need to look up movesets
        p.moves.forEach(move => {
          const pokeMoves = pokemon[p.name].moves.split(',');
          if (!pokeMoves.includes(move)) {
            reject(`${move} is not a valid move on this Pokemon`);
          }
        });
      });
    } else {
      reject("Invalid request");
    }
    resolve();
  });
}

module.exports = router;