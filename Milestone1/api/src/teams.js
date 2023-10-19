const express = require('express');
const router = express.Router();
const a = require('./authentication/auth-middleware');
router.use(a.auth);

//mimic retrieving from database
const testTeam1 =
{
  "username": "testuser",
  "userid": 1,
  "teamid": 1,
  "public": true,
  "pokemon": [{
    "mankey": {
      "moves": ["focuspunch", "bulldoze", "scratch", "dig"],
      "ability": "Vital Spirit",
      "item": null
    },
    "mankey": {
      "moves": ["seismictoss", "swift", "u-turn"],
      "ability": "Vital Spirit",
      "item": "leftovers"
    },
    "arceus": {
      "moves": ["judgement", "perishsong", "earthpower", "extremespeed"],
      "ability": "multitype",
      "item": "earthplate"
    }
  }]
}

const testTeam2 =
{
  "username": "testuser",
  "userid": 1,
  "teamid": 2,
  "public": false,
  "pokemon": [{
    "charizard": {
      "moves": ["airslash", "flamethrower", "fly", "dragonclaw"],
      "ability": "blaze",
      "item": "charizarditex"
    }
  }]
}

const testTeam3 =
{
  "username": "testuser2",
  "userid": 2,
  "teamid": 3,
  "public": true,
  "pokemon": [{
    "charizard": {
      "moves": ["flareblitz", "heatwave", "fly", "aerialace"],
      "ability": "solarpower",
      "item": "leftovers"
    },
    "pikachu": {
      "moves": ["thunderbolt", "irontail", "quickattack"],
      "ability": "static",
      "item": "lightball"
    }
  }]
}

const mockData = [testTeam1, testTeam2, testTeam3];

//create a new team: TODO
router.post('/create', (req, res) => {
  console.log("body of create team request: ", req.body);
  res.status(200).json({ "create-success": true });
});

//get all (public) teams
/**
 * possible filters (URL queries) for: 
 * - containing certain pokemon
 * - generation cap (would need to add to pokemon.json)
 * - exclude legends/mythicals (would need to manually add to pokemon.json)
 */
router.get('/', (req, res) => {
  let arr = [];
  mockData.forEach((t) => { if (t.public) arr.push(t) });
  if (arr.length > 0) {
    res.status(200).json({ "teams": arr });
  } else {
    res.status(404).json({ "error": "no teams found" });
  }
});

//edit specific existing team: TODO
router.put('/:teamid', (req, res) => {
  const id = req.params.teamid;
  //add logic to test if teamid belongs to user logged in - reject if no, return team if yes
  res.status(200).json({ "edited-team": id });
});

//get team via the teamid
router.get('/:teamid', (req, res) => {
  const id = req.params.teamid;
  for (const t of mockData) {
    if (t.teamid === id) {
      if (t.public || userBelongsToTeam(req.user, id)) {
        return res.status(200).json(t);
      } else {
        return res.status(401).json({ "error": "you are not authenticated to view this team" });
      }
    }
  }
  res.status(404).json({ "error": "team with that ID not found" });
});

//delete team TODO: clean up and implement after database introduced
router.delete('/:teamid', (req, res) => {
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
  mockData.forEach((t) => { if (t.teamid === teamId) team = t });
  return team && team.userid === user.id;
}

module.exports = router;