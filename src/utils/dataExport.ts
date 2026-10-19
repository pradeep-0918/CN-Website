/**
 * Data Import/Export and Storage Recovery utility
 * for Network Mastery Lab.
 * Pure logic tested via Node test runner.
 */

import type { UserProgress, UserNote, QuizResult } from '../types/network.ts';

export interface ExportPayload {
  version: string;
  exportedAt: number;
  appName: string;
  data: Partial<UserProgress>;
}

/**
 * Validates and repairs corrupted or malformed imported progress data
 */
export function sanitizeAndRecoverProgressData(raw: unknown): UserProgress {
  const fallback: UserProgress = {
    completedLessonIds: [],
    currentLessonId: 'm1-l1',
    bookmarks: [],
    notes: [],
    quizHistory: [],
    savedQuestions: [],
    theme: 'dark',
    tanglishEnabled: false,
    fontSize: 'medium',
    profile: {
      goal: 'placement',
      skillLevel: 'intermediate',
      dailyReviewGoal: 10,
    },
    spacedReviews: [],
    reviewSummaries: [],
    troubleshootingCompleted: [],
    wiresharkCompleted: [],
  };

  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const obj = raw as Record<string, any>;
  const payload = obj.data && typeof obj.data === 'object' ? obj.data : obj;

  return {
    completedLessonIds: Array.isArray(payload.completedLessonIds)
      ? payload.completedLessonIds.filter((id: any) => typeof id === 'string')
      : fallback.completedLessonIds,
    currentLessonId: typeof payload.currentLessonId === 'string' ? payload.currentLessonId : fallback.currentLessonId,
    bookmarks: Array.isArray(payload.bookmarks) ? payload.bookmarks : fallback.bookmarks,
    notes: Array.isArray(payload.notes) ? payload.notes : fallback.notes,
    quizHistory: Array.isArray(payload.quizHistory) ? payload.quizHistory : fallback.quizHistory,
    savedQuestions: Array.isArray(payload.savedQuestions) ? payload.savedQuestions : fallback.savedQuestions,
    theme: payload.theme === 'light' ? 'light' : 'dark',
    tanglishEnabled: Boolean(payload.tanglishEnabled),
    fontSize: ['small', 'medium', 'large'].includes(payload.fontSize) ? payload.fontSize : 'medium',
    profile: {
      goal: ['university', 'placement', 'practical'].includes(payload.profile?.goal)
        ? payload.profile.goal
        : 'placement',
      skillLevel: ['beginner', 'intermediate', 'advanced'].includes(payload.profile?.skillLevel)
        ? payload.profile.skillLevel
        : 'intermediate',
      dailyReviewGoal: typeof payload.profile?.dailyReviewGoal === 'number' ? payload.profile.dailyReviewGoal : 10,
      targetDate: payload.profile?.targetDate,
    },
    spacedReviews: Array.isArray(payload.spacedReviews) ? payload.spacedReviews : [],
    reviewSummaries: Array.isArray(payload.reviewSummaries) ? payload.reviewSummaries : [],
    troubleshootingCompleted: Array.isArray(payload.troubleshootingCompleted) ? payload.troubleshootingCompleted : [],
    wiresharkCompleted: Array.isArray(payload.wiresharkCompleted) ? payload.wiresharkCompleted : [],
  };
}

/**
 * Creates a JSON export string
 */
export function generateExportJSON(progress: UserProgress): string {
  const payload: ExportPayload = {
    version: '2.0.0',
    exportedAt: Date.now(),
    appName: 'Network Mastery Lab',
    data: progress,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Creates a comprehensive Markdown study notebook export
 */
export function generateMarkdownStudyNotes(params: {
  notes: UserNote[];
  completedLessonCount: number;
  totalLessonCount: number;
  quizHistory: QuizResult[];
}): string {
  const { notes, completedLessonCount, totalLessonCount, quizHistory } = params;

  let md = `# Network Mastery Lab — Study Notes & Progress Summary\n\n`;
  md += `*Generated on ${new Date().toLocaleDateString()}*\n\n`;
  md += `## Learning Progress\n`;
  md += `- **Chapters Completed**: ${completedLessonCount} / ${totalLessonCount} (${Math.round(
    (completedLessonCount / totalLessonCount) * 100
  )}%)\n`;
  md += `- **Assessments Completed**: ${quizHistory.length}\n`;

  if (quizHistory.length > 0) {
    const avg = Math.round(
      quizHistory.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / quizHistory.length
    );
    md += `- **Average Quiz Accuracy**: ${avg}%\n\n`;
  } else {
    md += `\n`;
  }

  md += `## Personal Chapter Notes (${notes.length})\n\n`;

  if (notes.length === 0) {
    md += `*No notes recorded yet.*\n`;
  } else {
    notes.forEach((n, idx) => {
      md += `### ${idx + 1}. ${n.lessonTitle}\n`;
      md += `*Recorded on ${new Date(n.timestamp).toLocaleString()}*\n\n`;
      if (n.selectedQuote) {
        md += `> "${n.selectedQuote}"\n\n`;
      }
      md += `${n.text}\n\n---\n\n`;
    });
  }

  return md;
}
