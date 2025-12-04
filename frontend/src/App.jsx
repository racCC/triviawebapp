import { useState } from 'react';
import QuizGenerator from './components/QuizGenerator';
import QuizPlayer from './components/QuizPlayer';
import QuizHistory from './components/QuizHistory';
import './styles/App.css';

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
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <h1 className="app-title">🧠The Trivia Archivist</h1>
            <p className="app-tagline">Master Your Knowledge</p>
          </div>

          <nav className="app-nav">
            <button
              className={`nav-btn ${currentView === 'generator' ? 'active' : ''}`}
              onClick={() => handleNavigate('generator')}
              aria-label="Create Quiz"
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">Create Quiz</span>
            </button>
            <button
              className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
              onClick={() => handleNavigate('history')}
              aria-label="Quiz History"
            >
              <span className="nav-icon">📚</span>
              <span className="nav-text">History</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-container">
          {currentView === 'generator' && (
            <section className="view-section">
              <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            </section>
          )}

          {currentView === 'player' && currentQuiz && (
            <section className="view-section">
              <QuizPlayer quiz={currentQuiz} onComplete={handleQuizComplete} />
            </section>
          )}

          {currentView === 'history' && (
            <section className="view-section">
              <QuizHistory onSelectQuiz={handleSelectQuiz} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 The Trivia Archivist. All rights reserved.</p>
         
        </div>
      </footer>
    </div>
  );
}

export default App;
