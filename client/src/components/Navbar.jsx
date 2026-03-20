import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Film, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-800 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div whileHover={{ rotate: 15 }}>
              <Film className="h-10 w-10 text-primary-500" />
            </motion.div>
            <span className="font-extrabold text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">CineMatch</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors text-black dark:text-white"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {user ? (
              <>
                <Link to="/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors text-black dark:text-white">
                  <UserIcon className="h-6 w-6" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-50 text-red-600 dark:hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="space-x-4 flex items-center">
                <Link to="/login" className="px-4 py-2 font-extrabold text-lg text-black dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Login</Link>
                <Link to="/register" className="px-6 py-2.5 bg-primary-600 font-extrabold text-lg text-white rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/40">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
