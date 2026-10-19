import React, { useState } from 'react';
import { calculateSubnet, calculateVLSM, SubnetResult, VLSMAllocation } from '../../utils/networkMath';
import { Network, Plus, Trash2, Binary, Check, RefreshCw } from 'lucide-react';

export const SubnetCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'vlsm' | 'practice'>('calculator');

  // Calculator State
  const [ipInput, setIpInput] = useState<string>('192.168.1.105');
  const [prefixInput, setPrefixInput] = useState<number>(24);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // VLSM State
  const [vlsmBaseIp, setVlsmBaseIp] = useState<string>('192.168.1.0');
  const [vlsmBasePrefix, setVlsmBasePrefix] = useState<number>(24);
  const [vlsmDepts, setVlsmDepts] = useState<Array<{ id: string; name: string; hostsNeeded: number }>>([
    { id: '1', name: 'Engineering', hostsNeeded: 60 },
    { id: '2', name: 'Sales & Marketing', hostsNeeded: 25 },
    { id: '3', name: 'Finance', hostsNeeded: 12 },
    { id: '4', name: 'Router P2P Link', hostsNeeded: 2 },
  ]);
  const [vlsmResults, setVlsmResults] = useState<VLSMAllocation[] | null>(null);
  const [vlsmError, setVlsmError] = useState<string | null>(null);

  // Practice State
  const [practiceQuestion, setPracticeQuestion] = useState<{
    ip: string;
    prefix: number;
    expectedNetwork: string;
    expectedBroadcast: string;
    expectedUsable: number;
  }>({
    ip: '172.16.50.130',
    prefix: 26,
    expectedNetwork: '172.16.50.128',
    expectedBroadcast: '172.16.50.191',
    expectedUsable: 62,
  });
  const [userNetworkAns, setUserNetworkAns] = useState<string>('');
  const [userBroadcastAns, setUserBroadcastAns] = useState<string>('');
  const [practiceChecked, setPracticeChecked] = useState<boolean>(false);

  // Compute standard subnet safely
  let subnetResult: SubnetResult | null = null;
  try {
    subnetResult = calculateSubnet(ipInput, prefixInput);
  } catch (err: any) {
    if (!errorMsg) setErrorMsg(err.message);
  }

  const handleIpChange = (val: string) => {
    setIpInput(val);
    setErrorMsg(null);
  };

  const handlePrefixChange = (val: number) => {
    setPrefixInput(val);
    setErrorMsg(null);
  };

  const runVlsmCalculation = () => {
    try {
      setVlsmError(null);
      const res = calculateVLSM(vlsmBaseIp, vlsmBasePrefix, vlsmDepts);
      setVlsmResults(res);
    } catch (err: any) {
      setVlsmError(err.message);
      setVlsmResults(null);
    }
  };

  const generateNewPractice = () => {
    const prefixes = [25, 26, 27, 28, 29, 30];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const octet4 = Math.floor(Math.random() * 254) + 1;
    const ip = `10.20.30.${octet4}`;
    const sub = calculateSubnet(ip, prefix);
    setPracticeQuestion({
      ip,
      prefix,
      expectedNetwork: sub.networkAddress,
      expectedBroadcast: sub.broadcastAddress,
      expectedUsable: sub.usableHosts,
    });
    setUserNetworkAns('');
    setUserBroadcastAns('');
    setPracticeChecked(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Network className="w-4 h-4" /> IPv4 & CIDR Engineering Workbench
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Subnetting & VLSM Calculator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time binary conversions, RFC 3021 /31 point-to-point support, host capacity, and Variable Length Subnet Masking.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'calculator' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CIDR Calculator
          </button>
          <button
            onClick={() => {
              setActiveTab('vlsm');
              if (!vlsmResults) runVlsmCalculation();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'vlsm' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VLSM Allocator
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'practice' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Drills
          </button>
        </div>
      </div>

      {/* TAB 1: CIDR CALCULATOR */}
      {activeTab === 'calculator' && (
        <div>
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 mb-6">
            <div className="md:col-span-6">
              <label htmlFor="ipv4-input-field" className="block text-xs font-mono text-slate-400 mb-1.5">IPv4 Address:</label>
              <input
                id="ipv4-input-field"
                type="text"
                value={ipInput}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="e.g. 192.168.1.105"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <label htmlFor="prefix-slider-input">CIDR Prefix Length:</label>
                <span className="text-sky-400 font-bold">/{prefixInput}</span>
              </div>
              <input
                id="prefix-slider-input"
                type="range"
                min="0"
                max="32"
                value={prefixInput}
                onChange={(e) => handlePrefixChange(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>/0 (Internet)</span>
                <span>/8 (Class A)</span>
                <span>/16 (Class B)</span>
                <span>/24 (Class C)</span>
                <span>/30 (P2P)</span>
                <span>/32 (Host)</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 mb-6 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono rounded-lg">
              Error: {errorMsg}
            </div>
          )}

          {subnetResult && (
            <div className="space-y-6">
              {/* Quick Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Subnet Mask</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">{subnetResult.netmask}</div>
                  <div className="text-[10px] font-mono text-slate-500">/{subnetResult.prefix}</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Usable Hosts</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {subnetResult.usableHosts.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Total: {subnetResult.totalAddresses.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Address Class</div>
                  <div className="text-base font-bold text-sky-400 font-mono mt-0.5">{subnetResult.ipClass}</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {subnetResult.isPrivate ? 'RFC 1918 Private' : 'Public IP'}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Wildcard Mask</div>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{subnetResult.wildcardMask}</div>
                  <div className="text-[10px] font-mono text-slate-500">Inverted mask</div>
                </div>
              </div>

              {/* Special Case Alerts */}
              {subnetResult.isSpecialP2P && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/60 rounded-lg text-xs text-amber-300 font-mono leading-relaxed">
                  💡 <strong>RFC 3021 Point-to-Point Link (/31):</strong> Both addresses ({subnetResult.networkAddress} and {subnetResult.broadcastAddress}) are valid usable host addresses. No dedicated broadcast address is reserved.
                </div>
              )}
              {subnetResult.isHostRoute && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-600/60 rounded-lg text-xs text-indigo-300 font-mono leading-relaxed">
                  💡 <strong>Host Route (/32):</strong> Represents a single unique IP host. No network or broadcast address. Used for Loopback interfaces and host-specific firewall routing.
                </div>
              )}

              {/* Detailed IP Address Ranges */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
                  Subnet Boundaries & Allocation Range
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Network Address:</span>
                    <span className="text-sky-400 font-bold text-sm">{subnetResult.networkAddress}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Broadcast Address:</span>
                    <span className="text-rose-400 font-bold text-sm">{subnetResult.broadcastAddress}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">First Usable Host IP:</span>
                    <span className="text-emerald-400 font-bold text-sm">{subnetResult.firstUsableIp}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Last Usable Host IP:</span>
                    <span className="text-emerald-400 font-bold text-sm">{subnetResult.lastUsableIp}</span>
                  </div>
                </div>
              </div>

              {/* 32-Bit Binary Breakdown */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Binary className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    32-Bit Binary Breakdown (Network vs Host Bits)
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono overflow-x-auto">
                  <div>
                    <div className="text-slate-400 mb-1">IP Address Binary:</div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 tracking-widest text-slate-200">
                      {subnetResult.binaryIp}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Subnet Mask Binary ({subnetResult.prefix} Network 1s, {32 - subnetResult.prefix} Host 0s):</div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 tracking-widest">
                      <span className="text-sky-400 font-bold">
                        {subnetResult.binaryMask.slice(0, subnetResult.prefix + Math.floor(subnetResult.prefix / 8))}
                      </span>
                      <span className="text-slate-500">
                        {subnetResult.binaryMask.slice(subnetResult.prefix + Math.floor(subnetResult.prefix / 8))}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Network ID Binary (Bitwise AND):</div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 tracking-widest text-emerald-400 font-bold">
                      {subnetResult.binaryNetwork}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VLSM ALLOCATOR */}
      {activeTab === 'vlsm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="md:col-span-6">
              <label htmlFor="vlsm-base-network" className="block text-xs font-mono text-slate-400 mb-1.5">Base Major Network:</label>
              <input
                id="vlsm-base-network"
                type="text"
                value={vlsmBaseIp}
                onChange={(e) => setVlsmBaseIp(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-6">
              <label htmlFor="vlsm-base-prefix" className="block text-xs font-mono text-slate-400 mb-1.5">Major Prefix:</label>
              <input
                id="vlsm-base-prefix"
                type="number"
                min="8"
                max="30"
                value={vlsmBasePrefix}
                onChange={(e) => setVlsmBasePrefix(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Department List */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Subnet Requirements (Host Capacity Needed)
              </h3>
              <button
                onClick={() =>
                  setVlsmDepts([
                    ...vlsmDepts,
                    { id: String(Date.now()), name: `Subnet ${vlsmDepts.length + 1}`, hostsNeeded: 10 },
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-medium text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Subnet
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {vlsmDepts.map((dept, index) => (
                <div key={dept.id} className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs font-mono text-slate-500 w-6">#{index + 1}</span>
                  <input
                    type="text"
                    value={dept.name}
                    aria-label={`Subnet ${index + 1} Name`}
                    onChange={(e) => {
                      const updated = [...vlsmDepts];
                      updated[index].name = e.target.value;
                      setVlsmDepts(updated);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                    placeholder="Department or Link Name"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Hosts:</span>
                    <input
                      type="number"
                      min="1"
                      value={dept.hostsNeeded}
                      aria-label={`Subnet ${index + 1} Hosts Needed`}
                      onChange={(e) => {
                        const updated = [...vlsmDepts];
                        updated[index].hostsNeeded = Number(e.target.value) || 1;
                        setVlsmDepts(updated);
                      }}
                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-sky-400 font-bold focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setVlsmDepts(vlsmDepts.filter((_, i) => i !== index))}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove Subnet"
                    aria-label={`Remove Subnet ${dept.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={runVlsmCalculation}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              Calculate VLSM Allocation Table
            </button>
          </div>

          {vlsmError && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono rounded-lg">
              VLSM Error: {vlsmError}
            </div>
          )}

          {/* Allocation Results Table */}
          {vlsmResults && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 overflow-x-auto">
              <h3 className="text-sm font-bold text-white font-mono uppercase mb-4">
                Computed VLSM Allocation Table
              </h3>

              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-2.5">Subnet Name</th>
                    <th className="p-2.5">Needed</th>
                    <th className="p-2.5">Allocated</th>
                    <th className="p-2.5">Prefix</th>
                    <th className="p-2.5">Network Address</th>
                    <th className="p-2.5">Usable Host Range</th>
                    <th className="p-2.5">Broadcast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vlsmResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-2.5 font-bold text-white">{row.name}</td>
                      <td className="p-2.5 text-slate-300">{row.neededHosts}</td>
                      <td className="p-2.5 text-emerald-400 font-bold">{row.allocatedHosts}</td>
                      <td className="p-2.5 text-sky-400 font-bold">/{row.prefix}</td>
                      <td className="p-2.5 text-slate-200">{row.networkAddress}</td>
                      <td className="p-2.5 text-slate-300">
                        {row.firstUsable} - {row.lastUsable}
                      </td>
                      <td className="p-2.5 text-rose-300">{row.broadcastAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRACTICE DRILLS */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase">Subnetting Exam Drill</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Calculate Network and Broadcast Addresses
                </h3>
              </div>
              <button
                onClick={generateNewPractice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Problem
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm font-mono mb-6">
              <span className="text-slate-400">Given Host IP:</span>{' '}
              <span className="text-sky-400 font-bold text-base">{practiceQuestion.ip}</span>
              {' with CIDR prefix '}
              <span className="text-emerald-400 font-bold text-base">/{practiceQuestion.prefix}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs font-mono">
              <div>
                <label htmlFor="practice-network-input" className="block text-slate-400 mb-1.5">Network Address:</label>
                <input
                  id="practice-network-input"
                  type="text"
                  value={userNetworkAns}
                  onChange={(e) => setUserNetworkAns(e.target.value.trim())}
                  placeholder="e.g. 10.20.30.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label htmlFor="practice-broadcast-input" className="block text-slate-400 mb-1.5">Broadcast Address:</label>
                <input
                  id="practice-broadcast-input"
                  type="text"
                  value={userBroadcastAns}
                  onChange={(e) => setUserBroadcastAns(e.target.value.trim())}
                  placeholder="e.g. 10.20.30.63"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              onClick={() => setPracticeChecked(true)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition-colors"
            >
              Check Answer
            </button>

            {practiceChecked && (
              <div className="mt-6 p-4 rounded-lg border bg-slate-900 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Network Address:</span>
                  {userNetworkAns === practiceQuestion.expectedNetwork ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Correct ({practiceQuestion.expectedNetwork})
                    </span>
                  ) : (
                    <span className="text-rose-400">
                      Incorrect (Expected: {practiceQuestion.expectedNetwork})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Broadcast Address:</span>
                  {userBroadcastAns === practiceQuestion.expectedBroadcast ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Correct ({practiceQuestion.expectedBroadcast})
                    </span>
                  ) : (
                    <span className="text-rose-400">
                      Incorrect (Expected: {practiceQuestion.expectedBroadcast})
                    </span>
                  )}
                </div>

                <div className="text-slate-400 pt-2 border-t border-slate-800">
                  Total Usable Hosts in /{practiceQuestion.prefix} = {practiceQuestion.expectedUsable} hosts.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
