const express = require('express');
const router = express.Router();
const MoveDAO = require('../data/dao/MoveDAO');
const { handleError } = require('../utils');

/*
Notes about move data:
 * Move power of 1 = Undetermined power (OHKO, fixed HP, fling, weight based, HP based, counter, reversal, etc.)
 * Move accuracy of 0 means accuracy has no effect (healing moves, stat raising moves, etc.)
 * Move accuracy of -1 means always hits (Aerial Ace, Vital Thorw, etc.)
 * Move power of 0 means no power (stat moves, status moves, healing moves, etc.)
 * These are updated for display purposes in MoveDAO
*/

//get all moves
router.get('/', (req, res) => {
  MoveDAO.getAllMoves().then(moves => {
    if (moves) {
      res.status(200).json(moves);
    } else {
      res.status(500).json({ error: "Could not find move data" });
    }
  }).catch(err => {
    handleError(err, res)
  });
});

//get move based on its name
router.get("/:name", (req, res) => {
  MoveDAO.getMoveByName(req.params.name).then(move => {
    if (move) {
      res.status(200).json(move);
    } else {
      res.status(404).json({ error: "Move not found" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

//get move based on its id
router.get("/id/:id", (req, res) => {
  MoveDAO.getMoveById(req.params.id).then(move => {
    if (move) {
      res.status(200).json(move);
    } else {
      res.status(404).json({ error: "Move not found" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

router.get("/type/:type", (req, res) => {
  MoveDAO.getMoveByType(req.params.type).then(moves => {
    if (moves) {
      res.status(200).json(moves);
    } else {
      res.status(404).json({ error: "Move with that type not found" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});

router.get("/category/:category", (req, res) => {
  MoveDAO.getMoveByCategory(req.params.category).then(moves => {
    if (moves) {
      res.status(200).json(moves);
    } else {
      res.status(404).json({ error: "Move with that category not found" });
    }
  }).catch(err => {
    handleError(err, res);
  });
});


/**
 * takes a query m for the names of 1-4 moves to test
 * Examples: 
 * - ?m=earthquake
 * - ?m=earthquake&m=earthpower&m=dig&m=bulldoze
 * Returns how well a Pokemon with the specified moves could hit Pokemon of different types
 */
router.get("/attack/effectiveness", (req, res) => {
  const moveNames = req.query.m;
  if (!moveNames) {
    return res.status(400).json({ "error": "Must specify at least one move" });
  }
  const movesArr = Array.isArray(moveNames) ? moveNames : [moveNames];
  if (movesArr.length > 4) {
    return res.status(400).json({ "error": "Can specify a maximum of 4 moves" });
  }
  MoveDAO.getMoveEffectiveness(movesArr).then((data) => {
    res.status(200).json({ data });
  }).catch(err => {
    handleError(err, res);
  });
});

module.exports = router;