interface SpacedRepetitionResult {
  interval: number;
  easeFactor: number;
  nextReview: Date;
}

export function spacedRepetition(
  currentInterval: number,
  currentEaseFactor: number,
  correct: boolean,
  confidence: number // 1-4 scale
): SpacedRepetitionResult {
  let interval = currentInterval;
  let easeFactor = currentEaseFactor;

  // Adjust ease factor based on confidence
  const confidenceModifier = (confidence - 2.5) * 0.08;
  
  if (correct) {
    // Correct answer - increase interval
    if (interval === 1) {
      interval = 6; // First correct: review in 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    // Adjust ease factor based on confidence
    easeFactor = Math.max(1.3, easeFactor + confidenceModifier);
  } else {
    // Incorrect answer - reset interval
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  // Cap maximum interval at 180 days
  interval = Math.min(interval, 180);
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(0, 0, 0, 0); // Reset to start of day

  return {
    interval,
    easeFactor,
    nextReview,
  };
}

export function shouldInterleave(correctCount: number): boolean {
  // Enable interleaving after 3 correct answers
  return correctCount >= 3;
}

export function calculateMastery(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.min(100, Math.round((correctCount / totalCount) * 100));
}

export function getDifficultyMultiplier(difficulty: number): number {
  // Adjust review frequency based on difficulty
  switch (difficulty) {
    case 1: return 1.2; // Easy - review less frequently
    case 2: return 1.0; // Medium - normal frequency
    case 3: return 0.8; // Hard - review more frequently
    default: return 1.0;
  }
}