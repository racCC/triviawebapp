import Quiz from '../models/Quiz.js';
import { fetchTriviaQuestions, getCategories } from '../services/triviaService.js';

// Get available trivia categories
export const getOptions = async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate a new quiz from Open Trivia API
export const generateQuiz = async (req, res) => {
  try {
    const { amount, category, difficulty } = req.body;

    // Validate input
    if (!amount || !category || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields: amount, category, difficulty' });
    }

    // Fetch questions from Open Trivia Database
    const questions = await fetchTriviaQuestions(amount, category, difficulty);

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'Failed to fetch trivia questions' });
    }

    // Create new quiz document
    const quiz = new Quiz({
      title: `Quiz - ${new Date().toLocaleDateString()}`,
      category,
      difficulty,
      questions,
      totalQuestions: questions.length,
      answers: [],
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quizzes from history
export const getHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit answers for a quiz
export const submitQuizAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    answers.forEach((answer) => {
      const question = quiz.questions[answer.questionIndex];
      if (question && answer.selectedAnswer === question.correct_answer) {
        score++;
      }
    });

    // Update quiz with answers and score
    quiz.answers = answers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
