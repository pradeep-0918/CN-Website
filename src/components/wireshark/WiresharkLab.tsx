import React, { useState } from 'react';
import { wiresharkExercises } from '../../data/wiresharkData';
import { SyntheticWiresharkPacket, WiresharkCaptureExercise } from '../../types/network';
import {
  FileCode,
  Search,
  Upload,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

export const WiresharkLab: React.FC = () => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ws-tcp-handshake');
  const [selectedPacketNo, setSelectedPacketNo] = useState<number>(1);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'Transmission Control Protocol': true,
    'Internet Protocol Version 4': false,
    'Ethernet II': false,
  });
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const exercise =
    wiresharkExercises.find((e) => e.id === selectedExerciseId) || wiresharkExercises[0];

  const currentPacket =
    exercise.packets.find((p) => p.no === selectedPacketNo) || exercise.packets[0];

  const toggleLayer = (layerName: string) => {
    setExpandedLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
    setSubmittedQuestions({ ...submittedQuestions, [questionId]: true });
  };

  const getProtocolColor = (proto: string) => {
    switch (proto) {
      case 'TCP':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
      case 'DNS':
        return 'text-sky-400 bg-sky-950/40 border-sky-500/30';
      case 'HTTP':
        return 'text-lime-400 bg-lime-950/40 border-lime-500/30';
      case 'TLSv1.3':
        return 'text-purple-400 bg-purple-950/40 border-purple-500/30';
      case 'ARP':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <FileCode className="w-4 h-4" /> Realistic Packet Dissection & Wire Analysis
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Practical Wireshark Learning Lab</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Inspect authentic synthetic packet traces with genuine 3-pane dissection: Packet List, Protocol Tree, and Raw Hex Dump.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
          <Info className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>Curated synthetic captures: exact byte-level RFC representations.</span>
        </div>
      </div>

      {/* Exercise Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {wiresharkExercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => {
              setSelectedExerciseId(ex.id);
              setSelectedPacketNo(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              selectedExerciseId === ex.id
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Wireshark 3-Pane Interface */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col space-y-px">
        {/* Pane 1: Packet List */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-2 font-bold tracking-wider flex items-center justify-between">
            <span>Pane 1: Packet List ({exercise.packets.length} packets captured)</span>
            <span className="text-cyan-400">Click packet to dissect below</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                  <th className="py-1 px-2 w-12">No.</th>
                  <th className="py-1 px-2 w-24">Time</th>
                  <th className="py-1 px-2 w-32">Source</th>
                  <th className="py-1 px-2 w-32">Destination</th>
                  <th className="py-1 px-2 w-20">Protocol</th>
                  <th className="py-1 px-2 w-16">Length</th>
                  <th className="py-1 px-2">Info</th>
                </tr>
              </thead>
              <tbody>
                {exercise.packets.map((pkt) => {
                  const isSelected = pkt.no === selectedPacketNo;
                  return (
                    <tr
                      key={pkt.no}
                      onClick={() => setSelectedPacketNo(pkt.no)}
                      className={`cursor-pointer transition-colors border-b border-slate-900/60 ${
                        isSelected
                          ? 'bg-sky-900/50 text-white font-bold'
                          : pkt.isFlaggedAnomaly
                          ? 'bg-rose-950/20 text-rose-300 hover:bg-slate-850'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <td className="py-1.5 px-2 text-slate-500">{pkt.no}</td>
                      <td className="py-1.5 px-2">{pkt.timeSec.toFixed(6)}</td>
                      <td className="py-1.5 px-2">{pkt.source}</td>
                      <td className="py-1.5 px-2">{pkt.destination}</td>
                      <td className="py-1.5 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getProtocolColor(pkt.protocol)}`}>
                          {pkt.protocol}
                        </span>
                      </td>
                      <td className="py-1.5 px-2">{pkt.lengthBytes}</td>
                      <td className="py-1.5 px-2 truncate max-w-md">{pkt.info}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pane 2: Packet Details Tree */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 max-h-72 overflow-y-auto space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center justify-between">
            <span>Pane 2: Packet Details Tree (Packet #{currentPacket.no})</span>
            {currentPacket.anomalyNote && (
              <span className="text-amber-400 text-[11px] font-normal flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {currentPacket.anomalyNote}
              </span>
            )}
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {currentPacket.layers.map((layer, idx) => {
              const isExpanded = expandedLayers[layer.name] ?? idx === currentPacket.layers.length - 1;
              return (
                <div key={idx} className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-900/40">
                  <button
                    onClick={() => toggleLayer(layer.name)}
                    className="w-full flex items-center gap-2 p-2 text-left bg-slate-900/80 hover:bg-slate-850 transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="font-bold text-white text-[11px]">{layer.name}</span>
                    <span className="text-slate-500 text-[10px] ml-auto">({layer.summary})</span>
                  </button>

                  {isExpanded && (
                    <div className="p-2.5 bg-slate-950/80 space-y-1 border-t border-slate-800/80 text-[11px]">
                      {layer.fields.map((field, fIdx) => (
                        <div key={fIdx} className="flex items-start justify-between py-0.5 border-b border-slate-900">
                          <span className="text-slate-400">{field.label}:</span>
                          <span className="text-cyan-300 font-bold">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 3: Hex Dump & ASCII */}
        <div className="p-4 bg-slate-950">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-2">
            Pane 3: Hexadecimal & ASCII Raw Payload Preview
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 font-mono text-xs text-slate-300 flex flex-wrap gap-2 overflow-x-auto">
            {currentPacket.hexBytes.map((byte, bIdx) => (
              <span
                key={bIdx}
                className="hover:bg-cyan-500/20 hover:text-cyan-300 rounded px-1 transition-colors cursor-default"
                title={`Byte ${bIdx}: 0x${byte}`}
              >
                {byte}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Packet Investigation Quiz Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4" /> Packet Investigation Challenge
        </div>

        {exercise.questions.map((q) => {
          const userAns = userAnswers[q.id];
          const isSubmitted = submittedQuestions[q.id];
          const isCorrect = userAns === q.correctIndex;

          return (
            <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-sm font-bold text-white">{q.question}</div>

              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (isSubmitted) {
                    if (oIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (userAns === oIdx) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    }
                  } else if (userAns === oIdx) {
                    optStyle = 'bg-sky-900/40 border-sky-500 text-white';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && oIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && userAns === oIdx && oIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    isCorrect
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="font-bold block mb-1">
                    {isCorrect ? 'Correct Analysis!' : 'Wire Analysis Insight:'}
                  </span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
