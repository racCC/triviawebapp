import Quiz from '../models/Quiz.js';
import { getCategories, fetchTriviaQuestions } from '../services/triviaService.js';
import { generateDidYouKnow,generateFactsForQuiz } from '../services/dykService.js';

// Get available trivia categories (names only)
export const getOptions = async (req, res) => {
  try {
    const categories = await getCategories();
    // Return only names for frontend dropdown
    const categoryNames = categories.map((cat) => cat.name);
    res.json(categoryNames);
  } catch (error) {
    console.error('Error in getOptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Generate a new quiz from Open Trivia API
export const generateQuiz = async (req, res) => {
  try {
    const { amount, category, difficulty } = req.body;

    // Validate input
    if (!amount || !category || !difficulty) {
      return res.status(400).json({
        error: 'Missing required fields: amount, category, difficulty',
      });
    }

    // Fetch questions from Open Trivia Database (pass category name)
    const questions = await fetchTriviaQuestions(amount, category, difficulty);

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        error: 'Failed to fetch trivia questions. Please try again.',
      });
    }

    // Create new quiz document with category NAME
    const quiz = new Quiz({
      title: `Quiz - ${new Date().toLocaleDateString()}`,
      category: category, 
      difficulty: difficulty,
      questions: questions,
      totalQuestions: questions.length,
      answers: [],
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error in generateQuiz:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz',
    });
  }
};

// Get all quizzes from history
export const getHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('Error in getHistory:', error.message);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
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
    console.error('Error in getQuizById:', error.message);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Submit answers for a quiz
export const submitQuizAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    answers.forEach((answer, index) => {
      if (quiz.questions[index] && quiz.questions[index].correct_answer === answer) {
        score++;
      }
    });

    // Update quiz with answers and score
    quiz.answers = answers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      quiz,
    });
  } catch (error) {
    console.error('Error in submitQuizAnswers:', error.message);
    res.status(500).json({ error: 'Failed to submit quiz answers' });
  }
  
};
export const getDidYouKnowFact = async (req, res) => {
  try {
    let body = req.body;

    
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { question, correct_answer, category } = body;

    console.log('Fact request received:', { question, correct_answer, category });

    if (!question || !correct_answer) {
      return res.status(400).json({ 
        error: 'Question and correct_answer are required' 
      });
    }

    const fact = await generateDidYouKnow({
      question,
      correct_answer,
      category: category || 'General Knowledge'
    });

    console.log('Fact generated:', fact);
    res.json(fact);
  } catch (error) {
    console.error('Error in getDidYouKnowFact:', error);
    res.status(500).json({ 
      error: 'Failed to generate fact',
      details: error.message 
    });
  }
};

// Generate facts for an entire quiz
export const getQuizFacts = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const facts = await generateFactsForQuiz(quiz.questions);
    res.json(facts);
  } catch (error) {
    console.error('Error getting quiz facts:', error);
    res.status(500).json({ 
      message: 'Failed to generate facts',
      error: error.message 
    });
  }
};