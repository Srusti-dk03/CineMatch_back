import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 animate-pulse animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover Movies That Match Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-pink-500">Vibe</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Take our interactive personality quiz to find the perfect film for your current mood. No more endless scrolling.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/quiz" 
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all"
          >
            <span>Start the Quiz</span>
            <Play className="w-5 h-5 fill-current" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
