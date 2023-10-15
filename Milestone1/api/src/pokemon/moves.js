const express = require('express');
const router = express.Router();
const a = require('../authentication/auth-middleware');
router.use(a.auth);
/**
 * Notes about move data:
 * Move power of 1 = Undetermined power (OHKO, fixed HP, fling, weight based, HP based, counter, reversal, etc.)
 * Move accuracy of 0 means always hits (like aerial ace) or no need for accuracy (healing, stat raising, baton pass, etc.)
 * Move power of 0 means no power (stat moves, status moves, healing moves, etc.)
 * 
 * Could add queries for sorting by power/pp/accuracy/alphabetical
 */

//that this data might want to be made available to the client off the bat.
//so it can be provided as offline functionality to browse pokemon.
//However we should have it in the database/backend anyway
router.get("/:name", (req, res) => {
  const name = req.params.name;
  res.status(200).json({
    "name": name,
    "type": "type",
    "category": "category",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "description": "description"
  });
});

//all moves with a certain type
router.get("/type/:type", (req, res) => {
  const type = req.params.type;
  res.status(200).json([{
    "name": "MoveName",
    "type": type,
    "category": "category",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "description": "description"
  },
  {
    "name": "MoveName2",
    "type": type,
    "category": "category",
    "power": 0,
    "accuracy": 0,
    "pp": 15,
    "description": "description"
  }]);
});

//all moves with a certain category
router.get("/category/:category", (req, res) => {
  const cat = req.params.category;
  res.status(200).json([{
    "name": "MoveName",
    "type": "type",
    "category": cat,
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "description": "description"
  },
  {
    "name": "MoveName2",
    "type": "type",
    "category": cat,
    "power": 0,
    "accuracy": 90,
    "pp": 20,
    "description": "description"
  }]);
});

module.exports = router;