const express = require('express');
const router = express.Router();
const Director = require('../models/Director');
const Movie = require('../models/Movie');

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
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Get the director by id
// @route GET /directors/:id
router.get('/:id', async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    const movies = await Movie.find({ director: director.id }).limit(6).exec();
    res.render('directors/show', {
      director: director,
      moviesByDirector: movies,
    });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Get the director edit page by id (Update)
// @route GET /directors/:id/edit
router.get('/:id/edit', async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) {
      return res.render('error/404');
    }

    res.render('directors/edit', { director: director });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Update a director functionality
// @route PUT /directors/:id
router.put('/:id', async (req, res) => {
  try {
    let director = await Director.findById(req.params.id).lean();

    if (!director) {
      return res.render('error/404');
    }
    director = await Director.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.redirect(`/directors/${director.id}`);
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// @desc Delete a director functionality
// @route DELETE /directors/:id
// If you delete a director, every movie of the director will be deleted too.
router.delete('/:id', async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.render('error/404');
    }

    await director.remove();
    res.redirect('/directors');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;
