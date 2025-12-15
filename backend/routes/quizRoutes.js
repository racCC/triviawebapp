import express from 'express';
import {
  getOptions,
  generateQuiz,
  getHistory,
  getQuizById,
  submitQuizAnswers,
  getDidYouKnowFact,
  getQuizFacts
} from '../controllers/quizController.js';

const router = express.Router();

// GET /api/options - Returns valid categories
router.get('/options', getOptions);

// POST /api/generate - Generate a new quiz
router.post('/generate', generateQuiz);

// GET /api/history - Get all quizzes from history
router.get('/history', getHistory);

// POST /api/fact - Get a "Did You Know?" fact (MUST be before /:id routes!)
router.post('/fact', getDidYouKnowFact);

// GET /api/quizzes/:quizId/facts - Get facts for entire quiz
router.get('/quizzes/:quizId/facts', getQuizFacts);

// GET /api/:id - Get a specific quiz by ID (keep dynamic routes LAST)
router.get('/:id', getQuizById);

// POST /api/:id/submit - Submit answers for a quiz
router.post('/:id/submit', submitQuizAnswers);

export default router;
