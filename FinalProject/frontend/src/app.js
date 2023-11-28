const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));

function getFile(filename) {
  return path.join(__dirname, 'static', 'templates', filename);
}

app.get('/', (req, res) => {
  res.sendFile(getFile('login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(getFile('register.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(getFile('home.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(getFile('createnewteam.html'));
});

app.get('/pokemon', (req, res) => {
  res.sendFile(getFile('pokemon-data/pokemon.html'));
});

app.get('/pokemon/info/:name', (req, res) => {
  res.sendFile(getFile('pokemon-data/pokemonview.html'));
});

app.get('/viewotherteams', (req, res) => {
  res.sendFile(getFile('viewotherteams.html'));
});

app.get('/vieweditteams', (req, res) => {
  res.sendFile(getFile('vieweditteams.html'));
});

app.get('/editteam', (req, res) => {
  res.sendFile(getFile('editteam.html'));
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));