import { useState, useEffect } from 'react';
import { fetchQuizHistory } from '../services/apiClient';
import '../styles/QuizHistory.css';

export default function QuizHistory({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizHistory();
      setQuizzes(data);
    } catch (err) {
      setError('Failed to load quiz history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="quiz-history"><p>Loading quiz history...</p></div>;
  }

  if (error) {
    return <div className="quiz-history error">{error}</div>;
  }

  return (
    <div className="quiz-history">
      <h2>Quiz History</h2>

      {quizzes.length === 0 ? (
        <p className="empty-message">No quizzes yet. Generate one to get started!</p>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-info">
                <h3>{quiz.title}</h3>
                <p className="quiz-meta">
                  <span className="category">{quiz.category}</span>
                  <span className="difficulty">{quiz.difficulty}</span>
                  <span className="questions">{quiz.totalQuestions} questions</span>
                </p>
                <p className="quiz-date">Created: {formatDate(quiz.createdAt)}</p>
              </div>

              <div className="quiz-score">
                {quiz.score !== null ? (
                  <>
                    <span className="score-badge">{quiz.score}/{quiz.totalQuestions}</span>
                    <span className="score-percentage">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="not-completed">Not completed</span>
                )}
              </div>

              <button
                onClick={() => onSelectQuiz(quiz)}
                className="btn-secondary"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={loadQuizHistory} className="btn-refresh">
        Refresh
      </button>
    </div>
  );
}
