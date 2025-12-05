import { useState, useEffect } from 'react';
import { Clock, BookOpen, BarChart3, RefreshCw, Loader2, Play, AlertCircle } from 'lucide-react';
import { fetchQuizzes } from '../services/apiClient';

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

      <style>{`
        .history-container {
          padding: 2rem 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: var(--muted-foreground);
          gap: 1rem;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .history-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .history-subtitle {
          color: var(--muted-foreground);
          margin-top: 0.25rem;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--destructive);
          border-radius: var(--radius);
          color: var(--destructive);
          margin-bottom: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          color: var(--muted-foreground);
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--muted-foreground);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          color: var(--primary);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .quiz-card {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
        }

        .quiz-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .quiz-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }

        .quiz-card-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }

        .quiz-card-body {
          flex: 1;
          margin-bottom: 1rem;
        }

        .quiz-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiz-stat {
          font-size: 0.875rem;
          color: var(--muted-foreground);
        }

        .quiz-score {
          font-weight: 600;
          font-size: 1rem;
        }

        .quiz-score.score-excellent { color: var(--success); }
        .quiz-score.score-good { color: #22c55e; }
        .quiz-score.score-fair { color: var(--warning); }
        .quiz-score.score-poor { color: var(--destructive); }

        .quiz-incomplete {
          font-size: 0.8rem;
          color: var(--muted-foreground);
          font-style: italic;
        }

        .quiz-card-btn {
          width: 100%;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .history-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizHistory;
