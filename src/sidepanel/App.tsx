import { useState, useEffect } from 'react';
import type { Puzzle, UserProgress, ExtensionSettings, ExtensionMessage } from '../types';
import { storage } from '../lib/storage';
import { AdaptiveDifficulty } from '../lib/adaptiveDifficulty';
import { generatePuzzle, selectRandomPuzzleType } from '../puzzles';
import PuzzleRenderer from './components/PuzzleRenderer';
import ProgressBar from './components/ProgressBar';
import Settings from './components/Settings';

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzleStartTime, setPuzzleStartTime] = useState<number>(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiResponseReady, setAiResponseReady] = useState(false);
  const [adaptiveDifficulty] = useState(() => new AdaptiveDifficulty());

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [loadedProgress, loadedSettings, session] = await Promise.all([
        storage.getProgress(),
        storage.getSettings(),
        storage.getCurrentSession(),
      ]);

      setProgress(loadedProgress);
      setSettings(loadedSettings);

      // Resume session if exists
      if (session && !session.abandoned) {
        setCurrentPuzzle(session.puzzle);
        setPuzzleStartTime(session.startTime);
      } else {
        // Generate new puzzle
        generateNewPuzzle(loadedSettings);
      }
    };

    loadData();
  }, []);

  // Listen for messages from background script
  useEffect(() => {
    const messageListener = (message: ExtensionMessage) => {
      if (message.type === 'LOADING_COMPLETE') {
        setAiResponseReady(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const generateNewPuzzle = (currentSettings: ExtensionSettings) => {
    const difficulty = adaptiveDifficulty.getCurrentDifficulty();
    const puzzleType = selectRandomPuzzleType(currentSettings.enabledPuzzleTypes);
    const puzzle = generatePuzzle(puzzleType, difficulty);

    setCurrentPuzzle(puzzle);
    setPuzzleStartTime(Date.now());
    setAiResponseReady(false);

    // Save session
    storage.setCurrentSession({
      puzzle,
      startTime: Date.now(),
      abandoned: false,
    });
  };

  const handlePuzzleComplete = async (correct: boolean) => {
    if (!currentPuzzle || !progress || !settings) return;

    const timeSpent = Date.now() - puzzleStartTime;

    // Update adaptive difficulty
    adaptiveDifficulty.updateDifficulty(correct, timeSpent, currentPuzzle.estimatedTime);

    // Send completion message to background
    chrome.runtime.sendMessage({
      type: 'PUZZLE_COMPLETED',
      payload: {
        puzzleType: currentPuzzle.type,
        timeSpent,
        correct,
      },
    });

    // Reload progress
    const updatedProgress = await storage.getProgress();
    setProgress(updatedProgress);

    // Generate new puzzle after short delay
    setTimeout(() => {
      generateNewPuzzle(settings);
    }, 1500);
  };

  const handlePuzzleAbandon = () => {
    if (!currentPuzzle) return;

    chrome.runtime.sendMessage({
      type: 'PUZZLE_ABANDONED',
      payload: {
        puzzleType: currentPuzzle.type,
      },
    });

    storage.setCurrentSession(null);
  };

  const handleViewResponse = () => {
    setAiResponseReady(false);
    handlePuzzleAbandon();
    // Close side panel
    window.close();
  };

  const handleSettingsUpdate = async (newSettings: ExtensionSettings) => {
    await storage.setSettings(newSettings);
    setSettings(newSettings);

    // Notify background script
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: newSettings,
    });
  };

  if (!progress || !settings) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading puzzle...</p>
      </div>
    );
  }

  if (showSettings) {
    return (
      <Settings
        settings={settings}
        onUpdate={handleSettingsUpdate}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="panel-header">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span>AI still thinking...</span>
        </div>
        <button
          className="icon-button settings-button"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      <main className="puzzle-area">
        {currentPuzzle ? (
          <PuzzleRenderer
            puzzle={currentPuzzle}
            onComplete={handlePuzzleComplete}
            onSkip={() => {
              handlePuzzleAbandon();
              if (settings) generateNewPuzzle(settings);
            }}
          />
        ) : (
          <div className="no-puzzle">
            <p>No puzzle available</p>
            <button
              className="btn btn-primary"
              onClick={() => settings && generateNewPuzzle(settings)}
            >
              Generate Puzzle
            </button>
          </div>
        )}
      </main>

      <footer className="panel-footer">
        <ProgressBar progress={progress} />
        <div className="streak-display">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{progress.streakDays} day streak</span>
        </div>
      </footer>

      {aiResponseReady && (
        <div className="response-notification">
          <div className="notification-content">
            <p className="notification-title">✨ AI Response Ready</p>
            <p className="notification-text">Your AI response is ready to view</p>
            <div className="notification-actions">
              <button className="btn btn-primary" onClick={handleViewResponse}>
                View Now
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setAiResponseReady(false)}
              >
                Finish Puzzle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
