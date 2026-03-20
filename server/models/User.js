const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizResults: [{
    date: { type: Date, default: Date.now },
    recommendedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    explanation: String
  }],
  savedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

module.exports = mongoose.model('User', UserSchema);
