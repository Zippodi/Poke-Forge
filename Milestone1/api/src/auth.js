const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  console.log("body of login request: ", req.body);
  //authenticate user
  res.status(200).json({ "authenticated": true });
});

router.post('/register', (req, res) => {
  //validate registration data
  console.log("body of register request: ", req.body);
  //TODO replace with session
  res.redirect("/login?acc=new"); //successful registration
});

module.exports = router;