const express = require('express');
const router = express.Router();
const a = require('./authentication/auth-middleware');
router.use(a.auth);

//note that this data, along with the moves and abilities, might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway
router.get('/pokemon/:name', (req, res) => {
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

module.exports = router;

