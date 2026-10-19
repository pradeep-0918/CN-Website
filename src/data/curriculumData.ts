import { Module, Lesson, QuizQuestion } from '../types/network';
import { module1 } from './modules/module1';
import { module2 } from './modules/module2';
import { module3 } from './modules/module3';
import { module4 } from './modules/module4';
import { module5 } from './modules/module5';
import { module6 } from './modules/module6';
import { module7 } from './modules/module7';
import { module8, module9 } from './modules/module8and9';
import { module10, module11, module12 } from './modules/module10to12';

export const allModules: Module[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module8,
  module9,
  module10,
  module11,
  module12,
];

export const allLessons: Lesson[] = allModules.flatMap((m) => m.lessons);

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getModuleByLessonId(lessonId: string): Module | undefined {
  return allModules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function getAdjacentLessons(currentId: string): { prev?: Lesson; next?: Lesson } {
  const index = allLessons.findIndex((l) => l.id === currentId);
  if (index === -1) return {};
  return {
    prev: index > 0 ? allLessons[index - 1] : undefined,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : undefined,
  };
}

export function searchCurriculum(query: string): Lesson[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allLessons.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.technicalExplanation.toLowerCase().includes(q) ||
      l.learningObjectives.some((obj) => obj.toLowerCase().includes(q))
  );
}

