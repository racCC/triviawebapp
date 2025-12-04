import { useState, useEffect } from 'react';
import { fetchQuizzes } from '../services/apiClient';
import '../styles/QuizHistory.css';

const QuizHistory = ({ onSelectQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load quiz history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-default';
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-fair';
    return 'score-poor';
  };

  if (loading) {
    return (
      <div className="quiz-history">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-history">
      <h2 className="history-title">Quiz History</h2>
      <p className="history-subtitle">Review your past quizzes and track your progress</p>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Quizzes Yet</h3>
          <p>Start by creating and taking a quiz to build your history</p>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-card">
              <span className="stat-number">{quizzes.length}</span>
              <span className="stat-label">Quizzes Taken</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Math.round(
                  (quizzes.filter((q) => q.score !== null).length / quizzes.length) * 100
                )}%
              </span>
              <span className="stat-label">Completion Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {quizzes.filter((q) => q.score !== null).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="quiz-list">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <div className="card-header">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <span className={`difficulty-badge ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="card-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📁</span>
                    <span className="meta-text">{quiz.category}</span>
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">❓</span>
                    <span className="meta-text">{quiz.totalQuestions} questions</span>
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">{formatDate(quiz.createdAt)}</span>
                  </span>
                </div>

                <div className="card-score">
                  {quiz.score !== null ? (
                    <>
                      <div className={`score-display ${getScoreColor(quiz.score, quiz.totalQuestions)}`}>
                        <span className="score-value">
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </span>
                        <span className="score-fraction">
                          {quiz.score}/{quiz.totalQuestions}
                        </span>
                      </div>
                      <span className="score-label">Score</span>
                    </>
                  ) : (
                    <div className="status-incomplete">
                      <span className="status-icon">⏳</span>
                      <span className="status-text">Not Completed</span>
                    </div>
                  )}
                </div>

                <button onClick={() => onSelectQuiz(quiz)} className="btn-view">
                  <span className="btn-text">View Details</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            ))}
          </div>

          <button onClick={loadQuizHistory} className="btn-refresh">
            <span>🔄</span>
            <span>Refresh History</span>
          </button>
        </>
      )}
    </div>
  );
};

export default QuizHistory;
