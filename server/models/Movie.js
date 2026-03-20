const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: [String],
  moodTags: [String], // e.g., 'dark', 'funny', 'emotional', 'thriller', 'action', 'romance', 'sci-fi', 'feel-good'
  rating: Number,
  description: String,
  posterUrl: String,
  releaseYear: Number,
  language: String,
  ottPlatforms: [String],
});

module.exports = mongoose.model('Movie', MovieSchema);
