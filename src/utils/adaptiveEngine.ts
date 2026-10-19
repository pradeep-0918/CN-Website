/**
 * Adaptive Recommendation & Practice Engine
 * for Network Mastery Lab.
 * Pure logic tested via Node test runner.
 */

import type {
  LearnerProfile,
  QuizResult,
  QuizQuestion,
  RecommendedActivity,
} from '../types/network.ts';

export interface PrerequisiteRule {
  targetLessonId: string;
  targetTitle: string;
  requiredLessonId: string;
  requiredTitle: string;
  conceptReason: string;
}

export const PREREQUISITE_RULES: PrerequisiteRule[] = [
  {
    targetLessonId: 'm5-l1',
    targetTitle: 'IPv4 Addressing, CIDR & Subnetting',
    requiredLessonId: 'm1-l1',
    requiredTitle: 'What is a Computer Network',
    conceptReason: 'Understand basic host-to-host connectivity before calculating binary subnets',
  },
  {
    targetLessonId: 'm5-l2',
    targetTitle: 'Dynamic Routing (OSPF, RIP, BGP)',
    requiredLessonId: 'm5-l1',
    requiredTitle: 'IPv4 Addressing, CIDR & Subnetting',
    conceptReason: 'Routing tables match destination IP prefixes; IP addressing is a strict prerequisite',
  },
  {
    targetLessonId: 'm6-l1',
    targetTitle: 'TCP Three-Way Handshake & Sockets',
    requiredLessonId: 'm2-l1',
    requiredTitle: 'OSI Reference Model & Encapsulation',
    conceptReason: 'Understand Layer 4 transport encapsulation before analyzing TCP sequence numbers',
  },
  {
    targetLessonId: 'm7-l1',
    targetTitle: 'DNS & HTTP Request Lifecycle',
    requiredLessonId: 'm6-l1',
    requiredTitle: 'TCP Three-Way Handshake & Sockets',
    conceptReason: 'HTTP and TLS negotiate over established TCP sockets',
  },
];

/**
 * Analyzes historical quiz results and breaks down measured accuracy per module and topic.
 */
export function analyzeQuizPerformance(
  quizHistory: QuizResult[]
): Record<number, { correct: number; total: number; accuracy: number; status: 'weak' | 'moderate' | 'strong' }> {
  const result: Record<number, { correct: number; total: number; accuracy: number; status: 'weak' | 'moderate' | 'strong' }> = {};

  quizHistory.forEach((res) => {
    if (res.moduleScores) {
      Object.entries(res.moduleScores).forEach(([modStr, score]) => {
        const modId = Number(modStr);
        if (!result[modId]) {
          result[modId] = { correct: 0, total: 0, accuracy: 0, status: 'weak' };
        }
        result[modId].correct += score.correct;
        result[modId].total += score.total;
      });
    }
  });

  Object.values(result).forEach((item) => {
    item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    if (item.accuracy < 60) {
      item.status = 'weak';
    } else if (item.accuracy < 85) {
      item.status = 'moderate';
    } else {
      item.status = 'strong';
    }
  });

  return result;
}

/**
 * Checks whether a given lesson's prerequisites have all been completed
 */
export function checkPrerequisitesMet(
  targetLessonId: string,
  completedLessonIds: string[]
): { isMet: boolean; missingPrerequisite?: PrerequisiteRule } {
  const rule = PREREQUISITE_RULES.find((r) => r.targetLessonId === targetLessonId);
  if (!rule) {
    return { isMet: true };
  }

  const isCompleted = completedLessonIds.includes(rule.requiredLessonId);
  return {
    isMet: isCompleted,
    missingPrerequisite: isCompleted ? undefined : rule,
  };
}

/**
 * Generates personalized, prioritized recommendations based on:
 * 1. User Goal (University, Placement, Practical)
 * 2. Skill Level (Beginner, Intermediate, Advanced)
 * 3. Measured Quiz Weaknesses
 * 4. Due Spaced Repetition reviews
 * 5. Completed Lessons & Prerequisite checks
 */
