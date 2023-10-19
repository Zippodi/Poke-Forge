const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
//api routes
const auth = require('./authentication/auth');
const pokemon = require('./pokemon/pokemon-data');
const moves = require('./pokemon/moves');
const teams = require('./teams');

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

//use routes
app.use('/api/auth', auth);
app.use('/api/pokemon', pokemon);
app.use('/api/moves', moves);
app.use('/api/teams', teams);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));