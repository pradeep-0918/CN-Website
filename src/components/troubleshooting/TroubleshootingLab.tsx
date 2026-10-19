import React, { useState } from 'react';
import { troubleshootingScenarios } from '../../data/troubleshootingData';
import { TroubleshootingScenario, TroubleshootingCommand } from '../../types/network';
import {
  Terminal,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Info
} from 'lucide-react';

export const TroubleshootingLab: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('ts-1');
  const [executedCommands, setExecutedCommands] = useState<TroubleshootingCommand[]>([]);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const scenario =
    troubleshootingScenarios.find((s) => s.id === selectedScenarioId) || troubleshootingScenarios[0];

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setExecutedCommands([]);
    setSelectedDiagnosisId(null);
    setIsRevealed(false);
  };

  const handleRunCommand = (cmd: TroubleshootingCommand) => {
    if (!executedCommands.some((c) => c.command === cmd.command)) {
      setExecutedCommands([...executedCommands, cmd]);
    }
  };

  const handleRunAllCommands = () => {
    setExecutedCommands(scenario.availableCommands);
  };

  const handleReset = () => {
    setExecutedCommands([]);
    setSelectedDiagnosisId(null);
    setIsRevealed(false);
  };

  const selectedDiagnosis = scenario.possibleDiagnoses.find((d) => d.id === selectedDiagnosisId);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" /> Realistic Diagnostics & Incident Triage
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Network Troubleshooting Lab</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Diagnose realistic connectivity failures using simulated CLI commands (ping, dig, ip, curl, ss).
          </p>
        </div>

        {/* Safe notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Simulated sandbox: no actual host networking commands executed.</span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {troubleshootingScenarios.map((scen) => (
          <button
            key={scen.id}
            onClick={() => handleSelectScenario(scen.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              selectedScenarioId === scen.id
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="opacity-60 mr-1.5">[{scen.category}]</span>
            <span>{scen.title.split('(')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Symptoms & Topology vs Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptoms & Hypothesis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Symptoms Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Incident Symptoms
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Difficulty: {scenario.difficulty}
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">{scenario.title}</h3>

            <ul className="space-y-2 text-xs text-slate-300">
              {scenario.symptoms.map((symp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{symp}</span>
                </li>
              ))}
            </ul>

            {/* Topology ASCII */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Topology Diagram:</span>
              <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
                {scenario.topology.trim()}
              </pre>
            </div>
          </div>

          {/* Diagnostic Hypothesis Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
              <Lightbulb className="w-4 h-4" /> Formulate Diagnosis
            </div>
            <p className="text-xs text-slate-400">
              Run diagnostic commands in the terminal, analyze the output, and select your root cause conclusion:
            </p>

            <div className="space-y-2">
              {scenario.possibleDiagnoses.map((diag) => (
                <button
                  key={diag.id}
                  onClick={() => setSelectedDiagnosisId(diag.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedDiagnosisId === diag.id
                      ? diag.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-slate-500 font-bold">[{diag.id.toUpperCase()}]</span>
                    <span>{diag.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Instant Feedback on selection */}
            {selectedDiagnosis && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  selectedDiagnosis.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {selectedDiagnosis.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Root Cause Confirmed!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Incorrect Diagnosis
                    </>
                  )}
                </div>
                <div>{selectedDiagnosis.feedback}</div>
              </div>
            )}

            {/* Reveal Verified Fix Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
              >
                {isRevealed ? 'Hide Verified Solution' : 'Reveal Verified Solution & Root Cause →'}
              </button>
            </div>

            {/* Revealed Solution Card */}
            {isRevealed && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Underlying Root Cause:</span>
                  <span className="text-white font-medium">{scenario.verifiedSolution.rootCause}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Remediation Command:</span>
                  <code className="text-emerald-400 font-mono text-[11px] block bg-slate-900 p-2 rounded mt-0.5">
                    {scenario.verifiedSolution.fixCommand}
                  </code>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Engineering Explanation:</span>
                  <span className="text-slate-300">{scenario.verifiedSolution.resolutionExplanation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Production Best Practice:</span>
                  <span className="text-sky-300">{scenario.verifiedSolution.preventativeBestPractice}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Simulated Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[500px]">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">bash - client@workstation:~</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAllCommands}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
                >
                  Run All Probes
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Clear Terminal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Command Launch Buttons */}
            <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
              <span className="text-slate-500 text-[11px] uppercase mr-1">Available Probes:</span>
              {scenario.availableCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleRunCommand(cmd)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 transition-colors whitespace-nowrap text-[11px]"
                >
                  $ {cmd.command.split(' ')[0]} {cmd.command.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Terminal Screen Body */}
            <div className="p-4 font-mono text-xs text-slate-200 space-y-4 flex-1 overflow-y-auto">
              <div className="text-slate-500 text-[11px]">
                # Network Mastery Lab Diagnostic Shell v2.4 (Simulated Sandbox)
                <br /># Click an available probe command above to execute diagnostic inspection.
              </div>

              {executedCommands.map((cmd, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400">
                    <span className="text-emerald-400">client@workstation:~$</span>
                    <span className="font-bold">{cmd.command}</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed pl-2 border-l border-slate-800">
                    {cmd.output}
                  </pre>
                  {cmd.notes && (
                    <div className="text-[10px] text-amber-300/80 italic pl-2">
                      💡 Diagnostic insight: {cmd.notes}
                    </div>
                  )}
                </div>
              ))}

              {executedCommands.length === 0 && (
                <div className="py-16 text-center text-slate-600 text-xs">
                  Terminal ready. Select a probe command above to inspect the network.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
