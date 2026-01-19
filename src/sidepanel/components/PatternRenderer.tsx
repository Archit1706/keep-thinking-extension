import React, { useState } from 'react';
import type { PatternPuzzle } from '../../types';
import { checkPatternAnswer, getPatternHint } from '../../puzzles';

interface PatternRendererProps {
  puzzle: PatternPuzzle;
  onComplete: (correct: boolean) => void;
}

function PatternRenderer({ puzzle, onComplete }: PatternRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hint, setHint] = useState<string>('');

  const handleSelectAnswer = (answer: number | string) => {
    if (feedback) return;

    setSelectedAnswer(answer);
    const correct = checkPatternAnswer(puzzle, answer);
    setFeedback(correct ? 'correct' : 'incorrect');

    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  const handleShowHint = () => {
    const hintText = getPatternHint(puzzle);
    setHint(hintText);
  };

  return (
    <div className="pattern-puzzle">
      <div className="pattern-question">
        <p className="instructions">What comes next in this sequence?</p>
      </div>

      <div className="sequence-display">
        {puzzle.sequence.map((item, index) => (
          <React.Fragment key={index}>
            <span className="sequence-item">{item}</span>
            {index < puzzle.sequence.length - 1 && <span className="separator">,</span>}
          </React.Fragment>
        ))}
        <span className="separator">,</span>
        <span className="sequence-item placeholder">?</span>
      </div>

      {hint && (
        <div className="hint-box">
          <p className="hint-text">{hint}</p>
        </div>
      )}

      <div className="options-grid">
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'correct'
                  : 'incorrect'
                : ''
            } ${
              feedback && option === puzzle.answer && selectedAnswer !== option
                ? 'show-correct'
                : ''
            }`}
            onClick={() => handleSelectAnswer(option)}
            disabled={feedback !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {!hint && !feedback && (
        <button className="btn btn-secondary hint-button" onClick={handleShowHint}>
          💡 Show Hint
        </button>
      )}

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>Correct!</span>
            </div>
          ) : (
            <div className="error-message">
              <span className="error-icon">✗</span>
              <span>The answer was {puzzle.answer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PatternRenderer;
