const express = require('express');
const router = express.Router();
const a = require('./authentication/auth-middleware');
router.use(a.auth);

//create a new team
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
  res.status(200).json({ "all-teams": "here" });
});

//edit specific existing team
router.put('/:teamid', (req, res) => {
  const id = req.params.teamid;
  console.log("body of put team request: ", req.body);
  //add logic to test if teamid belongs to user logged in - reject if no, return team if yes
  res.status(200).json({ "edited-team": id });
});

//get team via the teamid
router.get('/:teamid', (req, res) => {
  const id = req.params.teamid;
  res.status(200).json({ "specific-team": id });
});

//delete team
router.delete('/:teamid', (req, res) => {
  const id = req.params.teamid;
  //add logic to test if teamid belongs to user logged in - reject if no, delete team if yes
  res.status(200).json({ "deleted-team": id });
});

//get all public teams for a specific user
router.get('/user/:userid', (req, res) => {
  const userid = req.params.userid;
  res.status(200).json({ "all-public-teams-for-user": userid });
});

//get all teams (public and private) for the logged in user
router.get('/myteams', (req, res) => {
  res.status(200).json({ "all-teams": "for-logged-in-user" });
});

module.exports = router;