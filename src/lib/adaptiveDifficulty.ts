/**
 * Adaptive Difficulty Algorithm
 * Targets a 70% success rate - the psychological "flow channel"
 */

export class AdaptiveDifficulty {
  private history: number[] = [];
  private currentDifficulty = 0.5;
  private readonly targetSuccessRate = 0.7;
  private readonly historySize = 10;
  private readonly increaseRate = 0.05;
  private readonly decreaseRate = 0.08; // Faster decrease to avoid frustration
  private readonly tolerance = 0.1;

  constructor(initialDifficulty: number = 0.5, history: number[] = []) {
    this.currentDifficulty = Math.max(0, Math.min(1, initialDifficulty));
    this.history = history.slice(-this.historySize);
  }

  /**
   * Update difficulty based on puzzle performance
   * @param correct Whether the puzzle was solved correctly
   * @param timeSpent Time spent on puzzle in milliseconds
   * @param expectedTime Expected time for puzzle in milliseconds
   * @returns Updated difficulty level (0-1)
   */
  updateDifficulty(correct: boolean, timeSpent: number, expectedTime: number): number {
    // Calculate performance score (0-1)
    // Perfect score = 1.0 (correct answer, fast time)
    // Partial score = 0.7-1.0 (correct but slower)
    // Zero score = 0 (incorrect)
    let score = 0;
    if (correct) {
      const timeRatio = Math.max(0, (expectedTime - timeSpent) / expectedTime);
      score = 0.7 + 0.3 * timeRatio;
    }

    // Add to history
    this.history.push(score);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }

    // Calculate recent average success rate
    const recentAvg = this.history.reduce((a, b) => a + b, 0) / this.history.length;

    // Adjust difficulty based on success rate
    if (recentAvg > this.targetSuccessRate + this.tolerance) {
      // Too easy - increase difficulty
      this.currentDifficulty = Math.min(1, this.currentDifficulty + this.increaseRate);
    } else if (recentAvg < this.targetSuccessRate - this.tolerance) {
      // Too hard - decrease difficulty faster
      this.currentDifficulty = Math.max(0, this.currentDifficulty - this.decreaseRate);
    }

    return this.currentDifficulty;
  }

  /**
   * Get current difficulty level
   */
  getCurrentDifficulty(): number {
    return this.currentDifficulty;
  }

  /**
   * Get performance history
   */
  getHistory(): number[] {
    return [...this.history];
  }

  /**
   * Get current success rate
   */
  getSuccessRate(): number {
    if (this.history.length === 0) return 0;
    return this.history.reduce((a, b) => a + b, 0) / this.history.length;
  }

  /**
   * Reset difficulty to default
   */
  reset(): void {
    this.currentDifficulty = 0.5;
    this.history = [];
  }

  /**
   * Serialize state for storage
   */
  serialize(): { difficulty: number; history: number[] } {
    return {
      difficulty: this.currentDifficulty,
      history: this.history,
    };
  }

  /**
   * Restore from serialized state
   */
  static deserialize(state: { difficulty: number; history: number[] }): AdaptiveDifficulty {
    return new AdaptiveDifficulty(state.difficulty, state.history);
  }
}
