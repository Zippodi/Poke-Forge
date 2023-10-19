const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);
//could add queries to sort by a base stat or alphabetical order

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway

//data
const pokemon = require("../_data/pokemon.json");
const types = require("../types/types");

//get pokemon by its name
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  //might have to parse for certain characters in Pokemon names, will test later
  //specifically apostraphes and type:null
  const obj = pokemon[name];
  if (obj) {
    res.status(200).json(obj);
  } else {
    res.status(404).json({ "error": "pokemon with specified name not found" });
  }
});

//get all pokemon with a certain type
//might want to only return names (or names+types or specific data entries needed)
router.get('/type/:type', (req, res) => {
  const type = req.params.type.toLowerCase();
  if (!types.typeList.includes(type)) {
    return res.status(400).json({ "error": "type specified is not a valid type" });
  }
  let arr = [];
  Object.values(pokemon).forEach((poke) => {
    const pokeTypes = poke.types.split(',');
    if (pokeTypes.includes(type)) {
      arr.push(poke);
    }
  });
  if (arr.length === 0) {
    res.status(404).json({ "error": "no pokemon with specified type found" });
  } else {
    res.status(200).json({ "pokemon": arr });
  }
});

router.get('/:name/weaknesses', (req, res) => {
  const name = req.params.name;
  if (!pokemon[name]) {
    return res.status(400).json({ "error": "pokemon with specified name not found" });
  }
  const pokeTypes = pokemon[name].types.split(',');
  const obj = types.getDefensesJson(pokeTypes[0], pokeTypes[1]);
  if (obj) {
    res.status(200).json(obj);
  } else {
    res.status(500).json({ "error": "could not get type defenses" });
  }
});

module.exports = router;

