const mongoose = require('mongoose');
const Movie = require('./Movie');

const DirectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Code if the director still has movies in the database, you can not delete the director
/*
DirectorSchema.pre('remove', function (next) {
  Movie.find({ director: this.id }, (err, movies) => {
    if (err) {
      next(err);
    } else if (movies.length > 0) {
      next(new Error('This director has movies still!'));
    } else {
      next();
    }
  });
});
*/

// Delete every movie with the director
DirectorSchema.pre('remove', function (next) {
  Movie.find({ director: this.id }, (err, movies) => {
    if (err) {
      next(err);
    } else if (movies.length > 0) {
      movies.forEach((movie) => movie.remove());
      next();
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('Director', DirectorSchema);
