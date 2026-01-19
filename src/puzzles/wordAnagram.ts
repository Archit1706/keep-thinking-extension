import type { WordAnagram } from '../types';

// Word lists by difficulty
const WORD_LISTS = {
  easy: [
    { word: 'listen', hint: 'Not speaking' },
    { word: 'silent', hint: 'Without sound' },
    { word: 'earth', hint: 'Our planet' },
    { word: 'heart', hint: 'Organ that pumps blood' },
    { word: 'tea', hint: 'Hot beverage' },
    { word: 'eat', hint: 'Consume food' },
    { word: 'night', hint: 'When it\'s dark' },
    { word: 'thing', hint: 'An object' },
    { word: 'stop', hint: 'Don\'t go' },
    { word: 'pots', hint: 'Cooking containers' },
    { word: 'star', hint: 'Celestial body' },
    { word: 'rats', hint: 'Small rodents' },
    { word: 'arts', hint: 'Creative works' },
    { word: 'horse', hint: 'Animal you can ride' },
    { word: 'shore', hint: 'Beach edge' },
  ],
  medium: [
    { word: 'triangle', hint: 'Three-sided shape' },
    { word: 'integral', hint: 'Essential part' },
    { word: 'players', hint: 'Game participants' },
    { word: 'parsley', hint: 'Herb garnish' },
    { word: 'replays', hint: 'Watch again' },
    { word: 'section', hint: 'Part of something' },
    { word: 'notices', hint: 'Observes' },
    { word: 'kitchen', hint: 'Where you cook' },
    { word: 'thicken', hint: 'Make more dense' },
    { word: 'bedroom', hint: 'Where you sleep' },
    { word: 'boredom', hint: 'State of being uninterested' },
    { word: 'teacher', hint: 'Educator' },
    { word: 'cheater', hint: 'One who breaks rules' },
    { word: 'create', hint: 'Make something new' },
    { word: 'cerate', hint: 'Waxy ointment' },
  ],
  hard: [
    { word: 'aspired', hint: 'Had ambitions' },
    { word: 'despair', hint: 'Loss of hope' },
    { word: 'praised', hint: 'Complimented' },
    { word: 'asteroid', hint: 'Space rock' },
    { word: 'organise', hint: 'Put in order (British spelling)' },
    { word: 'moonlight', hint: 'Nighttime illumination' },
    { word: 'lemonish', hint: 'Citrus-like quality' },
    { word: 'customers', hint: 'People who buy' },
    { word: 'struggling', hint: 'Having difficulty' },
    { word: 'percussion', hint: 'Drum instruments' },
    { word: 'supersonic', hint: 'Faster than sound' },
    { word: 'astronomer', hint: 'Studies stars' },
    { word: 'moonstar', hint: 'Celestial body combination (not a real word)' },
    { word: 'conversational', hint: 'Relating to dialogue' },
    { word: 'conservation', hint: 'Preservation' },
  ],
};

/**
 * Scramble a word randomly
 */
function scrambleWord(word: string): string {
  const letters = word.split('');

  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  const scrambled = letters.join('');

  // If scrambled === original, try again
  if (scrambled === word && word.length > 3) {
    return scrambleWord(word);
  }

  return scrambled;
}

/**
 * Generate a word anagram puzzle based on difficulty
 */
export function generateWordAnagram(difficulty: number): WordAnagram {
  let wordList: { word: string; hint: string }[];

  if (difficulty < 0.35) {
    wordList = WORD_LISTS.easy;
  } else if (difficulty < 0.7) {
    wordList = WORD_LISTS.medium;
  } else {
    wordList = WORD_LISTS.hard;
  }

  // Select random word
  const selected = wordList[Math.floor(Math.random() * wordList.length)];
  const scrambled = scrambleWord(selected.word);

  // Estimate time based on word length and difficulty
  const baseTime = selected.word.length * 3000; // 3 seconds per letter
  const estimatedTime = baseTime * (0.8 + difficulty * 0.4); // 80%-120% of base

  return {
    id: `anagram_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'wordAnagram',
    scrambled,
    answer: selected.word,
    hint: selected.hint,
    difficulty,
    estimatedTime,
  };
}

/**
 * Check if answer is correct (case-insensitive)
 */
export function checkAnagramAnswer(puzzle: WordAnagram, userAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === puzzle.answer.toLowerCase();
}

/**
 * Get a hint by revealing one letter
 */
export function getLetterHint(puzzle: WordAnagram, revealedLetters: Set<number>): string {
  const answer = puzzle.answer;
  const availablePositions = Array.from({ length: answer.length }, (_, i) => i)
    .filter((i) => !revealedLetters.has(i));

  if (availablePositions.length === 0) {
    return puzzle.answer; // All letters revealed
  }

  const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  revealedLetters.add(position);

  // Build hint string with revealed letters
  return answer
    .split('')
    .map((letter, i) => (revealedLetters.has(i) ? letter : '_'))
    .join(' ');
}
