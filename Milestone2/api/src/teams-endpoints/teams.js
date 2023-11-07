const express = require('express');
const router = express.Router();
// const a = require('../auth-endpoints/auth-middleware');
// router.use(a.auth);

const TeamDAO = require('../data/dao/TeamDAO');


//create a new team, returns id of created team
router.post('/create', (req, res) => {
  if (req.body) {
    TeamDAO.createTeam(req.body, 1).then(data => {
      return res.status(200).json({ id: data });
    }).catch(err => {
      handleError(err, res);
    });
  } else {
    return res.status(400).json({ error: "invalid request" });
  }
});


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
      reject("public must be a boolean value");
    }
    if (body.pokemon && Array.isArray(body.pokemon)) {
      //between 1-6 pokemon
      if (body.pokemon.length < 1 || body.pokemon.length > 6) {
        reject('Must specify between 1-6 pokemon');
      }
      body.pokemon.forEach((p) => {
        //valid held item check
        if (p.item && !items[p.item]) {
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

function handleError(err, res) {
  if (err.message) {
    return res.status(400).json({ error: err.message });
  } else {
    return res.status(500).json({ error: err });
  }
}

module.exports = router;