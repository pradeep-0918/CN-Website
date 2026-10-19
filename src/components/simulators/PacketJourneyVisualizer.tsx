import React, { useState, useEffect } from 'react';
import { standardHttpsScenario, PacketJourneyScenario } from '../../data/packetJourneyData';
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Shield,
  Layers,
  ArrowRight,
  Globe,
  Server,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Lock,
  Unlock,
  Radio,
  Sliders
} from 'lucide-react';

export const PacketJourneyVisualizer: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('standard-https');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'headers' | 'router-hops' | 'security'>('overview');

  const scenario = standardHttpsScenario;
  const steps = scenario.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const delay = Math.round(4000 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const networkEntities = [
    { id: 'client', label: 'Client Browser', sub: '192.168.1.105', icon: Laptop },
    { id: 'gateway', label: 'Gateway Router', sub: '192.168.1.1', icon: Radio },
    { id: 'internet', label: 'Internet Core / WAN', sub: 'BGP Backbones', icon: Globe },
    { id: 'dc_router', label: 'Datacenter Router', sub: 'Edge Gateway', icon: Sliders },
    { id: 'server', label: 'Target Web Server', sub: '93.184.216.34:443', icon: Server },
  ];

  const getEntityActiveState = (entityId: string) => {
    const seg = currentStep.networkSegment;
    if (entityId === 'client' && (seg === 'Client LAN' || currentStep.id <= 2 || currentStep.id === 10)) return true;
    if (entityId === 'gateway' && (seg === 'Client LAN' || seg === 'Local Gateway Router' || currentStep.id === 6 || currentStep.id === 8)) return true;
    if (entityId === 'internet' && (seg === 'Internet Core WAN' || currentStep.id === 2 || currentStep.id === 3 || currentStep.id === 4 || currentStep.id === 8)) return true;
    if (entityId === 'dc_router' && (currentStep.id === 8 || currentStep.id === 9)) return true;
    if (entityId === 'server' && (seg === 'Target Web Server' || currentStep.id === 9)) return true;
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Flagship Interactive Architecture
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            End-to-End Packet Journey Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Follow a single packet from the browser keypress through DNS, TCP handshake, TLS 1.3 encryption, router hop rewriting, server execution, and back.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-sky-600/20"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Speed Selector */}
          <div className="flex items-center text-[11px] font-mono text-slate-400">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded ${
                  playbackSpeed === speed ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Network Topology Map */}
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Physical & Logical Topology Flow</span>
          <span className="text-sky-400 font-bold">Stage {currentStep.id} of {steps.length}</span>
        </div>

        {/* Nodes Graphic Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
          {networkEntities.map((ent, idx) => {
            const Icon = ent.icon;
            const isActive = getEntityActiveState(ent.id);
            return (
              <div
                key={ent.id}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-sky-950/60 border-sky-500/80 shadow-lg shadow-sky-500/20 scale-105'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isActive ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white leading-tight">{ent.label}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{ent.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Journey Progress</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step Spotlight Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Step Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/30 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Layer: {currentStep.layer}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Protocol: {currentStep.protocol}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800">
              Segment: {currentStep.networkSegment}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
          <p className="text-xs sm:text-sm text-sky-300 font-mono mt-1">{currentStep.subtitle}</p>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">{currentStep.narrative}</p>
        </div>

        {/* Step Details Sub-tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/50 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Hop Narrative
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Socket & MAC Addresses
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'headers'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PDU Header Fields
          </button>
          <button
            onClick={() => setActiveTab('router-hops')}
            className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'router-hops'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Router Hop Modifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Cryptography
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Entity Communication Flow
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="font-bold text-sky-400">{currentStep.fromEntity}</div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <div className="font-bold text-emerald-400">{currentStep.toEntity}</div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Operating across <span className="text-white font-mono">{currentStep.networkSegment}</span> via{' '}
                  <span className="text-sky-300 font-mono">{currentStep.protocol}</span>.
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Educational Teaching Assumptions
                </div>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {currentStep.teachingAssumptions.map((assump, i) => (
                    <li key={i}>{assump}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Layer 3 IP */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                  Network Layer (IPv4)
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Source IP:</span>
                    <span className="text-white font-bold">{currentStep.addresses.srcIp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Destination IP:</span>
                    <span className="text-white font-bold">{currentStep.addresses.dstIp}</span>
                  </div>
                </div>
              </div>

              {/* Layer 2 MAC */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Data Link Layer (MAC)
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Source MAC:</span>
                    <span className="text-white font-bold">{currentStep.addresses.srcMac}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Destination MAC:</span>
                    <span className="text-white font-bold">{currentStep.addresses.dstMac}</span>
                  </div>
                </div>
              </div>

              {/* Layer 4 Ports */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  Transport Layer (Ports)
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Source Port:</span>
                    <span className="text-white font-bold">{currentStep.addresses.srcPort || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Destination Port:</span>
                    <span className="text-white font-bold">{currentStep.addresses.dstPort || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-sky-400 font-bold uppercase mb-3">
                {currentStep.headersPDU.name}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStep.headersPDU.fields.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">{f.key}:</span>
                    <span className="text-white font-bold">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'router-hops' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-rose-900/40 p-4 rounded-xl space-y-3">
                <div className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Modified at Each Router Hop
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentStep.hopModifications.modified.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-emerald-900/40 p-4 rounded-xl space-y-3">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 100% Unchanged (End-to-End Invariant)
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentStep.hopModifications.unmodified.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentStep.securityAttributes.isEncrypted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {currentStep.securityAttributes.isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {currentStep.securityAttributes.isEncrypted ? 'Cryptographically Protected Stream' : 'Unencrypted / Plaintext Transmission'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {currentStep.securityAttributes.tlsState || 'Cleartext payload'}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Integrity Mechanism:</span>
                <span className="text-xs font-mono text-sky-400 font-bold">{currentStep.securityAttributes.integrityMechanism}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
