const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway

//data
const items = require('../_data/items.json');

//get all items
router.get('/', (req, res) => {
  res.status(200).json({ "items": items });
});

//get specific item
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const obj = items[name];
  if (obj) {
    res.status(200).json({ name: obj });
  } else {
    res.status(404).json({ "error": "item with specified name not found" });
  }
});

module.exports = router;