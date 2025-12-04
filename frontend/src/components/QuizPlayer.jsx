import { useState } from 'react';
import '../styles/QuizPlayer.css';

export default function QuizPlayer({ quiz}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);

  const question = quiz.questions[currentQuestion];
  const allAnswers = question 
    ? [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5) 
    : [];

  const handleAnswerClick = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        score++;
      }
    });
    return score;
  };

  // Score display page
  if (showScore) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="quiz-player score-page">
        <div className="score-container">
          {/* Header */}
          <div className="score-header">
            <h1 className="completion-title">Quiz Complete! 🎉</h1>
            <p className="quiz-category">{quiz.category}</p>
          </div>

          {/* Score Circle */}
          <div className="score-circle-wrapper">
            <div className="score-circle">
              <div className="score-inner">
                <span className="percentage">{percentage}%</span>
              </div>
            </div>
            <p className="score-details">
              You scored <span className="score-highlight">{score}</span> out of <span className="score-highlight">{quiz.questions.length}</span>
            </p>
          </div>

          {/* Performance Message */}
          <div className="performance-message">
            {percentage >= 80 && (
              <div className="message excellent">
                <span className="message-icon">🏆</span>
                <span className="message-text">Excellent work!</span>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="message great">
                <span className="message-icon">👍</span>
                <span className="message-text">Great job!</span>
              </div>
            )}
            {percentage >= 40 && percentage < 60 && (
              <div className="message good">
                <span className="message-icon">📚</span>
                <span className="message-text">Good effort!</span>
              </div>
            )}
            {percentage < 40 && (
              <div className="message keep-practicing">
                <span className="message-icon">💪</span>
                <span className="message-text">Keep practicing!</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="score-stats">
            <div className="stat-item correct">
              <span className="stat-icon">✓</span>
              <span className="stat-label">Correct</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item incorrect">
              <span className="stat-icon">✗</span>
              <span className="stat-label">Incorrect</span>
              <span className="stat-value">{quiz.questions.length - score}</span>
            </div>
            <div className="stat-item total">
              <span className="stat-icon">📊</span>
              <span className="stat-label">Total</span>
              <span className="stat-value">{quiz.questions.length}</span>
            </div>
          </div>

          {/* Answer Review */}
          <div className="answer-review-section">
            <h2 className="review-title">📋 Answer Review</h2>
            <div className="review-items">
              {quiz.questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correct_answer;
                
                return (
                  <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="review-number">Question {index + 1}</span>
                    </div>
                    
                    <p className="review-question-text">{q.question}</p>
                    
                    <div className="review-answers">
                      <div className="answer-item correct-answer">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-text">{q.correct_answer}</span>
                      </div>
                      
                      {userAnswer && userAnswer !== q.correct_answer && (
                        <div className="answer-item wrong-answer">
                          <span className="answer-label">Your Answer:</span>
                          <span className="answer-text">{userAnswer}</span>
                        </div>
                      )}
                      
                      {!userAnswer && (
                        <div className="answer-item not-answered">
                          <span className="answer-label">Your Answer:</span>
                          <span className="answer-text">Not answered</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="score-actions">
            <button onClick={() => window.location.reload()} className="btn-back">
              <span className="btn-icon">←</span>
              Back to Home
            </button>
            <button onClick={() => window.location.reload()} className="btn-another">
              <span className="btn-icon">🔄</span>
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz playing page
  const progressPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isAnswered = currentQuestion in answers;

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h2>{quiz.category}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="question-container">
        {/* Difficulty Badge */}
        <div className="difficulty-badge" data-difficulty={question.difficulty}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </div>

        <h3 className="question-text">{question.question}</h3>

        <div className="answers-container">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              className={`answer-btn ${
                answers[currentQuestion] === answer ? 'selected' : ''
              }`}
              onClick={() => handleAnswerClick(answer)}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary"
        >
          ← Previous
        </button>

        <div className="answered-indicator">
          {isAnswered ? (
            <span className="answered">✓ Answered</span>
          ) : (
            <span className="not-answered">⚠️ Select an answer</span>
          )}
        </div>

        <button 
          onClick={handleNext} 
          disabled={!isAnswered}
          className="btn-primary"
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next →'}
        </button>
      </div>
    </div>
  );
}