import axios from 'axios';
import { TRIVIA_API } from '../config/config.js';


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

// Get available categories (names only)
export const getCategories = async () => {
  try {
    const response = await axios.get(TRIVIA_API.CATEGORIES_URL);

    if (!response.data || !response.data.trivia_categories) {
      throw new Error('Failed to fetch categories');
    }

    // Return only category names (no IDs)
    const categories = response.data.trivia_categories.map((cat) => ({
      name: decodeHTML(cat.name),
      id: cat.id, 
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

// Helper: Get category ID from name
const getCategoryIdByName = async (categoryName) => {
  try {
    const response = await axios.get(TRIVIA_API.CATEGORIES_URL);
    const categories = response.data.trivia_categories;
    const category = categories.find(
      (cat) => decodeHTML(cat.name).toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  } catch (error) {
    console.error('Error fetching category ID:', error.message);
    return null;
  }
};

// Fetch trivia questions from Open Trivia Database
export const fetchTriviaQuestions = async (amount = 10, categoryName = '', difficulty = '') => {
  try {
    // Build query parameters
    const params = {
      amount: amount || 10,
      type: 'multiple', 
    };

    // If category name is provided, get its ID for the API call
    if (categoryName && categoryName !== 'Any' && categoryName.trim() !== '') {
      const categoryId = await getCategoryIdByName(categoryName);
      if (categoryId) {
        params.category = categoryId;
      }
    }

    if (difficulty && difficulty !== 'any') {
      params.difficulty = difficulty.toLowerCase();
    }

    // Fetch from Open Trivia Database
    const response = await axios.get(TRIVIA_API.BASE_URL, { params });

    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch trivia questions from API');
    }

    // Transform and decode the questions
    const questions = response.data.results.map((q) => ({
      question: decodeHTML(q.question),
      correct_answer: decodeHTML(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map((ans) => decodeHTML(ans)),
      type: q.type,
      difficulty: q.difficulty,
      category: decodeHTML(q.category),
    }));

    return questions;
  } catch (error) {
    console.error('Error fetching trivia questions:', error.message);
    throw error;
  }
};
export const getDidYouKnowFact = async (question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.question,
        correct_answer: question.correct_answer,
        category: question.category
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fact');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching fact:', error);
    return null;
  }
};
export const getQuizFacts = async (quizId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/facts`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz facts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz facts:', error);
    return [];
  }
};