const exress = require('express');

exports.auth = (req, res, next) => {
  let authenticated = true; //authenticate user - change to false to test redirect
  if (!authenticated) {
    // return res.redirect(303, "/api/auth/login");
    return res.status(401).json({ "authenticated": false });
  } else {
    req.user = { id: 1, username: "testuser" };
  }
  next();
}