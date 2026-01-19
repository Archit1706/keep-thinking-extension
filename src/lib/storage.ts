import type { ExtensionSettings, UserProgress, PuzzleSession } from '../types';

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'brainwait_settings',
  PROGRESS: 'brainwait_progress',
  CURRENT_SESSION: 'brainwait_session',
} as const;

// Default settings
export const DEFAULT_SETTINGS: ExtensionSettings = {
  autoActivation: true,
  triggerDelay: 2500,
  enabledPuzzleTypes: ['riddle', 'quickMath', 'wordAnagram', 'wordLadder', 'patternRecognition'],
  difficulty: 'adaptive',
  enabledSites: ['chatgpt', 'claude', 'gemini', 'deepseek', 'perplexity'],
  darkMode: 'system',
  soundEffects: false,
  streakNotifications: true,
};

// Default progress
export const DEFAULT_PROGRESS: UserProgress = {
  totalPuzzlesSolved: 0,
  streakDays: 0,
  lastPlayedDate: new Date().toISOString(),
  difficultyHistory: [],
  puzzleStats: {
    riddle: { attempted: 0, solved: 0, averageTime: 0 },
    quickMath: { attempted: 0, solved: 0, averageTime: 0 },
    wordAnagram: { attempted: 0, solved: 0, averageTime: 0 },
    wordLadder: { attempted: 0, solved: 0, averageTime: 0 },
    patternRecognition: { attempted: 0, solved: 0, averageTime: 0 },
  },
};

// Storage wrapper with type safety
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  onChange(callback: (changes: Record<string, chrome.storage.StorageChange>) => void): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        callback(changes);
      }
    });
  },

  // Specific getters/setters for typed data
  async getSettings(): Promise<ExtensionSettings> {
    const settings = await this.get<ExtensionSettings>(STORAGE_KEYS.SETTINGS);
    return settings || DEFAULT_SETTINGS;
  },

  async setSettings(settings: ExtensionSettings): Promise<void> {
    await this.set(STORAGE_KEYS.SETTINGS, settings);
  },

  async getProgress(): Promise<UserProgress> {
    const progress = await this.get<UserProgress>(STORAGE_KEYS.PROGRESS);
    return progress || DEFAULT_PROGRESS;
  },

  async setProgress(progress: UserProgress): Promise<void> {
    await this.set(STORAGE_KEYS.PROGRESS, progress);
  },

  async getCurrentSession(): Promise<PuzzleSession | null> {
    return await this.get<PuzzleSession>(STORAGE_KEYS.CURRENT_SESSION);
  },

  async setCurrentSession(session: PuzzleSession | null): Promise<void> {
    if (session === null) {
      await chrome.storage.local.remove(STORAGE_KEYS.CURRENT_SESSION);
    } else {
      await this.set(STORAGE_KEYS.CURRENT_SESSION, session);
    }
  },

  async updateProgress(update: Partial<UserProgress>): Promise<void> {
    const current = await this.getProgress();
    await this.setProgress({ ...current, ...update });
  },
};
