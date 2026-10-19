import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ipToInt,
  intToIp,
  calculateSubnet,
  calculateVLSM,
  calculateDelays,
  calculateCRC,
  verifyCRCCodeword,
  encodeHamming74,
  decodeHamming74,
  calculateDijkstra,
  calculateSlidingWindowUtilization,
} from './networkMath.ts';

test('IP integer conversions', () => {
  assert.equal(ipToInt('192.168.1.1'), 3232235777);
  assert.equal(intToIp(3232235777), '192.168.1.1');
  assert.equal(intToIp(ipToInt('10.0.0.1')), '10.0.0.1');
  assert.equal(intToIp(ipToInt('255.255.255.0')), '255.255.255.0');
});

test('calculateSubnet standard class C /24', () => {
  const result = calculateSubnet('192.168.1.100', 24);
  assert.equal(result.netmask, '255.255.255.0');
  assert.equal(result.networkAddress, '192.168.1.0');
  assert.equal(result.broadcastAddress, '192.168.1.255');
  assert.equal(result.firstUsableIp, '192.168.1.1');
  assert.equal(result.lastUsableIp, '192.168.1.254');
  assert.equal(result.usableHosts, 254);
  assert.equal(result.totalAddresses, 256);
  assert.equal(result.isPrivate, true);
  assert.equal(result.ipClass, 'C');
});

test('calculateSubnet /30 and special /31 and /32 cases', () => {
  // /30 has 2 usable hosts
  const sub30 = calculateSubnet('10.10.10.5', 30);
  assert.equal(sub30.networkAddress, '10.10.10.4');
  assert.equal(sub30.broadcastAddress, '10.10.10.7');
  assert.equal(sub30.firstUsableIp, '10.10.10.5');
  assert.equal(sub30.lastUsableIp, '10.10.10.6');
  assert.equal(sub30.usableHosts, 2);

  // /31 RFC 3021 point-to-point link
  const sub31 = calculateSubnet('172.16.1.0', 31);
  assert.equal(sub31.isSpecialP2P, true);
  assert.equal(sub31.usableHosts, 2);
  assert.equal(sub31.firstUsableIp, '172.16.1.0');
  assert.equal(sub31.lastUsableIp, '172.16.1.1');

  // /32 single host route
  const sub32 = calculateSubnet('8.8.8.8', 32);
  assert.equal(sub32.isHostRoute, true);
  assert.equal(sub32.usableHosts, 1);
  assert.equal(sub32.networkAddress, '8.8.8.8');
});

test('calculateVLSM allocations', () => {
  const allocations = calculateVLSM('192.168.1.0', 24, [
    { name: 'Engineering', hostsNeeded: 50 },
    { name: 'Sales', hostsNeeded: 25 },
    { name: 'Management', hostsNeeded: 10 },
  ]);

  assert.equal(allocations.length, 3);
  // Engineering should get /26 (62 usable hosts)
  assert.equal(allocations[0].name, 'Engineering');
  assert.equal(allocations[0].prefix, 26);
  assert.equal(allocations[0].networkAddress, '192.168.1.0');
  assert.equal(allocations[0].broadcastAddress, '192.168.1.63');

  // Sales should get /27 (30 usable hosts)
  assert.equal(allocations[1].name, 'Sales');
  assert.equal(allocations[1].prefix, 27);
  assert.equal(allocations[1].networkAddress, '192.168.1.64');
  assert.equal(allocations[1].broadcastAddress, '192.168.1.95');

  // Management should get /28 (14 usable hosts)
  assert.equal(allocations[2].name, 'Management');
  assert.equal(allocations[2].prefix, 28);
  assert.equal(allocations[2].networkAddress, '192.168.1.96');
});

test('calculateDelays calculation accuracy', () => {
  // 1000 Bytes = 8000 bits. Bandwidth = 1 Mbps = 1,000,000 bps. Trans delay = 8 ms
  // Distance = 2000 km = 2,000,000 m. Prop speed = 2.0e8 m/s. Prop delay = 10 ms
  const delays = calculateDelays(1000, 1000000, 2000000, 2.0e8, 1, 2);
  assert.equal(delays.transDelayMs, 8);
  assert.equal(delays.propDelayMs, 10);
  assert.equal(delays.totalDelayMs, 21); // 8 + 10 + 1 + 2
});

test('CRC and verification', () => {
  // Data: 11010011101100, Generator: 1011 (CRC-3)
  const crc = calculateCRC('11010011101100', '1011');
  assert.ok(crc.remainder.length === 3);
  assert.ok(verifyCRCCodeword(crc.codeword, '1011'));
});

test('Hamming 7,4 encoding and error correction', () => {
  const enc = encodeHamming74('1011');
  assert.equal(enc.codeword.length, 7);

  // No error
  const decClean = decodeHamming74(enc.codeword);
  assert.equal(decClean.hasError, false);
  assert.equal(decClean.syndrome, 0);
  assert.equal(decClean.correctedData, '1011');

  // Inject single-bit error at position 3 (0-indexed: 2)
  const bits = enc.codeword.split('');
  bits[2] = bits[2] === '0' ? '1' : '0';
  const corrupted = bits.join('');

  const decCorrupted = decodeHamming74(corrupted);
  assert.equal(decCorrupted.hasError, true);
  assert.equal(decCorrupted.syndrome, 3);
  assert.equal(decCorrupted.correctedCodeword, enc.codeword);
  assert.equal(decCorrupted.correctedData, '1011');
});

test('Dijkstra algorithm shortest paths', () => {
  const nodes = ['A', 'B', 'C', 'D'];
  const edges = [
    { from: 'A', to: 'B', cost: 1 },
    { from: 'A', to: 'C', cost: 4 },
    { from: 'B', to: 'C', cost: 2 },
    { from: 'C', to: 'D', cost: 1 },
    { from: 'B', to: 'D', cost: 5 },
  ];

  const result = calculateDijkstra(nodes, edges, 'A');
  assert.equal(result.distances['A'], 0);
  assert.equal(result.distances['B'], 1);
  assert.equal(result.distances['C'], 3); // A -> B -> C = 1 + 2 = 3
  assert.equal(result.distances['D'], 4); // A -> B -> C -> D = 1 + 2 + 1 = 4
  assert.deepEqual(result.paths['D'], ['A', 'B', 'C', 'D']);
});

test('Sliding window utilization', () => {
  // Trans = 1ms, Prop = 4ms -> a = 4
  // Stop and wait: 1 / (1 + 2*4) = 1/9 = 11.11%
  const sw = calculateSlidingWindowUtilization(1, 1, 4, 'stop-and-wait');
  assert.equal(sw.a, 4);
  assert.equal(sw.efficiencyPercent, 11.11);

  // GBN with N = 9: min(1, 9/9) = 100%
  const gbn = calculateSlidingWindowUtilization(9, 1, 4, 'go-back-n');
  assert.equal(gbn.efficiencyPercent, 100);
});
