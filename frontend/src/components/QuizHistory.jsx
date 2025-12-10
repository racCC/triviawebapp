import { useState, useEffect } from 'react';
import { Clock, BookOpen, BarChart3, RefreshCw, Loader2, Play, AlertCircle } from 'lucide-react';
import { fetchQuizzes } from '../services/apiClient';
import '../styles/QuizHistory.css';

const QuizHistory = ({ onSelectQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuizzes();
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-destructive';
      default: return 'badge-default';
    }
  };

  const getScoreClass = (score, total) => {
    if (!score && score !== 0) return '';
    const pct = (score / total) * 100;
    if (pct >= 80) return 'score-excellent';
    if (pct >= 60) return 'score-good';
    if (pct >= 40) return 'score-fair';
    return 'score-poor';
  };

  // Loading state
  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-state">
          <Loader2 className="animate-spin" size={32} />
          <p>Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h1 className="history-title">Quiz History</h1>
          <p className="history-subtitle">Review your past quizzes and track progress</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadQuizHistory}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="card empty-state">
          <BookOpen size={48} className="empty-icon" />
          <h2>No Quizzes Yet</h2>
          <p>Generate your first quiz to get started!</p>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="stats-grid">
            <div className="stat-card">
              <BarChart3 size={24} className="stat-icon" />
              <div className="stat-content">
                <span className="stat-value">{quizzes.length}</span>
                <span className="stat-label">Total Quizzes</span>
              </div>
            </div>
            <div className="stat-card">
              <BookOpen size={24} className="stat-icon" />
              <div className="stat-content">
                <span className="stat-value">
                  {quizzes.reduce((sum, q) => sum + q.totalQuestions, 0)}
                </span>
                <span className="stat-label">Questions</span>
              </div>
            </div>
          </div>

          {/* Quiz List */}
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card quiz-card">
                <div className="quiz-card-header">
                  <div>
                    <h3 className="quiz-card-title">{quiz.category}</h3>
                    <div className="quiz-card-meta">
                      <Clock size={14} />
                      <span>{formatDate(quiz.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`badge ${getDifficultyClass(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="quiz-card-body">
                  <div className="quiz-stats">
                    <span className="quiz-stat">
                      {quiz.totalQuestions} questions
                    </span>
                    {quiz.score !== null && quiz.score !== undefined ? (
                      <span className={`quiz-score ${getScoreClass(quiz.score, quiz.totalQuestions)}`}>
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                      </span>
                    ) : (
                      <span className="quiz-incomplete">Not completed</span>
                    )}
                  </div>
                </div>

                <button 
                  className="btn btn-primary quiz-card-btn"
                  onClick={() => onSelectQuiz(quiz)}
                >
                  <Play size={16} />
                  {quiz.score !== null ? 'Review' : 'Continue'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

     
    </div>
  );
};

export default QuizHistory;
