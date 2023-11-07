const express = require('express');
const router = express.Router();

const ItemDAO = require('../data/dao/ItemDAO');

//get all items
router.get('/', (req, res) => {
  ItemDAO.getAllItems().then(items => {
    res.status(200).json(items);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get specific item by it's name
router.get('/:name', (req, res) => {
  ItemDAO.getItemByName(req.params.name).then(item => {
    if (item) {
      res.status(200).json({ item });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

//get item by it's id
router.get('/id/:id', (req, res) => {
  ItemDAO.getItemById(req.params.id).then(item => {
    if (item) {
      res.status(200).json({ item });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

module.exports = router;