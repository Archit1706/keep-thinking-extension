import type { UserProgress } from '../../types';

interface ProgressBarProps {
  progress: UserProgress;
}

function ProgressBar({ progress }: ProgressBarProps) {
  const totalAttempted = Object.values(progress.puzzleStats).reduce(
    (sum, stat) => sum + stat.attempted,
    0
  );

  const successRate =
    totalAttempted > 0
      ? Math.round((progress.totalPuzzlesSolved / totalAttempted) * 100)
      : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Solved</span>
          <span className="stat-value">{progress.totalPuzzlesSolved}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value">{successRate}%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(successRate, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
