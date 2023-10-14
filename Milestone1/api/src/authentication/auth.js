const express = require('express');
const router = express.Router();

//-----------Login/Register Requests-----------------
router.post('/login', (req, res) => {
  console.log("body of login request: ", req.body);
  //authenticate user
  res.status(200).json({ "authenticated": true });
});

router.post('/register', (req, res) => {
  //validate registration data
  console.log("body of register request: ", req.body);
  //on successful login either log user in and take to homepage or (below) redirect to login page with data saying account made
  //TODO replace with session if redirect is wanted
  res.redirect("/login?acc=new");
});

module.exports = router;