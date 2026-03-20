import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCcw, Star, Play, Heart, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!location.state || !location.state.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold dark:text-white mb-4">No results found!</h2>
        <Link to="/quiz" className="text-primary-500 hover:underline">Take the quiz first.</Link>
      </div>
    );
  }

  const { recommendations, explanation } = location.state.data;

  const handleSaveMovie = async (movieId) => {
    if (!user) {
      alert("Please login to save movies!");
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/users/save-movie', { movieId });
      alert("Movie saved to your dashboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to save movie.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-pink-500 mb-6">
          Your Movie Matches
        </h1>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg border border-primary-500/20 inline-block relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-pink-500"></div>
          <p className="text-xl italic text-gray-700 dark:text-gray-300 font-medium tracking-wide">
            "{explanation}"
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {recommendations.map((movie, idx) => (
          <motion.div 
            key={movie._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <button 
                  onClick={() => handleSaveMovie(movie._id)}
                  className="bg-primary-600 text-white w-full py-2 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-500 transition-colors"
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Save</span>
                </button>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white text-sm font-bold">{movie.rating}</span>
              </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{movie.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genre.slice(0,2).map(g => (
                  <span key={g} className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                    {g}
                  </span>
                ))}
              </div>
              {movie.ottPlatforms && movie.ottPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 items-center">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mr-1">Streaming:</span>
                  {movie.ottPlatforms.map(platform => (
                    <span key={platform} className="text-[10px] font-bold px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700 rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{movie.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link 
          to="/quiz" 
          className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <RefreshCcw className="w-5 h-5" />
          <span>Retake Quiz</span>
        </Link>
      </div>
    </div>
  );
};

export default Results;
