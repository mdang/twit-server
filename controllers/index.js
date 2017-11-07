const express = require('express');
const router = express.Router();

/* GET Homepage */
router.get('/', (req, res) => {
  res.render('index', {
    ready: true
  });
});

module.exports = router;