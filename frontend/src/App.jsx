import { useState } from 'react';
import { Brain, PlusCircle, History, Sparkles } from 'lucide-react';
import QuizGenerator from './components/QuizGenerator';
import QuizPlayer from './components/QuizPlayer';
import QuizHistory from './components/QuizHistory';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('generator');
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleQuizGenerated = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('player');
  };

  const handleQuizComplete = () => {
    setCurrentView('generator');
    setCurrentQuiz(null);
  };

  const handleSelectQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('player');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setCurrentQuiz(null);
  };

  return (
    <>
      <style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .app-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .logo-text h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .logo-text p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f1f5f9;
          color: #64748b;
        }

        .nav-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .nav-btn.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .app-footer {
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 1.5rem 2rem;
          margin-top: auto;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .app-header {
            padding: 1rem;
          }

          .header-inner {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-buttons {
            width: 100%;
          }

          .nav-btn {
            flex: 1;
            justify-content: center;
          }

          .main-content {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="app-container">
        <header className="app-header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <Brain size={24} />
              </div>
              <div className="logo-text">
                <h1>The Trivia Archivist</h1>
                <p><Sparkles size={12} /> Master Your Knowledge</p>
              </div>
            </div>

            <nav className="nav-buttons">
              <button
                className={`nav-btn ${currentView === 'generator' ? 'active' : ''}`}
                onClick={() => handleNavigate('generator')}
              >
                <PlusCircle size={18} />
                <span>Create Quiz</span>
              </button>
              <button
                className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
                onClick={() => handleNavigate('history')}
              >
                <History size={18} />
                <span>History</span>
              </button>
            </nav>
          </div>
        </header>

        <main className="main-content">
          {currentView === 'generator' && (
            <QuizGenerator onQuizGenerated={handleQuizGenerated} />
          )}

          {currentView === 'player' && currentQuiz && (
            <QuizPlayer quiz={currentQuiz} onComplete={handleQuizComplete} />
          )}

          {currentView === 'history' && (
            <QuizHistory onSelectQuiz={handleSelectQuiz} />
          )}
        </main>

        <footer className="app-footer">
          <div className="footer-inner">
            <p>&copy; 2025 The Trivia Archivist. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
