const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// @desc Get all movies - with a search option
// @route GET /movies
router.get('/', async (req, res) => {
  let query = Movie.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.releasedBefore != null && req.query.releasedBefore != '') {
    query = query.lte('releaseDate', req.query.releasedBefore);
  }
  if (req.query.releasedAfter != null && req.query.releasedAfter != '') {
    query = query.gte('releaseDate', req.query.releasedAfter);
  }
  try {
    const movies = await query.exec();
    res.render('movies/index', {
      movies: movies,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// @desc Get - Create new movie page
// @route GET /movies/new
router.get('/new', async (req, res) => {
  try {
    const directors = await Director.find({});
    const movie = new Movie();
    res.render('movies/new', { directors: directors, movie: movie });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Create new movie functionality
// @route POST /movies/create
router.post('/create', async (req, res) => {
  try {
    const existingMovie = await Movie.findOne({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
    }).lean();

    if (!existingMovie) {
      const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        releaseDate: new Date(req.body.releaseDate),
        playTime: req.body.playTime,
        description: req.body.description,
      });
      saveCover(movie, req.body.cover);

      const newMovie = await movie.save();
      res.redirect('/movies');
    } else {
      res.render('error/500');
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

function saveCover(movie, coverEncoded) {
  if (coverEncoded == null) {
    return;
  }
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    movie.coverImage = new Buffer.from(cover.data, 'base64');
    movie.coverImageType = cover.type;
  }
}

module.exports = router;
