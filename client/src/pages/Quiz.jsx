import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ArrowRight } from 'lucide-react';

const questions = [
  {
    id: 'q1',
    text: "Pick your ideal weekend vibe:",
    options: [
      { text: "Explosions and fast cars", tag: "action" },
      { text: "A good laugh with friends", tag: "funny" },
      { text: "Deep thoughts and quiet nights", tag: "mind-bending" },
      { text: "Cozy blankets and hot cocoa", tag: "feel-good" }
    ]
  },
  {
    id: 'q2',
    text: "Choose a setting you enjoy most:",
    options: [
      { text: "A futuristic cyberpunk city", tag: "sci-fi" },
      { text: "A creepy abandoned house", tag: "dark" },
      { text: "A bustling modern metropolis", tag: "thriller" },
      { text: "A romantic Paris street", tag: "romance" }
    ]
  },
  {
    id: 'q3',
    text: "How do you want to feel after watching?",
    options: [
      { text: "On the edge of my seat", tag: "intense" },
      { text: "Like crying a river", tag: "emotional" },
      { text: "Mind blown", tag: "mind-bending" },
      { text: "Warm and fuzzy", tag: "feel-good" }
    ]
  },
  {
    id: 'q4',
    text: "What's the best type of villain?",
    options: [
      { text: "A terrifying monster", tag: "dark" },
      { text: "A rogue AI", tag: "sci-fi" },
      { text: "A political mastermind", tag: "thriller" },
      { text: "A hilarious rival", tag: "comedy" }
    ]
  },
  {
    id: 'q5',
    text: "Pick a color palette:",
    options: [
      { text: "Neon Pink and Blue", tag: "sci-fi" },
      { text: "Shadowy Grays and Black", tag: "dark" },
      { text: "Bright and Sunny Yellows", tag: "funny" },
      { text: "Warm Reds and Oranges", tag: "action" }
    ]
  },
  {
    id: 'q6',
    text: "What's your preferred pacing?",
    options: [
      { text: "Non-stop adrenaline", tag: "action" },
      { text: "Slow burn mystery", tag: "thriller" },
      { text: "Light and breezy", tag: "feel-good" },
      { text: "Deep and emotional buildup", tag: "emotional" }
    ]
  },
  {
    id: 'q7',
    text: "Pick a companion for your journey:",
    options: [
      { text: "A sarcastic robot", tag: "sci-fi" },
      { text: "A hardened detective", tag: "thriller" },
      { text: "Your high school crush", tag: "romance" },
      { text: "A group of misfits", tag: "comedy" }
    ]
  },
  {
    id: 'q8',
    text: "Choose a wild card object:",
    options: [
      { text: "A loaded gun", tag: "action" },
      { text: "A cursed artifact", tag: "dark" },
      { text: "A bouquet of flowers", tag: "romance" },
      { text: "A time machine", tag: "sci-fi" }
    ]
  },
  {
    id: 'q9',
    text: "Preferred Movie Language?",
    options: [
      { text: "English", tag: "english" },
      { text: "Hindi", tag: "hindi" },
      { text: "Kannada", tag: "kannada" },
      { text: "Telugu", tag: "telugu" },
      { text: "Tamil", tag: "tamil" },
      { text: "Malayalam", tag: "malayalam" },
      { text: "Any Language", tag: "any" }
    ]
  },
  {
    id: 'q10',
    type: 'input',
    text: "Any other specific genres or languages? (e.g. Kannada, Malayalam)",
    placeholder: "e.g. kannada, malayalam, anime, space..."
  }
];

const Quiz = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSelect = async (tag) => {
    const newAnswers = { ...answers, [questions[currentIdx].id]: tag };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      await submitQuiz(newAnswers);
    }
  };

  const handleInputSubmit = () => {
    handleSelect(customInput.trim() || 'none');
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/quiz/submit', { answers: finalAnswers });
      navigate('/results', { state: { data: res.data } });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const progressPercentage = ((currentIdx) / questions.length) * 100;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader className="h-16 w-16 text-primary-500 animate-spin mb-6" />
        <h2 className="text-3xl font-extrabold dark:text-white text-black animate-pulse">Analyzing your vibe...</h2>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mb-16 shadow-inner overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-12 leading-tight tracking-tight">
            {question.text}
          </h2>
          
          {question.type === 'input' ? (
            <div className="flex flex-col items-center space-y-8">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleInputSubmit() }}
                placeholder={question.placeholder}
                className="w-full max-w-2xl px-8 py-5 text-2xl font-bold border-4 border-gray-300 dark:border-gray-600 rounded-3xl bg-gray-50 dark:bg-dark-900 text-black dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/30 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInputSubmit}
                className="px-12 py-4 flex items-center space-x-3 bg-primary-600 hover:bg-primary-500 text-white font-extrabold text-2xl rounded-2xl shadow-xl shadow-primary-500/30 transition-all"
              >
                <span>Find My Movies</span>
                <ArrowRight className="w-8 h-8" />
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelect(option.tag)}
                  className="p-8 text-lg md:text-xl font-extrabold bg-white dark:bg-dark-800 border-4 border-gray-200 dark:border-gray-700 rounded-3xl shadow-md hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-primary-500/30 text-black dark:text-white transition-all text-center leading-snug"
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-12 text-gray-500 dark:text-gray-400 font-bold text-lg">Question {currentIdx + 1} of {questions.length}</div>
    </div>
  );
};

export default Quiz;
