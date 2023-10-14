const express = require('express');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
//api routes
const auth = require('./authentication/auth');
const pages = require('./pages');

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const staticPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'static');
app.use(express.static(staticPath));

//use routes
app.use('/api/auth', auth);
app.use('/api', pages);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));