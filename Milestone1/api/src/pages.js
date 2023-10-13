const express = require('express');
const router = express.Router();

router.get("/register", (req, res) => {
  res.status(200).json({ "register-page": "display" });
});

router.get("/login", (req, res) => {
  //dont need this conditional if registering logs in user as well
  if (req.params.acc === 'new') {
    console.log("show account created message");
  }
  res.status(200).json({ "login-page": "display" });
});

//home page
router.get("/", (req, res) => {
  res.status(200).json({ "home-page": "display" });
});

module.exports = router;