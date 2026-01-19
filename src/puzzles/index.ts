import type { Puzzle, PuzzleType } from '../types';
import { generateRiddle } from './riddles';
import { generateMathPuzzle } from './quickMath';
import { generateWordAnagram } from './wordAnagram';
import { generateWordLadder } from './wordLadder';
import { generatePatternPuzzle } from './patterns';

/**
 * Generate a puzzle based on type and difficulty
 */
export function generatePuzzle(type: PuzzleType, difficulty: number): Puzzle {
  switch (type) {
    case 'riddle':
      return generateRiddle(difficulty);
    case 'quickMath':
      return generateMathPuzzle(difficulty);
    case 'wordAnagram':
      return generateWordAnagram(difficulty);
    case 'wordLadder':
      return generateWordLadder(difficulty);
    case 'patternRecognition':
      return generatePatternPuzzle(difficulty);
    default:
      return generateRiddle(difficulty);
  }
}

/**
 * Select a random puzzle type from enabled types
 */
export function selectRandomPuzzleType(enabledTypes: PuzzleType[]): PuzzleType {
  if (enabledTypes.length === 0) {
    return 'riddle'; // Fallback
  }

  return enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
}

/**
 * Get puzzle icon emoji
 */
export function getPuzzleIcon(type: PuzzleType): string {
  switch (type) {
    case 'riddle':
      return '❓';
    case 'quickMath':
      return '🔢';
    case 'wordAnagram':
      return '🔤';
    case 'wordLadder':
      return '🪜';
    case 'patternRecognition':
      return '🧩';
    default:
      return '🎯';
  }
}

/**
 * Get puzzle display name
 */
export function getPuzzleName(type: PuzzleType): string {
  switch (type) {
    case 'riddle':
      return 'Riddle';
    case 'quickMath':
      return 'Quick Math';
    case 'wordAnagram':
      return 'Word Anagram';
    case 'wordLadder':
      return 'Word Ladder';
    case 'patternRecognition':
      return 'Pattern Recognition';
    default:
      return 'Puzzle';
  }
}

// Re-export checking functions
export { checkRiddleAnswer } from './riddles';
export { checkMathAnswer } from './quickMath';
export { checkAnagramAnswer, getLetterHint } from './wordAnagram';
export { checkWordLadderAnswer, getWordLadderHint } from './wordLadder';
export { checkPatternAnswer, getPatternHint } from './patterns';
