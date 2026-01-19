import type { MathPuzzle } from '../types';

type Operator = '+' | '-' | '×' | '÷';

/**
 * Generate a math puzzle based on difficulty level
 * Difficulty 0-1 maps to problem complexity
 */
export function generateMathPuzzle(difficulty: number): MathPuzzle {
  // Determine available operators based on difficulty
  const operators: Operator[] = difficulty < 0.3 ? ['+', '-'] : ['+', '-', '×', '÷'];

  // Determine number range based on difficulty
  const maxNum = Math.floor(10 + difficulty * 90); // 10-100 range

  // Select random operator
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let question: string;
  let answer: number;

  switch (operator) {
    case '+':
      {
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        question = `${a} + ${b}`;
        answer = a + b;
      }
      break;

    case '-':
      {
        let a = Math.floor(Math.random() * maxNum) + 1;
        let b = Math.floor(Math.random() * maxNum) + 1;
        // Ensure non-negative result
        if (b > a) [a, b] = [b, a];
        question = `${a} - ${b}`;
        answer = a - b;
      }
      break;

    case '×':
      {
        // Keep multiplication numbers smaller for easier mental math
        const maxMult = Math.floor(5 + difficulty * 15); // 5-20 range
        const a = Math.floor(Math.random() * maxMult) + 1;
        const b = Math.floor(Math.random() * maxMult) + 1;
        question = `${a} × ${b}`;
        answer = a * b;
      }
      break;

    case '÷':
      {
        // Generate division with whole number result
        const maxDiv = Math.floor(5 + difficulty * 15); // 5-20 range
        const quotient = Math.floor(Math.random() * maxDiv) + 1;
        const divisor = Math.floor(Math.random() * maxDiv) + 1;
        const dividend = quotient * divisor;
        question = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      }
      break;
  }

  // Generate wrong answer options for multiple choice
  const options = generateOptions(answer, difficulty);

  // Estimate time based on difficulty
  const estimatedTime = 20000 + difficulty * 40000; // 20-60 seconds

  return {
    id: `math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'quickMath',
    question,
    answer,
    options,
    difficulty,
    estimatedTime,
  };
}

/**
 * Generate plausible wrong answer options
 */
function generateOptions(correctAnswer: number, _difficulty: number): number[] {
  const options = [correctAnswer];
  const variance = Math.max(3, Math.floor(correctAnswer * 0.3)); // 30% variance

  while (options.length < 4) {
    let wrongAnswer: number;

    if (Math.random() < 0.5) {
      // Off-by-one type errors
      wrongAnswer = correctAnswer + (Math.random() < 0.5 ? 1 : -1);
    } else {
      // Calculation errors
      wrongAnswer = correctAnswer + Math.floor((Math.random() - 0.5) * variance * 2);
    }

    // Ensure positive and unique
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Check if answer is correct
 */
export function checkMathAnswer(puzzle: MathPuzzle, userAnswer: number): boolean {
  return userAnswer === puzzle.answer;
}

/**
 * Generate a compound math puzzle (for higher difficulty)
 */
export function generateCompoundMathPuzzle(difficulty: number): MathPuzzle {
  if (difficulty < 0.6) {
    return generateMathPuzzle(difficulty);
  }

  // Generate multi-step problem
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const c = Math.floor(Math.random() * 10) + 1;

  const operators = ['+', '-', '×'];
  const op1 = operators[Math.floor(Math.random() * operators.length)];
  const op2 = operators[Math.floor(Math.random() * operators.length)];

  let question: string;
  let answer: number;

  if (op1 === '×') {
    // Multiplication first (order of operations)
    question = `${a} ${op1} ${b} ${op2} ${c}`;
    const temp = op1 === '×' ? a * b : a + b;
    answer = op2 === '+' ? temp + c : op2 === '-' ? temp - c : temp * c;
  } else {
    question = `(${a} ${op1} ${b}) ${op2} ${c}`;
    const temp = op1 === '+' ? a + b : a - b;
    answer = op2 === '+' ? temp + c : op2 === '-' ? temp - c : temp * c;
  }

  const options = generateOptions(answer, difficulty);
  const estimatedTime = 45000 + difficulty * 45000; // 45-90 seconds

  return {
    id: `math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'quickMath',
    question,
    answer,
    options,
    difficulty,
    estimatedTime,
  };
}
