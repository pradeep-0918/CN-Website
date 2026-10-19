import React, { useState } from 'react';
import { calculateDelays, DelayResults } from '../../utils/networkMath';
import { Calculator, Clock, Zap, ArrowRight, Activity } from 'lucide-react';

export const DelayCalculator: React.FC = () => {
  // Inputs
  const [packetSizeVal, setPacketSizeVal] = useState<number>(1500); // 1500 bytes (MTU)
  const [packetSizeUnit, setPacketSizeUnit] = useState<'B' | 'KB' | 'MB'>('B');

  const [bandwidthVal, setBandwidthVal] = useState<number>(100); // 100 Mbps
  const [bandwidthUnit, setBandwidthUnit] = useState<'Kbps' | 'Mbps' | 'Gbps'>('Mbps');

  const [distanceKm, setDistanceKm] = useState<number>(2000); // 2000 km
  const [mediumSpeed, setMediumSpeed] = useState<number>(2.0e8); // 2.0 * 10^8 m/s (Fiber)
  const [procDelayMs, setProcDelayMs] = useState<number>(1);
  const [queueDelayMs, setQueueDelayMs] = useState<number>(2);

  // Compute normalized values in base units
  const packetSizeBytes =
    packetSizeUnit === 'B'
      ? packetSizeVal
      : packetSizeUnit === 'KB'
      ? packetSizeVal * 1024
      : packetSizeVal * 1024 * 1024;

  const bandwidthBps =
    bandwidthUnit === 'Kbps'
      ? bandwidthVal * 1000
      : bandwidthUnit === 'Mbps'
      ? bandwidthVal * 1000 * 1000
      : bandwidthVal * 1000 * 1000 * 1000;

  const distanceMeters = distanceKm * 1000;

  let delayResults: DelayResults | null = null;
  try {
    delayResults = calculateDelays(
      packetSizeBytes,
      bandwidthBps,
      distanceMeters,
      mediumSpeed,
      procDelayMs,
      queueDelayMs
    );
  } catch (e) {}

  // Presets
  const applyPreset = (preset: 'lan' | 'wan' | 'satellite') => {
    if (preset === 'lan') {
      setPacketSizeVal(1500);
      setPacketSizeUnit('B');
      setBandwidthVal(1);
      setBandwidthUnit('Gbps');
      setDistanceKm(0.1); // 100m Cat6
      setMediumSpeed(2.3e8); // Copper
      setProcDelayMs(0.01);
      setQueueDelayMs(0.05);
    } else if (preset === 'wan') {
      setPacketSizeVal(1500);
      setPacketSizeUnit('B');
      setBandwidthVal(100);
      setBandwidthUnit('Mbps');
      setDistanceKm(4000); // Cross-country fiber
      setMediumSpeed(2.0e8);
      setProcDelayMs(1);
      setQueueDelayMs(5);
    } else if (preset === 'satellite') {
      setPacketSizeVal(1500);
      setPacketSizeUnit('B');
      setBandwidthVal(25);
      setBandwidthUnit('Mbps');
      setDistanceKm(36000); // GEO satellite orbit
      setMediumSpeed(3.0e8); // Speed of light in vacuum
      setProcDelayMs(2);
      setQueueDelayMs(10);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Clock className="w-4 h-4" /> Quantitative Performance Modeling
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Transmission & End-to-End Delay Calculator</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Model Transmission vs Propagation delays, unit conversions, and Bandwidth-Delay Product (BDP) pipe sizing.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-slate-400 px-2 font-mono">Presets:</span>
          <button
            onClick={() => applyPreset('lan')}
            className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Gigabit LAN
          </button>
          <button
            onClick={() => applyPreset('wan')}
            className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Continental WAN
          </button>
          <button
            onClick={() => applyPreset('satellite')}
            className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
          >
            GEO Satellite
          </button>
        </div>
      </div>

      {/* Input Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 mb-6 text-xs font-mono">
        {/* Packet Size */}
        <div>
          <label htmlFor="delay-packet-size" className="block text-slate-400 mb-1.5">Packet Size (L):</label>
          <div className="flex items-center gap-1">
            <input
              id="delay-packet-size"
              type="number"
              min="1"
              value={packetSizeVal}
              onChange={(e) => setPacketSizeVal(Number(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold focus:outline-none"
            />
            <select
              value={packetSizeUnit}
              aria-label="Packet Size Unit"
              onChange={(e) => setPacketSizeUnit(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sky-400 font-bold focus:outline-none"
            >
              <option value="B">Bytes</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        </div>

        {/* Link Bandwidth */}
        <div>
          <label htmlFor="delay-bandwidth" className="block text-slate-400 mb-1.5">Link Bandwidth (R):</label>
          <div className="flex items-center gap-1">
            <input
              id="delay-bandwidth"
              type="number"
              min="0.1"
              step="any"
              value={bandwidthVal}
              onChange={(e) => setBandwidthVal(Number(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold focus:outline-none"
            />
            <select
              value={bandwidthUnit}
              aria-label="Bandwidth Unit"
              onChange={(e) => setBandwidthUnit(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sky-400 font-bold focus:outline-none"
            >
              <option value="Kbps">Kbps</option>
              <option value="Mbps">Mbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
        </div>

        {/* Physical Distance */}
        <div>
          <label htmlFor="delay-distance" className="block text-slate-400 mb-1.5">Distance (d in km):</label>
          <input
            id="delay-distance"
            type="number"
            min="0.01"
            step="any"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold focus:outline-none"
          />
        </div>

        {/* Medium Propagation Speed */}
        <div>
          <label htmlFor="delay-medium-speed" className="block text-slate-400 mb-1.5">Medium Speed (s):</label>
          <select
            id="delay-medium-speed"
            value={mediumSpeed}
            onChange={(e) => setMediumSpeed(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sky-400 font-bold focus:outline-none"
          >
            <option value={2.0e8}>Fiber Optic (2.0 × 10⁸ m/s)</option>
            <option value={2.3e8}>Copper Twisted Pair (2.3 × 10⁸ m/s)</option>
            <option value={3.0e8}>Vacuum / Wireless (3.0 × 10⁸ m/s)</option>
          </select>
        </div>
      </div>

      {delayResults && (
        <div className="space-y-6">
          {/* Main Delay Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
              <span className="text-slate-400 uppercase text-[11px]">Transmission Delay (L / R)</span>
              <div className="text-lg font-bold text-sky-400 mt-1">
                {delayResults.transDelayMs} <span className="text-xs text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-slate-500">Pushed onto medium</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
              <span className="text-slate-400 uppercase text-[11px]">Propagation Delay (d / s)</span>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {delayResults.propDelayMs} <span className="text-xs text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-slate-500">In-flight transit time</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
              <span className="text-slate-400 uppercase text-[11px]">Proc + Queue Delay</span>
              <div className="text-lg font-bold text-purple-400 mt-1">
                {(procDelayMs + queueDelayMs).toFixed(2)} <span className="text-xs text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-slate-500">Buffer & router CPU</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
              <span className="text-slate-400 uppercase text-[11px]">Total End-to-End Delay</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                {delayResults.totalDelayMs} <span className="text-xs text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-slate-500">One-way transit</span>
            </div>
          </div>

          {/* Visual Delay Breakdown Bar */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold uppercase">Proportional Delay Breakdown</span>
              <span className="text-slate-400">Ratio a (T_prop / T_trans) = {delayResults.ratioTransToProp}</span>
            </div>

            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex items-stretch">
              <div
                style={{
                  width: `${(delayResults.transDelayMs / delayResults.totalDelayMs) * 100}%`,
                }}
                className="bg-sky-500"
                title={`Transmission Delay: ${delayResults.transDelayMs}ms`}
              />
              <div
                style={{
                  width: `${(delayResults.propDelayMs / delayResults.totalDelayMs) * 100}%`,
                }}
                className="bg-amber-500"
                title={`Propagation Delay: ${delayResults.propDelayMs}ms`}
              />
              <div
                style={{
                  width: `${((procDelayMs + queueDelayMs) / delayResults.totalDelayMs) * 100}%`,
                }}
                className="bg-purple-500"
                title={`Proc & Queue Delay: ${procDelayMs + queueDelayMs}ms`}
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono mt-3 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Transmission ({((delayResults.transDelayMs / delayResults.totalDelayMs) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Propagation ({((delayResults.propDelayMs / delayResults.totalDelayMs) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Queue & Proc ({(((procDelayMs + queueDelayMs) / delayResults.totalDelayMs) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Bandwidth-Delay Product (BDP) Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase mb-1">
              Bandwidth-Delay Product (BDP) Analysis
            </h3>
            <p className="text-slate-400 font-sans text-xs mb-4">
              The volume of bits that can be concurrently in-flight across the link (BDP = R × RTT).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">BDP in Bits:</span>
                <div className="text-base font-bold text-sky-400 mt-0.5">
                  {delayResults.bdpBits.toLocaleString()} bits
                </div>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">BDP in Bytes (Minimum TCP Window Buffer):</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {(delayResults.bdpBytes / 1024).toFixed(2)} KB ({delayResults.bdpBytes.toLocaleString()} Bytes)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
