const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   
  res.json([]);
})

// app.get('/api/v1/login', (req, res) => {
//   res.send('login!')
// })

// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!')
// })

module.exports = router