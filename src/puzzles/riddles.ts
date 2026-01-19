import type { Riddle } from '../types';

// Pre-built riddle database for consistent quality
const RIDDLE_DATABASE: Omit<Riddle, 'id' | 'type'>[] = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    hints: ["I repeat what you say", "I'm found in caves and mountains", "Sound is key to my existence"],
    difficulty: 0.3,
    category: "nature",
    estimatedTime: 45000,
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hints: ["Think about walking", "You create me as you move", "I'm left on the ground"],
    difficulty: 0.2,
    category: "logic",
    estimatedTime: 30000,
  },
  {
    question: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
    answer: "keyboard",
    hints: ["It's something you use every day", "Related to computers", "You're probably looking at one now"],
    difficulty: 0.4,
    category: "objects",
    estimatedTime: 60000,
  },
  {
    question: "I'm tall when I'm young and short when I'm old. What am I?",
    answer: "candle",
    hints: ["I provide light", "I get consumed as I work", "You light me with fire"],
    difficulty: 0.3,
    category: "objects",
    estimatedTime: 45000,
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hints: ["I'm small and stuck to something", "I'm related to mail", "I help letters reach their destination"],
    difficulty: 0.5,
    category: "objects",
    estimatedTime: 75000,
  },
  {
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    hints: ["I show locations", "I'm made of paper or digital", "I help people navigate"],
    difficulty: 0.4,
    category: "objects",
    estimatedTime: 60000,
  },
  {
    question: "What gets wet while drying?",
    answer: "towel",
    hints: ["It's in your bathroom", "You use it after a shower", "It absorbs water"],
    difficulty: 0.2,
    category: "objects",
    estimatedTime: 30000,
  },
  {
    question: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?",
    answer: "breath",
    hints: ["Everyone does this constantly", "You need me to live", "You can control me temporarily"],
    difficulty: 0.5,
    category: "nature",
    estimatedTime: 75000,
  },
  {
    question: "What has a head and a tail but no body?",
    answer: "coin",
    hints: ["You use me to buy things", "I'm made of metal", "I can be flipped"],
    difficulty: 0.3,
    category: "objects",
    estimatedTime: 45000,
  },
  {
    question: "What runs but never walks, has a mouth but never talks, has a bed but never sleeps?",
    answer: "river",
    hints: ["I'm found in nature", "Fish live in me", "I flow continuously"],
    difficulty: 0.6,
    category: "nature",
    estimatedTime: 90000,
  },
  {
    question: "The more of this there is, the less you see. What is it?",
    answer: "darkness",
    hints: ["Opposite of light", "It happens at night", "You need light to dispel me"],
    difficulty: 0.4,
    category: "abstract",
    estimatedTime: 60000,
  },
  {
    question: "What can fill a room but takes up no space?",
    answer: "light",
    hints: ["You flip a switch for me", "I help you see", "I travel very fast"],
    difficulty: 0.5,
    category: "abstract",
    estimatedTime: 75000,
  },
  {
    question: "I have branches, but no fruit, trunk or leaves. What am I?",
    answer: "bank",
    hints: ["You visit me for money", "I'm a business", "I have multiple locations"],
    difficulty: 0.6,
    category: "wordplay",
    estimatedTime: 90000,
  },
  {
    question: "What goes up but never comes down?",
    answer: "age",
    hints: ["Everyone experiences this", "It happens with time", "You celebrate it yearly"],
    difficulty: 0.3,
    category: "abstract",
    estimatedTime: 45000,
  },
  {
    question: "I'm always hungry and must be fed. The finger I touch will soon turn red. What am I?",
    answer: "fire",
    hints: ["I'm hot and dangerous", "I need fuel to survive", "I can cook food"],
    difficulty: 0.4,
    category: "nature",
    estimatedTime: 60000,
  },
  {
    question: "What has many teeth but cannot bite?",
    answer: "comb",
    hints: ["You use me on your hair", "I'm found in bathrooms", "I have many parallel parts"],
    difficulty: 0.3,
    category: "objects",
    estimatedTime: 45000,
  },
  {
    question: "I can be cracked, made, told, and played. What am I?",
    answer: "joke",
    hints: ["I make people laugh", "Comedians use me", "I have a punchline"],
    difficulty: 0.5,
    category: "wordplay",
    estimatedTime: 75000,
  },
  {
    question: "What has one eye but cannot see?",
    answer: "needle",
    hints: ["Used for sewing", "You thread me", "I'm sharp at one end"],
    difficulty: 0.4,
    category: "objects",
    estimatedTime: 60000,
  },
  {
    question: "What building has the most stories?",
    answer: "library",
    hints: ["Think about the word 'stories' differently", "Books are kept here", "It's a place of knowledge"],
    difficulty: 0.7,
    category: "wordplay",
    estimatedTime: 90000,
  },
  {
    question: "I'm found in socks, scarves and mittens; and often in the paws of playful kittens. What am I?",
    answer: "yarn",
    hints: ["I'm used for knitting", "I come in different colors", "I'm a long thread"],
    difficulty: 0.5,
    category: "objects",
    estimatedTime: 75000,
  },
];

/**
 * Generate a riddle puzzle based on difficulty level
 */
export function generateRiddle(difficulty: number): Riddle {
  // Filter riddles by difficulty range (±0.2)
  const suitableRiddles = RIDDLE_DATABASE.filter(
    (riddle) => Math.abs(riddle.difficulty - difficulty) <= 0.25
  );

  // If no suitable riddles, use all riddles
  const pool = suitableRiddles.length > 0 ? suitableRiddles : RIDDLE_DATABASE;

  // Select random riddle
  const selected = pool[Math.floor(Math.random() * pool.length)];

  return {
    id: `riddle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'riddle',
    ...selected,
  };
}

/**
 * Check if an answer is correct (case-insensitive, trimmed)
 */
export function checkRiddleAnswer(puzzle: Riddle, userAnswer: string): boolean {
  const normalized = userAnswer.trim().toLowerCase();
  const correctAnswer = puzzle.answer.toLowerCase();

  // Exact match
  if (normalized === correctAnswer) return true;

  // Partial match with key words (for multi-word answers)
  if (correctAnswer.includes(' ')) {
    const keywords = correctAnswer.split(' ');
    return keywords.every((keyword) => normalized.includes(keyword));
  }

  return false;
}
