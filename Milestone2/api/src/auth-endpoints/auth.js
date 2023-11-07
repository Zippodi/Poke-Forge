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
  //on successful login either log user in and take to homepage or redirect to login page with data saying account made
  res.status(200).json({ "registered": true });
});

module.exports = router;