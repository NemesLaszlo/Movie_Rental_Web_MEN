const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Movie = require('../models/Movie');
const Director = require('../models/Director');
const uploadPath = path.join('public', Movie.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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
router.post('/create', upload.single('coverImageName'), async (req, res) => {
  try {
    const existingMovie = await Movie.findOne({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
    }).lean();

    if (!existingMovie) {
      const fileName = req.file != null ? req.file.filename : null;

      const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        releaseDate: new Date(req.body.releaseDate),
        playTime: req.body.playTime,
        coverImageName: fileName,
        description: req.body.description,
      });

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

module.exports = router;
