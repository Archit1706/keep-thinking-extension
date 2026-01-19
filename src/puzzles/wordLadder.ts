import type { WordLadder } from '../types';

// Pre-built word ladder chains with solutions
const WORD_LADDERS = [
  {
    start: 'cold',
    end: 'warm',
    steps: 4,
    solution: ['cold', 'cord', 'word', 'worm', 'warm'],
    difficulty: 0.5,
  },
  {
    start: 'cat',
    end: 'dog',
    steps: 3,
    solution: ['cat', 'cot', 'dot', 'dog'],
    difficulty: 0.3,
  },
  {
    start: 'head',
    end: 'tail',
    steps: 5,
    solution: ['head', 'heal', 'teal', 'tell', 'tall', 'tail'],
    difficulty: 0.7,
  },
  {
    start: 'love',
    end: 'hate',
    steps: 3,
    solution: ['love', 'hove', 'have', 'hate'],
    difficulty: 0.4,
  },
  {
    start: 'poor',
    end: 'rich',
    steps: 5,
    solution: ['poor', 'boor', 'book', 'rook', 'rock', 'rick', 'rich'],
    difficulty: 0.8,
  },
  {
    start: 'work',
    end: 'play',
    steps: 4,
    solution: ['work', 'pork', 'port', 'part', 'pact', 'play'],
    difficulty: 0.6,
  },
  {
    start: 'black',
    end: 'white',
    steps: 6,
    solution: ['black', 'blank', 'blink', 'clink', 'chink', 'think', 'thick', 'white'],
    difficulty: 0.9,
  },
  {
    start: 'boy',
    end: 'man',
    steps: 3,
    solution: ['boy', 'bay', 'may', 'man'],
    difficulty: 0.3,
  },
  {
    start: 'hot',
    end: 'ice',
    steps: 4,
    solution: ['hot', 'hat', 'hit', 'hic', 'hie', 'ice'],
    difficulty: 0.5,
  },
  {
    start: 'small',
    end: 'giant',
    steps: 7,
    solution: ['small', 'shall', 'shale', 'share', 'scare', 'scare', 'spare', 'spire', 'spine', 'swine', 'shine', 'shins', 'giant'],
    difficulty: 0.95,
  },
];

/**
 * Generate a word ladder puzzle based on difficulty
 */
export function generateWordLadder(difficulty: number): WordLadder {
  // Filter ladders by difficulty
  const suitable = WORD_LADDERS.filter(
    (ladder) => Math.abs(ladder.difficulty - difficulty) <= 0.25
  );

  const pool = suitable.length > 0 ? suitable : WORD_LADDERS;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  // Estimate time: roughly 15 seconds per step
  const estimatedTime = selected.steps * 15000;

  return {
    id: `wordladder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'wordLadder',
    startWord: selected.start,
    endWord: selected.end,
    steps: selected.steps,
    answer: selected.solution,
    difficulty: selected.difficulty,
    estimatedTime,
  };
}

/**
 * Check if a word ladder solution is valid
 */
export function checkWordLadderAnswer(puzzle: WordLadder, userPath: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if starts and ends correctly
  if (userPath[0]?.toLowerCase() !== puzzle.startWord.toLowerCase()) {
    errors.push(`Must start with "${puzzle.startWord}"`);
  }

  if (userPath[userPath.length - 1]?.toLowerCase() !== puzzle.endWord.toLowerCase()) {
    errors.push(`Must end with "${puzzle.endWord}"`);
  }

  // Check if each step changes only one letter
  for (let i = 0; i < userPath.length - 1; i++) {
    const current = userPath[i].toLowerCase();
    const next = userPath[i + 1].toLowerCase();

    if (current.length !== next.length) {
      errors.push(`Words must be same length (step ${i + 1})`);
      continue;
    }

    let differences = 0;
    for (let j = 0; j < current.length; j++) {
      if (current[j] !== next[j]) differences++;
    }

    if (differences !== 1) {
      errors.push(`Change only one letter per step (step ${i + 1})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get a hint - reveal next step in solution
 */
export function getWordLadderHint(puzzle: WordLadder, currentStep: number): string {
  if (currentStep >= puzzle.answer.length - 1) {
    return 'You\'re at the last step!';
  }

  const nextWord = puzzle.answer[currentStep + 1];
  const currentWord = puzzle.answer[currentStep];

  // Find which letter changed
  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] !== nextWord[i]) {
      return `Try changing letter ${i + 1} to "${nextWord[i]}"`;
    }
  }

  return `Next word: ${nextWord}`;
}
