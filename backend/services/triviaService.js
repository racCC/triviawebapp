import axios from 'axios';

const TRIVIA_API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
const CATEGORIES_API_URL = 'https://opentdb.com/api_category.php';

// HTML decode helper function
const decodeHTML = (html) => {
  const entities = {
    '&quot;': '"',
    '&#039;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
  };

  return html.replace(/&quot;|&#039;|&amp;|&lt;|&gt;/g, (match) => entities[match]);
};

// Get available categories
export const getCategories = async () => {
  try {
    const response = await axios.get(CATEGORIES_API_URL);

    if (!response.data || !response.data.trivia_categories) {
      throw new Error('Failed to fetch categories');
    }

    // Format categories with id and name
    const categories = response.data.trivia_categories.map((cat) => ({
      id: cat.id,
      name: decodeHTML(cat.name),
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

// Fetch trivia questions from Open Trivia Database
export const fetchTriviaQuestions = async (amount = 10, category = '', difficulty = '') => {
  try {
    // Build query parameters
    const params = {
      amount: amount || 10,
      type: 'multiple', // Get multiple choice questions
    };

    if (category && category !== 'any') {
      params.category = category;
    }

    if (difficulty && difficulty !== 'any') {
      params.difficulty = difficulty.toLowerCase();
    }

    // Fetch from Open Trivia Database
    const response = await axios.get(TRIVIA_API_URL, { params });

    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch trivia questions');
    }

    // Transform and decode the questions
    const questions = response.data.results.map((q) => ({
      question: decodeHTML(q.question),
      correct_answer: decodeHTML(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map((ans) => decodeHTML(ans)),
      type: q.type,
    }));

    return questions;
  } catch (error) {
    console.error('Error fetching trivia questions:', error.message);
    throw error;
  }
};
