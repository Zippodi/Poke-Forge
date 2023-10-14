const express = require('express');
const router = express.Router();
const a = require('./authentication/auth-middleware');
router.use(a.auth);

//might want to make /team/:userid or something
//create a new team (public/private maybe a setting in json sent?)
router.post('/teams', (req, res) => {
  console.log("body of create team request: ", req.body);
  res.status(200).json({ "create-success": true });
});

//edit specific existing team
router.put('/teams/:teamid', (req, res) => {
  console.log("body of put team request: ", req.body);
  //add logic to test if teamid belongs to user logged in - reject if no, return team if yes
  res.status(200).json({ "edit-success": true });
});

//get all (public) teams
//possible filters (URL queries) for: containing certain pokemon, generation cap, exclude legends/mythicals
router.get('/teams', (req, res) => {
  //select * from teams where public = 1 order by creationDate
  res.status(200).json({ "all-teams": "here" });
});

//get all teams created by user with given userid
router.get('/teams/:userid', (req, res) => {
  const id = req.params.userid;
  //add some logic to test if the id is the user logged in - provide public teams if not, all teams if yes
  //select * from teams where userId = id order by creationDate
  res.status(200).json({ "all-teams-for-user": "here" });
});

//get team via the teamid (database value)
router.get('/teams/:teamid', (req, res) => {
  const id = req.params.teamid;
  //add logic to test if teamid belongs to user logged in - reject if no, return team if yes
  //select * from teams where teamid = id
  res.status(200).json({ "specific-team": "here" });
});

//delete team
router.delete('/teams/:teamid', (req, res) => {
  const id = req.params.teamid;
  //add logic to test if teamid belongs to user logged in - reject if no, delete team if yes
  //delete from teams where teamid = id
  res.status(200).json({ "delete-success": true });
});