export function generatePersonalizedRecommendations(params: {
  profile: LearnerProfile;
  completedLessonIds: string[];
  quizHistory: QuizResult[];
  dueCardsCount: number;
}): RecommendedActivity[] {
  const { profile, completedLessonIds, quizHistory, dueCardsCount } = params;
  const recommendations: RecommendedActivity[] = [];

  // 1. Spaced Repetition Due Cards (Highest priority for active recall)
  if (dueCardsCount > 0) {
    recommendations.push({
      id: 'rec-spaced-review',
      type: 'review',
      title: `${dueCardsCount} Flashcard${dueCardsCount > 1 ? 's' : ''} Due for Active Recall`,
      reason: 'Spaced repetition schedule predicts memory decay for these cards today',
      targetId: 'notebook',
      priority: 'high',
      prerequisiteMet: true,
    });
  }

  // 2. Weak Topic Remediation
  const modulePerformance = analyzeQuizPerformance(quizHistory);
  const weakModules = Object.entries(modulePerformance)
    .filter(([_, stats]) => stats.status === 'weak' && stats.total >= 2)
    .sort((a, b) => a[1].accuracy - b[1].accuracy);

  if (weakModules.length > 0) {
    const [modIdStr, stats] = weakModules[0];
    const modId = Number(modIdStr);
    recommendations.push({
      id: `rec-weak-mod-${modId}`,
      type: 'quiz',
      title: `Remediate Module ${modId} (Measured Accuracy: ${stats.accuracy}%)`,
      reason: `Historical quiz accuracy is below 60% (${stats.correct}/${stats.total} correct)`,
      targetId: `mod-${modId}`,
      priority: 'high',
      prerequisiteMet: true,
    });
  }

  // 3. Goal-Specific Pathway Recommendations
  if (profile.goal === 'university') {
    recommendations.push({
      id: 'rec-uni-numerical',
      type: 'simulator',
      title: 'Practice Quantitative Transmission & Propagation Delays',
      reason: 'Numerical delay and BDP derivations appear on 90%+ of university examinations',
      targetId: 'delay',
      priority: 'medium',
      prerequisiteMet: true,
    });
    recommendations.push({
      id: 'rec-uni-subnet',
      type: 'simulator',
      title: 'Subnetting & VLSM Variable Length Mask Drills',
      reason: 'University exams prioritize step-by-step CIDR address allocation tables',
      targetId: 'subnet',
      priority: 'medium',
      prerequisiteMet: checkPrerequisitesMet('m5-l1', completedLessonIds).isMet,
      missingPrerequisiteName: checkPrerequisitesMet('m5-l1', completedLessonIds).missingPrerequisite?.requiredTitle,
    });
  } else if (profile.goal === 'placement') {
    recommendations.push({
      id: 'rec-placement-packet-journey',
      type: 'simulator',
      title: 'Trace Flagship "Packet Journey" from Browser to Server',
      reason: 'The #1 FAANG interview question: "What happens when you type google.com in a browser?"',
      targetId: 'packet-journey',
      priority: 'high',
      prerequisiteMet: true,
    });
    recommendations.push({
      id: 'rec-placement-wireshark',
      type: 'simulator',
      title: 'Wireshark Real-World Packet Analysis Drills',
      reason: 'Essential for infrastructure and backend SRE technical interviews',
      targetId: 'wireshark',
      priority: 'medium',
      prerequisiteMet: true,
    });
  } else {
    // practical networking
    recommendations.push({
      id: 'rec-practical-troubleshoot',
      type: 'troubleshoot',
      title: 'Hands-on Network Troubleshooting Scenarios',
      reason: 'Develop intuition diagnosing DNS failures, MTU mismatches, and unreachable gateways',
      targetId: 'troubleshooting',
      priority: 'high',
      prerequisiteMet: true,
    });
    recommendations.push({
      id: 'rec-practical-wireshark',
      type: 'simulator',
      title: 'Inspect Synthetic Wireshark Captures',
      reason: 'Diagnose packet drops, TCP retransmissions, and DNS response latency in captures',
      targetId: 'wireshark',
      priority: 'medium',
      prerequisiteMet: true,
    });
  }

  // 4. Next Lesson in sequence (prerequisite-aware)
  const allCurriculumLessonIds = [
    'm1-l1', 'm1-l2', 'm1-l3',
    'm2-l1', 'm2-l2',
    'm3-l1', 'm3-l2',
    'm4-l1', 'm4-l2', 'm4-l3', 'm4-l4',
    'm5-l1', 'm5-l2',
    'm6-l1', 'm6-l2',
    'm7-l1', 'm7-l2',
    'm8-l1', 'm8-l2',
    'm9-l1', 'm9-l2',
    'm10-l1', 'm10-l2',
    'm11-l1', 'm11-l2',
    'm12-l1', 'm12-l2',
  ];

  const nextUnfinishedLesson = allCurriculumLessonIds.find((id) => !completedLessonIds.includes(id));
  if (nextUnfinishedLesson) {
    const prereqCheck = checkPrerequisitesMet(nextUnfinishedLesson, completedLessonIds);
    recommendations.push({
      id: `rec-next-lesson-${nextUnfinishedLesson}`,
      type: 'lesson',
      title: `Next Curriculum Chapter: ${nextUnfinishedLesson.toUpperCase()}`,
      reason: prereqCheck.isMet
        ? 'Next uncompleted chapter in your structured curriculum roadmap'
        : `Requires prerequisite: ${prereqCheck.missingPrerequisite?.requiredTitle}`,
      targetId: nextUnfinishedLesson,
      priority: 'routine',
      prerequisiteMet: prereqCheck.isMet,
      missingPrerequisiteName: prereqCheck.missingPrerequisite?.requiredTitle,
    });
  }

  return recommendations;
}

