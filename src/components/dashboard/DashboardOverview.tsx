import React, { useState } from 'react';
import { Module, Lesson, QuizResult, LearnerProfile, SpacedReviewItem, RecommendedActivity } from '../../types/network';
import { allModules, allLessons } from '../../data/curriculumData';
import { generatePersonalizedRecommendations, analyzeQuizPerformance } from '../../utils/adaptiveEngine';
import { calculateRetentionEstimate, calculateTopicMastery } from '../../utils/spacedRepetition';
import { generateExportJSON, generateMarkdownStudyNotes, sanitizeAndRecoverProgressData } from '../../utils/dataExport';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  Network,
  Share2,
  Globe,
  Lock,
  Zap,
  Sliders,
  FileCode,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  GraduationCap,
  Briefcase,
  Terminal,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Info
} from 'lucide-react';

interface DashboardOverviewProps {
  completedLessonIds: string[];
  currentLessonId: string;
  notesCount: number;
  bookmarksCount: number;
  quizHistory: QuizResult[];
  profile: LearnerProfile;
  spacedReviews: SpacedReviewItem[];
  onUpdateProfile: (profile: LearnerProfile) => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenSimulator: (simId: string) => void;
  onOpenTab: (tab: 'dashboard' | 'reader' | 'simulators' | 'quiz' | 'notebook' | 'troubleshoot' | 'wireshark') => void;
  onImportProgress: (imported: any) => void;
  notes: any[];
}

