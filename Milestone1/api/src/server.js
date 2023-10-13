const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ your_api: 'it works' });
});

app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "src", "static", "index.html"));
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));