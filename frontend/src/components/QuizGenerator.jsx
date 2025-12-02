import { useState, useEffect } from 'react';
import { fetchCategories, generateQuiz } from '../services/apiClient';
import '../styles/QuizGenerator.css';

export default function QuizGenerator({ onQuizGenerated }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: 10,
    category: '',
    difficulty: 'medium',
  });

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: data[0].id.toString(),
          }));
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const quiz = await generateQuiz(
        formData.amount,
        formData.category,
        formData.difficulty
      );
      onQuizGenerated(quiz);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-generator">
      <h1>The Trivia Archivist</h1>
      <p className="subtitle">Create your custom trivia quiz</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1"
            max="50"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading || categories.length === 0}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
}
