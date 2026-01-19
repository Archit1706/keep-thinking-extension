import type { Puzzle } from '../../types';
import { getPuzzleIcon, getPuzzleName } from '../../puzzles';
import RiddleRenderer from './RiddleRenderer';
import MathRenderer from './MathRenderer';
import AnagramRenderer from './AnagramRenderer';
import WordLadderRenderer from './WordLadderRenderer';
import PatternRenderer from './PatternRenderer';

interface PuzzleRendererProps {
  puzzle: Puzzle;
  onComplete: (correct: boolean) => void;
  onSkip: () => void;
}

function PuzzleRenderer({ puzzle, onComplete, onSkip }: PuzzleRendererProps) {
  const renderPuzzle = () => {
    switch (puzzle.type) {
      case 'riddle':
        return <RiddleRenderer puzzle={puzzle} onComplete={onComplete} />;
      case 'quickMath':
        return <MathRenderer puzzle={puzzle} onComplete={onComplete} />;
      case 'wordAnagram':
        return <AnagramRenderer puzzle={puzzle} onComplete={onComplete} />;
      case 'wordLadder':
        return <WordLadderRenderer puzzle={puzzle} onComplete={onComplete} />;
      case 'patternRecognition':
        return <PatternRenderer puzzle={puzzle} onComplete={onComplete} />;
      default:
        return <div>Unknown puzzle type</div>;
    }
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <h2 className="puzzle-title">
          <span className="puzzle-icon">{getPuzzleIcon(puzzle.type)}</span>
          {getPuzzleName(puzzle.type)}
        </h2>
        <button className="btn-skip" onClick={onSkip} aria-label="Skip puzzle">
          Skip →
        </button>
      </div>
      <div className="puzzle-content">{renderPuzzle()}</div>
    </div>
  );
}

export default PuzzleRenderer;
