import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Info,
  Shield,
  Cpu,
  Network,
  Radio,
  FileText,
  Sliders,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export interface LayerMetadata {
  id: number;
  name: string;
  shortName: string;
  pduName: string;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    glow: string;
  };
  addedHeader?: {
    name: string;
    sizeBytes: number;
    description: string;
    fields: { name: string; value: string; bytes: number; desc: string }[];
  };
  addedTrailer?: {
    name: string;
    sizeBytes: number;
    description: string;
    fields: { name: string; value: string; bytes: number; desc: string }[];
  };
  coreResponsibility: string;
  realWorldAnalogy: string;
  interviewInsight: string;
}

const OSI_LAYERS_DATA: LayerMetadata[] = [
  {
    id: 7,
    name: 'Application Layer',
    shortName: 'L7: Application',
    pduName: 'User Data / Message',
    color: {
      bg: 'bg-violet-950/40',
      border: 'border-violet-500/40',
      text: 'text-violet-400',
      accent: 'bg-violet-500',
      glow: 'shadow-violet-500/20'
    },
    addedHeader: {
      name: 'HTTP / Application Message',
      sizeBytes: 84,
      description: 'Human-readable protocol structure formatting user intention',
      fields: [
        { name: 'Request Method', value: 'GET /api/v1/user', bytes: 18, desc: 'HTTP verb & URI resource path' },
        { name: 'Host Header', value: 'api.example.com', bytes: 21, desc: 'Target virtual host name' },
        { name: 'User-Agent', value: 'MasteryClient/2.0', bytes: 24, desc: 'Client browser / client runtime identity' },
        { name: 'Accept', value: 'application/json', bytes: 21, desc: 'MIME types client can process' }
      ]
    },
    coreResponsibility: 'Provides network services directly to software applications and users (HTTP, DNS, SSH, SMTP).',
    realWorldAnalogy: 'Writing a formal letter and deciding its message content in your native language.',
    interviewInsight: 'In TCP/IP model, OSI Layers 7, 6, and 5 are merged into a single unified Application layer.'
  },
  {
    id: 6,
    name: 'Presentation Layer',
    shortName: 'L6: Presentation',
    pduName: 'Formatted & Encrypted Data',
    color: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      accent: 'bg-purple-500',
      glow: 'shadow-purple-500/20'
    },
    addedHeader: {
      name: 'TLS 1.3 Record Wrapper',
      sizeBytes: 21,
      description: 'Cryptographic security envelope ensuring confidentiality & integrity',
      fields: [
        { name: 'Content Type', value: '0x17 (Application Data)', bytes: 1, desc: 'Identifies TLS record payload type' },
        { name: 'Legacy Protocol Ver', value: '0x0303 (TLS 1.2 compatibility)', bytes: 2, desc: 'Preserves middlebox compatibility' },
        { name: 'Encrypted Length', value: '148 Bytes', bytes: 2, desc: 'Length of ciphertext + authentication tag' },
        { name: 'AEAD Auth Tag', value: '16-byte Poly1305 MAC', bytes: 16, desc: 'Guarantees payload tamper-proofing' }
      ]
    },
    coreResponsibility: 'Handles data format translation, character encoding (ASCII/UTF-8), compression, and TLS/SSL encryption.',
    realWorldAnalogy: 'Translating the letter into a standardized secret code and sealing it in an opaque tamper-evident pouch.',
    interviewInsight: 'TLS/SSL actually operates between Transport and Application layers, acting as a hybrid Presentation layer service.'
  },
  {
    id: 5,
    name: 'Session Layer',
    shortName: 'L5: Session',
    pduName: 'Synchronized Session Data',
    color: {
      bg: 'bg-indigo-950/40',
      border: 'border-indigo-500/40',
      text: 'text-indigo-400',
      accent: 'bg-indigo-500',
      glow: 'shadow-indigo-500/20'
    },
    addedHeader: {
      name: 'Session Management Context',
      sizeBytes: 12,
      description: 'Maintains ongoing conversation dialog, checkpoints, and auth tokens',
      fields: [
        { name: 'Session ID', value: '0xA93F8120B4', bytes: 8, desc: 'Persistent connection session identifier' },
        { name: 'Sync Sequence', value: 'Sync Checkpoint #14', bytes: 4, desc: 'Permits checkpoint recovery on interrupted stream' }
      ]
    },
    coreResponsibility: 'Establishes, coordinates, checkpoints, and terminates long-lived conversations and duplex dialogs between systems.',
    realWorldAnalogy: 'Scheduling a two-way phone meeting with agreed turn-taking rules and keeping track of the agenda.',
    interviewInsight: 'Modern web protocols implement session concepts at Layer 7 (e.g. HTTP Cookies, JWT tokens, WebSockets).'
  },
  {
    id: 4,
    name: 'Transport Layer',
    shortName: 'L4: Transport',
    pduName: 'Segment (TCP) / Datagram (UDP)',
    color: {
      bg: 'bg-blue-950/40',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      accent: 'bg-blue-500',
      glow: 'shadow-blue-500/20'
    },
    addedHeader: {
      name: 'TCP Header (Transmission Control)',
      sizeBytes: 20,
      description: 'End-to-end process multiplexing, sequence ordering, and flow control',
      fields: [
        { name: 'Source Port', value: '54219 (Ephemeral)', bytes: 2, desc: 'Client application socket port' },
        { name: 'Destination Port', value: '443 (HTTPS)', bytes: 2, desc: 'Remote server application port' },
        { name: 'Sequence Number', value: '1000', bytes: 4, desc: 'Byte stream order tracking for reassembly' },
        { name: 'Acknowledgment', value: '450', bytes: 4, desc: 'Next expected byte from communication peer' },
        { name: 'Flags', value: 'ACK, PSH', bytes: 2, desc: 'Control flags instructing socket handling' },
        { name: 'Window Size', value: '64,240 Bytes', bytes: 2, desc: 'Receiver buffer capacity for flow control' },
        { name: 'Checksum', value: '0x8F2D', bytes: 2, desc: 'Header and data pseudo-header verification' },
        { name: 'Urgent Pointer', value: '0', bytes: 2, desc: 'Offset to urgent priority data if present' }
      ]
    },
    coreResponsibility: 'Provides process-to-process delivery, segmentation, flow control (sliding window), and reliability (ACKs/retransmission).',
    realWorldAnalogy: 'Putting the letter into a registered courier pouch numbered "Envelope 1 of 3" with a tracking barcode and delivery receipt.',
    interviewInsight: 'Port numbers distinguish different programs running on the same computer (e.g., your browser vs. your Spotify).'
  },
  {
    id: 3,
    name: 'Network Layer',
    shortName: 'L3: Network',
    pduName: 'Packet (Datagram)',
    color: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      accent: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20'
    },
    addedHeader: {
      name: 'IPv4 Header',
      sizeBytes: 20,
      description: 'Logical end-to-end routing across heterogeneous global networks',
      fields: [
        { name: 'Version & IHL', value: 'IPv4, 20 Bytes', bytes: 1, desc: 'IP version (4) and Internet Header Length' },
        { name: 'TOS / DSCP', value: '0x00 (Standard)', bytes: 1, desc: 'Quality of service & priority class' },
        { name: 'Total Length', value: '188 Bytes', bytes: 2, desc: 'Total IP packet size including payload' },
        { name: 'Identification', value: '0x4A1F', bytes: 2, desc: 'Used for IP packet fragmentation identification' },
        { name: 'Flags / Frag Offset', value: 'DF (Don\'t Frag), 0', bytes: 2, desc: 'Fragmentation control bits' },
        { name: 'Time to Live (TTL)', value: '64 Hops', bytes: 1, desc: 'Decremented at each router to prevent infinite loops' },
        { name: 'Protocol', value: '6 (TCP)', bytes: 1, desc: 'Demultiplexing to Layer 4 protocol handler' },
        { name: 'Header Checksum', value: '0xB3A1', bytes: 2, desc: 'Verifies integrity of IP header fields only' },
        { name: 'Source IP', value: '192.168.1.105', bytes: 4, desc: 'Logical origin IP address of client host' },
        { name: 'Destination IP', value: '93.184.216.34', bytes: 4, desc: 'Logical destination IP address of target host' }
      ]
    },
    coreResponsibility: 'Host-to-host delivery, logical addressing (IP), and path selection (routing) through multiple intermediate routers.',
    realWorldAnalogy: 'Writing the full postal street address, city, state, and postal code of both sender and recipient on the envelope.',
    interviewInsight: 'Routers operate at Layer 3. They examine the destination IP, decrement TTL, recalculate checksum, and forward.'
  },
  {
    id: 2,
    name: 'Data Link Layer',
    shortName: 'L2: Data Link',
    pduName: 'Frame',
    color: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      accent: 'bg-amber-500',
      glow: 'shadow-amber-500/20'
    },
    addedHeader: {
      name: 'Ethernet II Frame Header',
      sizeBytes: 14,
      description: 'Hop-to-hop physical framing across immediate local area link',
      fields: [
        { name: 'Destination MAC', value: '00:1A:2B:44:55:66', bytes: 6, desc: 'Hardware address of NEXT-HOP gateway router' },
        { name: 'Source MAC', value: '74:83:C2:11:22:33', bytes: 6, desc: 'Hardware address of client network adapter' },
        { name: 'EtherType', value: '0x0800 (IPv4)', bytes: 2, desc: 'Indicates Layer 3 protocol payload' }
      ]
    },
    addedTrailer: {
      name: 'Frame Check Sequence (FCS)',
      sizeBytes: 4,
      description: 'Hardware cyclic redundancy check for detecting transmission bit errors',
      fields: [
        { name: 'CRC-32 Checksum', value: '0x49E82B10', bytes: 4, desc: 'Mathematical polynomial verifying zero corruption' }
      ]
    },
    coreResponsibility: 'Hop-to-hop frame delivery, MAC addressing, media access control (CSMA/CD / CA), and error detection via CRC-32 trailer.',
    realWorldAnalogy: 'Handing the mailbag to the specific postal delivery truck driver traveling on the immediate road segment.',
    interviewInsight: 'Switches operate at Layer 2. Notice that MAC addresses CHANGE at every router hop, while IP addresses remain constant!'
  },
  {
    id: 1,
    name: 'Physical Layer',
    shortName: 'L1: Physical',
    pduName: 'Bits (Signals)',
    color: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      accent: 'bg-rose-500',
      glow: 'shadow-rose-500/20'
    },
    coreResponsibility: 'Transmission of raw, unstructured bit streams over physical transmission media (voltages, light pulses, or RF radio waves).',
    realWorldAnalogy: 'The physical asphalt road, train tracks, or airwaves over which physical transportation occurs.',
    interviewInsight: 'Hubs and repeaters operate at Layer 1. There is no addressing or header interpretation at the physical layer.'
  }
];

