import { useState } from 'react';
import type { MathPuzzle } from '../../types';
import { checkMathAnswer } from '../../puzzles';

interface MathRendererProps {
  puzzle: MathPuzzle;
  onComplete: (correct: boolean) => void;
}

function MathRenderer({ puzzle, onComplete }: MathRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleSelectAnswer = (answer: number) => {
    if (feedback) return; // Already answered

    setSelectedAnswer(answer);
    const correct = checkMathAnswer(puzzle, answer);
    setFeedback(correct ? 'correct' : 'incorrect');

    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  return (
    <div className="math-puzzle">
      <div className="math-question">
        <p className="question-text math-expression">{puzzle.question} = ?</p>
      </div>

      <div className="options-grid">
        {puzzle.options?.map((option, index) => (
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

export default MathRenderer;
