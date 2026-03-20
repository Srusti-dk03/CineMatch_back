const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

router.post('/submit', async (req, res) => {
  const { answers } = req.body; 
  
  try {
    const weights = {};
    const languagePreference = [];

    // Parse incoming tags
    Object.values(answers).forEach((val) => {
      if (typeof val === 'string' && val.trim() !== '' && val !== 'none') {
        const cleanVal = val.toLowerCase().trim();
        // Extract language separately
        if (["english", "hindi", "tamil", "telugu", "kannada", "malayalam", "any"].includes(cleanVal)) {
          languagePreference.push(cleanVal);
          return; 
        }

        const splitTags = cleanVal.split(/[\s,]+/);
        splitTags.forEach(t => {
          if (t) weights[t] = (weights[t] || 0) + 3; // +3 for explicit tags
        });
      }
    });

    const movies = await Movie.find();

    let filteredMovies = movies;
    // VERY STRICT Language Enforcement: Only show exact matches to avoid dummy output
    if (languagePreference.length > 0 && !languagePreference.includes("any")) {
      const targetLang = languagePreference[0];
      filteredMovies = movies.filter(m => m.language && m.language.toLowerCase() === targetLang);
    }

    const scoredMovies = filteredMovies.map(movie => {
      let score = 0;
      
      // Match moodTags (3x multiplier for hyper accuracy)
      movie.moodTags.forEach(tag => {
        if (weights[tag.toLowerCase()]) score += weights[tag.toLowerCase()] * 3;
      });
      
      // Match Genres
      movie.genre.forEach(g => {
        const lowerG = g.toLowerCase();
        if (weights[lowerG]) score += weights[lowerG] * 2;
        Object.keys(weights).forEach(wTag => {
          if (lowerG.includes(wTag)) score += weights[wTag] * 2;
        });
      });
      
      // Match descriptions & titles
      Object.keys(weights).forEach(wTag => {
        if (movie.description.toLowerCase().includes(wTag) || movie.title.toLowerCase().includes(wTag)) {
          score += weights[wTag] * 1.5;
        }
      });

      return { movie, score };
    });

    // Strictly sort by highest score, NO random score modifications that ruin accuracy!
    // We only shuffle exact mathematical ties.
    scoredMovies.sort((a, b) => {
      if (b.score === a.score) return Math.random() - 0.5;
      return b.score - a.score; // Absolute mathematical accuracy
    });
    
    const topRecommendations = scoredMovies.slice(0, 6).map(item => item.movie);
    
    // Formatting presentation text
    const topTags = Object.keys(weights).sort((a, b) => weights[b] - weights[a]).slice(0, 3);
    let langContext = '';
    if (languagePreference.length > 0 && !languagePreference.includes("any")) {
      langContext = languagePreference[0].toUpperCase();
    }
    
    // Check if we found ANY movies after strict filter
    const explanation = topTags.length > 0 && topRecommendations.length > 0
      ? `Hyper-accurate match: These ${langContext} movies perfectly align with your requested vibes (${topTags.join(', ')}).`
      : topRecommendations.length > 0
        ? `Here are the top definitive ${langContext} hits that match your exact personality!`
        : `We couldn't find any ${langContext} movies matching those specific criteria. Try loosening your filters!`;

    res.json({ recommendations: topRecommendations, explanation });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
