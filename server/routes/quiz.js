const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

router.post('/submit', async (req, res) => {
  const { answers } = req.body;

  try {
    const weights = {};
    const languagePreference = [];

    // 🔍 Parse incoming tags
    Object.values(answers).forEach((val) => {
      if (typeof val === 'string' && val.trim() !== '' && val !== 'none') {
        const cleanVal = val.toLowerCase().trim();

        // 🎯 Extract language separately
        if (["english", "hindi", "tamil", "telugu", "kannada", "malayalam", "any"].includes(cleanVal)) {
          languagePreference.push(cleanVal);
          return;
        }

        const splitTags = cleanVal.split(/[\s,]+/);
        splitTags.forEach(t => {
          if (t) weights[t] = (weights[t] || 0) + 3;
        });
      }
    });

    const movies = await Movie.find();

    let filteredMovies = movies;

    // ✅ RELAXED Language filter (fixed)
    if (languagePreference.length > 0 && !languagePreference.includes("any")) {
      const targetLang = languagePreference[0];
      filteredMovies = movies.filter(
        m => m.language && m.language.toLowerCase().includes(targetLang)
      );
    }

    // ✅ Fallback if no movies found
    if (filteredMovies.length === 0) {
      filteredMovies = movies;
    }

    // 🎯 SCORING SYSTEM
    const scoredMovies = filteredMovies.map(movie => {
      let score = 0;

      // Match moodTags
      movie.moodTags?.forEach(tag => {
        if (weights[tag.toLowerCase()]) {
          score += weights[tag.toLowerCase()] * 3;
        }
      });

      // Match Genres
      movie.genre?.forEach(g => {
        const lowerG = g.toLowerCase();
        if (weights[lowerG]) score += weights[lowerG] * 2;

        Object.keys(weights).forEach(wTag => {
          if (lowerG.includes(wTag)) score += weights[wTag] * 2;
        });
      });

      // Match description & title
      Object.keys(weights).forEach(wTag => {
        if (
          movie.description?.toLowerCase().includes(wTag) ||
          movie.title?.toLowerCase().includes(wTag)
        ) {
          score += weights[wTag] * 1.5;
        }
      });

      return { movie, score };
    });

    // 🔥 Sort by score
    scoredMovies.sort((a, b) => {
      if (b.score === a.score) return Math.random() - 0.5;
      return b.score - a.score;
    });

    // ✅ Remove zero-score junk + fallback
    let topRecommendations = scoredMovies
      .filter(item => item.score > 0)
      .slice(0, 6)
      .map(item => item.movie);

    if (topRecommendations.length === 0) {
      topRecommendations = movies.slice(0, 6);
    }

    // 🧠 Explanation
    const topTags = Object.keys(weights)
      .sort((a, b) => weights[b] - weights[a])
      .slice(0, 3);

    let langContext = '';
    if (languagePreference.length > 0 && !languagePreference.includes("any")) {
      langContext = languagePreference[0].toUpperCase();
    }

    const explanation =
      topTags.length > 0 && topRecommendations.length > 0
        ? `These ${langContext || ''} movies match your vibe: ${topTags.join(', ')}.`
        : `Here are some great movies you might enjoy!`;

    res.json({ recommendations: topRecommendations, explanation });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;