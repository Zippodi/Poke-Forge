const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);
//could add queries to sort by a base stat or alphabetical order

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway
router.get('/:name', (req, res) => {
  const name = req.params.name;
  res.status(200).json({
    "name": name,
    "types": "type1,type2",
    "base_stats": "HP,Attack,Defense,Speed,Sp. Atk,Sp. Def",
    "abilities": "ability1,ability2",
    "hidden_abilities": "hidden-ability",
    "moves": "list,of,moves",
    "egg_groups": "Group1,Group2",
    "evolutions": "NAME,method,extra,NAME,method"
  });
});

//get all pokemon with a certain type
//might want to only return names (or names+types or specific data entries needed)
router.get('/type/:type', (req, res) => {
  const type = req.params.type;
  res.status(200).json([{
    "name": 'PokemonName',
    "types": `${type},type2`,
    "base_stats": "HP,Attack,Defense,Speed,Sp. Atk,Sp. Def",
    "abilities": "ability1,ability2",
    "hidden_abilities": "hidden-ability",
    "moves": "list,of,moves",
    "egg_groups": "Group1,Group2",
    "evolutions": "NAME,method,extra,NAME,method"
  },
  {
    "name": 'PokemonName2',
    "types": `${type}`,
    "base_stats": "HP,Attack,Defense,Speed,Sp. Atk,Sp. Def",
    "abilities": "ability1",
    "hidden_abilities": null,
    "moves": "list,of,moves",
    "egg_groups": "Group1",
    "evolutions": null
  }]);
});

module.exports = router;

