/**
 * Pure calculation utilities for Computer Networks.
 * Tested via Node test runner.
 */

export interface SubnetResult {
  ip: string;
  prefix: number;
  netmask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: 'A' | 'B' | 'C' | 'D (Multicast)' | 'E (Experimental)' | 'CIDR';
  isPrivate: boolean;
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
  isSpecialP2P: boolean; // /31 RFC 3021
  isHostRoute: boolean;  // /32
}

/** Convert dotted-decimal IPv4 to 32-bit unsigned integer */
export function ipToInt(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) throw new Error('Invalid IPv4 address: must have 4 octets');
  let result = 0;
  for (let i = 0; i < 4; i++) {
    const octet = Number(parts[i]);
    if (isNaN(octet) || octet < 0 || octet > 255 || parts[i].trim() === '') {
      throw new Error(`Invalid IPv4 octet: ${parts[i]}`);
    }
    result = (result << 8) | octet;
  }
  return result >>> 0; // Return unsigned 32-bit integer
}

/** Convert 32-bit unsigned integer to dotted-decimal IPv4 */
export function intToIp(intVal: number): string {
  const uInt = intVal >>> 0;
  return [
    (uInt >>> 24) & 255,
    (uInt >>> 16) & 255,
    (uInt >>> 8) & 255,
    uInt & 255,
  ].join('.');
}

/** Convert integer to 8-bit binary string */
export function toBinaryOctet(octet: number): string {
  return octet.toString(2).padStart(8, '0');
}

/** Convert IPv4 string to 4-octet dotted binary string */
export function ipToBinaryString(ip: string): string {
  const parts = ip.split('.').map(Number);
  return parts.map(toBinaryOctet).join('.');
}

/** Calculate full IPv4 Subnet details */
export function calculateSubnet(ipStr: string, prefix: number): SubnetResult {
  if (prefix < 0 || prefix > 32 || !Number.isInteger(prefix)) {
    throw new Error('Prefix length must be an integer between 0 and 32');
  }

  const ipInt = ipToInt(ipStr);
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const totalAddresses = Math.pow(2, 32 - prefix);
  const isSpecialP2P = prefix === 31;
  const isHostRoute = prefix === 32;

  let usableHosts = 0;
  let firstUsableInt = 0;
  let lastUsableInt = 0;

  if (prefix === 32) {
    usableHosts = 1;
    firstUsableInt = ipInt;
    lastUsableInt = ipInt;
  } else if (prefix === 31) {
    // RFC 3021 Point-to-Point links
    usableHosts = 2;
    firstUsableInt = networkInt;
    lastUsableInt = broadcastInt;
  } else if (prefix === 30) {
    usableHosts = 2;
    firstUsableInt = (networkInt + 1) >>> 0;
    lastUsableInt = (broadcastInt - 1) >>> 0;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsableInt = (networkInt + 1) >>> 0;
    lastUsableInt = (broadcastInt - 1) >>> 0;
  }

  // Determine Class
  const firstOctet = (ipInt >>> 24) & 255;
  let ipClass: SubnetResult['ipClass'] = 'CIDR';
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental)';

  // Private IP checks (RFC 1918)
  // 10.0.0.0/8
  // 172.16.0.0/12
  // 192.168.0.0/16
  const secondOctet = (ipInt >>> 16) & 255;
  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ||
    (firstOctet === 192 && secondOctet === 168);

  const netmask = intToIp(maskInt);
  const wildcardMask = intToIp(wildcardInt);
  const networkAddress = intToIp(networkInt);
  const broadcastAddress = intToIp(broadcastInt);
  const firstUsableIp = intToIp(firstUsableInt);
  const lastUsableIp = intToIp(lastUsableInt);

  return {
    ip: intToIp(ipInt),
    prefix,
    netmask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    firstUsableIp,
    lastUsableIp,
    totalAddresses,
    usableHosts,
    ipClass,
    isPrivate,
    binaryIp: ipToBinaryString(intToIp(ipInt)),
    binaryMask: ipToBinaryString(netmask),
    binaryNetwork: ipToBinaryString(networkAddress),
    binaryBroadcast: ipToBinaryString(broadcastAddress),
    isSpecialP2P,
    isHostRoute,
  };
}

/** Variable Length Subnet Masking (VLSM) Allocation */
export interface VLSMAllocation {
  name: string;
  neededHosts: number;
  allocatedHosts: number;
  prefix: number;
  netmask: string;
  networkAddress: string;
  firstUsable: string;
  lastUsable: string;
  broadcastAddress: string;
}