const SIMULATORS_LIST = [
  { id: 'packet-journey', name: 'Flagship: Packet Journey', icon: Zap, desc: 'End-to-end browser request lifecycle, router hop rewriting & TLS 1.3' },
  { id: 'osi', name: 'OSI Encapsulation Visualizer', icon: Layers, desc: 'Step-by-step 7-layer PDU headers & trailers nesting' },
  { id: 'tcp', name: 'TCP 3-Way Handshake & Teardown', icon: Cpu, desc: 'SYN, SYN-ACK, ACK, and 2MSL TIME_WAIT state machine' },
  { id: 'subnet', name: 'Subnetting & VLSM Calculator', icon: Network, desc: 'IPv4, binary masks, /31 point-to-point, and department sizing' },
  { id: 'routing', name: 'Routing Simulator & Dijkstra', icon: Share2, desc: 'Configure link costs, simulate link down, and run Dijkstra SPF' },
  { id: 'dns', name: 'DNS Resolution Visualizer', icon: Globe, desc: 'Iterative lookups through Root, TLD, and Authoritative servers' },
  { id: 'error', name: 'Error Detection Playground', icon: ShieldAlert, desc: 'CRC modulo-2 division, Hamming (7,4) auto-correction, and Checksums' },
  { id: 'delay', name: 'Transmission & Delay Calculator', icon: Clock, desc: 'T_trans, T_prop, BDP pipe calculations, and unit conversions' },
  { id: 'sliding', name: 'Sliding-Window Protocol', icon: Sliders, desc: 'Stop-and-Wait, Go-Back-N, and Selective Repeat utilization' },
  { id: 'packet', name: 'Packet Structure Explorer', icon: FileCode, desc: 'Interactive field dissection of IPv4, TCP, UDP, and Ethernet headers' },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  completedLessonIds,
  currentLessonId,
  notesCount,
  bookmarksCount,
  quizHistory,
  profile,
  spacedReviews,
  onUpdateProfile,
  onSelectLesson,
  onOpenSimulator,
  onOpenTab,
  onImportProgress,
  notes,
}) => {
  const [importError, setImportError] = useState<string | null>(null);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const progressPercent = Math.round((completedLessonIds.length / allLessons.length) * 100);

  // Due flashcards
  const now = Date.now();
  const dueCardsCount = spacedReviews.filter((c) => !c.nextReviewDate || c.nextReviewDate <= now).length;
  const estimatedRetention = calculateRetentionEstimate(spacedReviews);
  const topicMastery = calculateTopicMastery(spacedReviews);

  // Quiz analytics
  const totalQuizzes = quizHistory.length;
  const quizAnalytics = analyzeQuizPerformance(quizHistory);
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / totalQuizzes
        )
      : null;

  // Personalized recommendations
  const recommendations: RecommendedActivity[] = generatePersonalizedRecommendations({
    profile,
    completedLessonIds,
    quizHistory,
    dueCardsCount,
  });

  // Export handlers
  const handleExportJSON = () => {
    const jsonStr = generateExportJSON({
      completedLessonIds,
      currentLessonId,
      bookmarks: [],
      notes,
      quizHistory,
      savedQuestions: [],
      theme: 'dark',
      tanglishEnabled: false,
      fontSize: 'medium',
      profile,
      spacedReviews,
    });
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network_mastery_progress_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const mdStr = generateMarkdownStudyNotes({
      notes,
      completedLessonCount: completedLessonIds.length,
      totalLessonCount: allLessons.length,
      quizHistory,
    });
    const blob = new Blob([mdStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network_mastery_study_notes_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const recovered = sanitizeAndRecoverProgressData(parsed);
        onImportProgress(recovered);
      } catch (err: any) {
        setImportError('Invalid JSON backup file. Unable to restore.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Personalized Learning Goal & Profile Config Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" /> Personalized Learning Trajectory
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Configure Your Learning Focus</h2>
          </div>

          {/* Quick Data Backup buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
              title="Download full progress JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" /> JSON Backup
            </button>
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
              title="Download study notes Markdown"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" /> Export Notes
            </button>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {importError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {importError}
          </div>
        )}

        {/* Goal Selector (3 Goals) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateProfile({ ...profile, goal: 'university' })}
            className={`p-4 rounded-xl border text-left transition-all ${
              profile.goal === 'university'
                ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-sky-400 mb-1">
              <GraduationCap className="w-4 h-4" /> University Examinations
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus on numerical problem sets, OSI/TCP derivations, framing math, and step-by-step descriptive question outlines.
            </p>
          </button>

          <button
            onClick={() => onUpdateProfile({ ...profile, goal: 'placement' })}
            className={`p-4 rounded-xl border text-left transition-all ${
              profile.goal === 'placement'
                ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 mb-1">
              <Briefcase className="w-4 h-4" /> Software Placements & FAANG
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prioritizes packet lifecycles ("type google.com"), socket states, HTTP/3 QUIC, Wireshark traces, and system design.
            </p>
          </button>

          <button
            onClick={() => onUpdateProfile({ ...profile, goal: 'practical' })}
            className={`p-4 rounded-xl border text-left transition-all ${
              profile.goal === 'practical'
                ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-purple-400 mb-1">
              <Terminal className="w-4 h-4" /> Practical Networking & Systems
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Emphasizes hands-on incident troubleshooting (ping, dig, curl, ss), MTU black holes, and packet analysis labs.
            </p>
          </button>
        </div>

        {/* Skill Level Selection */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Current Networking Skill Level:</span>
          <div className="flex items-center gap-1.5">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onUpdateProfile({ ...profile, skillLevel: lvl })}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[11px] transition-colors ${
                  profile.skillLevel === lvl
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Actions (Prerequisite-Aware) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Adaptive Learning & Practice Recommendations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized suggestions based on your target goal, skill level, and measured quiz accuracy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                rec.priority === 'high'
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-md shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      rec.priority === 'high' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rec.type.toUpperCase()} • {rec.priority.toUpperCase()}
                  </span>
                  {!rec.prerequisiteMet && (
                    <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked Prereq
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.reason}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                {rec.prerequisiteMet ? (
                  <button
                    onClick={() => {
                      if (rec.type === 'simulator') {
                        onOpenSimulator(rec.targetId);
                        onOpenTab('simulators');
                      } else if (rec.type === 'troubleshoot') {
                        onOpenTab('troubleshoot');
                      } else if (rec.type === 'review') {
                        onOpenTab('notebook');
                      } else if (rec.type === 'lesson') {
                        onSelectLesson(rec.targetId);
                      } else {
                        onOpenTab('quiz');
                      }
                    }}
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                  >
                    <span>Start Activity</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">
                    Complete prerequisite first: {rec.missingPrerequisiteName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Learning Modules Strip: Packet Journey, Troubleshooting, Wireshark */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            Flagship Interactive Laboratories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep first-principles tools for tracing packet lifecycles, diagnosing network incidents, and dissecting wire captures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Packet Journey */}
          <button
            onClick={() => {
              onOpenSimulator('packet-journey');
              onOpenTab('simulators');
            }}
            className="p-5 rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/60 to-slate-900 text-left hover:border-sky-400 transition-all group flex flex-col justify-between shadow-lg shadow-sky-950/40"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                Flagship: Packet Journey
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Follow a single request from browser keystroke, DNS, TCP handshake, TLS 1.3, router hop rewriting, to server execution.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono text-sky-400 font-bold flex items-center justify-between">
              <span>Launch 10-Stage Journey</span> <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Troubleshooting Lab */}
          <button
            onClick={() => onOpenTab('troubleshoot')}
            className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/60 to-slate-900 text-left hover:border-amber-400 transition-all group flex flex-col justify-between shadow-lg shadow-amber-950/40"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                Troubleshooting Lab
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Triage 8 realistic network incidents with simulated CLI probes (ping, dig, curl, ss, ip) and discover root causes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono text-amber-400 font-bold flex items-center justify-between">
              <span>Enter Sandbox Shell</span> <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Wireshark Lab */}
          <button
            onClick={() => onOpenTab('wireshark')}
            className="p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 to-slate-900 text-left hover:border-cyan-400 transition-all group flex flex-col justify-between shadow-lg shadow-cyan-950/40"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                Wireshark Packet Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authentic 3-pane packet dissection: examine frame trees, hex dumps, TCP Fast Retransmit, and solve capture challenges.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono text-cyan-400 font-bold flex items-center justify-between">
              <span>Open Packet Analyzer</span> <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* Progress & Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
          <span className="text-slate-400 uppercase">Curriculum Progress</span>
          <div className="text-2xl font-bold text-white mt-1">{progressPercent}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${progressPercent}%` }} className="bg-sky-500 h-full rounded-full transition-all" />
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            {completedLessonIds.length} of {allLessons.length} chapters completed
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
          <span className="text-slate-400 uppercase">Quiz Accuracy (Actual)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {avgQuizScore !== null ? `${avgQuizScore}%` : 'No attempts'}
          </div>
          <div className="text-[10px] text-slate-500 mt-4">
            {totalQuizzes} assessment{totalQuizzes === 1 ? '' : 's'} taken
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
          <span className="text-slate-400 uppercase">Active Recall Due</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{dueCardsCount}</div>
          <div className="text-[10px] text-slate-500 mt-4">
            Cards scheduled for review today
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
          <span className="text-slate-400 uppercase">Estimated Recall</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{estimatedRetention}%</div>
          <div className="text-[10px] text-slate-500 mt-4">
            Recall probability estimate (SM-2)
          </div>
        </div>
      </div>

      {/* 10 Interactive Simulators Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400" />
              Interactive Protocol Simulators & Calculators
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Working simulations with real mathematical calculations and step-by-step visual feedback.
            </p>
          </div>
          <button
            onClick={() => onOpenTab('simulators')}
            className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold"
          >
            <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SIMULATORS_LIST.map((sim) => {
            const Icon = sim.icon;
            return (
              <button
                key={sim.id}
                onClick={() => {
                  onOpenSimulator(sim.id);
                  onOpenTab('simulators');
                }}
                className="text-left p-4 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-sky-500/60 hover:bg-slate-900 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 group-hover:text-white group-hover:bg-sky-600 transition-colors mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mb-1">
                    {sim.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {sim.desc}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-sky-400 mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Launch Simulator</span> <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 12 Modules Roadmap */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            12-Module Complete Curriculum Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured step-by-step roadmap from Physical Layer fundamentals to Modern Cloud SDN.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allModules.map((module) => {
            const completedInModule = module.lessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;

            return (
              <div
                key={module.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-mono">
                    <span className="text-sky-400 font-bold uppercase">Module {module.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                      {module.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{module.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">
                    {completedInModule} / {module.lessons.length} Completed
                  </span>

                  <button
                    onClick={() => onSelectLesson(module.lessons[0].id)}
                    className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                  >
                    <span>Read Lessons</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
