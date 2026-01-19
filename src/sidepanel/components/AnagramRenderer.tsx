import React, { useState } from 'react';
import type { WordAnagram } from '../../types';
import { checkAnagramAnswer, getLetterHint } from '../../puzzles';

interface AnagramRendererProps {
  puzzle: WordAnagram;
  onComplete: (correct: boolean) => void;
}

function AnagramRenderer({ puzzle, onComplete }: AnagramRendererProps) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());
  const [letterHint, setLetterHint] = useState<string>('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) return;

    const correct = checkAnagramAnswer(puzzle, answer);
    setFeedback(correct ? 'correct' : 'incorrect');
    setAttempts(attempts + 1);

    if (correct) {
      setTimeout(() => onComplete(true), 1500);
    } else if (attempts >= 2) {
      setTimeout(() => onComplete(false), 2000);
    } else {
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleShowLetterHint = () => {
    const newRevealed = new Set(revealedLetters);
    const hint = getLetterHint(puzzle, newRevealed);
    setRevealedLetters(newRevealed);
    setLetterHint(hint);
  };

  return (
    <div className="anagram-puzzle">
      <div className="anagram-display">
        <p className="scrambled-word">{puzzle.scrambled}</p>
        {puzzle.hint && <p className="word-hint">Hint: {puzzle.hint}</p>}
      </div>

      {letterHint && (
        <div className="letter-hint">
          <p className="hint-label">Letter positions:</p>
          <p className="revealed-letters">{letterHint}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="answer-form">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Unscramble the word..."
          className="answer-input"
          disabled={feedback === 'correct'}
          autoFocus
          maxLength={puzzle.answer.length}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!answer.trim() || feedback === 'correct'}
        >
          Submit
        </button>
      </form>

      {revealedLetters.size < puzzle.answer.length && attempts > 0 && feedback !== 'correct' && (
        <button className="btn btn-secondary hint-button" onClick={handleShowLetterHint}>
          💡 Reveal a Letter
        </button>
      )}

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>Correct! The word was "{puzzle.answer}"</span>
            </div>
          ) : (
            <div className="error-message">
              <span className="error-icon">✗</span>
              <span>
                {attempts >= 2
                  ? `The answer was "${puzzle.answer}"`
                  : 'Try again!'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="puzzle-meta">
        <span className="attempts-count">Attempts: {attempts}/3</span>
        <span className="word-length">{puzzle.answer.length} letters</span>
      </div>
    </div>
  );
}

export default AnagramRenderer;
