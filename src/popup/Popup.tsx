import { useState, useEffect } from 'react';
import type { UserProgress, ExtensionSettings } from '../types';
import { storage } from '../lib/storage';

function Popup() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [loadedProgress, loadedSettings] = await Promise.all([
        storage.getProgress(),
        storage.getSettings(),
      ]);
      setProgress(loadedProgress);
      setSettings(loadedSettings);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleToggleActivation = async () => {
    if (!settings) return;

    const newSettings = { ...settings, autoActivation: !settings.autoActivation };
    await storage.setSettings(newSettings);
    setSettings(newSettings);

    // Notify background script
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: newSettings,
    });
  };

  const handleOpenSidePanel = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      await chrome.sidePanel.open({ tabId: tab.id });
      window.close();
    }
  };

  if (loading || !progress || !settings) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const totalAttempted = Object.values(progress.puzzleStats).reduce(
    (sum, stat) => sum + stat.attempted,
    0
  );

  const successRate =
    totalAttempted > 0
      ? Math.round((progress.totalPuzzlesSolved / totalAttempted) * 100)
      : 0;

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>🧩 BrainWait</h1>
        <p className="tagline">Keep your brain active</p>
      </header>

      <div className="popup-content">
        <section className="stats-section">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{progress.totalPuzzlesSolved}</div>
              <div className="stat-label">Puzzles Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                <span className="streak-icon">🔥</span> {progress.streakDays}
              </div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <button className="action-button primary" onClick={handleOpenSidePanel}>
            🎯 Start a Puzzle
          </button>

          <label className="toggle-row">
            <span>Auto-activate puzzles</span>
            <input
              type="checkbox"
              checked={settings.autoActivation}
              onChange={handleToggleActivation}
            />
          </label>
        </section>

        <section className="puzzle-breakdown">
          <h3>Puzzle Performance</h3>
          <div className="breakdown-list">
            {Object.entries(progress.puzzleStats).map(([type, stats]) => {
              const rate =
                stats.attempted > 0 ? Math.round((stats.solved / stats.attempted) * 100) : 0;
              return (
                <div key={type} className="breakdown-item">
                  <span className="breakdown-label">
                    {type === 'riddle' && '❓ Riddles'}
                    {type === 'quickMath' && '🔢 Quick Math'}
                    {type === 'wordAnagram' && '🔤 Anagrams'}
                    {type === 'wordLadder' && '🪜 Word Ladders'}
                    {type === 'patternRecognition' && '🧩 Patterns'}
                  </span>
                  <span className="breakdown-value">
                    {stats.solved}/{stats.attempted} ({rate}%)
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="popup-footer">
        <a
          href="https://github.com/yourusername/brainwait"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          About
        </a>
        <span className="footer-divider">•</span>
        <a href="#" className="footer-link" onClick={(e) => {
          e.preventDefault();
          chrome.runtime.openOptionsPage();
        }}>
          Settings
        </a>
      </footer>
    </div>
  );
}

export default Popup;
