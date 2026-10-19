import React, { useState } from 'react';
import { Send, Globe, Shield, Server, FileText, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface RequestPhase {
  id: number;
  name: string;
  shortDesc: string;
  durationMs: number;
  details: Record<string, string>;
  icon: any;
}

export const HTTPRequestSimulator: React.FC = () => {
  const [url, setUrl] = useState<string>('https://api.networkmastery.io/v1/status');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [statusCode, setStatusCode] = useState<200 | 201 | 301 | 404 | 500>(200);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const phases: RequestPhase[] = [
    {
      id: 1,
      name: '1. URL Parsing & HSTS Check',
      shortDesc: 'Browser parses protocol (https), hostname, port (443), and checks HTTP Strict Transport Security preload list.',
      durationMs: 2,
      details: {
        Protocol: 'HTTPS (Port 443)',
        Host: 'api.networkmastery.io',
        Path: '/v1/status',
        HSTS: 'Enabled (Force HTTPS)',
      },
      icon: Globe,
    },
    {
      id: 2,
      name: '2. DNS Resolution',
      shortDesc: 'Resolves hostname to IP address via local OS stub resolver and recursive DNS server.',
      durationMs: 14,
      details: {
        Queried: 'api.networkmastery.io',
        ResolvedIP: '104.21.48.12',
        RecordType: 'A (IPv4)',
        TTL: '300s',
      },
      icon: Globe,
    },
    {
      id: 3,
      name: '3. TCP 3-Way Handshake',
      shortDesc: 'Establishes full-duplex TCP byte-stream connection to server IP on port 443.',
      durationMs: 28,
      details: {
        'Step 1': 'Client -> SYN (Seq=1000)',
        'Step 2': 'Server -> SYN-ACK (Seq=5000, Ack=1001)',
        'Step 3': 'Client -> ACK (Seq=1001, Ack=5001)',
        Status: 'ESTABLISHED',
      },
      icon: Server,
    },
    {
      id: 4,
      name: '4. TLS 1.3 Cryptographic Handshake',
      shortDesc: 'Authenticates server certificate via X.509 PKI chain and derives symmetric AES-256-GCM session keys.',
      durationMs: 32,
      details: {
        CipherSuite: 'TLS_AES_256_GCM_SHA384',
        KeyExchange: 'ECDHE (Curve25519)',
        Certificate: 'Issued by Let\'s Encrypt Authority X3',
        ALPN: 'h2 (HTTP/2 negotiated)',
      },
      icon: Shield,
    },
    {
      id: 5,
      name: '5. HTTP Request Dispatch',
      shortDesc: 'Encrypted HTTP/2 request frame serialized and transmitted across the socket.',
      durationMs: 8,
      details: {
        Method: method,
        Path: '/v1/status',
        'User-Agent': 'Mozilla/5.0 NetworkMastery/2026',
        Accept: 'application/json',
      },
      icon: Send,
    },
    {
      id: 6,
      name: '6. Server Processing & Reverse Proxy',
      shortDesc: 'Edge CDN / Nginx reverse proxy routes request to internal API microservice, queries database, and builds response.',
      durationMs: 45,
      details: {
        Gateway: 'Envoy / Nginx 1.25',
        Upstream: 'api-service-prod:8080',
        DBLatency: '12ms',
        Compression: 'gzip',
      },
      icon: Server,
    },
    {
      id: 7,
      name: '7. HTTP Response & Rendering',
      shortDesc: `Server returns HTTP status ${statusCode}. Browser parses JSON payload and triggers state update.`,
      durationMs: 12,
      details: {
        Status: `${statusCode} ${statusCode === 200 ? 'OK' : statusCode === 404 ? 'Not Found' : 'Error'}`,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'max-age=60, public',
        'Payload Size': '412 Bytes',
      },
      icon: FileText,
    },
  ];

  const triggerSimulation = () => {
    setIsSimulating(true);
    setActivePhaseIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= phases.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActivePhaseIndex(current);
      }
    }, 1200);
  };

  const activePhase = phases[activePhaseIndex];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Globe className="w-4 h-4" /> Full-Stack Request Pipeline
          </div>
          <h2 className="text-xl font-bold text-white mt-1">HTTP Request Lifecycle Simulator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Trace what happens from typing a URL through DNS, TCP handshake, TLS 1.3 encryption, server gateway, and DOM rendering.
          </p>
        </div>

        {/* Status Code Config */}
        <div className="flex items-center gap-2">
          <label htmlFor="sim-response-code" className="text-xs font-mono text-slate-400">Simulate Response:</label>
          <select
            id="sim-response-code"
            value={statusCode}
            onChange={(e) => setStatusCode(Number(e.target.value) as any)}
            className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-emerald-400 font-bold focus:outline-none"
          >
            <option value={200}>200 OK</option>
            <option value={201}>201 Created</option>
            <option value={301}>301 Moved Permanently</option>
            <option value={404}>404 Not Found</option>
            <option value={500}>500 Internal Error</option>
          </select>
        </div>
      </div>

      {/* Browser Address Bar */}
      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 mb-6">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          aria-label="HTTP Method"
          className="bg-slate-900 border border-slate-700 text-sky-400 text-xs font-mono font-bold rounded-lg px-3 py-1.5 focus:outline-none"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={url}
            aria-label="Target Request URL"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          onClick={triggerSimulation}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> {isSimulating ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {phases.map((p, idx) => {
          const isDone = idx < activePhaseIndex;
          const isCurrent = idx === activePhaseIndex;
          return (
            <button
              key={p.id}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isCurrent
                  ? 'border-sky-500 bg-sky-950/60 ring-1 ring-sky-500/50 text-white'
                  : isDone
                  ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">STAGE {p.id}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">{p.durationMs}ms</span>
                )}
              </div>
              <div className="text-xs font-semibold truncate">{p.name.split('. ')[1]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase">Phase {activePhase.id} of 7</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{activePhase.name}</h3>
          </div>
          <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Estimated Latency: <strong className="text-emerald-400">{activePhase.durationMs} ms</strong>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-5 leading-relaxed">{activePhase.shortDesc}</p>

        {/* Phase Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mb-4">
          {Object.entries(activePhase.details).map(([key, val]) => (
            <div key={key} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{key}:</span>
              <span className="text-sky-300 font-bold">{val}</span>
            </div>
          ))}
        </div>

        {/* Payload / Response Preview */}
        {activePhase.id === 7 && (
          <div className="mt-4 p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 uppercase mb-2">Simulated JSON Response Body:</div>
            <pre className="text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded">
              {JSON.stringify(
                statusCode === 200
                  ? { status: 'healthy', version: '2.4.0', cluster: 'us-east-1', uptimeSeconds: 948123 }
                  : statusCode === 404
                  ? { error: 'Not Found', message: 'Resource does not exist' }
                  : { error: 'Internal Server Error', code: 500 },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
