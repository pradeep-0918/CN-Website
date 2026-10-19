/**
 * SuperMemo SM-2 inspired Spaced Repetition Scheduling Algorithm
 * for Network Mastery Lab.
 * Pure logic tested via Node test runner.
 */

import type { FlashcardRating, SpacedReviewItem } from '../types/network.ts';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Calculates next interval and ease factor based on learner's rating
 * 'again' = complete lapse (interval resets to 1 day)
 * 'hard'  = struggled (shorter interval advance, ease factor slightly decreased)
 * 'good'  = successful recall (standard SM-2 interval expansion)
 * 'easy'  = effortless recall (bonus interval multiplier, ease factor increased)
 */
export function calculateNextReview(
  item: SpacedReviewItem,
  rating: FlashcardRating,
  nowTimestamp: number = Date.now()
): SpacedReviewItem {
  let { reps = 0, intervalDays = 0, easeFactor = DEFAULT_EASE_FACTOR, history = [] } = item;

  let nextIntervalDays = 1;
  let nextReps = reps;
  let nextEaseFactor = easeFactor;

  switch (rating) {
    case 'again': {
      nextReps = 0;
      nextIntervalDays = 1;
      nextEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
      break;
    }
    case 'hard': {
      nextReps = reps + 1;
      nextIntervalDays = reps === 0 ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
      nextEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
      break;
    }
    case 'good': {
      nextReps = reps + 1;
      if (reps === 0) {
        nextIntervalDays = 1;
      } else if (reps === 1) {
        nextIntervalDays = 3;
      } else {
        nextIntervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
      }
      break;
    }
    case 'easy': {
      nextReps = reps + 1;
      if (reps === 0) {
        nextIntervalDays = 2;
      } else if (reps === 1) {
        nextIntervalDays = 4;
      } else {
        nextIntervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.3));
      }
      nextEaseFactor = easeFactor + 0.15;
      break;
    }
  }

  const nextReviewDate = nowTimestamp + nextIntervalDays * ONE_DAY_MS;
  const updatedHistory = [...history, { date: nowTimestamp, rating }];

  return {
    ...item,
    reps: nextReps,
    intervalDays: nextIntervalDays,
    easeFactor: Math.round(nextEaseFactor * 100) / 100,
    nextReviewDate,
    lastReviewedDate: nowTimestamp,
    history: updatedHistory,
  };
}

/**
 * Filters cards that are due for review (nextReviewDate <= current timestamp)
 */
export function getDueReviewCards(
  cards: SpacedReviewItem[],
  nowTimestamp: number = Date.now()
): SpacedReviewItem[] {
  return cards.filter((c) => !c.nextReviewDate || c.nextReviewDate <= nowTimestamp);
}

/**
 * Calculates estimated retention rate based on successful reviews vs lapses.
 * Explains that this is an estimate of recall, not an absolute guarantee.
 */
export function calculateRetentionEstimate(cards: SpacedReviewItem[]): number {
  if (!cards || cards.length === 0) return 100;

  let totalReviews = 0;
  let successfulReviews = 0;

  cards.forEach((c) => {
    if (c.history && c.history.length > 0) {
      c.history.forEach((h) => {
        totalReviews++;
        if (h.rating === 'good' || h.rating === 'easy') {
          successfulReviews++;
        }
      });
    } else if (c.reps > 0) {
      totalReviews += c.reps;
      successfulReviews += c.reps;
    }
  });

  if (totalReviews === 0) return 0;
  return Math.round((successfulReviews / totalReviews) * 100);
}

/**
 * Aggregates topic-wise mastery across modules
 */
export function calculateTopicMastery(
  cards: SpacedReviewItem[]
): Record<number, { mastered: number; learning: number; total: number; percent: number }> {
  const result: Record<number, { mastered: number; learning: number; total: number; percent: number }> = {};

  cards.forEach((c) => {
    const modId = c.moduleId || 1;
    if (!result[modId]) {
      result[modId] = { mastered: 0, learning: 0, total: 0, percent: 0 };
    }
    result[modId].total++;

    // Card is considered mastered if reps >= 3 and interval >= 7 days
    if (c.reps >= 3 && c.intervalDays >= 7) {
      result[modId].mastered++;
    } else if (c.reps > 0) {
      result[modId].learning++;
    }
  });

  Object.keys(result).forEach((k) => {
    const item = result[Number(k)];
    item.percent = item.total > 0 ? Math.round((item.mastered / item.total) * 100) : 0;
  });

  return result;
}
