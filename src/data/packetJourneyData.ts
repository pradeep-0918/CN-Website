import type { PacketJourneyStep } from '../types/network.ts';

export interface PacketJourneyScenario {
  id: 'standard-https' | 'cached-dns' | 'established-tcp' | 'http3-quic' | 'connection-refused';
  name: string;
  tagline: string;
  description: string;
  steps: PacketJourneyStep[];
}

export const standardHttpsScenario: PacketJourneyScenario = {
  id: 'standard-https',
  name: 'Standard Cold HTTPS Request (End-to-End)',
  tagline: 'DNS resolution + TCP 3-Way Handshake + TLS 1.3 + HTTP GET + 2-Hop Routing',
  description: 'Full cold-start journey of a web request from browser keypress to remote web server response.',
  steps: [
    {
      id: 1,
      title: '1. User Enters URL & Application Request Initiation',
      subtitle: 'Browser parses URL and constructs HTTP/1.1 or HTTP/2 GET request',
      layer: 'Application',
      protocol: 'HTTP / Application Engine',
      fromEntity: 'Client Web Browser',
      toEntity: 'Client OS Network Stack',
      networkSegment: 'Client LAN',
      narrative:
        'The user enters "https://api.example.com/data". The browser parses the URL into scheme (https), host (api.example.com), and resource path (/data). Before any bytes can be sent over the wire, the browser needs the target IP address and an encrypted transport socket.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: 'Unresolved (api.example.com)',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: 'Local Stack',
        srcPort: 52144,
        dstPort: 443,
      },
      headersPDU: {
        name: 'HTTP Request Payload',
        fields: [
          { key: 'Method', value: 'GET' },
          { key: 'Path', value: '/data' },
          { key: 'Host', value: 'api.example.com' },
          { key: 'User-Agent', value: 'Mozilla/5.0 (NetworkMasteryLab)' },
          { key: 'Accept', value: 'application/json' },
        ],
      },
      hopModifications: {
        modified: ['Application payload created in browser user-space buffer'],
        unmodified: ['Underlying socket addresses not yet bound'],
      },
      securityAttributes: {
        isEncrypted: false,
        tlsState: 'Unestablished (Plaintext in user-space buffer)',
        integrityMechanism: 'Application checksum (None yet)',
      },
      teachingAssumptions: [
        'Browser local DNS cache, hosts file, and OS DNS cache are checked first (simulating cold cache miss).',
        'Target destination uses standard HTTPS port 443.',
      ],
    },
    {
      id: 2,
      title: '2. Domain Name Resolution (DNS)',
      subtitle: 'Recursive resolver queries Root, TLD (.com), and Authoritative nameservers',
      layer: 'Application',
      protocol: 'DNS (over UDP port 53)',
      fromEntity: 'Client OS Resolver',
      toEntity: 'DNS Recursive Resolver (8.8.8.8)',
      networkSegment: 'Internet Core WAN',
      narrative:
        'Client sends a DNS query for "api.example.com (A record)". The recursive resolver walks the DNS hierarchy: Root (.) -> TLD (.com) -> Authoritative (ns1.example.com). The authoritative server returns IPv4 address 93.184.216.34 with TTL=300.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '8.8.8.8',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e (Gateway Router)',
        srcPort: 54129,
        dstPort: 53,
      },
      headersPDU: {
        name: 'DNS Query / Response PDU',
        fields: [
          { key: 'Transaction ID', value: '0x4a12' },
          { key: 'Flags', value: '0x0100 (Standard recursive query)' },
          { key: 'Questions', value: 'api.example.com: type A, class IN' },
          { key: 'Answer Returned', value: '93.184.216.34 (TTL: 300s)' },
        ],
      },
      hopModifications: {
        modified: ['Client updates OS DNS Cache with 93.184.216.34'],
        unmodified: ['Target domain name resolved permanently for TTL duration'],
      },
      securityAttributes: {
        isEncrypted: false,
        tlsState: 'Traditional DNS (Plain UDP). (DoH/DoT optional in production).',
        integrityMechanism: '16-bit UDP Checksum + Transaction ID matching',
      },
      teachingAssumptions: [
        'Illustrated as standard UDP DNS query for clear architectural visibility.',
      ],
    },
    {
      id: 3,
      title: '3. TCP Three-Way Handshake Connection Establishment',
      subtitle: 'Client and Server synchronize sequence numbers and agree on MSS/Window Scale',
      layer: 'Transport',
      protocol: 'TCP (Port 443)',
      fromEntity: 'Client Socket',
      toEntity: 'Server Socket (93.184.216.34:443)',
      networkSegment: 'Internet Core WAN',
      narrative:
        'Client initiates TCP connection: 1. Client -> Server: [SYN, Seq=1000, MSS=1460, WScale=7]. 2. Server -> Client: [SYN-ACK, Seq=5000, Ack=1001]. 3. Client -> Server: [ACK, Seq=1001, Ack=5001]. Socket transitions to ESTABLISHED state.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '93.184.216.34',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e (Gateway Router)',
        srcPort: 52144,
        dstPort: 443,
      },
      headersPDU: {
        name: 'TCP Header (Handshake SYN-ACK Segment)',
        fields: [
          { key: 'Source Port', value: '52144' },
          { key: 'Destination Port', value: '443' },
          { key: 'Sequence Number', value: '1000' },
          { key: 'Acknowledgment Number', value: '0 (in initial SYN)' },
          { key: 'Flags', value: 'SYN=1, ACK=0, RST=0, FIN=0' },
          { key: 'Window Size', value: '65535 (Scaled)' },
        ],
      },
      hopModifications: {
        modified: ['TCP State: CLOSED -> SYN_SENT -> ESTABLISHED'],
        unmodified: ['IP addresses remain fixed across handshake'],
      },
      securityAttributes: {
        isEncrypted: false,
        tlsState: 'Transport established, cryptographic layer not yet active',
        integrityMechanism: '16-bit TCP Checksum covers pseudo-header + TCP header',
      },
      teachingAssumptions: [
        'MSS negotiated to 1460 bytes for standard 1500-byte Ethernet MTU.',
      ],
    },
    {
      id: 4,
      title: '4. TLS 1.3 Cryptographic Handshake & Key Exchange',
      subtitle: 'Diffie-Hellman Key Exchange (ECDHE) & Certificate Authentication in 1-RTT',
      layer: 'Transport / Security',
      protocol: 'TLS 1.3 (RFC 8446)',
      fromEntity: 'Client TLS Engine',
      toEntity: 'Server TLS Engine',
      networkSegment: 'Internet Core WAN',
      narrative:
        'Client sends ClientHello with supported Cipher Suites (TLS_AES_256_GCM_SHA384) and ECDH KeyShare. Server responds with ServerHello + ECDH KeyShare, EncryptedExtensions, and X.509 Certificate signed by a trusted CA. Both derive symmetric session keys without ever transmitting the secret over the wire.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '93.184.216.34',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e (Gateway Router)',
        srcPort: 52144,
        dstPort: 443,
      },
      headersPDU: {
        name: 'TLS 1.3 Record Layer',
        fields: [
          { key: 'Content Type', value: 'Handshake (22)' },
          { key: 'TLS Version', value: 'TLS 1.3 (0x0304)' },
          { key: 'Negotiated Cipher', value: 'TLS_AES_256_GCM_SHA384' },
          { key: 'Key Exchange', value: 'X25519 Ephemeral Curve' },
          { key: 'Certificate Status', value: 'Valid, Issued by DigiCert Global Root CA' },
        ],
      },
      hopModifications: {
        modified: ['Symmetric AES-256 session key derived in RAM on both endpoints'],
        unmodified: ['Public internet routers only see TLS Record header, cannot read key exchange'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'Encrypted with Perfect Forward Secrecy (PFS)',
        integrityMechanism: 'HMAC-SHA384 / AEAD Authentication Tag',
      },
      teachingAssumptions: [
        'Assumes standard TLS 1.3 single-RTT handshake without session resumption ticket.',
      ],
    },
    {
      id: 5,
      title: '5. Application Data Encryption & TCP Segmentation',
      subtitle: 'HTTP request is encrypted with AES-256-GCM and segmented into TCP MSS chunks',
      layer: 'Transport',
      protocol: 'TCP / TLS Record',
      fromEntity: 'Client OS Kernel',
      toEntity: 'Client NIC Buffer',
      networkSegment: 'Client LAN',
      narrative:
        'The plaintext HTTP GET is encrypted using the negotiated symmetric AES-256 key, generating ciphertext and a 16-byte authentication tag. The OS TCP stack wraps this inside a TCP segment with Sequence Number=1001, sets PSH/ACK flags, and calculates the 16-bit TCP checksum.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '93.184.216.34',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e (Gateway Router)',
        srcPort: 52144,
        dstPort: 443,
      },
      headersPDU: {
        name: 'Encrypted TCP Segment PDU',
        fields: [
          { key: 'Seq Number', value: '1001' },
          { key: 'Ack Number', value: '5001' },
          { key: 'Payload Length', value: '412 bytes (Encrypted HTTP ciphertext)' },
          { key: 'Flags', value: 'PSH=1, ACK=1' },
          { key: 'TCP Checksum', value: '0x8f2a (Valid)' },
        ],
      },
      hopModifications: {
        modified: ['Plaintext converted to cryptographically opaque ciphertext'],
        unmodified: ['TCP port numbers remain visible to middleboxes'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'AES-256-GCM authenticated ciphertext',
        integrityMechanism: 'AEAD Poly1305/GCM Tag + TCP Checksum',
      },
      teachingAssumptions: [
        'Single segment fits within 1460-byte MSS (no IP fragmentation needed).',
      ],
    },
    {
      id: 6,
      title: '6. ARP Next-Hop Resolution & IP Packet Assembly',
      subtitle: 'Client encapsulates segment in IPv4 packet and queries default gateway MAC',
      layer: 'Network & Data Link',
      protocol: 'IPv4 + ARP',
      fromEntity: 'Client Network Stack',
      toEntity: 'Client Network Interface Card (NIC)',
      networkSegment: 'Client LAN',
      narrative:
        'Since destination 93.184.216.34 is outside the local subnet (192.168.1.0/24), the client checks its routing table and selects default gateway 192.168.1.1. If the gateway\'s MAC is not in the ARP table, an ARP broadcast ("Who has 192.168.1.1? Tell 192.168.1.105") is sent. Gateway replies with its MAC: 00:1a:2b:3c:4d:5e.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '93.184.216.34',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e (Default Gateway Router)',
        srcPort: 52144,
        dstPort: 443,
      },
      headersPDU: {
        name: 'IPv4 Datagram Header',
        fields: [
          { key: 'Version', value: '4' },
          { key: 'IHL', value: '5 (20 bytes)' },
          { key: 'Total Length', value: '432 bytes' },
          { key: 'TTL', value: '64' },
          { key: 'Protocol', value: '6 (TCP)' },
          { key: 'Header Checksum', value: '0xa41c' },
        ],
      },
      hopModifications: {
        modified: ['ARP cache entry populated with default gateway MAC'],
        unmodified: ['Source IP is Client (192.168.1.105), Dst IP is Server (93.184.216.34)'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'Payload encrypted, IP/TCP headers visible for routing',
        integrityMechanism: 'IPv4 Header Checksum',
      },
      teachingAssumptions: [
        'Local gateway router performs standard Network Address Translation (NAT) when routing to the WAN.',
      ],
    },
    {
      id: 7,
      title: '7. Local Link Frame Transmission (Ethernet II)',
      subtitle: 'Physical bit transmission over copper/fiber link with CRC-32 Frame Check Sequence',
      layer: 'Data Link & Physical',
      protocol: 'Ethernet 802.3',
      fromEntity: 'Client NIC',
      toEntity: 'Home / Office Gateway Switch',
      networkSegment: 'Client LAN',
      narrative:
        'Client NIC appends Ethernet header: Preamble (7 bytes) + SFD (1 byte) + Dst MAC (00:1a:2b:3c:4d:5e) + Src MAC (3c:22:fb:a1:00:14) + EtherType (0x0800 IPv4) + Payload + CRC-32 Frame Check Sequence (4 bytes). Transmitted as Manchester/4B5B encoded voltage pulses onto Cat6 cable.',
      addresses: {
        srcIp: '192.168.1.105',
        dstIp: '93.184.216.34',
        srcMac: '3c:22:fb:a1:00:14',
        dstMac: '00:1a:2b:3c:4d:5e',
      },
      headersPDU: {
        name: 'Ethernet II Frame Structure',
        fields: [
          { key: 'Preamble + SFD', value: '8 bytes synchronization' },
          { key: 'Destination MAC', value: '00:1a:2b:3c:4d:5e (Gateway Router)' },
          { key: 'Source MAC', value: '3c:22:fb:a1:00:14 (Client NIC)' },
          { key: 'EtherType', value: '0x0800 (IPv4)' },
          { key: 'FCS / CRC-32', value: '0xd7a5b1c9' },
        ],
      },
      hopModifications: {
        modified: ['Electrical / optical bit modulation onto physical transmission medium'],
        unmodified: ['IP and TCP headers inside payload remain untouched'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'Encrypted end-to-end payload',
        integrityMechanism: 'Hardware CRC-32 polynomial division across entire Ethernet frame',
      },
      teachingAssumptions: [
        'Ethernet link operating at 1 Gbps full-duplex without collisions.',
      ],
    },
    {
      id: 8,
      title: '8. WAN Router Forwarding & Hop Modifications',
      subtitle: 'Router decrements TTL, recalculates checksum, and rewrites MAC addresses',
      layer: 'Network',
      protocol: 'IPv4 / BGP Autonomous System Routing',
      fromEntity: 'Gateway Router (Hop 1)',
      toEntity: 'Tier-1 Transit Provider Router (Hop 2)',
      networkSegment: 'Internet Core WAN',
      narrative:
        'Crucial Networking First Principle: Intermediate routers STRIP the incoming Data Link Ethernet header. The router inspects the IP header: 1. Decrements TTL from 64 to 63 (drops packet if TTL=0). 2. Recalculates IPv4 header checksum. 3. Performs longest-prefix routing table lookup. 4. Encapsulates with NEW Data Link header: Src MAC = Outgoing Router interface, Dst MAC = Next-hop router. IP ADDRESSES DO NOT CHANGE (except in NAT).',
      addresses: {
        srcIp: '198.51.100.22 (NAT Public IP)',
        dstIp: '93.184.216.34',
        srcMac: 'f0:92:1c:44:88:99 (Router Outgoing Interface)',
        dstMac: 'e4:aa:5d:11:22:33 (ISP Gateway Router)',
      },
      headersPDU: {
        name: 'Updated IPv4 Header at Router Hop',
        fields: [
          { key: 'TTL', value: '63 (Decremented by 1)' },
          { key: 'Header Checksum', value: '0xb52d (Recalculated)' },
          { key: 'Source IP', value: '198.51.100.22 (NAT applied)' },
          { key: 'Destination IP', value: '93.184.216.34 (Unchanged)' },
          { key: 'New Next-Hop MAC', value: 'e4:aa:5d:11:22:33' },
        ],
      },
      hopModifications: {
        modified: [
          'TTL decremented by 1 at every router hop',
          'IPv4 Header Checksum recalculated',
          'Layer 2 MAC addresses completely stripped and rewritten for next physical link',
        ],
        unmodified: [
          'Original TCP payload and encrypted application data remain 100% unaltered',
          'Destination IP remains 93.184.216.34 throughout entire Internet transit',
        ],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'Routers cannot read encrypted payload',
        integrityMechanism: 'Per-hop CRC-32 and IPv4 Header Checksum verification',
      },
      teachingAssumptions: [
        'Standard BGP internet routing over fiber optical backbones.',
      ],
    },
    {
      id: 9,
      title: '9. Server Receipt, Decapsulation & HTTP Execution',
      subtitle: 'Server verifies checksums, strips headers, decrypts TLS, and executes handler',
      layer: 'Application & System',
      protocol: 'Web Application Server (Nginx / Node / Go)',
      fromEntity: 'Server Network Interface Card',
      toEntity: 'Server Web Application Process',
      networkSegment: 'Target Web Server',
      narrative:
        'Server NIC validates CRC-32. Kernel verifies IP address matches local interface and TCP checksum is valid. Packet is delivered to socket queue. TLS engine uses symmetric session key to decrypt ciphertext. HTTP parser reads "GET /data", calls backend API handler, fetches database record, and writes HTTP 200 OK JSON response into socket send buffer.',
      addresses: {
        srcIp: '93.184.216.34',
        dstIp: '198.51.100.22',
        srcMac: '00:50:56:c0:00:08 (Server NIC)',
        dstMac: '00:50:56:c0:00:01 (Datacenter Gateway)',
        srcPort: 443,
        dstPort: 52144,
      },
      headersPDU: {
        name: 'HTTP 200 OK Response Payload',
        fields: [
          { key: 'HTTP Status', value: '200 OK' },
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Content-Length', value: '184' },
          { key: 'Cache-Control', value: 'max-age=60, public' },
          { key: 'Body Preview', value: '{"status":"success","data":{"nodes":42,"latency_ms":12}}' },
        ],
      },
      hopModifications: {
        modified: ['Server transitions TCP state and creates response segment'],
        unmodified: ['Client socket session preserved'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'Response encrypted with same symmetric AES-256 session key',
        integrityMechanism: 'AEAD authentication tag appended to response record',
      },
      teachingAssumptions: [
        'Backend server returns 200 OK JSON response with sub-10ms processing time.',
      ],
    },
    {
      id: 10,
      title: '10. Response Journey Back & Browser DOM Tree Render',
      subtitle: 'Packets traverse reverse route, client decrypts stream, and paints pixels',
      layer: 'Application',
      protocol: 'Browser Rendering Engine',
      fromEntity: 'Client Operating System',
      toEntity: 'Client Screen Display',
      networkSegment: 'Client LAN',
      narrative:
        'Response packets travel back through datacenter routers, internet transit, and home gateway NAT. Client NIC verifies FCS, TCP stack acknowledges receipt with ACK segment. TLS layer decrypts payload. Browser receives JSON, updates application state, fires DOMContentLoaded / network waterfall events, and renders the data on screen. Total Round-Trip Time (RTT): ~28ms.',
      addresses: {
        srcIp: '93.184.216.34',
        dstIp: '192.168.1.105',
        srcMac: '00:1a:2b:3c:4d:5e',
        dstMac: '3c:22:fb:a1:00:14',
        srcPort: 443,
        dstPort: 52144,
      },
      headersPDU: {
        name: 'Client Browser Render Complete',
        fields: [
          { key: 'Total Round-Trip Time (RTT)', value: '28 ms' },
          { key: 'TCP Connection Status', value: 'ESTABLISHED (Keep-Alive pool for subsequent requests)' },
          { key: 'DOM Event', value: 'State updated and UI components rendered' },
        ],
      },
      hopModifications: {
        modified: ['Browser memory and Virtual DOM updated with response data'],
        unmodified: ['TCP connection kept alive in socket pool to avoid 3-way handshake on next click'],
      },
      securityAttributes: {
        isEncrypted: true,
        tlsState: 'End-to-End Secure Transaction Successfully Completed',
        integrityMechanism: 'All layer checksums and cryptographic MACs verified',
      },
      teachingAssumptions: [
        'Keep-Alive connection kept open for 60 seconds for subsequent requests.',
      ],
    },
  ],
};
