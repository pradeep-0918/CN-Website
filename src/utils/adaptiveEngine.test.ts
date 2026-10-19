import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeQuizPerformance,
  checkPrerequisitesMet,
  generatePersonalizedRecommendations,
  getAdaptiveQuestions,
} from './adaptiveEngine.ts';
import type { QuizResult, QuizQuestion, LearnerProfile } from '../types/network.ts';

test('Adaptive Engine - Analyzes quiz performance per module and marks weak topics', () => {
  const quizHistory: QuizResult[] = [
    {
      date: 1,
      score: 3,
      total: 10,
      moduleScores: {
        5: { correct: 1, total: 5 }, // 20% -> weak
        6: { correct: 5, total: 5 }, // 100% -> strong
      },
    },
  ];

  const analysis = analyzeQuizPerformance(quizHistory);
  assert.equal(analysis[5].accuracy, 20);
  assert.equal(analysis[5].status, 'weak');
  assert.equal(analysis[6].accuracy, 100);
  assert.equal(analysis[6].status, 'strong');
});

test('Adaptive Engine - Prerequisite checker flags missing requirements', () => {
  // m5-l2 requires m5-l1
  const check1 = checkPrerequisitesMet('m5-l2', ['m1-l1']);
  assert.equal(check1.isMet, false);
  assert.equal(check1.missingPrerequisite?.requiredLessonId, 'm5-l1');

  // Once m5-l1 is completed, prerequisite is met
  const check2 = checkPrerequisitesMet('m5-l2', ['m1-l1', 'm5-l1']);
  assert.equal(check2.isMet, true);
  assert.equal(check2.missingPrerequisite, undefined);
});

test('Adaptive Engine - Personalized recommendations for Placement goal', () => {
  const profile: LearnerProfile = {
    goal: 'placement',
    skillLevel: 'intermediate',
    dailyReviewGoal: 10,
  };

  const recs = generatePersonalizedRecommendations({
    profile,
    completedLessonIds: ['m1-l1'],
    quizHistory: [],
    dueCardsCount: 5,
  });

  // Should have spaced repetition review as high priority
  const reviewRec = recs.find((r) => r.type === 'review');
  assert.ok(reviewRec);
  assert.equal(reviewRec?.priority, 'high');

  // Should recommend Packet Journey for placement candidates
  const journeyRec = recs.find((r) => r.targetId === 'packet-journey');
  assert.ok(journeyRec);
});

test('Adaptive Engine - Adaptively prioritizes weak topic questions', () => {
  const questions: QuizQuestion[] = [
    {
      id: 'q-mod5-1',
      moduleId: 5,
      moduleTitle: 'Network Layer',
      topic: 'Subnetting',
      question: 'Calculate /27',
      type: 'single',
      correctAnswer: 1,
      explanation: '...',
      difficulty: 'Medium',
    },
    {
      id: 'q-mod6-1',
      moduleId: 6,
      moduleTitle: 'Transport Layer',
      topic: 'TCP',
      question: 'TCP SYN',
      type: 'single',
      correctAnswer: 0,
      explanation: '...',
      difficulty: 'Easy',
    },
  ];

  const quizHistory: QuizResult[] = [
    {
      date: 1,
      score: 1,
      total: 5,
      moduleScores: {
        5: { correct: 0, total: 4 }, // 0% accuracy in Module 5
        6: { correct: 4, total: 4 }, // 100% in Module 6
      },
    },
  ];

  const adaptive = getAdaptiveQuestions({
    allQuestions: questions,
    quizHistory,
    count: 2,
  });

  // Module 5 question should be ranked first because of weakness
  assert.equal(adaptive[0].id, 'q-mod5-1');
});
