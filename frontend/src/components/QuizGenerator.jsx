import { useState, useEffect } from 'react';
import { Sparkles, Loader2, BookOpen, Zap, Hash } from 'lucide-react';
import { fetchCategories, generateQuiz } from '../services/apiClient';
import '../styles/QuizGenerator.css';

const QuizGenerator = ({ onQuizGenerated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: 10,
    category: '',
    difficulty: 'medium',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0].name }));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
      setCategories([{ name: 'Any Category' }]);
      setFormData(prev => ({ ...prev, category: 'Any Category' }));
    } finally {
      setCategoriesLoading(false);
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

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'destructive' },
  ];

  return (
    <div className="generator-container">
      <div className="card generator-card">
        <div className="card-header">
          <div className="generator-header-content">
            <Sparkles className="generator-icon" size={28} />
            <div>
              <h1 className="card-title">Create Your Quiz</h1>
              <p className="card-description">
                Choose your preferences and test your knowledge
              </p>
            </div>
          </div>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="generator-form">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <BookOpen size={16} />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                disabled={categoriesLoading}
              >
                {categoriesLoading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label className="form-label">
                <Zap size={16} />
                Difficulty
              </label>
              <div className="difficulty-buttons">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    className={`difficulty-btn ${formData.difficulty === diff.value ? `active-${diff.color}` : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: diff.value }))}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                Questions: <span className="amount-value">{formData.amount}</span>
              </label>
              <input
                type="range"
                name="amount"
                min="5"
                max="50"
                step="5"
                value={formData.amount}
                onChange={handleInputChange}
                className="range-input"
              />
              <div className="range-labels">
                <span>5</span>
                <span>50</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg generate-btn"
              disabled={loading || categoriesLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Quiz
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default QuizGenerator;
