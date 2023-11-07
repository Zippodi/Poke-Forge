const express = require('express');
const router = express.Router();

const PokemonDAO = require('../data/dao/PokemonDAO');

//get all pokemon
router.get("/", (req, res) => {
  PokemonDAO.getAllPokemon().then(pokemon => {
    res.status(200).json(pokemon);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get pokemon by its name
router.get('/:name', (req, res) => {
  //test with farfetch'd, nidoran, and type: null
  PokemonDAO.getPokemonByName(req.params.name).then(pokemon => {
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get pokemon by it's id
router.get('/id/:id', (req, res) => {
  PokemonDAO.getPokemonById(req.params.id).then(pokemon => {
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get all pokemon with a certain type
//might want to only return names (or names+types or specific data entries needed)
router.get('/type/:type', (req, res) => {
  PokemonDAO.getPokemonByType(req.params.type).then(pokemon => {
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ error: "Pokemon with that type not found" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

//get weaknesses of this pokemon, can be via id or name
router.get('/:identifier/defenses', (req, res) => {
  const identifier = req.params.identifier.toLowerCase();
  if (isNaN(identifier)) {
    PokemonDAO.getPokemonByName(identifier, true).then(data => {
      if (data) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ error: "Pokemon not found" });
      }
    }).catch(err => {
      handleError(err, res);
    });
  } else {
    PokemonDAO.getPokemonById(identifier, true).then(data => {
      if (data) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ error: "Pokemon not found" });
      }
    }).catch(err => {
      handleError(err, res);
    });
  }
});

//get moves a pokemon can learn, can be via id or name
router.get('/:identifier/moves', (req, res) => {
  const identifier = req.params.identifier.toLowerCase();
  PokemonDAO.getPokemonMoves(identifier, isNaN(identifier)).then(data => {
    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: "Could not get move data for this Pokemon" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

//get abilities a pokemon can have, can be via id or name
router.get('/:identifier/abilities', (req, res) => {
  const identifier = req.params.identifier.toLowerCase();
  PokemonDAO.getPokemonAbilities(identifier, isNaN(identifier)).then(data => {
    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: "Could not get move data for this Pokemon" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});


function handleError(err, res) {
  if (err.message) {
    return res.status(400).json({ error: err.message });
  } else {
    return res.status(500).json({ error: err });
  }
}

module.exports = router;

