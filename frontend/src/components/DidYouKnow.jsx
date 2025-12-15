import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { getDidYouKnowFact } from '../services/apiClient';
import '../styles/DidYouKnow.css';

const DidYouKnow = ({ question, show }) => {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState(null);

  useEffect(() => {
    // Create a unique ID for this question
    const questionId = `${question?.question}|${question?.correct_answer}`;
    
    // Only fetch if this is a NEW question (different ID)
    if (show && question && questionId !== lastQuestionId) {
      setFact(null);  // Clear old fact
      setError(false);
      setLastQuestionId(questionId);
      
      // Fetch immediately
      (async () => {
        setLoading(true);
        try {
          const factData = await getDidYouKnowFact(question);
          if (factData) {
            setFact(factData);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error('Error fetching fact:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [show, question, lastQuestionId]);

  if (!show) return null;

  return (
    <div className="did-you-know-container">
      <div className="did-you-know-card">
        <div className="did-you-know-header">
          <div className="did-you-know-icon">
            <Lightbulb size={20} />
          </div>
          <span className="did-you-know-title">Did You Know?</span>
          <Sparkles size={16} className="sparkle-icon" />
        </div>

        <div className="did-you-know-content">
          {loading && (
            <div className="did-you-know-loading">
              <Loader2 size={24} className="loading-spinner" />
              <span>Generating interesting fact...</span>
            </div>
          )}

          {error && !loading && (
            <div className="did-you-know-error">
              <span>💡 Keep learning! Every question is an opportunity to discover something new.</span>
            </div>
          )}

          {fact && !loading && (
            <div className="did-you-know-fact">
              <span className="fact-emoji">{fact.emoji}</span>
              <p className="fact-text">{fact.fact}</p>
              <span className="fact-topic">#{fact.source_topic}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DidYouKnow;