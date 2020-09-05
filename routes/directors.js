const express = require('express');
const router = express.Router();
const Director = require('../models/Director');

// @desc Get all directors - with a search option
// @route GET /directors
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const directors = await Director.find(searchOptions);
    res.render('directors/index', {
      directors: directors,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// @desc Get - Create new director page
// @route GET /directors/new
router.get('/new', (req, res) => {
  res.render('directors/new', { director: new Director() });
});

// @desc Create new author functionality
// @route POST /directors/create
router.post('/create', async (req, res) => {
  try {
    const existingDirectory = await Director.findOne({
      name: req.body.name,
    }).lean();

    if (!existingDirectory) {
      await Director.create(req.body);
      res.redirect('/directors');
    } else {
      res.render('error/500');
    }
  } catch (error) {}
});

module.exports = router;
