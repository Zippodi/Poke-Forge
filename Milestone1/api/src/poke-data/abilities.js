const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);

const pokemon = require('../_data/pokemon.json');
const abilities = require('../_data/abilities.json');

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway

//get all abilities
router.get('/', (req, res) => {
  res.status(200).json(abilities);
});

//get ability by its name
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const abil = abilities[name];
  if (!abil) {
    res.status(400).json({ "error": "no ability with that name" });
  } else {
    res.status(200).json({ name: abil });
  }
});

module.exports = router;