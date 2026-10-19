/**
 * Types for Network Mastery Lab
 */

export interface Lesson {
  id: string;
  moduleId: number;
  chapterNumber: string;
  title: string;
  slug: string;
  readTime: string;
  summary: string;
  learningObjectives: string[];
  prerequisites: string[];
  beginnerExplanation: string;
  technicalExplanation: string;
  realWorldAnalogy: {
    title: string;
    story: string;
    takeaway: string;
  };
  tanglishExplanation?: string;
  protocolFlow?: {
    title: string;
    steps: Array<{ step: number; actor: string; action: string; detail: string }>;
  };
  diagramAsciiOrSvg?: string;
  practicalExamples: Array<{ title: string; scenario: string; solution: string }>;
  numericalProblems?: Array<{
    problem: string;
    given: Record<string, string>;
    formula: string;
    stepByStepSolution: string[];
    answer: string;
  }>;
  commonMistakes: Array<{ mistake: string; reality: string; whyItMatters: string }>;
  interviewQuestions: Array<{
    question: string;
    frequency: 'High' | 'Medium' | 'Essential';
    target: 'FAANG' | 'University Exam' | 'Network Engineer';
    answer: string;
  }>;
  practiceQuestions: Array<{
    id: string;
    question: string;
    type: 'single' | 'multiple' | 'numerical';
    options?: string[];
    correctIndex?: number | number[];
    correctAnswer?: string;
    explanation: string;
  }>;
  keyTakeaways: string[];
  flashcards: Array<{ front: string; back: string }>;
}

export interface Module {
  id: number;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  moduleId: number;
  moduleTitle: string;
  topic: string;
  question: string;
  type: 'single' | 'multiple' | 'true-false' | 'numerical' | 'scenario';
  options?: string[];
  correctAnswer: number | number[] | string | boolean;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserNote {
  id: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
  selectedQuote?: string;
  timestamp: number;
}

export interface Bookmark {
  lessonId: string;
  lessonTitle: string;
  moduleId: number;
  timestamp: number;
}

export interface QuizResult {
  date: number;
  score: number;
  total: number;
  moduleScores: Record<number, { correct: number; total: number }>;
}

export interface TextHighlight {
  id: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
  color: 'yellow' | 'green' | 'pink' | 'blue';
  timestamp: number;
}

export interface ActivityLogItem {
  id: string;
  type: 'lesson_completed' | 'quiz_taken' | 'note_added' | 'highlight_added';
  title: string;
  timestamp: number;
  detail?: string;
}

export interface LearnerProfile {
  goal: 'university' | 'placement' | 'practical';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyReviewGoal: number;
  targetDate?: string;
}

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface SpacedReviewItem {
  id: string;
  front: string;
  back: string;
  chapter: string;
  moduleId: number;
  intervalDays: number;
  easeFactor: number; // starts at 2.5
  reps: number;
  nextReviewDate: number; // timestamp
  lastReviewedDate?: number;
  history?: Array<{ date: number; rating: FlashcardRating }>;
}

export interface ReviewSessionSummary {
  date: number;
  cardsReviewed: number;
  ratingCounts: Record<FlashcardRating, number>;
  estimatedRetention: number; // percentage
}

export interface RecommendedActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'simulator' | 'review' | 'troubleshoot';
  title: string;
  reason: string;
  targetId: string;
  priority: 'high' | 'medium' | 'routine';
  prerequisiteMet: boolean;
  missingPrerequisiteName?: string;
}

export interface TroubleshootingCommand {
  command: string;
  output: string;
  exitCode: number;
  notes?: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  category: 'DHCP/IP' | 'DNS' | 'Routing' | 'Transport/TCP' | 'MTU' | 'Security/TLS' | 'Performance';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  symptoms: string[];
  topology: string;
  initialStateDescription: string;
  availableCommands: TroubleshootingCommand[];
  possibleDiagnoses: Array<{ id: string; text: string; isCorrect: boolean; feedback: string }>;
  verifiedSolution: {
    rootCause: string;
    fixCommand: string;
    resolutionExplanation: string;
    preventativeBestPractice: string;
  };
}

export interface WiresharkLayerField {
  label: string;
  value: string;
  description: string;
  byteOffset?: number;
  byteLength?: number;
}

export interface WiresharkPacketLayer {
  name: string;
  summary: string;
  fields: WiresharkLayerField[];
}

export interface SyntheticWiresharkPacket {
  no: number;
  timeSec: number;
  source: string;
  destination: string;
  protocol: 'ARP' | 'DNS' | 'TCP' | 'HTTP' | 'TLSv1.3' | 'ICMP';
  lengthBytes: number;
  info: string;
  layers: WiresharkPacketLayer[];
  hexBytes: string[];
  isFlaggedAnomaly?: boolean;
  anomalyNote?: string;
}

export interface WiresharkCaptureExercise {
  id: string;
  title: string;
  description: string;
  packets: SyntheticWiresharkPacket[];
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface PacketJourneyStep {
  id: number;
  title: string;
  subtitle: string;
  layer: string;
  protocol: string;
  fromEntity: string;
  toEntity: string;
  networkSegment: 'Client LAN' | 'Local Gateway Router' | 'Internet Core WAN' | 'Datacenter Router' | 'Target Web Server';
  narrative: string;
  addresses: {
    srcIp: string;
    dstIp: string;
    srcMac: string;
    dstMac: string;
    srcPort?: number | string;
    dstPort?: number | string;
  };
  headersPDU: {
    name: string;
    fields: Array<{ key: string; value: string }>;
  };
  hopModifications: {
    modified: string[];
    unmodified: string[];
  };
  securityAttributes: {
    isEncrypted: boolean;
    tlsState?: string;
    integrityMechanism: string;
  };
  teachingAssumptions: string[];
}

export interface UserProgress {
  completedLessonIds: string[];
  currentLessonId: string;
  bookmarks: Bookmark[];
  notes: UserNote[];
  highlights?: TextHighlight[];
  activityLog?: ActivityLogItem[];
  quizHistory: QuizResult[];
  savedQuestions: string[];
  theme: 'dark' | 'light';
  tanglishEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  readingWidth?: 'compact' | 'comfortable' | 'wide';
  profile?: LearnerProfile;
  spacedReviews?: SpacedReviewItem[];
  reviewSummaries?: ReviewSessionSummary[];
  troubleshootingCompleted?: string[];
  wiresharkCompleted?: string[];
}



