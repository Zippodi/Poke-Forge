const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);
/*
 * Notes about move data:
 * Move power of 1 = Undetermined power (OHKO, fixed HP, fling, weight based, HP based, counter, reversal, etc.)
 * Move accuracy of 0 means always hits (like aerial ace) or no need for accuracy (healing, stat raising, baton pass, etc.)
 * Move power of 0 means no power (stat moves, status moves, healing moves, etc.)
 * 
 * Could add queries for sorting by power/pp/accuracy/alphabetical
 */

//data
const moves = require('../_data/moves.json');
const types = require('../types/types').typeList;

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway

//get move based on its name
router.get("/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const obj = moves[name];
  if (obj) {
    res.status(200).json(obj);
  } else {
    res.status(404).json({ "error": "move name not found" });
  }
});

//all moves with a certain type
router.get("/type/:type", (req, res) => {
  const type = req.params.type.toLowerCase();
  if (!types.includes(type)) {
    return res.status(400).json({ "error": "type specified is not a valid type" });
  }
  let arr = [];
  Object.values(moves).forEach((move) => {
    if (move.type === type) {
      arr.push(move);
    }
  });
  if (arr.length === 0) {
    res.status(404).json({ "error": "no moves with specified type found" });
  } else {
    res.status(200).json({ "moves": arr });
  }
});

//all moves with a certain category
router.get("/category/:category", (req, res) => {
  const cat = req.params.category.toLowerCase();
  if (!["physical", "special", "status"].includes(cat)) {
    return res.status(400).json({ "error": "category specified is not a valid type" });
  }
  let arr = [];
  Object.values(moves).forEach((move) => {
    if (move.category === cat) {
      arr.push(move);
    }
  });
  if (arr.length === 0) {
    res.status(404).json({ "error": "no moves with specified category found" });
  } else {
    res.status(200).json({ "moves": arr });
  }
});

module.exports = router;