/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  BookOpen,
  Zap,
  Award,
  Bookmark,
  Search,
  CheckCircle2,
  Sliders,
  Sparkles,
  Command,
  Terminal,
  FileCode
} from 'lucide-react';
import { allLessons } from './data/curriculumData';
import {
  UserProgress,
  UserNote,
  Bookmark as BookmarkType,
  QuizResult,
  LearnerProfile,
  SpacedReviewItem,
} from './types/network';
import { CourseReader } from './components/reader/CourseReader';
import { SimulatorsHub } from './components/simulators/SimulatorsHub';
import { QuizArena } from './components/quiz/QuizArena';
import { KnowledgeBase } from './components/notebook/KnowledgeBase';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TroubleshootingLab } from './components/troubleshooting/TroubleshootingLab';
import { WiresharkLab } from './components/wireshark/WiresharkLab';
import { GlobalSearchModal } from './components/navigation/GlobalSearchModal';

const STORAGE_KEY = 'network_mastery_lab_user_progress_v2';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'reader' | 'simulators' | 'troubleshoot' | 'wireshark' | 'quiz' | 'notebook'
  >('dashboard');
  const [currentLessonId, setCurrentLessonId] = useState<string>('m1-l1');
  const [activeSimulatorId, setActiveSimulatorId] = useState<string>('packet-journey');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Persistent User Progress State
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedLessonIds || [];
      }
    } catch (e) {}
    return [];
  });

  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return (parsed.bookmarks || []).map((b: BookmarkType) => b.lessonId);
      }
    } catch (e) {}
    return [];
  });

  const [notes, setNotes] = useState<UserNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.notes || [];
      }
    } catch (e) {}
    return [];
  });

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.quizHistory || [];
      }
    } catch (e) {}
    return [];
  });

  const [profile, setProfile] = useState<LearnerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch (e) {}
    return {
      goal: 'placement',
      skillLevel: 'intermediate',
      dailyReviewGoal: 10,
    };
  });

  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.spacedReviews)) return parsed.spacedReviews;
      }
    } catch (e) {}
    return [];
  });

  const [tanglishEnabled, setTanglishEnabled] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        completedLessonIds,
        bookmarks: bookmarkedLessonIds.map((id) => {
          const l = allLessons.find((les) => les.id === id);
          return {
            lessonId: id,
            lessonTitle: l ? l.title : id,
            moduleId: l ? l.moduleId : 1,
            timestamp: Date.now(),
          };
        }),
        notes,
        quizHistory,
        profile,
        spacedReviews,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {}
  }, [completedLessonIds, bookmarkedLessonIds, notes, quizHistory, profile, spacedReviews]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
  };

  const handleToggleBookmark = (lessonId: string) => {
    if (bookmarkedLessonIds.includes(lessonId)) {
      setBookmarkedLessonIds(bookmarkedLessonIds.filter((id) => id !== lessonId));
    } else {
      setBookmarkedLessonIds([...bookmarkedLessonIds, lessonId]);
    }
  };

  const handleAddNote = (lessonId: string, noteText: string, quote?: string) => {
    const l = allLessons.find((les) => les.id === lessonId);
    const newNote: UserNote = {
      id: String(Date.now()),
      lessonId,
      lessonTitle: l ? l.title : lessonId,
      text: noteText,
      selectedQuote: quote,
      timestamp: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setActiveTab('reader');
  };

  const handleOpenSimulator = (simId?: string) => {
    if (simId) setActiveSimulatorId(simId);
    setActiveTab('simulators');
  };

  const handleImportProgress = (imported: UserProgress) => {
    if (imported.completedLessonIds) setCompletedLessonIds(imported.completedLessonIds);
    if (imported.currentLessonId) setCurrentLessonId(imported.currentLessonId);
    if (imported.notes) setNotes(imported.notes);
    if (imported.bookmarks) setBookmarkedLessonIds(imported.bookmarks.map((b) => b.lessonId));
    if (imported.quizHistory) setQuizHistory(imported.quizHistory);
    if (imported.profile) setProfile(imported.profile);
    if (imported.spacedReviews) setSpacedReviews(imported.spacedReviews);
  };

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const progressPercent = Math.round((completedLessonIds.length / allLessons.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Main Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shrink-0">
        {/* Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight leading-none group-hover:text-sky-400 transition-colors">
                Network Mastery Lab
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-1">
                First Principles Networking
              </div>
            </div>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'reader'
                  ? 'bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Curriculum Reader
            </button>
            <button
              onClick={() => setActiveTab('simulators')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'simulators'
                  ? 'bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> 10+ Simulators
            </button>
            <button
              onClick={() => setActiveTab('troubleshoot')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'troubleshoot'
                  ? 'bg-amber-600/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Troubleshooting
            </button>
            <button
              onClick={() => setActiveTab('wireshark')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'wireshark'
                  ? 'bg-cyan-600/20 text-cyan-400 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> Wireshark Lab
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Quizzes & Exams
            </button>
            <button
              onClick={() => setActiveTab('notebook')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'notebook'
                  ? 'bg-sky-600/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Notebook
            </button>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 font-mono transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold border border-slate-700">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Quick Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">{progressPercent}%</span>
            <span className="text-slate-500">Mastered</span>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-b border-slate-800 py-2 px-1 text-xs font-mono text-slate-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'dashboard' ? 'text-sky-400 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('reader')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'reader' ? 'text-sky-400 font-bold' : ''}`}
        >
          Reader
        </button>
        <button
          onClick={() => setActiveTab('simulators')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'simulators' ? 'text-sky-400 font-bold' : ''}`}
        >
          Simulators
        </button>
        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'troubleshoot' ? 'text-amber-400 font-bold' : ''}`}
        >
          Troubleshoot
        </button>
        <button
          onClick={() => setActiveTab('wireshark')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'wireshark' ? 'text-cyan-400 font-bold' : ''}`}
        >
          Wireshark
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'quiz' ? 'text-sky-400 font-bold' : ''}`}
        >
          Quiz
        </button>
        <button
          onClick={() => setActiveTab('notebook')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'notebook' ? 'text-sky-400 font-bold' : ''}`}
        >
          Notes
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            completedLessonIds={completedLessonIds}
            currentLessonId={currentLessonId}
            notesCount={notes.length}
            bookmarksCount={bookmarkedLessonIds.length}
            quizHistory={quizHistory}
            profile={profile}
            spacedReviews={spacedReviews}
            onUpdateProfile={setProfile}
            onSelectLesson={handleSelectLesson}
            onOpenSimulator={handleOpenSimulator}
            onOpenTab={setActiveTab}
            onImportProgress={handleImportProgress}
            notes={notes}
          />
        )}

        {activeTab === 'reader' && (
          <CourseReader
            currentLesson={currentLesson}
            completedLessonIds={completedLessonIds}
            bookmarkedLessonIds={bookmarkedLessonIds}
            tanglishEnabled={tanglishEnabled}
            fontSize={fontSize}
            onSelectLesson={(id) => setCurrentLessonId(id)}
            onToggleComplete={handleToggleComplete}
            onToggleBookmark={handleToggleBookmark}
            onToggleTanglish={() => setTanglishEnabled(!tanglishEnabled)}
            onChangeFontSize={setFontSize}
            onAddNote={handleAddNote}
            onOpenSimulator={handleOpenSimulator}
          />
        )}

        {activeTab === 'simulators' && (
          <SimulatorsHub initialSimulatorId={activeSimulatorId} />
        )}

        {activeTab === 'troubleshoot' && (
          <TroubleshootingLab />
        )}

        {activeTab === 'wireshark' && (
          <WiresharkLab />
        )}

        {activeTab === 'quiz' && (
          <QuizArena
            quizHistory={quizHistory}
            onSaveQuizResult={(res) => setQuizHistory([res, ...quizHistory])}
          />
        )}

        {activeTab === 'notebook' && (
          <KnowledgeBase
            notes={notes}
            bookmarks={bookmarkedLessonIds.map((id) => {
              const l = allLessons.find((les) => les.id === id);
              return {
                lessonId: id,
                lessonTitle: l ? l.title : id,
                moduleId: l ? l.moduleId : 1,
                timestamp: Date.now(),
              };
            })}
            spacedReviews={spacedReviews}
            onUpdateSpacedReviews={setSpacedReviews}
            onSelectLesson={handleSelectLesson}
            onDeleteNote={handleDeleteNote}
            onRemoveBookmark={handleToggleBookmark}
          />
        )}
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
        onSelectSimulator={(simId) => {
          setActiveSimulatorId(simId);
          setActiveTab('simulators');
        }}
      />
    </div>
  );
}
