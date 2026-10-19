import React, { useState, useEffect } from 'react';
import { comprehensiveQuestions } from '../../data/curriculumData';
import { QuizQuestion, QuizResult } from '../../types/network';
import { getAdaptiveQuestions } from '../../utils/adaptiveEngine';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Filter,
  ChevronRight,
  HelpCircle,
  GraduationCap,
  Briefcase,
  Zap,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface QuizArenaProps {
  quizHistory?: QuizResult[];
  onSaveQuizResult: (result: QuizResult) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ quizHistory = [], onSaveQuizResult }) => {
  const [examTrack, setExamTrack] = useState<'practice' | 'university' | 'placement' | 'adaptive'>('practice');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | 'all'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [examDurationMins, setExamDurationMins] = useState<number>(10);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(600);
  const [retryOnlyIncorrect, setRetryOnlyIncorrect] = useState<boolean>(false);

  // Compute question pool based on track
  const questionPool: QuizQuestion[] = React.useMemo(() => {
    let pool = comprehensiveQuestions;

    if (selectedModuleFilter !== 'all') {
      pool = pool.filter((q) => q.moduleId === selectedModuleFilter);
    }

    if (examTrack === 'adaptive') {
      return getAdaptiveQuestions({
        allQuestions: pool,
        quizHistory,
        count: 10,
        retryOnlyIncorrect,
        incorrectQuestionIds: Object.keys(userAnswers).filter(
          (id) => String(userAnswers[id]) !== String(comprehensiveQuestions.find((q) => q.id === id)?.correctAnswer)
        ),
      });
    }

    if (examTrack === 'university') {
      // Prioritize numerical and protocol architectural questions
      return pool.filter((q) => q.type === 'numerical' || q.difficulty === 'Medium' || q.difficulty === 'Hard');
    }

    if (examTrack === 'placement') {
      // Rapid-fire FAANG & placement topics
      return pool.filter((q) => q.type === 'single' || q.type === 'scenario');
    }

    return pool;
  }, [examTrack, selectedModuleFilter, quizHistory, retryOnlyIncorrect]);

  const currentQ = questionPool[currentQuestionIndex] || questionPool[0];

  // Timer effect for timed modes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const isTimed = examTrack === 'university' || examTrack === 'placement';

    if (isTimed && !isSubmitted && examTimeRemaining > 0) {
      timer = setInterval(() => {
        setExamTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examTrack, isSubmitted, examTimeRemaining]);

  const handleSelectOption = (questionId: string, answer: any) => {
    if (isSubmitted && (examTrack === 'university' || examTrack === 'placement')) return;
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const calculateScore = () => {
    let score = 0;
    const moduleScores: Record<number, { correct: number; total: number }> = {};

    questionPool.forEach((q) => {
      if (!moduleScores[q.moduleId]) {
        moduleScores[q.moduleId] = { correct: 0, total: 0 };
      }
      moduleScores[q.moduleId].total++;

      const userAns = userAnswers[q.id];
      const isCorrect = String(userAns) === String(q.correctAnswer);
      if (isCorrect) {
        score++;
        moduleScores[q.moduleId].correct++;
      }
    });

    return { score, total: questionPool.length, moduleScores };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const { score, total, moduleScores } = calculateScore();
    onSaveQuizResult({
      date: Date.now(),
      score,
      total,
      moduleScores,
    });
  };

  const resetQuiz = (durationMins = examDurationMins) => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setExamTimeRemaining(durationMins * 60);
    setRetryOnlyIncorrect(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const { score, total } = calculateScore();
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" /> Technical Assessment Center
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Quizzes & Exam Simulator</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Targeted exam prep: University derivations, FAANG placement rapid-fire, and adaptive weakness remediation.
          </p>
        </div>

        {/* Exam Track Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium overflow-x-auto">
          <button
            onClick={() => {
              setExamTrack('practice');
              resetQuiz();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              examTrack === 'practice' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Drills
          </button>
          <button
            onClick={() => {
              setExamTrack('university');
              resetQuiz(15);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              examTrack === 'university'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> University Exam
          </button>
          <button
            onClick={() => {
              setExamTrack('placement');
              resetQuiz(10);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              examTrack === 'placement'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Placement & FAANG
          </button>
          <button
            onClick={() => {
              setExamTrack('adaptive');
              resetQuiz();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              examTrack === 'adaptive'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Adaptive Drill
          </button>
        </div>
      </div>

      {/* Filter and Config Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-quiz-module" className="text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Module Scope:
          </label>
          <select
            id="filter-quiz-module"
            value={selectedModuleFilter}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              setSelectedModuleFilter(val);
              resetQuiz();
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sky-400 font-bold focus:outline-none"
          >
            <option value="all">All Modules ({comprehensiveQuestions.length} Questions)</option>
            <option value={1}>Mod 1: Intro & Topologies</option>
            <option value={2}>Mod 2: OSI & TCP/IP Layering</option>
            <option value={3}>Mod 3: Physical & Capacity</option>
            <option value={4}>Mod 4: Data Link & CRC/Hamming</option>
            <option value={5}>Mod 5: Network & CIDR Subnetting</option>
            <option value={6}>Mod 6: Transport & TCP Sockets</option>
            <option value={7}>Mod 7: Application & HTTP/3</option>
            <option value={9}>Mod 9: Security & TLS/PKI</option>
          </select>
        </div>

        {/* Timer display for exam tracks */}
        {(examTrack === 'university' || examTrack === 'placement') && !isSubmitted && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 font-bold text-amber-400">
            <Clock className="w-4 h-4" />
            <span>Time Remaining: {formatTimer(examTimeRemaining)}</span>
          </div>
        )}

        {isSubmitted && (
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            Score: {score} / {total} ({accuracy}%)
          </div>
        )}
      </div>

      {/* Main Question Card */}
      {!isSubmitted && currentQ ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-sky-300 font-mono text-xs font-bold">
                Question {currentQuestionIndex + 1} of {questionPool.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentQ.topic} · {currentQ.difficulty}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              {currentQ.moduleTitle}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options Canvas */}
          <div className="space-y-3">
            {currentQ.options ? (
              currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                const isCorrectOption = idx === currentQ.correctAnswer;
                const showPracticeFeedback =
                  (examTrack === 'practice' || examTrack === 'adaptive') &&
                  userAnswers[currentQ.id] !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                      showPracticeFeedback
                        ? isCorrectOption
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : isSelected
                          ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                        : isSelected
                        ? 'border-sky-500 bg-sky-950/60 text-white ring-1 ring-sky-500 font-medium'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showPracticeFeedback && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {showPracticeFeedback && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : currentQ.type === 'true-false' ? (
              <div className="flex gap-4">
                {[true, false].map((val) => {
                  const isSelected = userAnswers[currentQ.id] === val;
                  return (
                    <button
                      key={String(val)}
                      onClick={() => handleSelectOption(currentQ.id, val)}
                      className={`flex-1 p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-950 text-sky-200 ring-1 ring-sky-500'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {val ? 'TRUE' : 'FALSE'}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Numerical Input */
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={userAnswers[currentQ.id] || ''}
                  aria-label="Numerical Answer Input"
                  onChange={(e) => handleSelectOption(currentQ.id, e.target.value.trim())}
                  placeholder="Enter numerical answer..."
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-sky-500 w-full max-w-xs"
                />
              </div>
            )}
          </div>

          {/* Practice Mode Immediate Explanation */}
          {(examTrack === 'practice' || examTrack === 'adaptive') &&
            userAnswers[currentQ.id] !== undefined && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white uppercase">Technical First-Principles Explanation:</span>
                </div>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-200 border border-slate-700"
            >
              Previous
            </button>

            {currentQuestionIndex < questionPool.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-sm"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : isSubmitted ? (
        /* Results View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">Assessment Completed!</h3>
            <p className="text-sm text-slate-400 mt-1">
              {examTrack === 'university'
                ? 'University Numerical & Protocol Derivations Report'
                : examTrack === 'placement'
                ? 'FAANG Placement Technical Readiness Assessment'
                : 'Concept Mastery Evaluation'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 uppercase">Score</span>
              <div className="text-2xl font-bold text-white mt-1">
                {score} / {total}
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 uppercase">Accuracy</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{accuracy}%</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 uppercase">Status</span>
              <div className={`text-base font-bold mt-1.5 ${accuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {accuracy >= 80 ? 'Mastery Achieved' : 'Needs Review'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => resetQuiz()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> Retake Assessment
            </button>
            {accuracy < 100 && (
              <button
                onClick={() => {
                  setRetryOnlyIncorrect(true);
                  setExamTrack('adaptive');
                  resetQuiz();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Retry Incorrect Questions Only
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-xs">No questions matched the selected filter.</div>
      )}
    </div>
  );
};
