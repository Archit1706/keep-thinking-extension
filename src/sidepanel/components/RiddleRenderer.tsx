import React, { useState } from 'react';
import type { Riddle } from '../../types';
import { checkRiddleAnswer } from '../../puzzles';

interface RiddleRendererProps {
  puzzle: Riddle;
  onComplete: (correct: boolean) => void;
}

function RiddleRenderer({ puzzle, onComplete }: RiddleRendererProps) {
  const [answer, setAnswer] = useState('');
  const [currentHint, setCurrentHint] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) return;

    const correct = checkRiddleAnswer(puzzle, answer);
    setFeedback(correct ? 'correct' : 'incorrect');
    setAttempts(attempts + 1);

    if (correct) {
      setTimeout(() => onComplete(true), 1500);
    } else if (attempts >= 2) {
      // After 3 attempts, show answer and complete
      setTimeout(() => {
        setFeedback(null);
        onComplete(false);
      }, 2000);
    } else {
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleShowHint = () => {
    if (currentHint < puzzle.hints.length) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="riddle-puzzle">
      <div className="riddle-question">
        <p className="question-text">{puzzle.question}</p>
      </div>

      <form onSubmit={handleSubmit} className="answer-form">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="answer-input"
          disabled={feedback === 'correct'}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!answer.trim() || feedback === 'correct'}
        >
          Submit
        </button>
      </form>

      {currentHint > 0 && (
        <div className="hints-section">
          <h4>Hints:</h4>
          {puzzle.hints.slice(0, currentHint).map((hint, index) => (
            <p key={index} className="hint-text">
              {index + 1}. {hint}
            </p>
          ))}
        </div>
      )}

      {currentHint < puzzle.hints.length && attempts > 0 && feedback !== 'correct' && (
        <button className="btn btn-secondary hint-button" onClick={handleShowHint}>
          💡 Show Hint ({currentHint + 1}/{puzzle.hints.length})
        </button>
      )}

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>Correct! Well done!</span>
            </div>
          ) : (
            <div className="error-message">
              <span className="error-icon">✗</span>
              <span>
                Not quite right. {attempts >= 2 ? `The answer was "${puzzle.answer}"` : 'Try again!'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="puzzle-meta">
        <span className="attempts-count">Attempts: {attempts}/3</span>
        <span className="category-tag">{puzzle.category}</span>
      </div>
    </div>
  );
}

export default RiddleRenderer;