/** Comprehensive verified Question Bank across all 12 modules */
export const comprehensiveQuestions: QuizQuestion[] = [
  {
    id: 'q-1',
    moduleId: 1,
    moduleTitle: 'Introduction to Computer Networks',
    topic: 'Network Topologies',
    question: 'How many duplex physical links are required to interconnect 8 switches in a Full Mesh topology?',
    type: 'numerical',
    correctAnswer: '28',
    explanation: 'For a full mesh with N nodes, the formula is N * (N - 1) / 2 = 8 * 7 / 2 = 28 links.',
    difficulty: 'Easy',
  },
  {
    id: 'q-2',
    moduleId: 1,
    moduleTitle: 'Introduction to Computer Networks',
    topic: 'Network Hardware',
    question: 'A standard 16-port Layer 2 switch with all ports in default VLAN 1 contains how many collision domains and how many broadcast domains?',
    type: 'single',
    options: [
      '1 collision domain, 1 broadcast domain',
      '16 collision domains, 1 broadcast domain',
      '16 collision domains, 16 broadcast domains',
      '1 collision domain, 16 broadcast domains',
    ],
    correctAnswer: 1,
    explanation: 'Each port on a switch is an independent micro-segmented collision domain (16), but all ports share a single broadcast domain (1) unless segregated by VLANs or routers.',
    difficulty: 'Medium',
  },
  {
    id: 'q-3',
    moduleId: 2,
    moduleTitle: 'Network Models & Architectures',
    topic: 'OSI Protocol Data Units',
    question: 'Match the OSI layer to its exact Protocol Data Unit (PDU): Transport Layer, Network Layer, and Data Link Layer.',
    type: 'single',
    options: [
      'Segment, Packet, Frame',
      'Packet, Frame, Bit',
      'Datagram, Segment, Packet',
      'Frame, Packet, Segment',
    ],
    correctAnswer: 0,
    explanation: 'Transport Layer PDU is Segment (or Datagram in UDP); Network Layer PDU is Packet; Data Link Layer PDU is Frame.',
    difficulty: 'Easy',
  },
  {
    id: 'q-4',
    moduleId: 3,
    moduleTitle: 'Physical Layer',
    topic: 'Shannon Capacity Theorem',
    question: 'What is the maximum theoretical capacity of a channel with 10 kHz bandwidth and an SNR of 31 (linear)?',
    type: 'single',
    options: ['10 Kbps', '31 Kbps', '50 Kbps', '100 Kbps'],
    correctAnswer: 2,
    explanation: 'C = B * log2(1 + SNR) = 10,000 * log2(1 + 31) = 10,000 * log2(32) = 10,000 * 5 = 50,000 bps = 50 Kbps.',
    difficulty: 'Medium',
  },
  {
    id: 'q-5',
    moduleId: 4,
    moduleTitle: 'Data Link Layer',
    topic: 'Hamming Code',
    question: 'In a 7-bit Hamming(7,4) code, if parity checks reveal a syndrome of binary 110 (decimal 6), what action is taken?',
    type: 'single',
    options: [
      'Request full retransmission from sender',
      'Bit at position 6 is flipped to correct the single-bit error',
      'Bit at position 7 is discarded',
      'The packet is dropped as unrecoverable',
    ],
    correctAnswer: 1,
    explanation: 'The syndrome binary value directly specifies the 1-based index of the corrupted bit. Binary 110 = 6, so bit 6 is inverted to correct the error.',
    difficulty: 'Medium',
  },
  {
    id: 'q-6',
    moduleId: 4,
    moduleTitle: 'Data Link Layer',
    topic: 'Sliding Window ARQ',
    question: 'With 4-bit sequence numbers (m = 4), what is the maximum sender window size allowed in Selective Repeat ARQ to prevent window overlap?',
    type: 'single',
    options: ['7', '8', '15', '16'],
    correctAnswer: 1,
    explanation: 'In Selective Repeat, W_s <= 2^(m - 1) = 2^(4 - 1) = 2^3 = 8. (For Go-Back-N it would be 2^m - 1 = 15).',
    difficulty: 'Hard',
  },
  {
    id: 'q-7',
    moduleId: 5,
    moduleTitle: 'Network Layer',
    topic: 'IPv4 Subnetting & CIDR',
    question: 'What is the network address and broadcast address for the host IP 10.50.12.195/27?',
    type: 'single',
    options: [
      'Network: 10.50.12.0, Broadcast: 10.50.12.255',
      'Network: 10.50.12.192, Broadcast: 10.50.12.223',
      'Network: 10.50.12.160, Broadcast: 10.50.12.191',
      'Network: 10.50.12.192, Broadcast: 10.50.12.255',
    ],
    correctAnswer: 1,
    explanation: 'Prefix /27 has block size 2^(32-27) = 32. Blocks in 4th octet: 0, 32, 64, 96, 128, 160, 192..223. 195 falls in 192..223. Network: 10.50.12.192, Broadcast: 10.50.12.223.',
    difficulty: 'Medium',
  },
  {
    id: 'q-8',
    moduleId: 5,
    moduleTitle: 'Network Layer',
    topic: 'RFC 3021 /31 Subnets',
    question: 'True or False: Under RFC 3021, an IPv4 /31 subnet has exactly 2 usable host IP addresses and requires no dedicated broadcast address.',
    type: 'true-false',
    correctAnswer: true,
    explanation: 'True. RFC 3021 standardizes /31 for point-to-point router links where directed broadcast is unnecessary, conserving IP addresses by making both 0 and 1 valid host endpoints.',
    difficulty: 'Medium',
  },
  {
    id: 'q-9',
    moduleId: 6,
    moduleTitle: 'Transport Layer',
    topic: 'TCP 3-Way Handshake',
    question: 'If Client sends SYN with Seq=2000, and Server responds with SYN-ACK with Seq=5000, what will be the Seq and Ack numbers on the Client’s final ACK segment?',
    type: 'single',
    options: [
      'Seq = 2001, Ack = 5001',
      'Seq = 2000, Ack = 5000',
      'Seq = 2001, Ack = 2002',
      'Seq = 5001, Ack = 2001',
    ],
    correctAnswer: 0,
    explanation: 'The client’s ACK has Seq = client ISN + 1 = 2001, and Ack = server ISN + 1 = 5001.',
    difficulty: 'Medium',
  },
  {
    id: 'q-10',
    moduleId: 6,
    moduleTitle: 'Transport Layer',
    topic: 'TCP Congestion Control',
    question: 'During TCP Reno Congestion Avoidance, if 3 Duplicate ACKs are received, what action occurs?',
    type: 'single',
    options: [
      'cwnd drops to 1 MSS and Slow Start begins',
      'Fast Retransmit sends missing packet; ssthresh is halved and Fast Recovery continues in Congestion Avoidance',
      'The TCP connection is reset with an RST packet',
      'The sender pauses all transmissions for 2*MSL',
    ],
    correctAnswer: 1,
    explanation: '3 Duplicate ACKs trigger Fast Retransmit and Fast Recovery in TCP Reno, halving ssthresh without resetting cwnd to 1.',
    difficulty: 'Hard',
  },
  {
    id: 'q-11',
    moduleId: 7,
    moduleTitle: 'Application Layer',
    topic: 'HTTP Architecture',
    question: 'Why does HTTP/3 run over QUIC and UDP instead of traditional TCP?',
    type: 'single',
    options: [
      'UDP does not require checksum verification',
      'To eliminate TCP Head-of-Line blocking and enable 0-RTT connection resumption',
      'Because TCP does not support encryption',
      'To prevent DNS lookups',
    ],
    correctAnswer: 1,
    explanation: 'QUIC multiplexes independent byte streams at the transport layer over UDP so that a lost packet on one stream does not block unrelated concurrent streams, completely eliminating transport Head-of-Line blocking.',
    difficulty: 'Hard',
  },
  {
    id: 'q-12',
    moduleId: 9,
    moduleTitle: 'Network Security',
    topic: 'Public Key Infrastructure',
    question: 'In digital signature verification, which key is used to decrypt the signature and verify the original message hash?',
    type: 'single',
    options: [
      'Sender’s Public Key',
      'Sender’s Private Key',
      'Receiver’s Public Key',
      'Receiver’s Private Key',
    ],
    correctAnswer: 0,
    explanation: 'The sender signs using their secret Private Key; any verifier uses the sender’s Public Key to verify the signature.',
    difficulty: 'Medium',
  },
];
