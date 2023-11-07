const express = require('express');
const router = express.Router();

const AbilityDAO = require('../data/dao/AbilityDAO');

//get all abilitys
router.get('/', (req, res) => {
  AbilityDAO.getAllAbilities().then(abilities => {
    res.status(200).json(abilities);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get specific ability by it's name
router.get('/:name', (req, res) => {
  AbilityDAO.getAbilityByName(req.params.name).then(ability => {
    if (ability) {
      res.status(200).json({ ability });
    } else {
      res.status(404).json({ error: 'Ability not found' });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

//get ability by it's id
router.get('/id/:id', (req, res) => {
  AbilityDAO.getAbilityById(req.params.id).then(ability => {
    if (ability) {
      res.status(200).json({ ability });
    } else {
      res.status(404).json({ error: 'Ability not found' });
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