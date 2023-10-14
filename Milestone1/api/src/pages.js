const express = require('express');
const router = express.Router();
const path = require('path');
const a = require('./authentication/auth-middleware');
router.use(a.auth);

// //home page
// router.get("/", (req, res) => {
//   res.status(200).json({ "home-page": "display" });
// });

// //test showing page
// router.get('/test', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'static', 'index.html'));
// });

module.exports = router;