export function calculateVLSM(
  baseIp: string,
  basePrefix: number,
  requirements: Array<{ name: string; hostsNeeded: number }>
): VLSMAllocation[] {
  // Sort requirements descending by hosts needed
  const sorted = [...requirements].sort((a, b) => b.hostsNeeded - a.hostsNeeded);
  let currentIpInt = ipToInt(baseIp);
  const results: VLSMAllocation[] = [];

  for (const req of sorted) {
    // Find smallest prefix that satisfies: 2^(32 - prefix) - 2 >= hostsNeeded
    let prefix = 30;
    while (prefix >= basePrefix) {
      const capacity = Math.pow(2, 32 - prefix) - 2;
      if (capacity >= req.hostsNeeded) {
        break;
      }
      prefix--;
    }

    if (prefix < basePrefix) {
      throw new Error(`Cannot fit requirement "${req.name}" (${req.hostsNeeded} hosts) within /${basePrefix}`);
    }

    const blockSize = Math.pow(2, 32 - prefix);
    // Align currentIpInt to block boundary
    const remainder = currentIpInt % blockSize;
    if (remainder !== 0) {
      currentIpInt = currentIpInt + (blockSize - remainder);
    }

    const sub = calculateSubnet(intToIp(currentIpInt), prefix);
    results.push({
      name: req.name,
      neededHosts: req.hostsNeeded,
      allocatedHosts: sub.usableHosts,
      prefix,
      netmask: sub.netmask,
      networkAddress: sub.networkAddress,
      firstUsable: sub.firstUsableIp,
      lastUsable: sub.lastUsableIp,
      broadcastAddress: sub.broadcastAddress,
    });

    currentIpInt = (ipToInt(sub.broadcastAddress) + 1) >>> 0;
  }

  return results;
}

/** Network Delays and Bandwidth-Delay Product */
export interface DelayResults {
  transDelayMs: number;
  propDelayMs: number;
  procDelayMs: number;
  queueDelayMs: number;
  totalDelayMs: number;
  bdpBits: number;
  bdpBytes: number;
  ratioTransToProp: number; // a = T_prop / T_trans
}

export function calculateDelays(
  packetSizeBytes: number,
  bandwidthBps: number, // bits per second
  distanceMeters: number,
  propSpeedMps: number = 2.0e8, // default 2x10^8 m/s in fiber/copper
  procDelayMs: number = 0,
  queueDelayMs: number = 0
): DelayResults {
  if (bandwidthBps <= 0) throw new Error('Bandwidth must be greater than 0');
  if (propSpeedMps <= 0) throw new Error('Propagation speed must be greater than 0');

  const packetBits = packetSizeBytes * 8;
  const transDelaySec = packetBits / bandwidthBps;
  const propDelaySec = distanceMeters / propSpeedMps;

  const transDelayMs = transDelaySec * 1000;
  const propDelayMs = propDelaySec * 1000;
  const totalDelayMs = transDelayMs + propDelayMs + procDelayMs + queueDelayMs;

  const rttSec = (propDelaySec * 2) + transDelaySec;
  const bdpBits = bandwidthBps * rttSec;
  const bdpBytes = bdpBits / 8;

  const ratioTransToProp = transDelaySec > 0 ? propDelaySec / transDelaySec : 0;

  return {
    transDelayMs: Number(transDelayMs.toFixed(4)),
    propDelayMs: Number(propDelayMs.toFixed(4)),
    procDelayMs,
    queueDelayMs,
    totalDelayMs: Number(totalDelayMs.toFixed(4)),
    bdpBits: Math.round(bdpBits),
    bdpBytes: Math.round(bdpBytes),
    ratioTransToProp: Number(ratioTransToProp.toFixed(4)),
  };
}

/** Cyclic Redundancy Check (CRC) Polynomial Division */
export interface CRCResult {
  dataBits: string;
  generator: string;
  dividend: string; // data + padded zeros
  remainder: string; // checksum
  codeword: string;  // data + remainder
  steps: Array<{ currentRemainder: string; xoredWith: string; quotientBit: string }>;
}

