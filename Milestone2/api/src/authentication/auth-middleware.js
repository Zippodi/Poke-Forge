const exress = require('express');

exports.auth = (req, res, next) => {
  let authenticated = true; //authenticate user
  if (!authenticated) {
    // return res.redirect(303, "/api/auth/login"); //redirect to login page
    return res.status(401).json({ "authenticated": false });
  } else {
    req.user = { id: 1, username: "testuser" }; //test user information
  }
  next();
}