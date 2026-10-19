import React, { useState } from 'react';
import { UserNote, Bookmark, SpacedReviewItem, FlashcardRating } from '../../types/network';
import { allLessons } from '../../data/curriculumData';
import { calculateNextReview, calculateRetentionEstimate, calculateTopicMastery } from '../../utils/spacedRepetition';
import {
  BookOpen,
  Bookmark as BookmarkIcon,
  FileText,
  Download,
  Trash2,
  ArrowUpRight,
  Sparkles,
  RotateCw,
  Check,
  RotateCcw,
  Clock,
  Layers,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface KnowledgeBaseProps {
  notes: UserNote[];
  bookmarks: Bookmark[];
  spacedReviews: SpacedReviewItem[];
  onUpdateSpacedReviews: (reviews: SpacedReviewItem[]) => void;
  onSelectLesson: (lessonId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onRemoveBookmark: (lessonId: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  notes,
  bookmarks,
  spacedReviews,
  onUpdateSpacedReviews,
  onSelectLesson,
  onDeleteNote,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'spaced-review' | 'all-cards' | 'bookmarks' | 'formulas'>('notes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Spaced review state
  const [reviewMode, setReviewMode] = useState<'due-only' | 'all'>('due-only');
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);
  const [sessionRatings, setSessionRatings] = useState<Record<FlashcardRating, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  // Build deck from curriculum if spacedReviews is empty
  const activeDeck: SpacedReviewItem[] = React.useMemo(() => {
    if (spacedReviews && spacedReviews.length > 0) return spacedReviews;
    let autoId = 1;
    return allLessons.flatMap((l) =>
      l.flashcards.map((f) => ({
        id: `sr-${autoId++}`,
        front: f.front,
        back: f.back,
        chapter: l.chapterNumber,
        moduleId: l.moduleId,
        intervalDays: 0,
        easeFactor: 2.5,
        reps: 0,
        nextReviewDate: Date.now() - 1000, // initially due
      }))
    );
  }, [spacedReviews]);

  const now = Date.now();
  const dueCards = activeDeck.filter((c) => !c.nextReviewDate || c.nextReviewDate <= now);
  const cardsToReview = reviewMode === 'due-only' ? dueCards : activeDeck;
  const currentCard = cardsToReview[currentReviewIndex] || cardsToReview[0];

  const estimatedRetention = calculateRetentionEstimate(activeDeck);
  const topicMastery = calculateTopicMastery(activeDeck);

  const handleRateCard = (rating: FlashcardRating) => {
    if (!currentCard) return;

    const updatedCard = calculateNextReview(currentCard, rating, Date.now());
    const updatedDeck = activeDeck.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    onUpdateSpacedReviews(updatedDeck);

    setSessionReviewedCount((prev) => prev + 1);
    setSessionRatings((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));

    setIsFlipped(false);
    if (currentReviewIndex >= cardsToReview.length - 1) {
      setSessionCompleted(true);
    } else {
      setCurrentReviewIndex((prev) => prev + 1);
    }
  };

  const handleRestartSession = () => {
    setSessionCompleted(false);
    setCurrentReviewIndex(0);
    setSessionReviewedCount(0);
    setSessionRatings({ again: 0, hard: 0, good: 0, easy: 0 });
    setIsFlipped(false);
  };

  const exportNotesToMarkdown = () => {
    let md = '# Network Mastery Lab - Personal Study Notes\n\n';
    notes.forEach((n) => {
      md += `## ${n.lessonTitle}\n`;
      md += `*Recorded on ${new Date(n.timestamp).toLocaleDateString()}*\n\n`;
      if (n.selectedQuote) {
        md += `> "${n.selectedQuote}"\n\n`;
      }
      md += `${n.text}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `network_mastery_notes_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.selectedQuote && n.selectedQuote.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase font-bold">
            <BookOpen className="w-4 h-4" /> Personal Revision & Knowledge Base
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Study Notebook & Active Recall</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Spaced repetition flashcards with SM-2 scheduling, saved lesson notes, and formula cheatsheets.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'notes' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('spaced-review');
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'spaced-review'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spaced Review ({dueCards.length} Due)
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bookmarks' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'formulas' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Formula Sheet
          </button>
        </div>
      </div>

      {/* TAB 1: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search through your personal notes..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            {notes.length > 0 && (
              <button
                onClick={exportNotesToMarkdown}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-medium border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export Markdown
              </button>
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No notes recorded yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select any text while reading lessons in the Course Reader and click "Save as Note" to capture key insights here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 text-xs font-mono">
                    <button
                      onClick={() => onSelectLesson(note.lessonId)}
                      className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{note.lessonTitle}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {note.selectedQuote && (
                    <blockquote className="p-3 bg-slate-950 border-l-2 border-sky-500 rounded-lg text-xs text-slate-400 italic mb-3">
                      "{note.selectedQuote}"
                    </blockquote>
                  )}

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPACED REPETITION REVIEW (SM-2) */}
      {activeTab === 'spaced-review' && (
        <div className="space-y-6">
          {/* Algorithm retention disclaimer */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Active Recall Schedule:</strong> Intervals are computed using an SM-2 scheduling algorithm. Notice: this review schedule is an algorithmic estimate of recall probability, not an absolute guarantee of retention.
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 uppercase text-[10px] block">Due Today</span>
              <span className="text-xl font-bold text-sky-400">{dueCards.length}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 uppercase text-[10px] block">Total Deck</span>
              <span className="text-xl font-bold text-white">{activeDeck.length}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-500 uppercase text-[10px] block">Estimated Retention</span>
              <span className="text-xl font-bold text-emerald-400">{estimatedRetention}%</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Review Filter:</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              <button
                onClick={() => {
                  setReviewMode('due-only');
                  setCurrentReviewIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  reviewMode === 'due-only' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Due Cards Only ({dueCards.length})
              </button>
              <button
                onClick={() => {
                  setReviewMode('all');
                  setCurrentReviewIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  reviewMode === 'all' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Cards ({activeDeck.length})
              </button>
            </div>
          </div>

          {/* Review Session Area */}
          {cardsToReview.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">All Caught Up For Today!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No cards are currently due for review under the SM-2 schedule. You can switch to "All Cards" above to practice anytime.
              </p>
            </div>
          ) : sessionCompleted ? (
            /* Session Summary Card */
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Daily Review Session Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You reviewed {sessionReviewedCount} flashcards. Intervals and ease factors have been recalibrated.
                </p>
              </div>

              {/* Ratings Breakdown */}
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
                  <span className="block text-[10px] text-slate-400">Again</span>
                  <span className="text-base font-bold">{sessionRatings.again}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
                  <span className="block text-[10px] text-slate-400">Hard</span>
                  <span className="text-base font-bold">{sessionRatings.hard}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300">
                  <span className="block text-[10px] text-slate-400">Good</span>
                  <span className="text-base font-bold">{sessionRatings.good}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <span className="block text-[10px] text-slate-400">Easy</span>
                  <span className="text-base font-bold">{sessionRatings.easy}</span>
                </div>
              </div>

              <button
                onClick={handleRestartSession}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20"
              >
                Start New Session
              </button>
            </div>
          ) : (
            /* Active Card Flashcard */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-bold">
                  Card {currentReviewIndex + 1} of {cardsToReview.length}
                </span>
                <span>
                  Chapter {currentCard.chapter} • Reps: {currentCard.reps} • Ease: {currentCard.easeFactor}
                </span>
              </div>

              {/* Card Canvas */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-64 cursor-pointer bg-slate-900 border-2 border-slate-800 hover:border-sky-500 rounded-2xl p-8 flex flex-col justify-between items-center text-center transition-all shadow-2xl relative overflow-hidden"
              >
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  {isFlipped ? 'ANSWER / FIRST PRINCIPLES EXPLANATION' : 'QUESTION / CONCEPT PROMPT'}
                </div>

                <div className="text-lg md:text-xl font-bold text-white px-4 leading-relaxed my-auto">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono">
                  <RotateCw className="w-3.5 h-3.5" /> Click card to flip
                </div>
              </div>

              {/* 4 SuperMemo Rating Buttons (Only shown when flipped) */}
              {isFlipped ? (
                <div className="space-y-2">
                  <div className="text-center text-[11px] font-mono text-slate-500 uppercase">
                    Rate Your Memory Recall Difficulty (SM-2 Interval):
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateCard('again')}
                      className="p-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-mono transition-all text-center"
                    >
                      <div className="font-bold">Again</div>
                      <div className="text-[10px] text-rose-400/80 mt-0.5">&lt; 1 day</div>
                    </button>
                    <button
                      onClick={() => handleRateCard('hard')}
                      className="p-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-mono transition-all text-center"
                    >
                      <div className="font-bold">Hard</div>
                      <div className="text-[10px] text-amber-400/80 mt-0.5">1-2 days</div>
                    </button>
                    <button
                      onClick={() => handleRateCard('good')}
                      className="p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 text-xs font-mono transition-all text-center"
                    >
                      <div className="font-bold">Good</div>
                      <div className="text-[10px] text-sky-400/80 mt-0.5">3-8 days</div>
                    </button>
                    <button
                      onClick={() => handleRateCard('easy')}
                      className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all text-center"
                    >
                      <div className="font-bold">Easy</div>
                      <div className="text-[10px] text-emerald-400/80 mt-0.5">10+ days</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
                  >
                    Reveal Answer & Rate Recall →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
              <BookmarkIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No chapters bookmarked</h3>
              <p className="text-xs text-slate-400">
                Click the bookmark ribbon icon on any chapter in the Course Reader to pin it here.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.lessonId}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Module {bm.moduleId}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{bm.lessonTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectLesson(bm.lessonId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-medium"
                  >
                    Open Chapter <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(bm.lessonId)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: FORMULAS CHEATSHEET */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Transmission Delay</span>
            <div className="text-base font-bold text-white">T_trans = L / R</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Packet size (bits) divided by Link bandwidth (bps).
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Propagation Delay</span>
            <div className="text-base font-bold text-white">T_prop = d / s</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Physical distance (meters) divided by signal velocity in medium (m/s).
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Nyquist Bit Rate (Noiseless)</span>
            <div className="text-base font-bold text-white">C = 2 * B * log2(M)</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              B is bandwidth in Hz; M is number of discrete signal voltage levels.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Shannon Channel Capacity</span>
            <div className="text-base font-bold text-white">C = B * log2(1 + SNR)</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Maximum theoretical data rate in noisy channels where SNR is the linear power ratio.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Bandwidth-Delay Product</span>
            <div className="text-base font-bold text-white">BDP = R * RTT</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Governs minimum TCP socket buffer size to saturate transatlantic high-speed links.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold uppercase text-[11px]">Full Mesh Duplex Links</span>
            <div className="text-base font-bold text-white">Links = N * (N - 1) / 2</div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Required duplex cables to interconnect N nodes in a fully meshed topology.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
