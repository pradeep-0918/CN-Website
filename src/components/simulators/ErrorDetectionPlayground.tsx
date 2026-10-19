import React, { useState } from 'react';
import { calculateCRC, verifyCRCCodeword, encodeHamming74, decodeHamming74, calculateInternetChecksum } from '../../utils/networkMath';
import { ShieldAlert, Check, X, Binary, RotateCcw, Sparkles } from 'lucide-react';

export const ErrorDetectionPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crc' | 'hamming' | 'checksum'>('crc');

  // CRC State
  const [crcData, setCrcData] = useState<string>('11010011101100');
  const [crcGenerator, setCrcGenerator] = useState<string>('1011');
  const [crcInjectedCodeword, setCrcInjectedCodeword] = useState<string>('');
  const [crcVerificationResult, setCrcVerificationResult] = useState<boolean | null>(null);

  // Hamming State
  const [hammingData, setHammingData] = useState<string>('1011');
  const [corruptedCodeword, setCorruptedCodeword] = useState<string>('');

  // Checksum State
  const [hexWords, setHexWords] = useState<string[]>(['4500', '003C', '1C46', '4000', '4006']);

  // Compute CRC
  let crcCalcResult: any = null;
  let crcError: string | null = null;
  try {
    crcCalcResult = calculateCRC(crcData, crcGenerator);
  } catch (err: any) {
    crcError = err.message;
  }

  // Compute Hamming
  let hammingEncoded: any = null;
  let hammingDecoded: any = null;
  let hammingError: string | null = null;
  try {
    hammingEncoded = encodeHamming74(hammingData);
    const activeCodeword = corruptedCodeword || hammingEncoded.codeword;
    hammingDecoded = decodeHamming74(activeCodeword);
  } catch (err: any) {
    hammingError = err.message;
  }

  // Compute Checksum
  let checksumResult: any = null;
  try {
    checksumResult = calculateInternetChecksum(hexWords);
  } catch (e) {}

  const flipHammingBit = (bitIndex: number) => {
    if (!hammingEncoded) return;
    const current = corruptedCodeword || hammingEncoded.codeword;
    const bits = current.split('');
    bits[bitIndex] = bits[bitIndex] === '0' ? '1' : '0';
    setCorruptedCodeword(bits.join(''));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <ShieldAlert className="w-4 h-4" /> Data Link Layer Integrity Playground
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Error Detection & Correction Engine</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Experiment with Cyclic Redundancy Check (CRC) modulo-2 polynomial division, Hamming(7,4) auto-correction, and Internet Checksums.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTab('crc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'crc' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CRC Polynomial Division
          </button>
          <button
            onClick={() => {
              setActiveTab('hamming');
              setCorruptedCodeword('');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'hamming' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hamming (7,4) Single-Error Correction
          </button>
          <button
            onClick={() => setActiveTab('checksum')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'checksum' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Internet Checksum
          </button>
        </div>
      </div>

      {/* TAB 1: CRC */}
      {activeTab === 'crc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-4 font-mono text-xs">
            <div className="sm:col-span-8">
              <label htmlFor="crc-data-bits-input" className="block text-slate-400 mb-1.5">Data Bits (Binary 0s and 1s):</label>
              <input
                id="crc-data-bits-input"
                type="text"
                value={crcData}
                onChange={(e) => {
                  setCrcData(e.target.value.replace(/[^01]/g, ''));
                  setCrcInjectedCodeword('');
                  setCrcVerificationResult(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-bold tracking-widest focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="crc-generator-select" className="block text-slate-400 mb-1.5">Generator Polynomial G(x):</label>
              <select
                id="crc-generator-select"
                value={crcGenerator}
                onChange={(e) => {
                  setCrcGenerator(e.target.value);
                  setCrcInjectedCodeword('');
                  setCrcVerificationResult(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sky-400 font-bold focus:outline-none"
              >
                <option value="1011">CRC-3 (1011: x^3 + x + 1)</option>
                <option value="10011">CRC-4 (10011: x^4 + x + 1)</option>
                <option value="110101">CRC-5 (110101: x^5 + x^4 + x^2 + 1)</option>
                <option value="100000111">CRC-8 (100000111: ATM / Bluetooth)</option>
              </select>
            </div>
          </div>

          {crcError && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono rounded-lg">
              {crcError}
            </div>
          )}

          {crcCalcResult && (
            <div className="space-y-6">
              {/* Codeword Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
                  <span className="text-slate-400 uppercase text-[11px]">Original Data</span>
                  <div className="text-sm font-bold text-white mt-1 break-all">{crcCalcResult.dataBits}</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
                  <span className="text-slate-400 uppercase text-[11px]">Computed CRC Remainder</span>
                  <div className="text-sm font-bold text-emerald-400 mt-1 break-all">{crcCalcResult.remainder}</div>
                  <span className="text-[10px] text-slate-500">{crcCalcResult.generator.length - 1} Check Bits</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5">
                  <span className="text-slate-400 uppercase text-[11px]">Transmitted Codeword</span>
                  <div className="text-sm font-bold text-sky-400 mt-1 break-all">
                    {crcCalcResult.dataBits}
                    <span className="text-emerald-400 font-extrabold underline">{crcCalcResult.remainder}</span>
                  </div>
                </div>
              </div>

              {/* Error Injection Test */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
                <h3 className="text-sm font-bold text-white uppercase mb-2">
                  Channel Error Injection & Verification Test
                </h3>
                <p className="text-slate-400 font-sans text-xs mb-4">
                  Test the receiver’s verification algorithm. Click any bit below to corrupt it and see if the receiver catches the transmission error.
                </p>

                <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800 mb-4">
                  {(crcInjectedCodeword || crcCalcResult.codeword).split('').map((bit: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const current = (crcInjectedCodeword || crcCalcResult.codeword).split('');
                        current[idx] = current[idx] === '0' ? '1' : '0';
                        const mutated = current.join('');
                        setCrcInjectedCodeword(mutated);
                        setCrcVerificationResult(verifyCRCCodeword(mutated, crcGenerator));
                      }}
                      className={`w-7 h-8 rounded border flex flex-col items-center justify-center font-bold text-xs transition-colors ${
                        bit !== crcCalcResult.codeword[idx]
                          ? 'bg-rose-950 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                          : idx >= crcCalcResult.dataBits.length
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:border-emerald-500'
                          : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-sky-500'
                      }`}
                      title={`Bit ${idx + 1}: Click to flip`}
                      aria-label={`Bit ${idx + 1}: Click to flip`}
                    >
                      <span>{bit}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const target = crcInjectedCodeword || crcCalcResult.codeword;
                        setCrcVerificationResult(verifyCRCCodeword(target, crcGenerator));
                      }}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium text-xs transition-colors"
                    >
                      Run Receiver Verification Check
                    </button>
                    <button
                      onClick={() => {
                        setCrcInjectedCodeword('');
                        setCrcVerificationResult(null);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Bits
                    </button>
                  </div>

                  {crcVerificationResult !== null && (
                    <div
                      className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${
                        crcVerificationResult
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-rose-950/80 border-rose-700 text-rose-300'
                      }`}
                    >
                      {crcVerificationResult ? (
                        <>
                          <Check className="w-4 h-4" /> Remainder = 0 (Frame Accepted - No Errors)
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" /> Remainder ≠ 0 (Frame Discarded - CRC Error Detected!)
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HAMMING (7,4) */}
      {activeTab === 'hamming' && (
        <div className="space-y-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 font-mono text-xs">
            <label htmlFor="hamming-input-bits" className="block text-slate-400 mb-1.5">4-Bit Input Data (D1, D2, D3, D4):</label>
            <div className="flex items-center gap-3">
              <input
                id="hamming-input-bits"
                type="text"
                maxLength={4}
                value={hammingData}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^01]/g, '').slice(0, 4);
                  setHammingData(cleaned);
                  setCorruptedCodeword('');
                }}
                className="w-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-bold text-center tracking-widest text-sm focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-400">
                Parity bit positions: P1 (pos 1), P2 (pos 2), P4 (pos 4)
              </span>
            </div>
          </div>

          {hammingEncoded && hammingDecoded && (
            <div className="space-y-6">
              {/* Hamming Codeword Bit Cells */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 font-mono text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white uppercase">
                    7-Bit Codeword (Click any bit to inject single-bit corruption)
                  </h3>
                  <button
                    onClick={() => setCorruptedCodeword('')}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Corruption
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 max-w-xl mb-6">
                  {(corruptedCodeword || hammingEncoded.codeword).split('').map((bit: string, idx: number) => {
                    const pos = idx + 1;
                    const isParity = pos === 1 || pos === 2 || pos === 4;
                    const isFlipped = bit !== hammingEncoded.codeword[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => flipHammingBit(idx)}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isFlipped
                            ? 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500'
                            : isParity
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300 hover:border-amber-500'
                            : 'bg-sky-950/40 border-sky-800 text-sky-300 hover:border-sky-500'
                        }`}
                        title={`Click to flip Bit ${pos}`}
                        aria-label={`Click to flip Bit ${pos}`}
                      >
                        <span className="text-[10px] text-slate-400">
                          {isParity ? `P${pos}` : `D${pos === 3 ? 1 : pos === 5 ? 2 : pos === 6 ? 3 : 4}`}
                        </span>
                        <span className="text-base font-extrabold my-1">{bit}</span>
                        <span className="text-[9px] text-slate-500">Pos {pos}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Syndrome and Auto-Correction Analysis */}
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-white">Receiver Syndrome Decoding Result:</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold ${
                        hammingDecoded.hasError ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {hammingDecoded.hasError ? `Error Detected at Bit Position ${hammingDecoded.syndrome}` : 'Zero Errors (Syndrome = 000)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] mb-3">
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Received 7-bit Vector:</span>
                      <div className="font-bold text-white mt-0.5">{hammingDecoded.received}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Corrected 7-bit Codeword:</span>
                      <div className="font-bold text-emerald-400 mt-0.5">{hammingDecoded.correctedCodeword}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-400">Decoded 4 Data Bits:</span>
                      <div className="font-bold text-sky-400 mt-0.5">{hammingDecoded.correctedData}</div>
                    </div>
                  </div>

                  {hammingDecoded.hasError && (
                    <div className="text-xs text-slate-300 font-sans leading-relaxed">
                      💡 <strong>Auto-Correction in Action:</strong> The calculated syndrome ($S_4 S_2 S_1 = {hammingDecoded.syndrome.toString(2).padStart(3, '0')}$) translates to decimal {hammingDecoded.syndrome}. The receiver silently flips bit {hammingDecoded.syndrome} back to its original state, completely restoring data <code>{hammingDecoded.correctedData}</code> without requesting a retransmission!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERNET CHECKSUM */}
      {activeTab === 'checksum' && (
        <div className="space-y-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-5 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase mb-2">
              RFC 1071 16-Bit Internet Checksum (One’s Complement Addition)
            </h3>
            <p className="text-slate-400 font-sans text-xs mb-4">
              Used in IPv4 headers, TCP segments, and UDP datagrams. 16-bit words are summed with end-around carry and then bitwise inverted (~Sum).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
              {hexWords.map((word, idx) => (
                <div key={idx}>
                  <label htmlFor={`hex-word-input-${idx}`} className="text-slate-500 text-[10px] block mb-1">16-bit Word #{idx + 1}:</label>
                  <input
                    id={`hex-word-input-${idx}`}
                    type="text"
                    maxLength={4}
                    value={word}
                    onChange={(e) => {
                      const updated = [...hexWords];
                      updated[idx] = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
                      setHexWords(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sky-400 font-bold text-center focus:outline-none focus:border-sky-500"
                  />
                </div>
              ))}
            </div>

            {checksumResult && (
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Accumulated 16-bit Sum:</span>
                  <span className="font-bold text-white">0x{checksumResult.sum.toString(16).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400 font-bold">1’s Complement Inverted Checksum:</span>
                  <span className="text-base font-bold text-emerald-400">0x{checksumResult.checksum}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
