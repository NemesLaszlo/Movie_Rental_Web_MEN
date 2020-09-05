const express = require('express');
const router = express.Router();

// @desc Basic route / Simple Page
// @route GET /
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
