const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Movie',
  },
});

module.exports = mongoose.model('Actor', ActorSchema);
