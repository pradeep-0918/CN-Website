import React, { useState } from 'react';
import { ArrowDown, ArrowUp, RotateCcw, Play, Pause, ChevronRight, Layers, Info } from 'lucide-react';

interface LayerInfo {
  number: number;
  name: string;
  pdu: string;
  addressing: string;
  headerFields: string[];
  sampleValue: string;
  color: string;
  description: string;
}

const OSI_LAYERS: LayerInfo[] = [
  {
    number: 7,
    name: 'Application Layer',
    pdu: 'Data',
    addressing: 'URL / Process Names',
    headerFields: ['HTTP Request', 'Host: example.com', 'User-Agent: Chrome'],
    sampleValue: 'GET /index.html HTTP/1.1',
    color: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
    description: 'Direct interface with user software. Generates the raw application message.',
  },
  {
    number: 6,
    name: 'Presentation Layer',
    pdu: 'Formatted Data',
    addressing: 'Syntax / Encoding Type',
    headerFields: ['TLS 1.3 Record', 'MIME Type', 'Compression (gzip)'],
    sampleValue: 'Encrypted Payload [AES-256-GCM]',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    description: 'Translates, encrypts, and compresses application data into standardized syntax.',
  },
  {
    number: 5,
    name: 'Session Layer',
    pdu: 'Session Data',
    addressing: 'Session ID / Token',
    headerFields: ['Session ID: 0x9B4F', 'Sync Checkpoint: #12'],
    sampleValue: 'Dialog Management & Checkpoints',
    color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    description: 'Establishes, manages, and terminates persistent communication sessions and dialogs.',
  },
  {
    number: 4,
    name: 'Transport Layer',
    pdu: 'Segment / Datagram',
    addressing: 'Port Numbers (Process-to-Process)',
    headerFields: ['Src Port: 54321', 'Dst Port: 443', 'Seq: 1000', 'Ack: 500', 'Flags: ACK, PSH'],
    sampleValue: 'TCP Header (20 Bytes) + Payload',
    color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    description: 'Ensures end-to-end reliable delivery, segment sequence ordering, and flow/congestion control.',
  },
  {
    number: 3,
    name: 'Network Layer',
    pdu: 'Packet',
    addressing: 'Logical IP Addresses (Host-to-Host)',
    headerFields: ['Src IP: 192.168.1.105', 'Dst IP: 93.184.216.34', 'TTL: 64', 'Protocol: TCP (6)'],
    sampleValue: 'IPv4 Header (20 Bytes) + TCP Segment',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    description: 'Steers packets across heterogeneous networks and routers using logical IP routing.',
  },
  {
    number: 2,
    name: 'Data Link Layer',
    pdu: 'Frame',
    addressing: 'Physical MAC Addresses (Hop-to-Hop)',
    headerFields: ['Src MAC: 74:83:C2:11:22:33', 'Dst MAC (Gateway): 00:1A:2B:44:55:66', 'EtherType: 0x0800', 'Trailer: CRC-32 FCS'],
    sampleValue: 'Ethernet Frame (14B Header + Payload + 4B FCS Trailer)',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    description: 'Transfers frames across a single physical link, verifies hardware MACs, and detects errors via CRC trailer.',
  },
  {
    number: 1,
    name: 'Physical Layer',
    pdu: 'Bits',
    addressing: 'Pins / Voltages / Radio Frequencies',
    headerFields: ['1000BASE-T Encoding', 'PAM-5 Modulation', 'Copper Cat6 Voltage Pulses'],
    sampleValue: '01001000 01100101 01101100 01101100 01101111...',
    color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    description: 'Encodes bits into physical electrical, optical, or radio frequency pulses onto the physical medium.',
  },
];

