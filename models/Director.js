const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Director', DirectorSchema);
