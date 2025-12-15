import {API_URL} from "../../config/config";

// Fetch available categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL.BASE_URL}/options`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    // Convert array of names to array of objects for dropdown
    const categories = await response.json();
    return categories.map((name) => ({
      id: name, 
      name: name,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


// Generate a new quiz
export const generateQuiz = async (amount, category, difficulty) => {
  try {
    const response = await fetch(`${API_URL.BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseInt(amount),
        category: category, // Send category NAME
        difficulty: difficulty,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
// Fetch all quizzes from history
export const fetchQuizzes = async () => {
  try {
    const response = await fetch(`${API_URL.BASE_URL}/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};


// Get specific quiz by ID
export const getQuizById = async (id) => {
  try {
    const response = await fetch(`${API_URL.BASE_URL}/${id}`);
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
    const response = await fetch(`${API_URL.BASE_URL}/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
};
export const getDidYouKnowFact = async (question) => {
  try {
    console.log('Fetching fact for:', question.question);
    
    const response = await fetch(`${API_URL.BASE_URL}/fact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.question,
        correct_answer: question.correct_answer,
        category: question.category || 'General Knowledge'
      }),
    });

    console.log('Fact response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Fact API error:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('Fact received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching fact:', error);
    return null;
  }
};

// Get facts for entire quiz
export const getQuizFacts = async (quizId) => {
  try {
    const response = await fetch(`${API_URL.BASE_URL}/quizzes/${quizId}/facts`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz facts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz facts:', error);
    return [];
  }
};