const PRESET_PAYLOADS = [
  { label: 'HTTP GET Request', text: 'GET /index.html HTTP/1.1\r\nHost: example.com\r\nAccept: text/html' },
  { label: 'JSON REST API', text: '{"action":"login","user":"alice@mastery.edu"}' },
  { label: 'DNS Lookup Query', text: 'IN A? www.google.com (Recursion Desired: 1)' },
  { label: 'Custom Payload', text: 'Hello, World! Network Engineering from First Principles.' }
];

export const OSIEncapsulationVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = L7, 6 = L1
  const [direction, setDirection] = useState<'encapsulate' | 'decapsulate'>('encapsulate');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1400);
  const [selectedPayloadIndex, setSelectedPayloadIndex] = useState<number>(0);
  const [customPayload, setCustomPayload] = useState<string>(PRESET_PAYLOADS[0].text);
  const [selectedHeaderTab, setSelectedHeaderTab] = useState<'l2' | 'l3' | 'l4' | 'app'>('l4');
  const [copiedState, setCopiedState] = useState<boolean>(false);

  // Auto-play animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMs]);

  // Derived layer info
  // Step 0 = Layer 7, Step 1 = Layer 6 ... Step 6 = Layer 1
  const activeLayerIndex = direction === 'encapsulate' ? currentStep : 6 - currentStep;
  const activeLayer = OSI_LAYERS_DATA[activeLayerIndex];

  // Calculate packet composition sizes based on current step
  const payloadBytes = useMemo(() => {
    return new TextEncoder().encode(customPayload).length;
  }, [customPayload]);

  const packetBreakdown = useMemo(() => {
    // Check which headers are currently attached
    const isL7Present = direction === 'encapsulate' ? activeLayerIndex >= 0 : activeLayerIndex <= 0;
    const isL6Present = direction === 'encapsulate' ? activeLayerIndex >= 1 : activeLayerIndex <= 1;
    const isL5Present = direction === 'encapsulate' ? activeLayerIndex >= 2 : activeLayerIndex <= 2;
    const isL4Present = direction === 'encapsulate' ? activeLayerIndex >= 3 : activeLayerIndex <= 3;
    const isL3Present = direction === 'encapsulate' ? activeLayerIndex >= 4 : activeLayerIndex <= 4;
    const isL2Present = direction === 'encapsulate' ? activeLayerIndex >= 5 : activeLayerIndex <= 5;
    const isL1Active = activeLayerIndex === 6;

    let totalHeaderBytes = 0;
    if (isL7Present) totalHeaderBytes += 84;
    if (isL6Present) totalHeaderBytes += 21;
    if (isL5Present) totalHeaderBytes += 12;
    if (isL4Present) totalHeaderBytes += 20; // TCP
    if (isL3Present) totalHeaderBytes += 20; // IPv4
    if (isL2Present) totalHeaderBytes += 18; // Ethernet 14B + FCS 4B

    const totalPacketSize = payloadBytes + totalHeaderBytes;
    const overheadPercentage = Math.round((totalHeaderBytes / totalPacketSize) * 100);

    return {
      isL7Present,
      isL6Present,
      isL5Present,
      isL4Present,
      isL3Present,
      isL2Present,
      isL1Active,
      totalHeaderBytes,
      totalPacketSize,
      overheadPercentage
    };
  }, [activeLayerIndex, direction, payloadBytes]);

  const handleCopyBitstream = () => {
    const fakeBits = '01000111 01000101 01010100 00100000 00101111 01101001 01101110 01100100 01100101 01111000 00101110 01101000 01110100 01101101 01101100';
    navigator.clipboard.writeText(fakeBits);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl max-w-6xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Interactive Simulator</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">PDU Encapsulation & Decapsulation</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">OSI Encapsulation Visualizer</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Animate how user messages descend the 7 OSI layers, wrapping headers and trailers into transport segments,
            network packets, data-link frames, and physical bit pulses.
          </p>
        </div>

        {/* Direction Switch & Speed */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Direction Pill */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setDirection('encapsulate');
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                direction === 'encapsulate'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Encapsulation (Tx)</span>
            </button>
            <button
              onClick={() => {
                setDirection('decapsulate');
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                direction === 'decapsulate'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Decapsulation (Rx)</span>
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setSpeedMs(2000)}
              className={`px-1.5 py-0.5 rounded ${speedMs === 2000 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeedMs(1400)}
              className={`px-1.5 py-0.5 rounded ${speedMs === 1400 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMs(800)}
              className={`px-1.5 py-0.5 rounded ${speedMs === 800 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizer Area: Two-Column Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Interactive 7-Layer OSI Architecture Diagram */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              OSI LAYERED STACK
            </span>
            <span>
              STEP {currentStep + 1} OF 7 ({direction === 'encapsulate' ? 'DOWNWARD' : 'UPWARD'})
            </span>
          </div>

          {/* The Stack */}
          <div className="relative space-y-2">
            {/* Active Moving Marker Indicator */}
            <div
              className="absolute -left-2 w-1 rounded-r transition-all duration-300 ease-out bg-sky-400 shadow-md shadow-sky-400/50"
              style={{
                top: `${activeLayerIndex * 54 + 6}px`,
                height: '40px'
              }}
            />

            {OSI_LAYERS_DATA.map((layer, idx) => {
              const isCurrent = idx === activeLayerIndex;
              const isProcessed =
                direction === 'encapsulate' ? idx <= activeLayerIndex : idx >= activeLayerIndex;

              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setCurrentStep(direction === 'encapsulate' ? idx : 6 - idx);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between group ${
                    isCurrent
                      ? `${layer.color.border} ${layer.color.bg} ring-1 ring-offset-1 ring-offset-slate-950 ${layer.color.text} shadow-lg shadow-black/40`
                      : isProcessed
                      ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      : 'border-slate-800/40 bg-slate-950/40 text-slate-500 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-all ${
                        isCurrent
                          ? `${layer.color.accent} text-white shadow-sm`
                          : isProcessed
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      L{layer.id}
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                        {layer.name}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        PDU: <span className={layer.color.text}>{layer.pduName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Header / PDU pill */}
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isCurrent
                          ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                          : 'border-transparent text-slate-500'
                      }`}
                    >
                      {layer.id === 1
                        ? '0101 Bits'
                        : layer.id === 2
                        ? '+MAC / FCS'
                        : layer.id === 3
                        ? '+IPv4 (20B)'
                        : layer.id === 4
                        ? '+TCP (20B)'
                        : layer.id === 6
                        ? '+TLS (21B)'
                        : 'Payload'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Playback Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentStep((prev) => Math.max(0, prev - 1));
                  setIsPlaying(false);
                }}
                disabled={currentStep === 0}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs"
                title="Previous Layer"
                aria-label="Previous Layer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                aria-label={isPlaying ? 'Pause Animation' : 'Play Animation'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Animate
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentStep((prev) => Math.min(6, prev + 1));
                  setIsPlaying(false);
                }}
                disabled={currentStep === 6}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs"
                title="Next Layer"
                aria-label="Next Layer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className="p-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Reset Stack"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Visual Packet Construction & Deep Layer Dissection */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Layer Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                  {direction === 'encapsulate' ? 'TRANSMITTING HOST (TX)' : 'RECEIVING HOST (RX)'} • LAYER {activeLayer.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeLayer.name}</h3>
              </div>
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-400 font-semibold">
                PDU: {activeLayer.pduName}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeLayer.coreResponsibility}</p>

            {/* Quick Context Analogy */}
            <div className="mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-amber-300">Real-World Analogy: </span>
                {activeLayer.realWorldAnalogy}
              </div>
            </div>
          </div>

          {/* Visual Container: Dynamic Encapsulated Packet Construction */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>DYNAMIC FRAME CONSTRUCTION (LAYER {activeLayer.id})</span>
              </span>
              <span className="text-emerald-400">
                Total PDU: {packetBreakdown.totalPacketSize} Bytes ({packetBreakdown.overheadPercentage}% Header Overhead)
              </span>
            </div>

            {/* If at Physical Layer (L1), show signal bit stream with wave */}
            {activeLayer.id === 1 ? (
              <div className="border border-rose-500/40 bg-rose-950/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-rose-400 font-semibold flex items-center gap-1.5">
                    <Radio className="w-4 h-4 animate-pulse" />
                    Physical Bit Stream (PAM-5 / 1000BASE-T Signal Pulses)
                  </span>
                  <button
                    onClick={handleCopyBitstream}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
                  >
                    {copiedState ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedState ? 'Copied' : 'Copy Bits'}</span>
                  </button>
                </div>

                <div className="font-mono text-xs tracking-widest text-rose-300 bg-slate-900/90 p-3 rounded border border-rose-900/40 break-all leading-loose">
                  01001111 01010011 01001001 00100000 01000101 01101110 01100011 01100001 01110000 01110011 01110101 01101100 01100001 01110100 01101001 01101111 01101110 00100000 01000011 01101111 01101101 01110000 01101100 01100101 01110100 01100101
                </div>

                {/* Simulated Signal Waveform */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Voltage Level: +2.5V (Logic 1) / -2.5V (Logic 0)</span>
                  <span>Modulation: Differential Manchester</span>
                </div>
              </div>
            ) : (
              /* The Nested Packet Frame */
              <div className="border border-slate-700/80 rounded-lg p-3 bg-slate-900/60 overflow-x-auto">
                <div className="flex items-stretch gap-1.5 min-w-[580px] text-xs font-mono select-none">
                  {/* L2 MAC Header */}
                  {packetBreakdown.isL2Present && (
                    <button
                      onClick={() => setSelectedHeaderTab('l2')}
                      className={`px-3 py-2.5 rounded border flex flex-col items-center justify-center shrink-0 transition-all ${
                        selectedHeaderTab === 'l2'
                          ? 'bg-amber-900/60 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                          : 'bg-amber-950/40 border-amber-700/60 text-amber-300 hover:bg-amber-900/40'
                      }`}
                    >
                      <span className="font-bold">L2 Ethernet</span>
                      <span className="text-[10px] text-amber-400/80">14 Bytes</span>
                      <span className="text-[9px] text-amber-300/70">MAC Addr</span>
                    </button>
                  )}

                  {/* L3 IP Header */}
                  {packetBreakdown.isL3Present && (
                    <button
                      onClick={() => setSelectedHeaderTab('l3')}
                      className={`px-3 py-2.5 rounded border flex flex-col items-center justify-center shrink-0 transition-all ${
                        selectedHeaderTab === 'l3'
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                          : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/40'
                      }`}
                    >
                      <span className="font-bold">L3 IPv4</span>
                      <span className="text-[10px] text-emerald-400/80">20 Bytes</span>
                      <span className="text-[9px] text-emerald-300/70">Src/Dst IP</span>
                    </button>
                  )}

                  {/* L4 TCP Header */}
                  {packetBreakdown.isL4Present && (
                    <button
                      onClick={() => setSelectedHeaderTab('l4')}
                      className={`px-3 py-2.5 rounded border flex flex-col items-center justify-center shrink-0 transition-all ${
                        selectedHeaderTab === 'l4'
                          ? 'bg-blue-900/60 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                          : 'bg-blue-950/40 border-blue-700/60 text-blue-300 hover:bg-blue-900/40'
                      }`}
                    >
                      <span className="font-bold">L4 TCP</span>
                      <span className="text-[10px] text-blue-400/80">20 Bytes</span>
                      <span className="text-[9px] text-blue-300/70">Port 443</span>
                    </button>
                  )}

                  {/* Application Payload (Center Body) */}
                  <button
                    onClick={() => setSelectedHeaderTab('app')}
                    className={`flex-1 p-2.5 rounded border flex flex-col items-center justify-center text-center transition-all ${
                      selectedHeaderTab === 'app'
                        ? 'bg-violet-900/60 border-violet-500 text-violet-200 ring-1 ring-violet-500'
                        : 'bg-violet-950/40 border-violet-700/60 text-violet-300 hover:bg-violet-900/40'
                    }`}
                  >
                    <span className="font-bold">Application Payload</span>
                    <span className="text-[10px] text-violet-400/90 font-mono truncate max-w-[200px]">
                      {customPayload.replace(/\r?\n/g, ' ')}
                    </span>
                    <span className="text-[9px] text-violet-300/70">{payloadBytes} Bytes</span>
                  </button>

                  {/* L2 FCS Trailer */}
                  {packetBreakdown.isL2Present && (
                    <button
                      onClick={() => setSelectedHeaderTab('l2')}
                      className={`px-3 py-2.5 rounded border flex flex-col items-center justify-center shrink-0 transition-all ${
                        selectedHeaderTab === 'l2'
                          ? 'bg-amber-900/60 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                          : 'bg-amber-950/40 border-amber-700/60 text-amber-300 hover:bg-amber-900/40'
                      }`}
                    >
                      <span className="font-bold">L2 FCS</span>
                      <span className="text-[10px] text-amber-400/80">4 Bytes</span>
                      <span className="text-[9px] text-amber-300/70">CRC-32</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Deep Header Dissector Tabs */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-400 uppercase">INSPECT HEADER FIELDS:</span>
                <button
                  onClick={() => setSelectedHeaderTab('l4')}
                  className={`px-2.5 py-1 rounded ${selectedHeaderTab === 'l4' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  L4 TCP (20B)
                </button>
                <button
                  onClick={() => setSelectedHeaderTab('l3')}
                  className={`px-2.5 py-1 rounded ${selectedHeaderTab === 'l3' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  L3 IPv4 (20B)
                </button>
                <button
                  onClick={() => setSelectedHeaderTab('l2')}
                  className={`px-2.5 py-1 rounded ${selectedHeaderTab === 'l2' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  L2 Ethernet (18B)
                </button>
                <button
                  onClick={() => setSelectedHeaderTab('app')}
                  className={`px-2.5 py-1 rounded ${selectedHeaderTab === 'app' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Payload Data
                </button>
              </div>
            </div>

            {/* Field breakdown table */}
            {selectedHeaderTab === 'l4' && (
              <div className="space-y-2">
                <div className="text-xs text-blue-300 font-mono flex items-center justify-between">
                  <span>TCP Transmission Control Protocol Header Fields:</span>
                  <span className="text-slate-500">RFC 793 / 9293</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {OSI_LAYERS_DATA[3].addedHeader?.fields.map((field, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-blue-400 font-semibold">
                        <span>{field.name}</span>
                        <span className="text-slate-500">{field.bytes}B</span>
                      </div>
                      <div className="text-slate-200 font-bold mt-0.5">{field.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{field.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHeaderTab === 'l3' && (
              <div className="space-y-2">
                <div className="text-xs text-emerald-300 font-mono flex items-center justify-between">
                  <span>IPv4 Internet Protocol Header Fields:</span>
                  <span className="text-slate-500">RFC 791</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {OSI_LAYERS_DATA[4].addedHeader?.fields.map((field, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>{field.name}</span>
                        <span className="text-slate-500">{field.bytes}B</span>
                      </div>
                      <div className="text-slate-200 font-bold mt-0.5">{field.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{field.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHeaderTab === 'l2' && (
              <div className="space-y-2">
                <div className="text-xs text-amber-300 font-mono flex items-center justify-between">
                  <span>Ethernet II Framing & Trailer Fields:</span>
                  <span className="text-slate-500">IEEE 802.3</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {OSI_LAYERS_DATA[5].addedHeader?.fields.map((field, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-amber-400 font-semibold">
                        <span>{field.name}</span>
                        <span className="text-slate-500">{field.bytes}B</span>
                      </div>
                      <div className="text-slate-200 font-bold mt-0.5">{field.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{field.desc}</div>
                    </div>
                  ))}
                  {OSI_LAYERS_DATA[5].addedTrailer?.fields.map((field, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-amber-900/60">
                      <div className="flex justify-between text-amber-400 font-semibold">
                        <span>{field.name} (Trailer)</span>
                        <span className="text-slate-500">{field.bytes}B</span>
                      </div>
                      <div className="text-amber-300 font-bold mt-0.5">{field.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{field.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHeaderTab === 'app' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-violet-300 font-mono">Configure Custom Application Payload:</span>
                  <div className="flex gap-1">
                    {PRESET_PAYLOADS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedPayloadIndex(idx);
                          setCustomPayload(preset.text);
                        }}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          selectedPayloadIndex === idx
                            ? 'bg-violet-600 border-violet-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-500"
                  placeholder="Type any custom text or JSON..."
                />
              </div>
            )}
          </div>

          {/* IIT & System Engineering Interview Insight */}
          <div className="bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-800/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Engineering & Interview Note</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeLayer.interviewInsight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSIEncapsulationVisualizer;
