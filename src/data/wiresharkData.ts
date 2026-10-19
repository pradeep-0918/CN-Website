import type { WiresharkCaptureExercise } from '../types/network.ts';

export const wiresharkExercises: WiresharkCaptureExercise[] = [
  {
    id: 'ws-tcp-handshake',
    title: 'Trace 1: TCP Three-Way Handshake & Teardown',
    description: 'Inspect SYN, SYN-ACK, ACK sequence number synchronization and initial window scales.',
    packets: [
      {
        no: 1,
        timeSec: 0.000000,
        source: '192.168.1.105',
        destination: '93.184.216.34',
        protocol: 'TCP',
        lengthBytes: 74,
        info: '52144 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1 WS=128',
        layers: [
          {
            name: 'Frame 1: 74 bytes on wire',
            summary: '74 bytes captured (592 bits)',
            fields: [
              { label: 'Arrival Time', value: 'Oct 19, 2026 10:00:00.000000000 UTC', description: 'Packet timestamp' },
              { label: 'Frame Length', value: '74 bytes', description: 'Wire length including FCS' },
            ],
          },
          {
            name: 'Ethernet II, Src: 3c:22:fb:a1:00:14, Dst: 00:1a:2b:3c:4d:5e',
            summary: 'Destination: Default Gateway, Source: Client NIC',
            fields: [
              { label: 'Destination MAC', value: '00:1a:2b:3c:4d:5e', description: 'Next-hop router interface' },
              { label: 'Source MAC', value: '3c:22:fb:a1:00:14', description: 'Client workstation hardware address' },
              { label: 'Type', value: 'IPv4 (0x0800)', description: 'Network layer protocol' },
            ],
          },
          {
            name: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 93.184.216.34',
            summary: 'IPv4 Header (20 bytes)',
            fields: [
              { label: 'Header Length', value: '20 bytes (5)', description: 'Standard IPv4 header size' },
              { label: 'Time to Live (TTL)', value: '64', description: 'Standard Linux/Mac default TTL' },
              { label: 'Protocol', value: 'TCP (6)', description: 'Transport layer protocol' },
              { label: 'Header Checksum', value: '0xa41c [correct]', description: 'Validated IPv4 header checksum' },
            ],
          },
          {
            name: 'Transmission Control Protocol, Src Port: 52144, Dst Port: 443, Seq: 0',
            summary: 'TCP [SYN] (40 bytes with options)',
            fields: [
              { label: 'Source Port', value: '52144', description: 'Client ephemeral port' },
              { label: 'Destination Port', value: '443 (HTTPS)', description: 'Well-known server TLS port' },
              { label: 'Sequence Number (relative)', value: '0 (raw: 2841029104)', description: 'Client Initial Sequence Number (ISN_c)' },
              { label: 'Flags', value: '0x002 (SYN)', description: 'Synchronize sequence numbers' },
              { label: 'Window', value: '64240', description: 'Initial advertised receive window' },
              { label: 'Maximum Segment Size (MSS)', value: '1460 bytes', description: 'MTU 1500 - 40 bytes' },
              { label: 'Window Scale', value: '7 (multiply by 128)', description: 'RFC 7323 window expansion' },
            ],
          },
        ],
        hexBytes: ['00', '1a', '2b', '3c', '4d', '5e', '3c', '22', 'fb', 'a1', '00', '14', '08', '00', '45', '00', '00', '3c', 'c3', '4e', '40', '00', '40', '06', 'a4', '1c', 'c0', 'a8', '01', '69', '5d', 'b8', 'd8', '22', 'cb', 'b0', '01', 'bb', 'a9', '51', '6f', 'f0', '00', '00', '00', '00', 'a0', '02', 'fa', 'f0', '8f', '2a', '00', '00', '02', '04', '05', 'b4', '04', '02', '08', '0a', '00', '01', 'e2', '40', '00', '00', '00', '00', '01', '03', '03', '07'],
      },
      {
        no: 2,
        timeSec: 0.024182,
        source: '93.184.216.34',
        destination: '192.168.1.105',
        protocol: 'TCP',
        lengthBytes: 74,
        info: '443 → 52144 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460 SACK_PERM=1 WS=256',
        layers: [
          {
            name: 'Frame 2: 74 bytes on wire',
            summary: '74 bytes captured (592 bits)',
            fields: [
              { label: 'Arrival Time', value: 'Oct 19, 2026 10:00:00.024182 UTC', description: 'Round-trip delay: 24.1ms' },
            ],
          },
          {
            name: 'Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: 3c:22:fb:a1:00:14',
            summary: 'Destination: Client, Source: Gateway',
            fields: [
              { label: 'Destination MAC', value: '3c:22:fb:a1:00:14', description: 'Client NIC' },
              { label: 'Source MAC', value: '00:1a:2b:3c:4d:5e', description: 'Gateway incoming port' },
            ],
          },
          {
            name: 'Transmission Control Protocol, Src Port: 443, Dst Port: 52144, Seq: 0, Ack: 1',
            summary: 'TCP [SYN, ACK]',
            fields: [
              { label: 'Sequence Number (relative)', value: '0 (raw: 819401248)', description: 'Server Initial Sequence Number (ISN_s)' },
              { label: 'Acknowledgment Number (relative)', value: '1 (raw: 2841029105)', description: 'Acknowledging Client ISN + 1' },
              { label: 'Flags', value: '0x012 (SYN, ACK)', description: 'Synchronize and Acknowledge' },
              { label: 'Window Scale', value: '8 (multiply by 256)', description: 'Server window scale factor' },
            ],
          },
        ],
        hexBytes: ['3c', '22', 'fb', 'a1', '00', '14', '00', '1a', '2b', '3c', '4d', '5e', '08', '00', '45', '00', '00', '3c', '12', '90', '00', '00', '38', '06', '7e', '52', '5d', 'b8', 'd8', '22', 'c0', 'a8', '01', '69', '01', 'bb', 'cb', 'b0', '30', 'd6', '8b', '60', 'a9', '51', '6f', 'f1', 'a0', '12', 'ff', 'ff', '42', '10', '00', '00', '02', '04', '05', 'b4', '04', '02', '08', '0a', '10', '29', '38', '40', '00', '01', 'e2', '40', '01', '03', '03', '08'],
      },
      {
        no: 3,
        timeSec: 0.024350,
        source: '192.168.1.105',
        destination: '93.184.216.34',
        protocol: 'TCP',
        lengthBytes: 54,
        info: '52144 → 443 [ACK] Seq=1 Ack=1 Win=131072 Len=0',
        layers: [
          {
            name: 'Frame 3: 54 bytes on wire',
            summary: 'Pure ACK completion segment',
            fields: [
              { label: 'Sequence Number', value: '1', description: 'Client byte stream pointer' },
              { label: 'Acknowledgment Number', value: '1', description: 'Server byte stream pointer' },
              { label: 'Flags', value: '0x010 (ACK)', description: 'Connection established!' },
            ],
          },
        ],
        hexBytes: ['00', '1a', '2b', '3c', '4d', '5e', '3c', '22', 'fb', 'a1', '00', '14', '08', '00', '45', '00', '00', '28', 'c3', '4f', '40', '00', '40', '06', 'a4', '2f', 'c0', 'a8', '01', '69', '5d', 'b8', 'd8', '22', 'cb', 'b0', '01', 'bb', 'a9', '51', '6f', 'f1', '30', 'd6', '8b', '61', '50', '10', '04', '00', '9c', '12', '00', '00'],
      },
    ],
    questions: [
      {
        id: 'wq-1',
        question: 'In Packet #2 (SYN-ACK), why is the relative Acknowledgment Number equal to 1?',
        options: [
          'Because the client sent 1 byte of application payload',
          'Because the TCP SYN flag consumes exactly 1 virtual sequence number in the stream',
          'Because the port number is 1',
          'Because it is the default starting value for all ACKs',
        ],
        correctIndex: 1,
        explanation:
          'In TCP, the SYN and FIN control flags consume exactly 1 sequence number space to guarantee reliable delivery, even though they contain 0 bytes of application data.',
      },
      {
        id: 'wq-2',
        question: 'What is the negotiated Maximum Segment Size (MSS) for this TCP connection?',
        options: ['1500 bytes', '1460 bytes', '65535 bytes', '128 bytes'],
        correctIndex: 1,
        explanation: 'Both Packet #1 and Packet #2 specify MSS=1460 bytes (derived from Ethernet MTU 1500 minus 20-byte IP header and 20-byte TCP header).',
      },
    ],
  },
  {
    id: 'ws-tcp-retransmit',
    title: 'Trace 2: Fast Retransmit Triggered by 3 Duplicate ACKs',
    description: 'Diagnose packet loss recovery: sender receives 3 identical ACKs and immediately retransmits.',
    packets: [
      {
        no: 1,
        timeSec: 0.100000,
        source: '10.0.0.10',
        destination: '10.0.0.50',
        protocol: 'TCP',
        lengthBytes: 1514,
        info: '54000 → 80 [PSH, ACK] Seq=1461 Ack=1 Len=1460 (PACKET DROPPED BY SWITCH)',
        layers: [
          {
            name: 'Frame 1: 1514 bytes on wire',
            summary: 'Segment #2 sent by client',
            fields: [
              { label: 'Sequence Number', value: '1461', description: 'Bytes 1461 to 2920' },
              { label: 'Length', value: '1460 bytes', description: 'Full MSS data segment' },
            ],
          },
        ],
        hexBytes: ['00', '50', '56', 'c0', '00', '08', '00', '50', '56', 'c0', '00', '01', '08', '00'],
        isFlaggedAnomaly: true,
        anomalyNote: 'This segment was lost due to queue buffer overflow on intermediate switch.',
      },
      {
        no: 2,
        timeSec: 0.120000,
        source: '10.0.0.50',
        destination: '10.0.0.10',
        protocol: 'TCP',
        lengthBytes: 54,
        info: '80 → 54000 [ACK] Seq=1 Ack=1461 Win=64240 (Dup ACK #1)',
        layers: [
          {
            name: 'Frame 2: TCP Duplicate ACK #1',
            summary: 'Receiver still waiting for byte 1461',
            fields: [
              { label: 'Acknowledgment Number', value: '1461', description: 'Expected next byte' },
              { label: 'Analysis Flag', value: 'TCP Dup ACK 1', description: 'Out-of-order segment received' },
            ],
          },
        ],
        hexBytes: ['00', '50', '56', 'c0', '00', '01', '00', '50', '56', 'c0', '00', '08', '08', '00'],
      },
      {
        no: 3,
        timeSec: 0.121000,
        source: '10.0.0.50',
        destination: '10.0.0.10',
        protocol: 'TCP',
        lengthBytes: 54,
        info: '80 → 54000 [ACK] Seq=1 Ack=1461 Win=64240 (Dup ACK #2)',
        layers: [
          {
            name: 'Frame 3: TCP Duplicate ACK #2',
            summary: 'Second notification that byte 1461 is missing',
            fields: [{ label: 'Acknowledgment Number', value: '1461', description: 'Still expecting 1461' }],
          },
        ],
        hexBytes: ['00', '50', '56', 'c0', '00', '01', '00', '50', '56', 'c0', '00', '08', '08', '00'],
      },
      {
        no: 4,
        timeSec: 0.122000,
        source: '10.0.0.50',
        destination: '10.0.0.10',
        protocol: 'TCP',
        lengthBytes: 54,
        info: '80 → 54000 [ACK] Seq=1 Ack=1461 Win=64240 (Dup ACK #3 - Trigger Fast Retransmit!)',
        layers: [
          {
            name: 'Frame 4: TCP Duplicate ACK #3',
            summary: 'Third duplicate ACK triggers TCP Reno Fast Retransmit threshold',
            fields: [
              { label: 'Acknowledgment Number', value: '1461', description: 'Threshold reached: 3 Dup ACKs' },
            ],
          },
        ],
        hexBytes: ['00', '50', '56', 'c0', '00', '01', '00', '50', '56', 'c0', '00', '08', '08', '00'],
        isFlaggedAnomaly: true,
        anomalyNote: 'Receipt of 3 Duplicate ACKs triggers immediate Fast Retransmit without waiting for RTO timer.',
      },
      {
        no: 5,
        timeSec: 0.123500,
        source: '10.0.0.10',
        destination: '10.0.0.50',
        protocol: 'TCP',
        lengthBytes: 1514,
        info: '54000 → 80 [TCP Retransmission] Seq=1461 Ack=1 Len=1460 (Fast Retransmitted Segment)',
        layers: [
          {
            name: 'Frame 5: Fast Retransmission of Lost Segment',
            summary: 'Client immediately resends bytes 1461-2920',
            fields: [
              { label: 'Sequence Number', value: '1461', description: 'Resending lost bytes' },
              { label: 'Event', value: 'TCP Fast Retransmission', description: 'Triggered by 3 Dup ACKs' },
            ],
          },
        ],
        hexBytes: ['00', '50', '56', 'c0', '00', '08', '00', '50', '56', 'c0', '00', '01', '08', '00'],
        isFlaggedAnomaly: true,
        anomalyNote: 'Fast Retransmission avoids the severe throughput penalty of an exponential RTO timer timeout.',
      },
    ],
    questions: [
      {
        id: 'wq-3',
        question: 'Why does receiving 3 Duplicate ACKs cause the sender to retransmit before the Retransmission Timeout (RTO) expires?',
        options: [
          'Because 3 Duplicate ACKs strongly indicate a single lost segment while later packets are still arriving, making a slow RTO wait unnecessary',
          'Because the receiver will terminate the TCP connection if no retransmission occurs within 1ms',
          'Because the sequence number overflows',
          'Because the checksum failed',
        ],
        correctIndex: 0,
        explanation:
          'If subsequent packets are still arriving, the receiver generates duplicate ACKs for each out-of-order segment. Exactly 3 duplicate ACKs are required to filter out minor network packet reordering, allowing the sender to immediately trigger Fast Retransmit.',
      },
    ],
  },
];
