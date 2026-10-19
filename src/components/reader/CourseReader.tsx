import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Search,
  Sliders,
  Sparkles,
  Share2,
  FileText,
  HelpCircle,
  Hash,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Lesson, Module } from '../../types/network';
import { allModules, getAdjacentLessons } from '../../data/curriculumData';

interface CourseReaderProps {
  currentLesson: Lesson;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  tanglishEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onSelectLesson: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onToggleTanglish: () => void;
  onChangeFontSize: (size: 'small' | 'medium' | 'large') => void;
  onAddNote: (lessonId: string, noteText: string, quote?: string) => void;
  onOpenSimulator: (simId?: string) => void;
}

export const CourseReader: React.FC<CourseReaderProps> = ({
  currentLesson,
  completedLessonIds,
  bookmarkedLessonIds,
  tanglishEnabled,
  fontSize,
  onSelectLesson,
  onToggleComplete,
  onToggleBookmark,
  onToggleTanglish,
  onChangeFontSize,
  onAddNote,
  onOpenSimulator,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [curriculumFilter, setCurriculumFilter] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // Listen Mode (SpeechSynthesis)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isCompleted = completedLessonIds.includes(currentLesson.id);
  const isBookmarked = bookmarkedLessonIds.includes(currentLesson.id);
  const { prev: prevLesson, next: nextLesson } = getAdjacentLessons(currentLesson.id);

  // Check speech synthesis support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech and reset practice answers when lesson changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setUserAnswers({});
  }, [currentLesson.id]);

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      // Read title, beginner explanation, and technical summary in logical order
      const textToRead = `${currentLesson.title}. Lesson Overview: ${currentLesson.summary}. Beginner Explanation: ${currentLesson.beginnerExplanation}. Key Technical Details: ${currentLesson.technicalExplanation}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && speechUtteranceRef.current) {
      handleToggleSpeak();
      setTimeout(handleToggleSpeak, 100);
    }
  };

  // Text selection handler for note-taking
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 3) {
      setSelectedText(sel.toString().trim());
    }
  };

  const submitNote = () => {
    if (noteInput.trim()) {
      onAddNote(currentLesson.id, noteInput.trim(), selectedText || undefined);
      setNoteInput('');
      setSelectedText('');
      setShowNoteModal(false);
    }
  };

  const fontClasses =
    fontSize === 'small'
      ? 'text-sm leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-loose'
      : 'text-base leading-relaxed';

  return (
    <div className={`flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 ${fullscreen ? 'fixed inset-0 z-50 h-screen' : ''}`}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Expandable Curriculum Sidebar */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 fixed lg:relative inset-y-0 left-0 z-40 h-full ${
          sidebarOpen ? 'w-80 translate-x-0 shadow-2xl lg:shadow-none' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Course Roadmap
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              {completedLessonIds.length} / 12 Lessons
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              aria-label="Close Roadmap"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <input
              type="text"
              value={curriculumFilter}
              onChange={(e) => setCurriculumFilter(e.target.value)}
              placeholder="Search chapters & topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {allModules.map((module) => {
            const filteredLessons = module.lessons.filter((l) =>
              l.title.toLowerCase().includes(curriculumFilter.toLowerCase())
            );
            if (curriculumFilter && filteredLessons.length === 0) return null;

            return (
              <div key={module.id} className="space-y-1">
                <div className="px-2 py-1 text-[11px] font-mono text-slate-400 font-semibold uppercase flex items-center justify-between">
                  <span>Mod {module.id}: {module.title.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-600">{module.level}</span>
                </div>

                <div className="space-y-0.5">
                  {(curriculumFilter ? filteredLessons : module.lessons).map((lesson) => {
                    const isCurrent = lesson.id === currentLesson.id;
                    const isLessonDone = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          onSelectLesson(lesson.id);
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-sky-600/20 text-sky-300 font-semibold border border-sky-500/30'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-slate-500 text-[10px] w-6 shrink-0">
                            {lesson.chapterNumber}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        {isLessonDone && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Reading Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Reading Toolbar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={sidebarOpen ? 'Collapse Roadmap' : 'Expand Roadmap'}
              aria-label={sidebarOpen ? 'Collapse Roadmap' : 'Expand Roadmap'}
            >
              <Sliders className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Chapter {currentLesson.chapterNumber}</span>
              <span>·</span>
              <span>{currentLesson.readTime}</span>
            </div>
          </div>

          {/* Reading Actions: Listen Mode, Font Size, Tanglish, Bookmark, Complete */}
          <div className="flex items-center gap-2">
            {/* Listen Mode Player */}
            {speechSupported && (
              <div className="flex items-center bg-slate-800/90 rounded-lg border border-slate-700 p-1 text-xs">
                <button
                  onClick={handleToggleSpeak}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                    isSpeaking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Listen Mode (Browser SpeechSynthesis)"
                >
                  {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="font-mono">{isSpeaking ? 'Listening' : 'Listen'}</span>
                </button>

                <div className="flex items-center border-l border-slate-700 pl-1 ml-1 text-[11px] font-mono text-slate-400">
                  {[1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-1.5 py-0.5 rounded ${
                        speechRate === rate ? 'text-sky-400 font-bold' : 'hover:text-slate-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tanglish Toggle */}
            <button
              onClick={onToggleTanglish}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                tanglishEnabled
                  ? 'bg-amber-950/60 border-amber-600/70 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Tanglish Conversational Explanation"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tanglish</span>
            </button>

            {/* Font Size controls */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs font-mono text-slate-400">
              <button
                onClick={() => onChangeFontSize('small')}
                className={`px-2 py-1 rounded ${fontSize === 'small' ? 'bg-slate-700 text-white' : ''}`}
              >
                A-
              </button>
              <button
                onClick={() => onChangeFontSize('medium')}
                className={`px-2 py-1 rounded ${fontSize === 'medium' ? 'bg-slate-700 text-white' : ''}`}
              >
                A
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-2 py-1 rounded ${fontSize === 'large' ? 'bg-slate-700 text-white' : ''}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(currentLesson.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-950/60 border-amber-500 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Bookmark Chapter"
              aria-label="Bookmark Chapter"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Toggle Fullscreen Focus Mode"
              aria-label="Toggle Fullscreen Focus Mode"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Scrollable Lesson Body */}
        <div
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full space-y-10"
        >
          {/* Header Title & Objectives */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest mb-1.5">
              <span>Chapter {currentLesson.chapterNumber}</span>
              <span>·</span>
              <span>{currentLesson.readTime}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              {currentLesson.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              {currentLesson.summary}
            </p>
          </div>

          {/* Quick Action: Take Note from selection */}
          {selectedText && (
            <div className="sticky top-2 z-40 bg-sky-950/90 border border-sky-600 rounded-xl p-3 shadow-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-sky-300 truncate max-w-md">
                Selected: "{selectedText}"
              </span>
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold"
              >
                Save as Note
              </button>
            </div>
          )}

          {/* Learning Objectives Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <h2 className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-3">
              Learning Objectives
            </h2>
            <ul className="space-y-2 text-sm text-slate-200">
              {currentLesson.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1: Beginner-Friendly Explanation */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              1. The Intuitive Mental Model
            </h2>
            <div className={`text-slate-300 ${fontClasses} leading-relaxed`}>
              {currentLesson.beginnerExplanation}
            </div>
          </section>

          {/* Real-World Analogy */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/70 border-l-4 border-l-amber-500 border border-slate-800 rounded-xl p-5">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              Real-World Analogy
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {currentLesson.realWorldAnalogy.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {currentLesson.realWorldAnalogy.story}
            </p>
            <div className="text-xs text-amber-300/90 font-mono">
              💡 Takeaway: {currentLesson.realWorldAnalogy.takeaway}
            </div>
          </div>

          {/* Optional Tanglish Callout */}
          {tanglishEnabled && currentLesson.tanglishExplanation && (
            <div className="bg-amber-950/30 border border-amber-800/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Tanglish Explanation (எளிய விளக்கம்)</span>
              </div>
              <p className="text-sm text-amber-200/90 leading-relaxed font-sans">
                {currentLesson.tanglishExplanation}
              </p>
            </div>
          )}

          {/* Section 2: Detailed Technical Explanation */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-sky-400" />
              2. Technical Architecture & In-Depth Mechanics
            </h2>
            <div className={`text-slate-300 ${fontClasses} whitespace-pre-line leading-relaxed`}>
              {currentLesson.technicalExplanation}
            </div>
          </section>

          {/* Numerical Problems (if applicable) */}
          {currentLesson.numericalProblems && currentLesson.numericalProblems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                3. Worked Numerical Calculations
              </h2>

              {currentLesson.numericalProblems.map((prob, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs">
                  <div className="text-sm font-bold text-white mb-2 font-sans">
                    Problem #{idx + 1}: {prob.problem}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 mb-3 text-slate-300">
                    {Object.entries(prob.given).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-slate-500">{k}:</span> <span className="font-bold text-sky-300">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3 text-slate-300">
                    <span className="text-slate-500">Formula:</span>{' '}
                    <span className="text-amber-400 font-bold">{prob.formula}</span>
                  </div>

                  <div className="space-y-1 mb-3 text-slate-400">
                    {prob.stepByStepSolution.map((s, sIdx) => (
                      <div key={sIdx}>→ {s}</div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-sm">
                    Final Answer: {prob.answer}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Common Mistakes & Misconceptions */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              4. Common Traps & Misconceptions
            </h2>

            <div className="space-y-3">
              {currentLesson.commonMistakes.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm">
                  <div className="text-rose-400 font-bold mb-1">
                    ❌ Myth: {m.mistake}
                  </div>
                  <div className="text-emerald-400 font-semibold mb-1">
                    ✓ Reality: {m.reality}
                  </div>
                  <div className="text-slate-400 text-xs">
                    Why it matters: {m.whyItMatters}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* High-Frequency Interview Questions */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              5. High-Frequency Interview Questions
            </h2>

            <div className="space-y-3">
              {currentLesson.interviewQuestions.map((q, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      {q.frequency} Frequency · {q.target}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{q.question}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{q.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Interactive Understanding & Practice Check */}
          {currentLesson.practiceQuestions && currentLesson.practiceQuestions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                6. Check Your Understanding
              </h2>

              <div className="space-y-4">
                {currentLesson.practiceQuestions.map((pq, qIdx) => {
                  const isAnswered = userAnswers[pq.id] !== undefined;
                  const selectedOpt = userAnswers[pq.id];
                  const isCorrect = selectedOpt === pq.correctIndex;

                  return (
                    <div
                      key={pq.id || qIdx}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                          Concept Check #{qIdx + 1}
                        </span>
                        {isAnswered && (
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                              isCorrect
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isCorrect ? 'Correct! ✓' : 'Review Explanation ✕'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-medium text-white">{pq.question}</h3>

                      <div className="space-y-2">
                        {pq.options && pq.options.map((opt, optIdx) => {
                          let optStyle = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 text-slate-300';
                          if (isAnswered) {
                            if (optIdx === pq.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-semibold';
                            } else if (selectedOpt === optIdx) {
                              optStyle = 'border-rose-500 bg-rose-950/50 text-rose-200';
                            } else {
                              optStyle = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isAnswered}
                              onClick={() => setUserAnswers((prev) => ({ ...prev, [pq.id]: optIdx }))}
                              className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && optIdx === pq.correctIndex && (
                                <span className="text-xs font-mono text-emerald-400 font-bold ml-2">✓ Correct Answer</span>
                              )}
                              {isAnswered && selectedOpt === optIdx && optIdx !== pq.correctIndex && (
                                <span className="text-xs font-mono text-rose-400 font-bold ml-2">Selected</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 animate-fadeIn">
                          <div className="font-bold text-sky-400 font-mono">Explanation:</div>
                          <p className="leading-relaxed">{pq.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Key Takeaways */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
              Key Takeaways
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {currentLesson.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Completion & Next/Prev Footer */}
          <footer className="pt-8 border-t border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Finished this chapter?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mark as complete to update your mastery roadmap and unlock revision flashcards.
                </p>
              </div>

              <button
                onClick={() => onToggleComplete(currentLesson.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? 'Completed ✓ (Click to reset)' : 'Mark Chapter Complete'}
              </button>
            </div>

            {/* Next / Previous Navigation */}
            <div className="flex items-center justify-between gap-4">
              {prevLesson ? (
                <button
                  onClick={() => onSelectLesson(prevLesson.id)}
                  className="flex items-center gap-2 text-left p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white transition-all text-xs font-mono"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Previous</div>
                    <div className="font-sans font-bold text-sm truncate max-w-[200px]">
                      {prevLesson.title}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => onSelectLesson(nextLesson.id)}
                  className="flex items-center gap-2 text-right p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white transition-all text-xs font-mono"
                >
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Next Chapter</div>
                    <div className="font-sans font-bold text-sm truncate max-w-[200px]">
                      {nextLesson.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </footer>
        </div>
      </main>

      {/* Note-Taking Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Save Note to Knowledge Base</h3>
            {selectedText && (
              <blockquote className="p-3 bg-slate-950 border-l-2 border-sky-500 text-xs text-slate-400 italic mb-4 rounded">
                "{selectedText}"
              </blockquote>
            )}
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Enter your personal insight, mnemonic, or exam note..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={submitNote}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