export function calculateCRC(dataBits: string, generator: string): CRCResult {
  const cleanData = dataBits.trim().replace(/[^01]/g, '');
  const cleanGen = generator.trim().replace(/[^01]/g, '');

  if (!cleanData) throw new Error('Data bits cannot be empty');
  if (!cleanGen || cleanGen.length < 2 || cleanGen[0] !== '1') {
    throw new Error('Generator polynomial must start with 1 and have length >= 2');
  }

  const k = cleanGen.length - 1; // number of zeros to append
  const dividend = cleanData + '0'.repeat(k);
  let remainderArr = dividend.split('');
  const steps: CRCResult['steps'] = [];

  for (let i = 0; i < cleanData.length; i++) {
    const bit = remainderArr[i];
    if (bit === '1') {
      let xorStr = '';
      for (let j = 0; j < cleanGen.length; j++) {
        const dBit = remainderArr[i + j];
        const gBit = cleanGen[j];
        const res = dBit === gBit ? '0' : '1';
        remainderArr[i + j] = res;
        xorStr += gBit;
      }
      steps.push({
        currentRemainder: remainderArr.join('').slice(i, i + cleanGen.length),
        xoredWith: xorStr,
        quotientBit: '1',
      });
    } else {
      steps.push({
        currentRemainder: remainderArr.join('').slice(i, i + cleanGen.length),
        xoredWith: '0'.repeat(cleanGen.length),
        quotientBit: '0',
      });
    }
  }

  const remainder = remainderArr.slice(cleanData.length).join('');
  const codeword = cleanData + remainder;

  return {
    dataBits: cleanData,
    generator: cleanGen,
    dividend,
    remainder,
    codeword,
    steps,
  };
}

/** Verify CRC Codeword */
export function verifyCRCCodeword(codeword: string, generator: string): boolean {
  const result = calculateCRC(codeword, generator);
  // Remainder must be all zeros
  return result.remainder.split('').every(bit => bit === '0');
}

/** Hamming Code (7,4) Single Error Correction */
export interface Hamming74EncodeResult {
  data: string; // 4 bits: d3, d2, d1, d0
  p1: number;
  p2: number;
  p4: number;
  codeword: string; // 7 bits [p1, p2, d1, p4, d2, d3, d4] in 1-based indexing
}

export function encodeHamming74(data4Bits: string): Hamming74EncodeResult {
  const d = data4Bits.trim().replace(/[^01]/g, '');
  if (d.length !== 4) throw new Error('Input must be exactly 4 bits (e.g. 1011)');

  // 1-based index:
  // Position 1: P1
  // Position 2: P2
  // Position 3: D1 (d[0])
  // Position 4: P3 / P4
  // Position 5: D2 (d[1])
  // Position 6: D3 (d[2])
  // Position 7: D4 (d[3])
  const d1 = Number(d[0]);
  const d2 = Number(d[1]);
  const d3 = Number(d[2]);
  const d4 = Number(d[3]);

  // P1 checks bits 1, 3, 5, 7 -> P1 ^ D1 ^ D2 ^ D4 = 0 => P1 = D1 ^ D2 ^ D4
  const p1 = d1 ^ d2 ^ d4;
  // P2 checks bits 2, 3, 6, 7 -> P2 ^ D1 ^ D3 ^ D4 = 0 => P2 = D1 ^ D3 ^ D4
  const p2 = d1 ^ d3 ^ d4;
  // P4 checks bits 4, 5, 6, 7 -> P4 ^ D2 ^ D3 ^ D4 = 0 => P4 = D2 ^ D3 ^ D4
  const p4 = d2 ^ d3 ^ d4;

  const codeword = `${p1}${p2}${d1}${p4}${d2}${d3}${d4}`;
  return {
    data: d,
    p1,
    p2,
    p4,
    codeword,
  };
}

export interface Hamming74DecodeResult {
  received: string;
  syndrome: number; // 0 means no error, 1-7 points to erroneous bit position
  hasError: boolean;
  correctedCodeword: string;
  correctedData: string;
}

