import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
        
        {error && <div className="bg-red-50 text-red-600 font-bold p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-md font-bold text-gray-900 dark:text-gray-100">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 h-6 w-6" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-dark-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none text-black dark:text-white font-bold text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="you@example.com"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-md font-bold text-gray-900 dark:text-gray-100">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 h-6 w-6" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-dark-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none text-black dark:text-white font-bold text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-extrabold text-lg py-4 px-4 rounded-xl transition-all flex justify-center items-center space-x-2 shadow-lg shadow-primary-500/30"
          >
            <span>Sign In</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-600 dark:text-gray-300 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-extrabold hover:underline transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
