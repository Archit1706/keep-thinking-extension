import React, { useState } from 'react';
import type { WordLadder } from '../../types';
import { checkWordLadderAnswer, getWordLadderHint } from '../../puzzles';

interface WordLadderRendererProps {
  puzzle: WordLadder;
  onComplete: (correct: boolean) => void;
}

function WordLadderRenderer({ puzzle, onComplete }: WordLadderRendererProps) {
  const [path, setPath] = useState<string[]>([puzzle.startWord]);
  const [currentWord, setCurrentWord] = useState('');
  const [hint, setHint] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentWord.trim()) return;

    const newPath = [...path, currentWord.toLowerCase()];
    setPath(newPath);
    setCurrentWord('');
    setFeedback(null);

    // Check if reached end
    if (currentWord.toLowerCase() === puzzle.endWord.toLowerCase()) {
      const result = checkWordLadderAnswer(puzzle, newPath);
      if (result.valid) {
        setTimeout(() => onComplete(true), 1500);
      } else {
        setFeedback(result.errors.join(', '));
        setTimeout(() => onComplete(false), 3000);
      }
    }
  };

  const handleShowHint = () => {
    const hintText = getWordLadderHint(puzzle, path.length - 1);
    setHint(hintText);
  };

  const handleUndo = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setFeedback(null);
    }
  };

  const handleGiveUp = () => {
    setPath(puzzle.answer);
    setFeedback('Solution shown above');
    setTimeout(() => onComplete(false), 3000);
  };

  return (
    <div className="wordladder-puzzle">
      <div className="ladder-info">
        <p className="instructions">
          Change one letter at a time to transform <strong>{puzzle.startWord}</strong> into{' '}
          <strong>{puzzle.endWord}</strong>
        </p>
        <p className="target-steps">Target: {puzzle.steps} steps</p>
      </div>

      <div className="word-path">
        {path.map((word, index) => (
          <div key={index} className="word-step">
            <span className="step-number">{index + 1}.</span>
            <span className="step-word">{word}</span>
          </div>
        ))}
        <div className="word-step target">
          <span className="step-number">{path.length + 1}.</span>
          <span className="step-word target-word">{puzzle.endWord}</span>
        </div>
      </div>

      <form onSubmit={handleAddWord} className="ladder-form">
        <input
          type="text"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          placeholder="Next word..."
          className="answer-input"
          autoFocus
          maxLength={puzzle.startWord.length}
        />
        <button type="submit" className="btn btn-primary" disabled={!currentWord.trim()}>
          Add
        </button>
      </form>

      {hint && (
        <div className="hint-box">
          <p className="hint-text">💡 {hint}</p>
        </div>
      )}

      {feedback && (
        <div className="feedback">
          <p className="feedback-text">{feedback}</p>
        </div>
      )}

      <div className="ladder-actions">
        <button className="btn btn-secondary" onClick={handleUndo} disabled={path.length <= 1}>
          ← Undo
        </button>
        <button className="btn btn-secondary" onClick={handleShowHint}>
          💡 Hint
        </button>
        <button className="btn btn-text" onClick={handleGiveUp}>
          Give Up
        </button>
      </div>
    </div>
  );
}

export default WordLadderRenderer;
