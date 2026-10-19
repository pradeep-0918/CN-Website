import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Clock, ShieldCheck, Play, Pause } from 'lucide-react';

interface HandshakeStep {
  step: number;
  phase: 'handshake' | 'teardown';
  sender: 'Client' | 'Server';
  flags: string;
  seqFormula: string;
  ackFormula: string;
  seqValue: number;
  ackValue: number;
  clientState: string;
  serverState: string;
  description: string;
}

export const TCPHandshakeSimulator: React.FC = () => {
  const [clientISN, setClientISN] = useState<number>(1000);
  const [serverISN, setServerISN] = useState<number>(5000);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Generate steps dynamically based on ISNs
  const steps: HandshakeStep[] = [
    {
      step: 0,
      phase: 'handshake',
      sender: 'Client',
      flags: 'INITIAL',
      seqFormula: '-',
      ackFormula: '-',
      seqValue: 0,
      ackValue: 0,
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      description: 'Server application (e.g. Nginx on port 443) binds socket and enters LISTEN state waiting for inbound connections.',
    },
    {
      step: 1,
      phase: 'handshake',
      sender: 'Client',
      flags: 'SYN',
      seqFormula: 'Seq = ISN_c',
      ackFormula: 'Ack = -',
      seqValue: clientISN,
      ackValue: 0,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      description: `Client initiates connection by sending a SYN packet with random Initial Sequence Number (ISN_c = ${clientISN}). Client transitions to SYN_SENT.`,
    },
    {
      step: 2,
      phase: 'handshake',
      sender: 'Server',
      flags: 'SYN, ACK',
      seqFormula: 'Seq = ISN_s',
      ackFormula: 'Ack = ISN_c + 1',
      seqValue: serverISN,
      ackValue: clientISN + 1,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      description: `Server allocates transmission control block (TCB), generates its own random ISN_s (${serverISN}), and acknowledges client's SYN by setting Ack = ${clientISN + 1} (consuming 1 seq). Server enters SYN_RCVD.`,
    },
    {
      step: 3,
      phase: 'handshake',
      sender: 'Client',
      flags: 'ACK',
      seqFormula: 'Seq = ISN_c + 1',
      ackFormula: 'Ack = ISN_s + 1',
      seqValue: clientISN + 1,
      ackValue: serverISN + 1,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      description: `Client acknowledges server's SYN by setting Ack = ${serverISN + 1}. Both endpoints are now in ESTABLISHED state. Full-duplex application data transmission can now begin!`,
    },
    {
      step: 4,
      phase: 'teardown',
      sender: 'Client',
      flags: 'FIN',
      seqFormula: 'Seq = u',
      ackFormula: 'Ack = v',
      seqValue: clientISN + 100,
      ackValue: serverISN + 500,
      clientState: 'FIN_WAIT_1',
      serverState: 'ESTABLISHED',
      description: 'Client finishes sending data and initiates active close with a FIN packet. Client enters FIN_WAIT_1.',
    },
    {
      step: 5,
      phase: 'teardown',
      sender: 'Server',
      flags: 'ACK',
      seqFormula: 'Seq = v',
      ackFormula: 'Ack = u + 1',
      seqValue: serverISN + 500,
      ackValue: clientISN + 101,
      clientState: 'FIN_WAIT_2',
      serverState: 'CLOSE_WAIT',
      description: 'Server acknowledges client FIN with ACK. Server enters CLOSE_WAIT (can still send remaining data). Client enters FIN_WAIT_2.',
    },
    {
      step: 6,
      phase: 'teardown',
      sender: 'Server',
      flags: 'FIN',
      seqFormula: 'Seq = w',
      ackFormula: 'Ack = u + 1',
      seqValue: serverISN + 800,
      ackValue: clientISN + 101,
      clientState: 'FIN_WAIT_2',
      serverState: 'LAST_ACK',
      description: 'Server finishes transmitting its remaining payload and sends its own FIN packet. Server enters LAST_ACK.',
    },
    {
      step: 7,
      phase: 'teardown',
      sender: 'Client',
      flags: 'ACK',
      seqFormula: 'Seq = u + 1',
      ackFormula: 'Ack = w + 1',
      seqValue: clientISN + 101,
      ackValue: serverISN + 801,
      clientState: 'TIME_WAIT (2*MSL)',
      serverState: 'CLOSED',
      description: 'Client acknowledges server FIN. Server immediately enters CLOSED. Client enters TIME_WAIT for 2*MSL (typically 60-120 seconds) before fully closing to guarantee final ACK delivery.',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto play
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, steps.length]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" /> Transport Layer Protocol Engine
          </div>
          <h2 className="text-xl font-bold text-white mt-1">TCP Handshake & Teardown Simulator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Step through SYN, SYN-ACK, ACK sequence number synchronization, full-duplex ESTABLISHED communication, and 4-way FIN termination.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isAutoPlaying ? 'Pause' : 'Auto Play'}
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsAutoPlaying(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* ISN Configuration Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 mb-6 text-xs font-mono">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="client-isn-input" className="text-slate-400">Client Initial Seq Num (ISN_c):</label>
          <input
            id="client-isn-input"
            type="number"
            value={clientISN}
            onChange={(e) => setClientISN(Number(e.target.value) || 0)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sky-400 font-bold w-28 text-right focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="server-isn-input" className="text-slate-400">Server Initial Seq Num (ISN_s):</label>
          <input
            id="server-isn-input"
            type="number"
            value={serverISN}
            onChange={(e) => setServerISN(Number(e.target.value) || 0)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-emerald-400 font-bold w-28 text-right focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Interactive Diagram: Client vs Server with Animated Transmission Line */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 mb-6">
        {/* Endpoints Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Client Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-sky-950/80 border-2 border-sky-500 flex items-center justify-center font-bold text-sky-400 shadow-lg shadow-sky-500/10">
              Client
            </div>
            <span className="text-xs font-mono text-slate-400 mt-2">192.168.1.100</span>
            <span className="text-[11px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60 mt-1">
              State: {currentStep.clientState}
            </span>
          </div>

          {/* Connection Status Badge */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">
              {currentStep.phase === 'handshake' ? 'CONNECTION ESTABLISHMENT' : 'CONNECTION TERMINATION'}
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border bg-slate-900 border-slate-700">
              {currentStepIndex >= 3 && currentStepIndex < 7 ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ESTABLISHED
                </span>
              ) : currentStepIndex === 7 ? (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-3.5 h-3.5" /> TIME_WAIT (2*MSL)
                </span>
              ) : (
                <span className="text-slate-400">HANDSHAKE IN PROGRESS</span>
              )}
            </div>
          </div>

          {/* Server Node */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 shadow-lg shadow-emerald-500/10">
              Server
            </div>
            <span className="text-xs font-mono text-slate-400 mt-2">93.184.216.34:443</span>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 mt-1">
              State: {currentStep.serverState}
            </span>
          </div>
        </div>

        {/* Transmission Packet Flow Visualization */}
        <div className="relative py-8 px-4 border-y border-slate-800/80 my-4 min-h-[140px] flex items-center justify-center">
          {currentStep.step === 0 ? (
            <div className="text-center text-sm text-slate-500 font-mono">
              Socket initialized. Ready to begin TCP 3-Way Handshake.
            </div>
          ) : (
            <div className="w-full max-w-xl">
              {/* Arrow and Packet Badge */}
              <div className="flex items-center justify-between mb-2 text-xs font-mono">
                <span className={currentStep.sender === 'Client' ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                  {currentStep.sender === 'Client' ? 'Originator' : 'Recipient'}
                </span>
                <span className="text-slate-400">Transit Direction</span>
                <span className={currentStep.sender === 'Server' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {currentStep.sender === 'Server' ? 'Originator' : 'Recipient'}
                </span>
              </div>

              <div className="relative flex items-center">
                {/* Horizontal Line */}
                <div className="w-full h-0.5 bg-slate-800 relative">
                  <div
                    className={`absolute inset-0 h-0.5 ${
                      currentStep.sender === 'Client' ? 'bg-gradient-to-r from-sky-500 to-sky-400' : 'bg-gradient-to-l from-emerald-500 to-emerald-400'
                    }`}
                  />
                </div>

                {/* Packet Box floating on the line */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -top-6 px-4 py-2 rounded-lg border shadow-lg font-mono text-xs flex flex-col items-center ${
                    currentStep.sender === 'Client'
                      ? 'bg-sky-950 border-sky-500 text-sky-200'
                      : 'bg-emerald-950 border-emerald-500 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {currentStep.sender === 'Client' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    <span>Flags: [{currentStep.flags}]</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Seq = <span className="font-semibold text-white">{currentStep.seqValue}</span>
                    {currentStep.ackValue > 0 && (
                      <>
                        {' · '}Ack = <span className="font-semibold text-white">{currentStep.ackValue}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Explanation Callout */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-sky-400 uppercase">
              Step {currentStep.step} of 7 — {currentStep.flags}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Formula: {currentStep.seqFormula} {currentStep.ackFormula !== 'Ack = -' ? `| ${currentStep.ackFormula}` : ''}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">{currentStep.description}</p>
        </div>
      </div>

      {/* Stepper Navigation buttons */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={() => {
            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            setIsAutoPlaying(false);
          }}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
        >
          Previous Step
        </button>

        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStepIndex(i);
                setIsAutoPlaying(false);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStepIndex
                  ? 'bg-sky-400 ring-2 ring-sky-400/40 w-5'
                  : i < currentStepIndex
                  ? 'bg-slate-600'
                  : 'bg-slate-800'
              }`}
              title={`Jump to Step ${i}`}
              aria-label={`Jump to Step ${i}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
            setIsAutoPlaying(false);
          }}
          disabled={currentStepIndex === steps.length - 1}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-white shadow-sm transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
