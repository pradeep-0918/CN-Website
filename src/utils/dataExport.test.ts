import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeAndRecoverProgressData,
  generateExportJSON,
  generateMarkdownStudyNotes,
} from './dataExport.ts';
import type { UserProgress } from '../types/network.ts';

test('Data Recovery - Gracefully handles null, undefined, or corrupt objects', () => {
  const recoveredFromNull = sanitizeAndRecoverProgressData(null);
  assert.equal(recoveredFromNull.currentLessonId, 'm1-l1');
  assert.deepEqual(recoveredFromNull.completedLessonIds, []);
  assert.equal(recoveredFromNull.profile?.goal, 'placement');

  const corruptPayload = {
    completedLessonIds: 'not-an-array',
    currentLessonId: 12345,
    theme: 'invalid-theme',
    profile: { goal: 'astronaut' },
  };

  const recoveredFromCorrupt = sanitizeAndRecoverProgressData(corruptPayload);
  assert.deepEqual(recoveredFromCorrupt.completedLessonIds, []);
  assert.equal(recoveredFromCorrupt.currentLessonId, 'm1-l1');
  assert.equal(recoveredFromCorrupt.theme, 'dark');
  assert.equal(recoveredFromCorrupt.profile?.goal, 'placement');
});

test('Data Recovery - Correctly preserves valid user progress', () => {
  const validData: Partial<UserProgress> = {
    completedLessonIds: ['m1-l1', 'm1-l2'],
    currentLessonId: 'm1-l3',
    theme: 'light',
    tanglishEnabled: true,
    profile: {
      goal: 'university',
      skillLevel: 'advanced',
      dailyReviewGoal: 15,
    },
  };

  const recovered = sanitizeAndRecoverProgressData(validData);
  assert.deepEqual(recovered.completedLessonIds, ['m1-l1', 'm1-l2']);
  assert.equal(recovered.currentLessonId, 'm1-l3');
  assert.equal(recovered.theme, 'light');
  assert.equal(recovered.tanglishEnabled, true);
  assert.equal(recovered.profile?.goal, 'university');
});

test('Data Export - Generates valid JSON and Markdown files', () => {
  const progress = sanitizeAndRecoverProgressData({});
  const jsonStr = generateExportJSON(progress);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.appName, 'Network Mastery Lab');
  assert.equal(parsed.version, '2.0.0');

  const md = generateMarkdownStudyNotes({
    notes: [
      {
        id: '1',
        lessonId: 'm1-l1',
        lessonTitle: 'Intro to Networks',
        text: 'Important concept on full duplex',
        selectedQuote: 'Simultaneous two-way transmission',
        timestamp: 1700000000000,
      },
    ],
    completedLessonCount: 5,
    totalLessonCount: 24,
    quizHistory: [{ date: 1, score: 8, total: 10, moduleScores: {} }],
  });

  assert.ok(md.includes('Network Mastery Lab'));
  assert.ok(md.includes('Chapters Completed**: 5 / 24'));
  assert.ok(md.includes('Average Quiz Accuracy**: 80%'));
  assert.ok(md.includes('Intro to Networks'));
});
