import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

function QuizQuestion({ 
  question, 
  questionNumber, 
  totalQuestions,
  selectedAnswer, 
  onSelectAnswer, 
  showResult,
  difficulty 
}) {
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-destructive';
      default: return 'badge-default';
    }
  };

  const getAnswerStyle = (answer) => {
    if (!showResult) {
      return selectedAnswer === answer ? 'answer-selected' : '';
    }
    
    const isCorrect = answer === question.correct_answer;
    const isSelected = selectedAnswer === answer;
    
    if (isCorrect) return 'answer-correct';
    if (isSelected && !isCorrect) return 'answer-incorrect';
    return 'answer-disabled';
  };

  // Shuffle answers once per question using useMemo
  const allAnswers = useMemo(() => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    // Fisher-Yates shuffle with seeded random based on question
    const seed = question.question.length;
    for (let i = answers.length - 1; i > 0; i--) {
      const j = (seed * (i + 1)) % (i + 1);
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }, [question]);

  // Decode HTML entities
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="quiz-question animate-fadeIn">
      <div className="question-header">
        <span className="question-number">
          Question {questionNumber} of {totalQuestions}
        </span>
        {difficulty && (
          <span className={`badge ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        )}
      </div>

      <h2 className="question-text">
        {decodeHTML(question.question)}
      </h2>

      <div className="answers-grid">
        {allAnswers.map((answer, index) => (
          <button
            key={index}
            className={`answer-btn ${getAnswerStyle(answer)}`}
            onClick={() => !showResult && onSelectAnswer(answer)}
            disabled={showResult}
          >
            <span className="answer-text">{decodeHTML(answer)}</span>
            {showResult && answer === question.correct_answer && (
              <Check className="answer-icon correct" size={20} />
            )}
            {showResult && selectedAnswer === answer && answer !== question.correct_answer && (
              <X className="answer-icon incorrect" size={20} />
            )}
          </button>
        ))}
      </div>

      <style>{`
        .quiz-question {
          width: 100%;
        }

        .question-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .question-number {
          font-size: 0.875rem;
          color: var(--muted-foreground);
          font-weight: 500;
        }

        .question-text {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          color: var(--foreground);
        }

        .answers-grid {
          display: grid;
          gap: 0.75rem;
        }

        .answer-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border: 2px solid var(--border);
          border-radius: var(--radius);
          background-color: var(--card);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 0.95rem;
        }

        .answer-btn:hover:not(:disabled) {
          border-color: var(--primary);
          background-color: var(--secondary);
        }

        .answer-btn:disabled {
          cursor: default;
        }

        .answer-selected {
          border-color: var(--primary);
          background-color: var(--secondary);
        }

        .answer-correct {
          border-color: var(--success);
          background-color: rgba(34, 197, 94, 0.1);
        }

        .answer-incorrect {
          border-color: var(--destructive);
          background-color: rgba(239, 68, 68, 0.1);
        }

        .answer-disabled {
          opacity: 0.6;
        }

        .answer-text {
          flex: 1;
        }

        .answer-icon {
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .answer-icon.correct {
          color: var(--success);
        }

        .answer-icon.incorrect {
          color: var(--destructive);
        }
      `}</style>
    </div>
  );
}

export default QuizQuestion;