export const OSIVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<'encapsulate' | 'decapsulate'>('encapsulate');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play interval
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentLayerIndex = direction === 'encapsulate' ? activeStep : 6 - activeStep;
  const currentLayer = OSI_LAYERS[currentLayerIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Layers className="w-4 h-4" /> Interactive Protocol Visualizer
          </div>
          <h2 className="text-xl font-bold text-white mt-1">OSI Encapsulation & Decapsulation Engine</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Watch how application data is transformed into transport segments, network packets, data link frames, and physical bits.
          </p>
        </div>

        {/* Direction & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => {
                setDirection('encapsulate');
                setActiveStep(0);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                direction === 'encapsulate'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" /> Encapsulation (Down)
            </button>
            <button
              onClick={() => {
                setDirection('decapsulate');
                setActiveStep(0);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                direction === 'decapsulate'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Decapsulation (Up)
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
            title={isPlaying ? 'Pause Animation' : 'Auto Play'}
            aria-label={isPlaying ? 'Pause Animation' : 'Auto Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => {
              setActiveStep(0);
              setIsPlaying(false);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
            title="Reset"
            aria-label="Reset Visualizer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: 7 Layer Stack on Left, Packet Anatomy on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Layers list */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-1 font-mono">
            <span>OSI ARCHITECTURE</span>
            <span>CURRENT STEP: {activeStep + 1} OF 7</span>
          </div>

          {OSI_LAYERS.map((layer, idx) => {
            const isCurrent = idx === currentLayerIndex;
            const isProcessed =
              direction === 'encapsulate' ? idx <= currentLayerIndex : idx >= currentLayerIndex;

            return (
              <button
                key={layer.number}
                onClick={() => {
                  setActiveStep(direction === 'encapsulate' ? idx : 6 - idx);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-500/50 shadow-md'
                    : isProcessed
                    ? 'border-slate-700/80 bg-slate-800/40 text-slate-300'
                    : 'border-slate-800/60 bg-slate-900/50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                      isCurrent
                        ? 'bg-sky-500 text-white'
                        : isProcessed
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    L{layer.number}
                  </span>
                  <div>
                    <div className={`font-semibold text-sm ${isCurrent ? 'text-white' : ''}`}>
                      {layer.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      PDU: <span className="text-sky-300">{layer.pdu}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {layer.addressing.split(' ')[0]}
                  </span>
                  {isCurrent && <ChevronRight className="w-4 h-4 text-sky-400 animate-pulse" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Inspection and Packet Construction */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                  Active Inspection: Layer {currentLayer.number}
                </span>
                <h3 className="text-lg font-bold text-white">{currentLayer.name}</h3>
              </div>
              <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-300">
                PDU: {currentLayer.pdu}
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">{currentLayer.description}</p>

            {/* Addressing info */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 mb-4">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Addressing Type</div>
              <div className="text-sm font-semibold text-slate-200">{currentLayer.addressing}</div>
            </div>

            {/* Visual Encapsulation Nesting Diagram */}
            <div className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              {direction === 'encapsulate'
                ? 'Frame Nesting (Adding Headers Down Stack)'
                : 'Frame Unwrapping (Decapsulating Up Stack)'}
            </div>

            {/* The Constructed PDU Box Representation */}
            <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/60 overflow-x-auto">
              <div className="flex items-stretch gap-1 min-w-[500px] text-xs font-mono">
                {/* Layer 2 Frame Header */}
                {(direction === 'encapsulate' ? currentLayerIndex >= 5 : currentLayerIndex <= 5) && (
                  <div className="bg-amber-950/60 border border-amber-600/60 text-amber-300 p-2 rounded flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold">L2 MAC Header</span>
                    <span className="text-[10px] text-amber-400/80">Src & Dst MAC</span>
                  </div>
                )}

                {/* Layer 3 IP Header */}
                {(direction === 'encapsulate' ? currentLayerIndex >= 4 : currentLayerIndex <= 4) && (
                  <div className="bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 p-2 rounded flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold">L3 IP Header</span>
                    <span className="text-[10px] text-emerald-400/80">Src & Dst IP</span>
                  </div>
                )}

                {/* Layer 4 TCP Header */}
                {(direction === 'encapsulate' ? currentLayerIndex >= 3 : currentLayerIndex <= 3) && (
                  <div className="bg-blue-950/60 border border-blue-600/60 text-blue-300 p-2 rounded flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold">L4 TCP Header</span>
                    <span className="text-[10px] text-blue-400/80">Port 443 | Seq/Ack</span>
                  </div>
                )}

                {/* Application Payload */}
                <div className="bg-violet-950/60 border border-violet-600/60 text-violet-300 p-2 rounded flex-1 flex flex-col items-center justify-center text-center">
                  <span className="font-bold">Application Payload</span>
                  <span className="text-[10px] text-violet-400/80 truncate max-w-[180px]">
                    "{currentLayer.sampleValue}"
                  </span>
                </div>

                {/* Layer 2 Frame Trailer FCS */}
                {(direction === 'encapsulate' ? currentLayerIndex >= 5 : currentLayerIndex <= 5) && (
                  <div className="bg-amber-950/60 border border-amber-600/60 text-amber-300 p-2 rounded flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold">L2 FCS Trailer</span>
                    <span className="text-[10px] text-amber-400/80">CRC-32 Checksum</span>
                  </div>
                )}
              </div>
            </div>

            {/* Header Fields in this Layer */}
            <div className="mt-4">
              <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                Headers Added at Layer {currentLayer.number}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentLayer.headerFields.map((field, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              Previous Layer
            </button>
            <div className="text-xs text-slate-400 font-mono">
              Step {activeStep + 1} of 7
            </div>
            <button
              onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
              disabled={activeStep === 6}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-white shadow-sm transition-colors"
            >
              Next Layer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OSIEncapsulationVisualizer } from './OSIEncapsulationVisualizer';
export default OSIVisualizer;
