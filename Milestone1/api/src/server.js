const express = require('express');
const path = require('path');

//require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
//api routes
const auth = require('./authentication/auth');
const pokemon = require('./poke-data/pokemon');
const moves = require('./poke-data/moves');
const teams = require('./teams');
const abilities = require('./poke-data/abilities');
const items = require('./poke-data/items');

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

//use routes
app.use('/auth', auth);
app.use('/teams', teams);

app.use('/pokemon', pokemon);
app.use('/moves', moves);
app.use('/abilities', abilities);
app.use('/items', items);

//docker logs -f api
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));