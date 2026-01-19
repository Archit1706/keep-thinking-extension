import type { PatternPuzzle } from '../types';

type PatternType = 'arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'prime' | 'alternate';

/**
 * Generate arithmetic sequence (constant difference)
 */
function generateArithmetic(difficulty: number): PatternPuzzle {
  const start = Math.floor(Math.random() * 20) + 1;
  const diff = Math.floor(Math.random() * 10) + 2;
  const length = 4 + Math.floor(difficulty * 3); // 4-7 terms

  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(start + i * diff);
  }

  const answer = sequence[sequence.length - 1] + diff;

  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'patternRecognition',
    sequence,
    answer,
    options: generateOptions(answer, diff),
    difficulty,
    estimatedTime: 30000 + difficulty * 30000,
  };
}

/**
 * Generate geometric sequence (constant ratio)
 */
function generateGeometric(difficulty: number): PatternPuzzle {
  const start = Math.floor(Math.random() * 5) + 2;
  const ratio = Math.floor(Math.random() * 3) + 2; // 2x or 3x
  const length = 4 + Math.floor(difficulty * 2); // 4-6 terms

  const sequence: number[] = [];
  let current = start;
  for (let i = 0; i < length; i++) {
    sequence.push(current);
    current *= ratio;
  }

  const answer = sequence[sequence.length - 1] * ratio;

  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'patternRecognition',
    sequence,
    answer,
    options: generateOptions(answer, answer / 2),
    difficulty,
    estimatedTime: 40000 + difficulty * 40000,
  };
}

/**
 * Generate Fibonacci-like sequence
 */
function generateFibonacci(difficulty: number): PatternPuzzle {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  const length = 5 + Math.floor(difficulty * 2); // 5-7 terms

  const sequence: number[] = [a, b];
  for (let i = 2; i < length; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }

  const answer = sequence[sequence.length - 1] + sequence[sequence.length - 2];

  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'patternRecognition',
    sequence,
    answer,
    options: generateOptions(answer, 10),
    difficulty,
    estimatedTime: 45000 + difficulty * 45000,
  };
}

/**
 * Generate square number sequence
 */
function generateSquares(difficulty: number): PatternPuzzle {
  const start = Math.floor(Math.random() * 5) + 1;
  const length = 4 + Math.floor(difficulty * 2); // 4-6 terms

  const sequence: number[] = [];
  for (let i = start; i < start + length; i++) {
    sequence.push(i * i);
  }

  const next = start + length;
  const answer = next * next;

  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'patternRecognition',
    sequence,
    answer,
    options: generateOptions(answer, 15),
    difficulty,
    estimatedTime: 40000 + difficulty * 40000,
  };
}

/**
 * Generate alternating pattern
 */
function generateAlternating(difficulty: number): PatternPuzzle {
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 20) + 5;
  const diffA = Math.floor(Math.random() * 5) + 2;
  const diffB = Math.floor(Math.random() * 5) + 2;

  const sequence: number[] = [];
  let valA = a;
  let valB = b;

  const length = 6 + Math.floor(difficulty * 2); // 6-8 terms
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      sequence.push(valA);
      valA += diffA;
    } else {
      sequence.push(valB);
      valB += diffB;
    }
  }

  const answer = length % 2 === 0 ? valA : valB;

  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'patternRecognition',
    sequence,
    answer,
    options: generateOptions(answer, 10),
    difficulty,
    estimatedTime: 50000 + difficulty * 50000,
  };
}

/**
 * Generate pattern puzzle based on difficulty
 */
export function generatePatternPuzzle(difficulty: number): PatternPuzzle {
  const patternTypes: PatternType[] = ['arithmetic', 'geometric', 'fibonacci', 'square', 'alternate'];

  // Filter patterns by difficulty
  let availableTypes = patternTypes;
  if (difficulty < 0.3) {
    availableTypes = ['arithmetic', 'geometric'];
  } else if (difficulty < 0.6) {
    availableTypes = ['arithmetic', 'geometric', 'square'];
  }

  const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

  switch (selectedType) {
    case 'arithmetic':
      return generateArithmetic(difficulty);
    case 'geometric':
      return generateGeometric(difficulty);
    case 'fibonacci':
      return generateFibonacci(difficulty);
    case 'square':
      return generateSquares(difficulty);
    case 'alternate':
      return generateAlternating(difficulty);
    default:
      return generateArithmetic(difficulty);
  }
}

/**
 * Generate wrong answer options
 */
function generateOptions(correctAnswer: number, variance: number): number[] {
  const options = [correctAnswer];

  while (options.length < 4) {
    const offset = Math.floor((Math.random() - 0.5) * variance * 4);
    const wrong = correctAnswer + offset;

    if (wrong > 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

/**
 * Check if answer is correct
 */
export function checkPatternAnswer(puzzle: PatternPuzzle, userAnswer: number | string): boolean {
  return userAnswer === puzzle.answer;
}

/**
 * Get a hint about the pattern type
 */
export function getPatternHint(puzzle: PatternPuzzle): string {
  const seq = puzzle.sequence as number[];

  // Check for arithmetic
  const diffs = seq.slice(1).map((val, i) => val - seq[i]);
  if (diffs.every((d) => d === diffs[0])) {
    return 'Hint: Each number increases by the same amount';
  }

  // Check for geometric
  const ratios = seq.slice(1).map((val, i) => val / seq[i]);
  if (ratios.every((r) => r === ratios[0])) {
    return 'Hint: Each number is multiplied by the same factor';
  }

  // Check for Fibonacci
  let isFib = true;
  for (let i = 2; i < seq.length; i++) {
    if (seq[i] !== seq[i - 1] + seq[i - 2]) {
      isFib = false;
      break;
    }
  }
  if (isFib) {
    return 'Hint: Each number is the sum of the previous two';
  }

  // Check for squares
  const sqrtSeq = seq.map((n) => Math.sqrt(n));
  if (sqrtSeq.every((s) => s === Math.floor(s))) {
    const sqrtDiffs = sqrtSeq.slice(1).map((val, i) => val - sqrtSeq[i]);
    if (sqrtDiffs.every((d) => d === sqrtDiffs[0])) {
      return 'Hint: These numbers are perfect squares';
    }
  }

  return 'Hint: Look for a pattern in how the numbers change';
}
