const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
//api routes
const auth = require('./auth');
const pages = require('./pages');

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

//authentication middleware
app.use((req, res, next) => {
  //dont need to authenticate users if they are trying to register
  if (req.originalUrl === '/register' || req.originalUrl === '/login') {
    return next();
  }
  let authenticated = true; //authenticate user - change to false to test redirect
  if (!authenticated) {
    return res.redirect(303, "/login");
  }
  next();
});


app.use('/auth', auth);
app.use('/', pages);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));