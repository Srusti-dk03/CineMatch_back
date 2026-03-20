const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Save a movie to user profile
router.post('/save-movie', auth, async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedMovies.includes(movieId)) {
      user.savedMovies.push(movieId);
      await user.save();
    }
    res.json(user.savedMovies);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedMovies');
    res.json({
      username: user.username,
      email: user.email,
      savedMovies: user.savedMovies,
      quizResults: user.quizResults
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
