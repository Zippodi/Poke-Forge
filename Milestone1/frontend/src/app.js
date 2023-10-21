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

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));