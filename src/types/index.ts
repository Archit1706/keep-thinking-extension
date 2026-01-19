// Core types for the extension

export interface PlatformSelectors {
  stopButton?: string[];
  streamingClass?: string;
  responseContainer?: string;
  loadingIndicator?: string[];
  sendButtonDisabled?: string;
}

export interface DetectorCallbacks {
  onStart?: () => void;
  onComplete?: (duration: number) => void;
  onTriggerPuzzle?: () => void;
}

export type Platform = 'chatgpt' | 'claude' | 'gemini' | 'deepseek' | 'perplexity' | 'generic';

export interface ExtensionSettings {
  autoActivation: boolean;
  triggerDelay: number;
  enabledPuzzleTypes: PuzzleType[];
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  enabledSites: Platform[];
  darkMode: 'light' | 'dark' | 'system';
  soundEffects: boolean;
  streakNotifications: boolean;
}

export type PuzzleType = 'riddle' | 'quickMath' | 'wordAnagram' | 'wordLadder' | 'patternRecognition';

export interface BasePuzzle {
  id: string;
  type: PuzzleType;
  difficulty: number;
  estimatedTime: number;
}

export interface Riddle extends BasePuzzle {
  type: 'riddle';
  question: string;
  answer: string;
  hints: string[];
  category: string;
}

export interface MathPuzzle extends BasePuzzle {
  type: 'quickMath';
  question: string;
  answer: number;
  options?: number[];
}

export interface WordAnagram extends BasePuzzle {
  type: 'wordAnagram';
  scrambled: string;
  answer: string;
  hint?: string;
}

export interface WordLadder extends BasePuzzle {
  type: 'wordLadder';
  startWord: string;
  endWord: string;
  steps: number;
  answer: string[];
}

export interface PatternPuzzle extends BasePuzzle {
  type: 'patternRecognition';
  sequence: (number | string)[];
  answer: number | string;
  options: (number | string)[];
}

export type Puzzle = Riddle | MathPuzzle | WordAnagram | WordLadder | PatternPuzzle;

export interface UserProgress {
  totalPuzzlesSolved: number;
  streakDays: number;
  lastPlayedDate: string;
  difficultyHistory: number[];
  puzzleStats: Record<PuzzleType, {
    attempted: number;
    solved: number;
    averageTime: number;
  }>;
}

export interface PuzzleSession {
  puzzle: Puzzle;
  startTime: number;
  abandoned: boolean;
}

// Message types for communication between components
export type MessageType =
  | 'LOADING_STARTED'
  | 'LOADING_COMPLETE'
  | 'TRIGGER_PUZZLE'
  | 'OPEN_SIDE_PANEL'
  | 'CLOSE_SIDE_PANEL'
  | 'PUZZLE_COMPLETED'
  | 'PUZZLE_ABANDONED'
  | 'UPDATE_SETTINGS';

export interface ExtensionMessage {
  type: MessageType;
  payload?: any;
}
