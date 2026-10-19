import React, { useState } from 'react';
import { calculateSlidingWindowUtilization } from '../../utils/networkMath';
import { Sliders, Play, Pause, RotateCcw, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface SimulatedPacket {
  seq: number;
  status: 'sent' | 'acked' | 'lost' | 'buffered';
}

export const SlidingWindowSimulator: React.FC = () => {
  const [protocol, setProtocol] = useState<'stop-and-wait' | 'go-back-n' | 'selective-repeat'>('go-back-n');
  const [windowSize, setWindowSize] = useState<number>(4);
  const [transDelay, setTransDelay] = useState<number>(2); // ms
  const [propDelay, setPropDelay] = useState<number>(10); // ms
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Packets state (packets 0 to 11)
  const [packets, setPackets] = useState<SimulatedPacket[]>(
    Array.from({ length: 12 }, (_, i) => ({
      seq: i,
      status: i < 4 ? 'sent' : 'buffered',
    }))
  );

  const [baseSeq, setBaseSeq] = useState<number>(0);
  const [lossInjectedSeq, setLossInjectedSeq] = useState<number | null>(null);

  const effectiveWindow = protocol === 'stop-and-wait' ? 1 : windowSize;
  const utilization = calculateSlidingWindowUtilization(
    effectiveWindow,
    transDelay,
    propDelay,
    protocol
  );

  const injectLoss = (seq: number) => {
    setLossInjectedSeq(seq);
    setPackets((prev) =>
      prev.map((p) => (p.seq === seq ? { ...p, status: 'lost' } : p))
    );
  };

  const advanceWindow = () => {
    setPackets((prev) => {
      const next = [...prev];
      if (protocol === 'go-back-n' && lossInjectedSeq !== null) {
        // In GBN, loss causes retransmission of all from lost packet
        for (let i = lossInjectedSeq; i < next.length; i++) {
          next[i].status = 'sent';
        }
        setLossInjectedSeq(null);
      } else {
        // Normal ACK
        if (baseSeq < next.length) {
          next[baseSeq].status = 'acked';
        }
        setBaseSeq((b) => Math.min(next.length - 1, b + 1));
      }
      return next;
    });
  };

  const resetSimulation = () => {
    setBaseSeq(0);
    setLossInjectedSeq(null);
    setPackets(
      Array.from({ length: 12 }, (_, i) => ({
        seq: i,
        status: i < effectiveWindow ? 'sent' : 'buffered',
      }))
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Sliders className="w-4 h-4" /> Flow Control Protocol Engine
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Sliding-Window Protocol Simulator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare Stop-and-Wait, Go-Back-N, and Selective Repeat ARQ window progressions and channel utilization.
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => {
              setProtocol('stop-and-wait');
              resetSimulation();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              protocol === 'stop-and-wait' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stop-and-Wait
          </button>
          <button
            onClick={() => {
              setProtocol('go-back-n');
              resetSimulation();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              protocol === 'go-back-n' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Go-Back-N
          </button>
          <button
            onClick={() => {
              setProtocol('selective-repeat');
              resetSimulation();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              protocol === 'selective-repeat' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Selective Repeat
          </button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 mb-6 text-xs font-mono">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <label htmlFor="window-size-slider">Sender Window Size (N):</label>
            <span className="text-sky-400 font-bold">{effectiveWindow}</span>
          </div>
          <input
            id="window-size-slider"
            type="range"
            min="1"
            max="8"
            disabled={protocol === 'stop-and-wait'}
            value={effectiveWindow}
            onChange={(e) => {
              setWindowSize(Number(e.target.value));
              resetSimulation();
            }}
            className="w-full accent-sky-500 cursor-pointer disabled:opacity-30"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <label htmlFor="trans-delay-input">Transmission Delay (T_trans):</label>
            <span className="text-emerald-400 font-bold">{transDelay} ms</span>
          </div>
          <input
            id="trans-delay-input"
            type="range"
            min="1"
            max="10"
            value={transDelay}
            onChange={(e) => setTransDelay(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <label htmlFor="prop-delay-input">Propagation Delay (T_prop):</label>
            <span className="text-amber-400 font-bold">{propDelay} ms</span>
          </div>
          <input
            id="prop-delay-input"
            type="range"
            min="2"
            max="30"
            value={propDelay}
            onChange={(e) => setPropDelay(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Utilization & Math Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
          <span className="text-slate-400 uppercase text-[11px]">Channel Ratio a</span>
          <div className="text-lg font-bold text-sky-400 mt-1">
            a = {utilization.a}
          </div>
          <span className="text-[10px] text-slate-500">T_prop / T_trans</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
          <span className="text-slate-400 uppercase text-[11px]">Utilization Efficiency (η)</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">
            {utilization.efficiencyPercent}%
          </div>
          <span className="text-[10px] text-slate-500">{utilization.formula}</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
          <span className="text-slate-400 uppercase text-[11px]">Receiver Window (W_r)</span>
          <div className="text-lg font-bold text-amber-400 mt-1">
            {protocol === 'selective-repeat' ? `W_r = ${effectiveWindow}` : 'W_r = 1 (Cumulative)'}
          </div>
          <span className="text-[10px] text-slate-500">
            {protocol === 'selective-repeat' ? 'Buffers out of order' : 'Discards out of order'}
          </span>
        </div>
      </div>

      {/* Interactive Visual Window Track */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            Sender Sequence Number Stream & Active Window [Base: {baseSeq}]
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={advanceWindow}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Advance Window (Simulate ACK)
            </button>
            <button
              onClick={resetSimulation}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Reset Track"
              aria-label="Reset Track"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Frame Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 px-2">
          {packets.map((pkt) => {
            const inWindow = pkt.seq >= baseSeq && pkt.seq < baseSeq + effectiveWindow;
            return (
              <div
                key={pkt.seq}
                className={`w-14 h-20 rounded-lg border-2 flex flex-col items-center justify-between p-2 font-mono transition-all shrink-0 ${
                  inWindow
                    ? 'border-sky-400 bg-sky-950/40 shadow-lg shadow-sky-500/10'
                    : 'border-slate-800 bg-slate-900/50 opacity-60'
                }`}
              >
                <span className="text-[10px] text-slate-400">Pkt #{pkt.seq}</span>
                <span
                  className={`text-xs font-bold ${
                    pkt.status === 'acked'
                      ? 'text-emerald-400'
                      : pkt.status === 'lost'
                      ? 'text-rose-400'
                      : 'text-sky-300'
                  }`}
                >
                  {pkt.status.toUpperCase()}
                </span>
                {inWindow && pkt.status !== 'lost' && pkt.status !== 'acked' ? (
                  <button
                    onClick={() => injectLoss(pkt.seq)}
                    className="text-[9px] text-rose-400 hover:underline"
                  >
                    Drop
                  </button>
                ) : (
                  <span className="text-[9px] text-slate-500">-</span>
                )}
              </div>
            );
          })}
        </div>

        {lossInjectedSeq !== null && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg flex items-center gap-2 text-xs text-rose-300 font-mono">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Packet #{lossInjectedSeq} was dropped in flight!{' '}
              {protocol === 'go-back-n'
                ? 'In Go-Back-N, the receiver discards all subsequent packets and requests retransmission of packet #' + lossInjectedSeq + ' onward.'
                : 'In Selective Repeat, the receiver buffers packets ' + (lossInjectedSeq + 1) + ' onward and re-requests ONLY packet #' + lossInjectedSeq + '.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
