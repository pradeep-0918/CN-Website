import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextReview,
  getDueReviewCards,
  calculateRetentionEstimate,
  calculateTopicMastery,
} from './spacedRepetition.ts';
import type { SpacedReviewItem } from '../types/network.ts';

test('Spaced repetition - Again rating resets reps and sets interval to 1 day', () => {
  const item: SpacedReviewItem = {
    id: 'c-1',
    front: 'Question',
    back: 'Answer',
    chapter: '1.1',
    moduleId: 1,
    intervalDays: 14,
    easeFactor: 2.5,
    reps: 4,
    nextReviewDate: Date.now() - 1000,
  };

  const updated = calculateNextReview(item, 'again', 1700000000000);
  assert.equal(updated.reps, 0);
  assert.equal(updated.intervalDays, 1);
  assert.equal(updated.easeFactor, 2.3);
  assert.equal(updated.nextReviewDate, 1700000000000 + 24 * 60 * 60 * 1000);
});

test('Spaced repetition - Good rating expands interval progressively', () => {
  let item: SpacedReviewItem = {
    id: 'c-2',
    front: 'What is MTU?',
    back: 'Maximum Transmission Unit',
    chapter: '4.1',
    moduleId: 4,
    intervalDays: 0,
    easeFactor: 2.5,
    reps: 0,
    nextReviewDate: 1700000000000,
  };

  // Rep 1: Good => interval 1 day
  item = calculateNextReview(item, 'good', 1700000000000);
  assert.equal(item.reps, 1);
  assert.equal(item.intervalDays, 1);

  // Rep 2: Good => interval 3 days
  item = calculateNextReview(item, 'good', 1700000000000);
  assert.equal(item.reps, 2);
  assert.equal(item.intervalDays, 3);

  // Rep 3: Good => interval 3 * 2.5 = 8 days
  item = calculateNextReview(item, 'good', 1700000000000);
  assert.equal(item.reps, 3);
  assert.equal(item.intervalDays, 8);
});

test('Spaced repetition - Easy rating boosts interval and increases ease factor', () => {
  const item: SpacedReviewItem = {
    id: 'c-3',
    front: 'TCP vs UDP',
    back: 'Connection-oriented vs Connectionless',
    chapter: '6.1',
    moduleId: 6,
    intervalDays: 3,
    easeFactor: 2.5,
    reps: 2,
    nextReviewDate: 1700000000000,
  };

  const updated = calculateNextReview(item, 'easy', 1700000000000);
  assert.equal(updated.reps, 3);
  assert.ok(updated.intervalDays >= 9);
  assert.equal(updated.easeFactor, 2.65);
});

test('Spaced repetition - Due cards filtering respects timestamp', () => {
  const now = 1700000000000;
  const cards: SpacedReviewItem[] = [
    {
      id: 'due-1',
      front: 'Q1',
      back: 'A1',
      chapter: '1.1',
      moduleId: 1,
      intervalDays: 1,
      easeFactor: 2.5,
      reps: 1,
      nextReviewDate: now - 5000, // in past => due
    },
    {
      id: 'future-1',
      front: 'Q2',
      back: 'A2',
      chapter: '1.2',
      moduleId: 1,
      intervalDays: 5,
      easeFactor: 2.5,
      reps: 2,
      nextReviewDate: now + 500000, // future => not due
    },
  ];

  const due = getDueReviewCards(cards, now);
  assert.equal(due.length, 1);
  assert.equal(due[0].id, 'due-1');
});

test('Spaced repetition - Retention estimate and topic mastery calculation', () => {
  const cards: SpacedReviewItem[] = [
    {
      id: 'c-1',
      front: 'Q1',
      back: 'A1',
      chapter: '1.1',
      moduleId: 1,
      intervalDays: 10,
      easeFactor: 2.5,
      reps: 4,
      nextReviewDate: 0,
      history: [
        { date: 1, rating: 'good' },
        { date: 2, rating: 'good' },
      ],
    },
    {
      id: 'c-2',
      front: 'Q2',
      back: 'A2',
      chapter: '1.2',
      moduleId: 1,
      intervalDays: 1,
      easeFactor: 2.1,
      reps: 1,
      nextReviewDate: 0,
      history: [
        { date: 1, rating: 'again' },
        { date: 2, rating: 'good' },
      ],
    },
  ];

  const retention = calculateRetentionEstimate(cards);
  assert.equal(retention, 75); // 3 good out of 4 reviews = 75%

  const mastery = calculateTopicMastery(cards);
  assert.equal(mastery[1].mastered, 1);
  assert.equal(mastery[1].learning, 1);
  assert.equal(mastery[1].total, 2);
  assert.equal(mastery[1].percent, 50);
});
