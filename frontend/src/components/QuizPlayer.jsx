import { useState } from 'react';
import { Trophy, ArrowLeft, ArrowRight, RotateCcw, Check, X, Home } from 'lucide-react';
import QuizQuestion from './QuizQuestion';
import '../styles/QuizPlayer.css';

export default function QuizPlayer({ quiz, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowResult(false);
      } else {
        setIsComplete(true);
      }
    }, 25000);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowResult(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return { text: "Outstanding!", icon: "🏆" };
    if (percentage >= 80) return { text: "Excellent!", icon: "🌟" };
    if (percentage >= 70) return { text: "Great job!", icon: "👏" };
    if (percentage >= 60) return { text: "Good effort!", icon: "👍" };
    if (percentage >= 50) return { text: "Not bad!", icon: "📚" };
    return { text: "Keep practicing!", icon: "💪" };
  };

  // Completion Screen
  if (isComplete) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    const performance = getPerformanceMessage(percentage);

    return (
      <div className="player-container">
        <div className="card completion-card animate-fadeIn">
          <div className="completion-header">
            <div className="trophy-wrapper">
              <Trophy className="trophy-icon" size={48} />
            </div>
            <h1 className="completion-title">Quiz Complete!</h1>
            <p className="quiz-info">{quiz.category} • {quiz.difficulty}</p>
          </div>

          <div className="score-display">
            <div className="score-circle">
              <span className="score-percentage">{percentage}%</span>
            </div>
            <p className="score-text">
              {score} out of {totalQuestions} correct
            </p>
            <div className="performance-badge">
              <span className="performance-icon">{performance.icon}</span>
              <span className="performance-text">{performance.text}</span>
            </div>
          </div>

          <div className="score-stats">
            <div className="stat correct">
              <Check size={20} />
              <span>{score} Correct</span>
            </div>
            <div className="stat incorrect">
              <X size={20} />
              <span>{totalQuestions - score} Incorrect</span>
            </div>
          </div>

          <div className="answer-review">
            <h3 className="review-title">Answer Review</h3>
            <div className="review-list">
              {quiz.questions.map((q, index) => {
                const isCorrect = answers[index] === q.correct_answer;
                return (
                  <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className={`review-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? <Check size={16} /> : <X size={16} />}
                      </span>
                      <span className="review-num">Q{index + 1}</span>
                    </div>
                    <p className="review-question">{q.question}</p>
                    <div className="review-answers">
                      <p className="correct-answer">
                        <Check size={14} /> {q.correct_answer}
                      </p>
                      {!isCorrect && answers[index] && (
                        <p className="user-answer">
                          <X size={14} /> {answers[index]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="completion-actions">
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              <Home size={18} />
              Home
            </button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <RotateCcw size={18} />
              New Quiz
            </button>
          </div>
        </div>

        
      </div>
    );
  }

  // Quiz Playing Screen
  const isAnswered = currentQuestion in answers;

  return (
    <div className="player-container">
      <div className="card player-card">
        {/* Header with Progress */}
        <div className="player-header">
          <div className="header-top">
            <button className="btn btn-ghost btn-icon" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="quiz-meta">
              <span className="badge badge-outline">{quiz.category}</span>
            </div>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="card-content">
          <QuizQuestion
            question={question}
            questionNumber={currentQuestion + 1}
            totalQuestions={totalQuestions}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
            showResult={showResult}
            difficulty={question.difficulty}
          />
        </div>

        {/* Navigation */}
        <div className="player-footer">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || showResult}
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isAnswered || showResult}
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}
            {currentQuestion < totalQuestions - 1 && <ArrowRight size={18} />}
          </button>
        </div>
      </div>

      
    </div>
  );
}