/**
 * Filters and ranks questions adaptively based on measured accuracy and difficulty.
 */
export function getAdaptiveQuestions(params: {
  allQuestions: QuizQuestion[];
  quizHistory: QuizResult[];
  count?: number;
  retryOnlyIncorrect?: boolean;
  incorrectQuestionIds?: string[];
}): QuizQuestion[] {
  const { allQuestions, quizHistory, count = 10, retryOnlyIncorrect, incorrectQuestionIds = [] } = params;

  if (retryOnlyIncorrect && incorrectQuestionIds.length > 0) {
    return allQuestions.filter((q) => incorrectQuestionIds.includes(q.id));
  }

  const modPerf = analyzeQuizPerformance(quizHistory);

  // Score each question: prioritize questions from weak modules, with appropriate difficulty
  const scored = allQuestions.map((q) => {
    const modStats = modPerf[q.moduleId];
    let weight = 10;

    if (modStats) {
      if (modStats.status === 'weak') {
        weight += 20; // boost questions from weak topics
      } else if (modStats.status === 'strong') {
        weight -= 5;
      }
    }

    // If user has high accuracy overall, prioritize Hard questions
    const overallCorrect = quizHistory.reduce((acc, h) => acc + h.score, 0);
    const overallTotal = quizHistory.reduce((acc, h) => acc + h.total, 0);
    const overallAcc = overallTotal > 0 ? (overallCorrect / overallTotal) * 100 : 50;

    if (overallAcc > 75 && q.difficulty === 'Hard') {
      weight += 15;
    } else if (overallAcc < 60 && q.difficulty === 'Easy') {
      weight += 10;
    }

    return { question: q, weight };
  });

  scored.sort((a, b) => b.weight - a.weight);
  return scored.slice(0, count).map((s) => s.question);
}
