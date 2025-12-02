import express from 'express';
import {
  getOptions,
  generateQuiz,
  getHistory,
  getQuizById,
  submitQuizAnswers,
} from '../controllers/quizController.js';

const router = express.Router();

// GET /api/options - Returns valid categories
router.get('/options', getOptions);

// POST /api/generate - Generate a new quiz
router.post('/generate', generateQuiz);

// GET /api/history - Get all quizzes from history
router.get('/history', getHistory);

// GET /api/quizzes/:id - Get a specific quiz by ID
router.get('/:id', getQuizById);

// POST /api/quizzes/:id/submit - Submit answers for a quiz
router.post('/:id/submit', submitQuizAnswers);

export default router;
