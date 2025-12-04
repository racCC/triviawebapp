import { useState, useEffect } from 'react';
import { fetchCategories, generateQuiz } from '../services/apiClient';
import '../styles/QuizGenerator.css';

const QuizGenerator = ({ onQuizGenerated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: 10,
    category: 'Any Category',
    difficulty: 'medium',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories. Using default options.');
      setCategories([
        { name: 'Any Category' },
        { name: 'General Knowledge' },
        { name: 'Entertainment' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const quiz = await generateQuiz(
        formData.amount,
        formData.category,
        formData.difficulty
      );
      onQuizGenerated(quiz);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-generator">
      <h2 className="generator-title">Create Your Quiz</h2>
      <p className="generator-subtitle">Choose your preferences and start testing your knowledge</p>

      <form className="generator-form" onSubmit={handleSubmit}>
        {/* Category Section */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            <span className="label-icon">📚</span>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Section */}
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">⚡</span>
            Difficulty
          </label>
          <div className="difficulty-options">
            {['easy', 'medium', 'hard'].map((level) => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={formData.difficulty === level}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-text">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question Count Section */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            <span className="label-icon">❓</span>
            Number of Questions: <span className="amount-display">{formData.amount}</span>
          </label>
          <input
            id="amount"
            type="range"
            name="amount"
            min="5"
            max="50"
            step="5"
            value={formData.amount}
            onChange={handleInputChange}
            className="form-range"
          />
          <div className="range-labels">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-generate"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Start Quiz
            </>
          )}
        </button>
      </form>

      {/* Info Section */}
      <div className="generator-info">
        <div className="info-card">
          <span className="info-icon">✨</span>
          <div className="info-content">
            <h3>Customizable</h3>
            <p>Choose from various categories and difficulty levels</p>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">💾</span>
          <div className="info-content">
            <h3>Saved Automatically</h3>
            <p>Your quiz attempts are saved for future reference</p>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">📊</span>
          <div className="info-content">
            <h3>Track Progress</h3>
            <p>View your scores and quiz history anytime</p>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🏆</span>
          <div className="info-content">
            <h3>Achieve Greatness</h3>
            <p>Complete quizzes to earn badges and recognition</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
