import React, { useState } from 'react';
import { Search, Globe, Database, Server, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

interface DNSStep {
  step: number;
  from: string;
  to: string;
  queryType: string;
  queryTarget: string;
  response: string;
  isReferral: boolean;
  explanation: string;
}

const SAMPLE_DOMAINS: Record<string, { ip: string; ipv6: string; cname?: string; mx: string; ttl: number }> = {
  'algomaster.io': { ip: '104.21.48.12', ipv6: '2606:4700:3031::6815:300c', mx: 'mail.algomaster.io (Priority 10)', ttl: 300 },
  'google.com': { ip: '142.250.190.46', ipv6: '2a00:1450:4009:822::200e', mx: 'smtp.google.com (Priority 1)', ttl: 300 },
  'github.com': { ip: '140.82.121.4', ipv6: '2606:50c0:8000::2', mx: 'aspmx.l.google.com (Priority 5)', ttl: 60 },
  'wikipedia.org': { ip: '208.80.154.224', ipv6: '2620:0:861:ed1a::1', mx: 'mx1001.wikimedia.org (Priority 10)', ttl: 600 },
};

export const DNSVisualizer: React.FC = () => {
  const [domainInput, setDomainInput] = useState<string>('algomaster.io');
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'MX' | 'NS' | 'CNAME' | 'TXT'>('A');
  const [isCached, setIsCached] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const domain = domainInput.trim().toLowerCase();
  const domainData = SAMPLE_DOMAINS[domain] || {
    ip: '93.184.216.34',
    ipv6: '2606:2800:220:1:248:1893:25c8:1946',
    mx: `mail.${domain} (Priority 10)`,
    ttl: 300,
  };

  const tld = domain.split('.').pop() || 'com';

  const steps: DNSStep[] = isCached
    ? [
        {
          step: 1,
          from: 'Client Browser',
          to: 'Local DNS Cache',
          queryType: recordType,
          queryTarget: domain,
          response: domainData.ip,
          isReferral: false,
          explanation: `Cache HIT! The record for ${domain} was found in the browser/OS local resolver cache. Zero external network latency (0 ms RTT).`,
        },
      ]
    : [
        {
          step: 1,
          from: 'Browser / OS Stub',
          to: 'Recursive Resolver (e.g. 1.1.1.1 / 8.8.8.8)',
          queryType: recordType,
          queryTarget: domain,
          response: 'Searching...',
          isReferral: false,
          explanation: `Client asks its configured ISP or public recursive resolver to resolve ${domain}.`,
        },
        {
          step: 2,
          from: 'Recursive Resolver',
          to: 'Root DNS Server (.)',
          queryType: recordType,
          queryTarget: domain,
          response: `Referral to .${tld} TLD Servers`,
          isReferral: true,
          explanation: `The Root server does not know the final IP. It examines the ending .${tld} and responds with a referral to the official .${tld} Top-Level Domain (TLD) servers.`,
        },
        {
          step: 3,
          from: 'Recursive Resolver',
          to: `.${tld} TLD Server`,
          queryType: recordType,
          queryTarget: domain,
          response: `Referral to Authoritative Nameserver (ns1.${domain})`,
          isReferral: true,
          explanation: `The .${tld} TLD registry server inspects the domain and refers the resolver to the authoritative nameservers delegated by the domain registrar.`,
        },
        {
          step: 4,
          from: 'Recursive Resolver',
          to: `Authoritative Server (ns1.${domain})`,
          queryType: recordType,
          queryTarget: domain,
          response:
            recordType === 'A'
              ? domainData.ip
              : recordType === 'AAAA'
              ? domainData.ipv6
              : recordType === 'MX'
              ? domainData.mx
              : `v=spf1 include:_spf.${domain} ~all`,
          isReferral: false,
          explanation: `The Authoritative server holds the master DNS zone file! It returns the authentic answer with a TTL of ${domainData.ttl} seconds.`,
        },
        {
          step: 5,
          from: 'Recursive Resolver',
          to: 'Client Browser',
          queryType: recordType,
          queryTarget: domain,
          response: domainData.ip,
          isReferral: false,
          explanation: `Recursive resolver caches the record locally for ${domainData.ttl}s and returns the resolved ${recordType} record to the client.`,
        },
      ];

  const currentStep = steps[Math.min(activeStepIndex, steps.length - 1)];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Globe className="w-4 h-4" /> Application Layer Protocol Engine
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Hierarchical DNS Resolution Visualizer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Trace iterative queries from the Browser through Recursive Resolvers, Root (.), TLD (.com/.io), and Authoritative Nameservers.
          </p>
        </div>

        {/* Cache Hit Toggle */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => {
              setIsCached(false);
              setActiveStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              !isCached ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cold Cache (Full Resolution)
          </button>
          <button
            onClick={() => {
              setIsCached(true);
              setActiveStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              isCached ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hot Cache (0ms Hit)
          </button>
        </div>
      </div>

      {/* Domain & Record Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 mb-6 text-xs font-mono">
        <div className="sm:col-span-8">
          <label htmlFor="dns-domain-input" className="block text-slate-400 mb-1.5">Query Domain Name (FQDN):</label>
          <div className="relative">
            <input
              id="dns-domain-input"
              type="text"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                setActiveStepIndex(0);
              }}
              placeholder="e.g. algomaster.io"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="dns-record-type" className="block text-slate-400 mb-1.5">Record Type:</label>
          <select
            id="dns-record-type"
            value={recordType}
            onChange={(e) => {
              setRecordType(e.target.value as any);
              setActiveStepIndex(0);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sky-400 font-bold focus:outline-none"
          >
            <option value="A">A (IPv4 Address)</option>
            <option value="AAAA">AAAA (IPv6 Address)</option>
            <option value="MX">MX (Mail Exchange)</option>
            <option value="NS">NS (Name Server)</option>
            <option value="CNAME">CNAME (Alias)</option>
            <option value="TXT">TXT (Verification / SPF)</option>
          </select>
        </div>
      </div>

      {/* Visual Hierarchy Nodes */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center mb-6">
          <div className={`p-3 rounded-lg border transition-all ${currentStep.from.includes('Browser') || currentStep.to.includes('Browser') ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold">1. Browser / Client</div>
            <div className="text-[10px] font-mono text-slate-500">Stub Resolver</div>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${currentStep.from.includes('Recursive') || currentStep.to.includes('Recursive') ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold">2. Recursive Resolver</div>
            <div className="text-[10px] font-mono text-slate-500">1.1.1.1 / 8.8.8.8</div>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${currentStep.from.includes('Root') || currentStep.to.includes('Root') ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-purple-400">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold">3. Root Server (.)</div>
            <div className="text-[10px] font-mono text-slate-500">13 Global Anycast Clusters</div>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${currentStep.from.includes('TLD') || currentStep.to.includes('TLD') ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold">4. TLD Server</div>
            <div className="text-[10px] font-mono text-slate-500">.{tld} Registry</div>
          </div>

          <div className={`p-3 rounded-lg border transition-all ${currentStep.from.includes('Authoritative') || currentStep.to.includes('Authoritative') ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-rose-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold">5. Authoritative</div>
            <div className="text-[10px] font-mono text-slate-500">ns1.{domain}</div>
          </div>
        </div>

        {/* Current Step Activity Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-sky-400 font-bold">
              STEP {currentStep.step} OF {steps.length}
            </span>
            <span className="text-slate-400">
              {currentStep.from} → {currentStep.to}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-500">Query: </span>
              <span className="text-white font-bold">{currentStep.queryType} {currentStep.queryTarget}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-500">Result: </span>
              <span className="text-emerald-400 font-bold">{currentStep.response}</span>
            </div>
          </div>

          <p className="text-slate-300 font-sans text-sm leading-relaxed">
            {currentStep.explanation}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeStepIndex === 0}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-medium text-slate-200 border border-slate-700"
        >
          Previous Step
        </button>

        <div className="text-xs font-mono text-slate-400">
          Resolution Phase {activeStepIndex + 1} / {steps.length}
        </div>

        <button
          onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={activeStepIndex === steps.length - 1}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-lg text-xs font-medium text-white shadow-sm"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
