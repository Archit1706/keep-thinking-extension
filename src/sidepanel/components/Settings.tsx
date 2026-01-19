import { useState } from 'react';
import type { ExtensionSettings, PuzzleType } from '../../types';

interface SettingsProps {
  settings: ExtensionSettings;
  onUpdate: (settings: ExtensionSettings) => void;
  onClose: () => void;
}

const PUZZLE_TYPES: { type: PuzzleType; label: string; description: string }[] = [
  { type: 'riddle', label: 'Riddles', description: 'Lateral thinking puzzles' },
  { type: 'quickMath', label: 'Quick Math', description: 'Mental arithmetic' },
  { type: 'wordAnagram', label: 'Word Anagrams', description: 'Unscramble words' },
  { type: 'wordLadder', label: 'Word Ladders', description: 'Transform words step by step' },
  {
    type: 'patternRecognition',
    label: 'Pattern Recognition',
    description: 'Number sequences',
  },
];

function Settings({ settings, onUpdate, onClose }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<ExtensionSettings>(settings);

  const handleTogglePuzzleType = (type: PuzzleType) => {
    const enabled = localSettings.enabledPuzzleTypes.includes(type);
    const newTypes = enabled
      ? localSettings.enabledPuzzleTypes.filter((t) => t !== type)
      : [...localSettings.enabledPuzzleTypes, type];

    setLocalSettings({
      ...localSettings,
      enabledPuzzleTypes: newTypes.length > 0 ? newTypes : [type], // Keep at least one enabled
    });
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>Settings</h2>
        <button className="icon-button close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h3>Puzzle Activation</h3>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={localSettings.autoActivation}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, autoActivation: e.target.checked })
              }
            />
            <span className="toggle-label">
              Auto-activate puzzles
              <span className="setting-description">
                Automatically show puzzles when AI is thinking
              </span>
            </span>
          </label>

          <label className="slider-setting">
            <span className="slider-label">
              Trigger delay: {localSettings.triggerDelay / 1000}s
              <span className="setting-description">
                Wait time before showing puzzle
              </span>
            </span>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={localSettings.triggerDelay}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  triggerDelay: parseInt(e.target.value),
                })
              }
            />
          </label>
        </section>

        <section className="settings-section">
          <h3>Puzzle Types</h3>
          <div className="puzzle-types-list">
            {PUZZLE_TYPES.map(({ type, label, description }) => (
              <label key={type} className="checkbox-setting">
                <input
                  type="checkbox"
                  checked={localSettings.enabledPuzzleTypes.includes(type)}
                  onChange={() => handleTogglePuzzleType(type)}
                />
                <span className="checkbox-label">
                  {label}
                  <span className="setting-description">{description}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>Difficulty</h3>
          <div className="difficulty-options">
            {(['easy', 'medium', 'hard', 'adaptive'] as const).map((level) => (
              <label key={level} className="radio-setting">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={localSettings.difficulty === level}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      difficulty: e.target.value as typeof level,
                    })
                  }
                />
                <span className="radio-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>Notifications</h3>
          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={localSettings.streakNotifications}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  streakNotifications: e.target.checked,
                })
              }
            />
            <span className="toggle-label">
              Streak notifications
              <span className="setting-description">Get notified about your daily streak</span>
            </span>
          </label>

          <label className="toggle-setting">
            <input
              type="checkbox"
              checked={localSettings.soundEffects}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, soundEffects: e.target.checked })
              }
            />
            <span className="toggle-label">
              Sound effects
              <span className="setting-description">Play sounds for correct/incorrect answers</span>
            </span>
          </label>
        </section>

        <section className="settings-section">
          <h3>Appearance</h3>
          <div className="appearance-options">
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <label key={mode} className="radio-setting">
                <input
                  type="radio"
                  name="darkMode"
                  value={mode}
                  checked={localSettings.darkMode === mode}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      darkMode: e.target.value as typeof mode,
                    })
                  }
                />
                <span className="radio-label">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <footer className="settings-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Settings
        </button>
      </footer>
    </div>
  );
}

export default Settings;
