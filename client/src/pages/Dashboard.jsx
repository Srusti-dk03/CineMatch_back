import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Film, Play, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/dashboard`);
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Profile Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
            <div className="w-24 h-24 bg-gradient-to-tr from-primary-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
              <span className="text-4xl font-bold">{dashboardData?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">{dashboardData?.username}</h2>
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-8">
              <Mail className="w-4 h-4 mr-2" />
              <span>{dashboardData?.email}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-2xl">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Film className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">Saved Movies</span>
                </div>
                <span className="font-bold text-lg text-primary-500">{dashboardData?.savedMovies?.length || 0}</span>
              </div>
            </div>

            <button 
              onClick={() => logout()}
              className="w-full mt-8 py-3 text-red-500 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content / Saved Movies */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">Your Watchlist</span>
          </h2>
          
          {dashboardData?.savedMovies?.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No movies saved yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Take the personality quiz to discover movies tailored to your exact taste, and save your favorites here.
              </p>
              <Link 
                to="/quiz" 
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold transition-all shadow-lg shadow-primary-500/20"
              >
                <span>Take Quiz</span>
                <Play className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.savedMovies?.map((movie, idx) => (
                <motion.div 
                  key={movie._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[2/3]">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-white text-sm font-bold">{movie.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{movie.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.slice(0,2).map(g => (
                        <span key={g} className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md uppercase tracking-wider">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{movie.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
