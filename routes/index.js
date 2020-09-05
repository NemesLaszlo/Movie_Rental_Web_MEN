const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @desc Basic route / Home Page - Main page with the recently added movies
// @route GET /
router.get('/', async (req, res) => {
  let movies = [];
  try {
    movies = await Movie.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch (error) {
    movies = [];
    console.error(error);
  }
  res.render('index', { movies: movies });
});

module.exports = router;
