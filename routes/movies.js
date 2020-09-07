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

// @desc Get all available movies
// @route GET /movies/available
router.get('/available', async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'Available' }).sort({
      createdAt: 'desc',
    });

    res.render('movies/available', { movies: movies });
  } catch (error) {
    console.error(error);
    res.render('error/500');
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
        status: req.body.status,
      });
      saveCover(movie, req.body.cover);

      const newMovie = await movie.save();
      res.redirect(`/movies/${newMovie.id}`);
    } else {
      res.render('error/500');
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Get a movie by id
// @route GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    // populate - access to the director of this movie - "pre loads the director information"
    const movie = await Movie.findById(req.params.id)
      .populate('director')
      .exec();

    res.render('movies/show', { movie: movie });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Get the movie edit page by id (Update)
// @route GET /movies/:id/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const directors = await Director.find({});
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.render('error/404');
    }

    res.render('movies/edit', { movie: movie, directors: directors });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Update a movie functionality
// @route PUT /movies/:id
router.put('/:id', async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.render('error/404');
    }
    movie.title = req.body.title;
    movie.director = req.body.director;
    movie.releaseDate = new Date(req.body.releaseDate);
    movie.playTime = req.body.playTime;
    movie.status = req.body.status;
    movie.description = req.body.description;
    if (req.body.cover != null && req.body.cover != '') {
      saveCover(movie, req.body.cover);
    }

    await movie.save();
    res.redirect(`/movies/${movie.id}`);
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Delete a movie functionality
// @route DELETE /movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.render('error/404');
    }

    await movie.remove();
    res.redirect('/movies');
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
