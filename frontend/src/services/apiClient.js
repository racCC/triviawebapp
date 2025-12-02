const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all available categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Generate a new quiz
export const generateQuiz = async (amount, category, difficulty) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, category, difficulty }),
    });
    if (!response.ok) throw new Error('Failed to generate quiz');
    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

// Fetch quiz history
export const fetchQuizHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch quiz history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
};

// Get specific quiz by ID
export const getQuizById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch quiz');
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

// Submit quiz answers
export const submitQuizAnswers = async (quizId, answers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error('Failed to submit answers');
    return await response.json();
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
};
