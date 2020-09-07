const mongoose = require('mongoose');
const Actor = require('./Actor');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  playTime: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Director',
  },
  status: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Not Available'],
    required: true,
  },
});

MovieSchema.virtual('coverImagePath').get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString('base64')}`;
  }
});

// Delete every actor with the movie
MovieSchema.pre('remove', function (next) {
  Actor.find({ movie: this.id }, (err, actors) => {
    if (err) {
      next(err);
    } else if (actors.length > 0) {
      actors.forEach((actor) => actor.remove());
      next();
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('Movie', MovieSchema);
