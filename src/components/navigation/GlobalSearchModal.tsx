import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Layers, X, ArrowRight } from 'lucide-react';
import { searchCurriculum } from '../../data/curriculumData';
import { Lesson } from '../../types/network';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectSimulator: (simId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectSimulator,
}) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results: Lesson[] = searchCurriculum(query);

  const simulators = [
    { id: 'packet-journey', name: 'Flagship: Packet Journey Visualizer', keywords: 'end to end packet journey browser server dns tcp tls 1.3 router hops nat get request' },
    { id: 'osi', name: 'OSI Encapsulation Visualizer', keywords: 'layers pdu data link transport physical 7 layers' },
    { id: 'tcp', name: 'TCP 3-Way Handshake & Teardown', keywords: 'syn ack sequence initial sequence number isn teardown fin' },
    { id: 'subnet', name: 'Subnetting & VLSM Calculator', keywords: 'cidr ipv4 ip prefix /24 /30 /31 binary mask wildcard' },
    { id: 'routing', name: 'Routing Simulator & Dijkstra', keywords: 'dijkstra shortest path ospf rip bellman-ford link cost' },
    { id: 'dns', name: 'DNS Resolution Visualizer', keywords: 'domain name root tld authoritative recursive a aaaa cname' },
    { id: 'http', name: 'HTTP Request Lifecycle', keywords: 'http https tls get post status codes lifecycle' },
    { id: 'error', name: 'Error Detection Playground', keywords: 'crc cyclic redundancy check hamming code checksum parity' },
    { id: 'delay', name: 'Transmission & Delay Calculator', keywords: 'delay transmission propagation bdp bandwidth queuing' },
    { id: 'sliding', name: 'Sliding-Window Protocol', keywords: 'sliding window stop and wait go back n selective repeat arq' },
    { id: 'packet', name: 'Packet Structure Explorer', keywords: 'packet header ipv4 tcp udp ethernet wireshark fields' },
  ].filter((s) => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.keywords.includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, RFCs, algorithms, simulators (e.g. TCP, Subnetting, CRC)..."
            className="w-full bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-300"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Simulators Matches */}
          {simulators.length > 0 && (
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Interactive Simulators
              </div>
              <div className="space-y-1">
                {simulators.slice(0, 3).map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => {
                      onSelectSimulator(sim.id);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-white font-sans">{sim.name}</span>
                    </div>
                    <span className="text-sky-400 text-[11px]">Launch Simulator →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Lesson Matches */}
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
              Curriculum Chapters & Lessons ({results.length})
            </div>

            {results.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                No matching lessons found for "{query}". Try searching "TCP", "OSI", "Subnet", or "Hamming".
              </div>
            ) : (
              <div className="space-y-1.5">
                {results.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-sky-400">
                        <span>Chapter {lesson.chapterNumber}</span>
                        <span>·</span>
                        <span>{lesson.readTime}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{lesson.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Esc to close</span>
          <span>Network Mastery Lab</span>
        </div>
      </div>
    </div>
  );
};