export function decodeHamming74(code7Bits: string): Hamming74DecodeResult {
  const c = code7Bits.trim().replace(/[^01]/g, '');
  if (c.length !== 7) throw new Error('Codeword must be exactly 7 bits');

  const b1 = Number(c[0]);
  const b2 = Number(c[1]);
  const b3 = Number(c[2]);
  const b4 = Number(c[3]);
  const b5 = Number(c[4]);
  const b6 = Number(c[5]);
  const b7 = Number(c[6]);

  const s1 = b1 ^ b3 ^ b5 ^ b7;
  const s2 = b2 ^ b3 ^ b6 ^ b7;
  const s4 = b4 ^ b5 ^ b6 ^ b7;

  // Syndrome binary value: s4 s2 s1
  const syndrome = (s4 << 2) | (s2 << 1) | s1;
  const hasError = syndrome !== 0;

  const bits = c.split('').map(Number);
  if (hasError && syndrome >= 1 && syndrome <= 7) {
    // Flip bit at index syndrome - 1
    bits[syndrome - 1] = bits[syndrome - 1] ^ 1;
  }

  const correctedCodeword = bits.join('');
  const correctedData = `${bits[2]}${bits[4]}${bits[5]}${bits[6]}`;

  return {
    received: c,
    syndrome,
    hasError,
    correctedCodeword,
    correctedData,
  };
}

/** Internet Checksum (RFC 1071 16-bit 1's complement) */
export function calculateInternetChecksum(wordsHex: string[]): { sum: number; checksum: string } {
  let sum = 0;
  for (const word of wordsHex) {
    const val = parseInt(word, 16);
    if (isNaN(val)) throw new Error(`Invalid hex word: ${word}`);
    sum += val;
    // Add carry
    while (sum > 0xffff) {
      sum = (sum & 0xffff) + (sum >>> 16);
    }
  }

  const checksum = (~sum) & 0xffff;
  return {
    sum,
    checksum: checksum.toString(16).padStart(4, '0').toUpperCase(),
  };
}

/** Dijkstra's Shortest Path Algorithm for Routing Tables */
export interface DijkstraStep {
  step: number;
  visitedNode: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
}

export interface DijkstraResult {
  source: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  paths: Record<string, string[]>;
  steps: DijkstraStep[];
}

export function calculateDijkstra(
  nodes: string[],
  edges: Array<{ from: string; to: string; cost: number }>,
  source: string
): DijkstraResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>(nodes);
  const steps: DijkstraStep[] = [];

  for (const node of nodes) {
    distances[node] = node === source ? 0 : Infinity;
    previous[node] = null;
  }

  let stepCount = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current: string | null = null;
    let smallestDist = Infinity;
    for (const node of unvisited) {
      if (distances[node] < smallestDist) {
        smallestDist = distances[node];
        current = node;
      }
    }

    if (current === null || smallestDist === Infinity) {
      break; // Remaining nodes are unreachable
    }

    unvisited.delete(current);
    stepCount++;

    // Check neighbors
    for (const edge of edges) {
      let neighbor: string | null = null;
      if (edge.from === current) neighbor = edge.to;
      else if (edge.to === current) neighbor = edge.from; // undirected graph

      if (neighbor && unvisited.has(neighbor)) {
        const newDist = distances[current] + edge.cost;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = current;
        }
      }
    }

    steps.push({
      step: stepCount,
      visitedNode: current,
      distances: { ...distances },
      previous: { ...previous },
    });
  }

  // Build paths
  const paths: Record<string, string[]> = {};
  for (const node of nodes) {
    if (distances[node] === Infinity) {
      paths[node] = [];
    } else {
      const path: string[] = [];
      let curr: string | null = node;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
      paths[node] = path;
    }
  }

  return {
    source,
    distances,
    previous,
    paths,
    steps,
  };
}

/** Sliding Window Protocol Utilization & Efficiency */
export function calculateSlidingWindowUtilization(
  windowSize: number, // N packets
  transDelayMs: number,
  propDelayMs: number,
  protocol: 'stop-and-wait' | 'go-back-n' | 'selective-repeat'
): {
  a: number; // ratio T_prop / T_trans
  efficiencyPercent: number;
  formula: string;
} {
  const a = transDelayMs > 0 ? propDelayMs / transDelayMs : 0;
  let efficiency = 0;
  let formula = '';

  if (protocol === 'stop-and-wait') {
    // For stop-and-wait: eta = 1 / (1 + 2a)
    efficiency = 1 / (1 + 2 * a);
    formula = 'η = 1 / (1 + 2a)';
  } else {
    // For GBN and SR with window N: eta = min(1, N / (1 + 2a))
    efficiency = Math.min(1, windowSize / (1 + 2 * a));
    formula = `η = min(1, N / (1 + 2a)) where N = ${windowSize}`;
  }

  return {
    a: Number(a.toFixed(4)),
    efficiencyPercent: Number((efficiency * 100).toFixed(2)),
    formula,
  };
}
