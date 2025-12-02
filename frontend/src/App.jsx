import { useState } from 'react';
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

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentView === 'generator' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('generator');
              setCurrentQuiz(null);
            }}
          >
            Create Quiz
          </button>
          <button
            className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            Quiz History
          </button>
        </nav>
      </header>

      <main className="app-content">
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
        <p>&copy; The Trivia Archivist.</p>
      </footer>
    </div>
  );
}

export default App;
