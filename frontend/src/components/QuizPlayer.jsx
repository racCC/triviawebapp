import { useState } from 'react';
import '../styles/QuizPlayer.css';

export default function QuizPlayer({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);

  const question = quiz.questions[currentQuestion];
  const allAnswers = question ? [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5) : [];

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
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.keys(answers).forEach((qIndex) => {
      if (quiz.questions[parseInt(qIndex)].correct_answer === answers[qIndex]) {
        score++;
      }
    });
    setShowScore(true);
    onComplete({ score, totalQuestions: quiz.questions.length, answers });
  };

  if (showScore) {
    const score = Object.keys(answers).reduce((acc, qIndex) => {
      return quiz.questions[parseInt(qIndex)].correct_answer === answers[qIndex]
        ? acc + 1
        : acc;
    }, 0);

    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="score-display">
        <h2>Quiz Complete!</h2>
        <div className="score-circle">
          <span className="score-text">{percentage}%</span>
        </div>
        <p className="score-result">
          You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong>
        </p>
        <button onClick={() => onComplete({ showScore: true })} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="question-container">
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
          Previous
        </button>

        <div className="answered-indicator">
          {Object.keys(answers).length} / {quiz.questions.length} answered
        </div>

        <button onClick={handleNext} className="btn-primary">
          {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
}
