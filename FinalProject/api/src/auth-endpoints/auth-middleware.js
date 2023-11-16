const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "UserToken";

exports.TokenMiddleware = (req, res, next) => {
  let token = null;
  if (!req.cookies[TOKEN_COOKIE_NAME]) {
    //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1];
    }
  }
  else { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME];
  }

  if (!token) { // If we don't have a token
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  //If we've made it this far, we have a token. We need to validate it
  try {
    const decoded = jwt.verify(token, process.env.API_SECRET_KEY);
    req.user = decoded.user;
    next(); //Make sure we call the next middleware
  }
  catch (err) { //Token is invalid
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
}


exports.generateToken = (req, res, user) => {
  let data = {
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Use the exp registered claim to expire token in 1 hour
  }
  const token = jwt.sign(data, process.env.API_SECRET_KEY);
  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 2 * 60 * 1000
  });
};


exports.removeToken = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
}

