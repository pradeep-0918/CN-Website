import { Module } from '../../types/network';

export const module6: Module = {
  id: 6,
  title: 'Transport Layer',
  tagline: 'End-to-End Reliability, TCP Handshake, Sockets & Congestion Control',
  description: 'Deep dive into process-to-process communication, port numbers, TCP vs UDP, TCP 3-way handshake mechanics, sequence/ack number math, connection termination, and congestion control algorithms.',
  iconName: 'Cpu',
  level: 'Advanced',
  lessons: [
    {
      id: 'm6-l1',
      moduleId: 6,
      chapterNumber: '6.1',
      title: 'Ports, Sockets & TCP vs UDP Fundamental Tradeoffs',
      slug: 'ports-sockets-and-tcp-vs-udp',
      readTime: '12 min read',
      summary: 'Understand 16-bit port numbers, 5-tuple socket binding, and analyze the architectural tradeoffs between reliable connection-oriented TCP and lightweight stateless UDP.',
      learningObjectives: [
        'Define a socket 5-tuple (Src IP, Src Port, Dst IP, Dst Port, Protocol).',
        'Distinguish Well-Known (0-1023), Registered (1024-49151), and Ephemeral ports (49152-65535).',
        'Compare TCP (ordered, reliable, flow-controlled) with UDP (datagram, connectionless, low latency).',
      ],
      prerequisites: ['Module 2 & 5'],
      beginnerExplanation:
        'Your computer’s IP address gets a packet to your house. But once inside, how does your operating system know whether the packet belongs to your Chrome browser, your Spotify stream, or your Zoom call? That is what Port Numbers do. An IP address is like the building street address; the port number is the apartment number inside the building. TCP is like certified registered mail with signatures required; UDP is like a postcard tossed on your doorstep.',
      technicalExplanation:
        'The Transport Layer provides process-to-process logical communication. Endpoints are identified by a Socket 5-tuple: `(Source IP, Source Port, Destination IP, Destination Port, Transport Protocol)`.\n\nPort Numbers (16-bit, 0 to 65535):\n- Well-Known Ports (0 - 1023): Assigned by IANA for core system services (HTTP: 80, HTTPS: 443, SSH: 22, DNS: 53, SMTP: 25, DHCP: 67/68).\n- Registered Ports (1024 - 49151): Vendor-specific applications (MySQL: 3306, PostgreSQL: 5432, Redis: 6379).\n- Dynamic / Ephemeral Ports (49152 - 65535): Allocated on-the-fly by client OS for outbound requests.\n\nTCP (Transmission Control Protocol - RFC 793):\n- Connection-oriented (requires 3-way handshake before data transfer).\n- Byte-stream abstraction: data is a continuous stream of numbered octets.\n- 100% Reliability: sequence numbers, ACKs, retransmission timers, duplicate detection.\n- In-order delivery: buffers out-of-order packets.\n- Congestion and flow control built-in.\n- Header size: 20 Bytes minimum (up to 60 Bytes with options).\n\nUDP (User Datagram Protocol - RFC 768):\n- Connectionless: zero handshake delay.\n- Message-oriented: preserves application datagram boundaries.\n- Unreliable: no ACKs, no retransmissions, no ordering guarantees.\n- Minimal header: exactly 8 Bytes (Source Port, Destination Port, Length, Checksum).\n- Ideal for real-time gaming, VoIP (RTP), DNS queries, live video broadcasting, and QUIC (HTTP/3).',
      realWorldAnalogy: {
        title: 'Phone Call vs Postcard',
        story: 'TCP is dialing a friend’s phone number, hearing them say "Hello", verifying that they can hear you, and having a confirmed dialogue where you repeat yourself if the call breaks up. UDP is dropping postcards into the mailbox. Some postcards might arrive tomorrow, some next week, some out of order, and one might get lost in the rain. But you never spent time waiting for the phone line to connect.',
        takeaway: 'TCP trades latency and bandwidth for reliability; UDP trades reliability for raw speed and zero setup latency.',
      },
      tanglishExplanation:
        'IP address namma computer-kku varum, aana computer-kulla Chrome-aa, Zoom-aa, illa Spotify-aa nu identify panna Port Numbers thevai (0 to 65535). TCP vandhu connection-oriented: 3-way handshake panni, sequence numbers vechu 100% reliable-a data anuppum. Oru packet miss aana thirumba anuppum. UDP vandhu connectionless: no handshake, no guarantee, aana super fast! Live gaming, voice call, video streaming-kku UDP thaan best.',
      practicalExamples: [
        {
          title: 'Checking Open Listening Sockets with Netstat / SS',
          scenario: 'Inspect active socket bindings on a web server.',
          solution: 'Run `ss -tulpn` in Linux. Output shows: `tcp LISTEN 0 128 0.0.0.0:443 0.0.0.0:* users:(("nginx",pid=1234,fd=6))` showing Nginx listening on TCP 443.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming UDP has no checksum and performs zero integrity verification.',
          reality: 'UDP has a mandatory 16-bit checksum in IPv6 (and optional/standard in IPv4). If a UDP packet has corrupted bits, the receiving operating system drops the packet silently. UDP does not attempt retransmission, but it will NOT deliver corrupted bits to the application.',
          whyItMatters: 'Unreliable does not mean corrupted; it means packets may be dropped without retry.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why does DNS use UDP for standard queries, but TCP for Zone Transfers and large responses (> 512 bytes)?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'A DNS lookup is typically a single request and single response. Using UDP avoids the overhead of a 3-way handshake (1 RTT) and connection teardown. If the UDP request times out, the client resolver simply retries. However, DNS switches to TCP (Port 53) when responses exceed the classic 512-byte UDP payload limit (using the Truncation bit TC=1), when performing DNSSEC cryptographic exchanges, or during DNS Zone Transfers (AXFR/IXFR) between authoritative servers where reliable full-database replication is mandatory.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-6-1',
          question: 'What is the minimum header size of a TCP segment and a UDP datagram respectively?',
          type: 'single',
          options: ['20 bytes and 8 bytes', '16 bytes and 4 bytes', '32 bytes and 16 bytes', '40 bytes and 20 bytes'],
          correctIndex: 0,
          explanation: 'TCP has a 20-byte minimum header (up to 60 with options); UDP has a fixed 8-byte header.',
        },
      ],
      keyTakeaways: [
        'Sockets are defined by the 5-tuple: (Src IP, Src Port, Dst IP, Dst Port, Protocol).',
        'TCP guarantees reliable, ordered byte-stream delivery with congestion control.',
        'UDP provides low-overhead, connectionless datagram delivery used by real-time applications and DNS.',
      ],
      flashcards: [
        { front: 'What is the size of a UDP header?', back: '8 Bytes (Source Port, Destination Port, Length, Checksum)' },
        { front: 'What is an ephemeral port?', back: 'A temporary dynamic port number (49152–65535) allocated by the client OS for the duration of a connection.' },
      ],
    },
    {
      id: 'm6-l2',
      moduleId: 6,
      chapterNumber: '6.2',
      title: 'TCP Three-Way Handshake & Connection Teardown',
      slug: 'tcp-three-way-handshake-and-teardown',
      readTime: '16 min read',
      summary: 'Step through SYN, SYN-ACK, ACK sequence number math, RFC 6528 cryptographic ISN selection, 4-way FIN/ACK termination, and the 2MSL TIME_WAIT state.',
      learningObjectives: [
        'Diagram the 3-Way Handshake and calculate sequence/acknowledgment numbers with payload data.',
        'Explain why Initial Sequence Numbers (ISNs) are randomized cryptographically (RFC 6528) instead of starting at zero.',
        'Trace the 4-way termination exchange (FIN, ACK, FIN, ACK) and distinguish FIN_WAIT_2 from CLOSE_WAIT.',
        'Prove why the active closer must linger in TIME_WAIT for 2*MSL before releasing socket resources.',
      ],
      prerequisites: ['Lesson 6.1: Ports and Sockets'],
      beginnerExplanation:
        'Before two computers exchange a single web page over TCP, they establish mutual trust and agree on starting byte counters using the 3-Way Handshake. Imagine a telephone call between Alice and Bob:\n1. Alice dials Bob and says: "Hello Bob! Can you hear me? I am starting my byte counter at 1000" (SYN flag, Seq = 1000).\n2. Bob answers: "Hello Alice! Yes, I hear you loud and clear. I received your 1000 and expect byte 1001 next. Can you hear me? I am starting my byte counter at 5000" (SYN+ACK flags, Seq = 5000, Ack = 1001).\n3. Alice replies: "Yes, Bob, I hear you too! I received your 5000 and expect byte 5001" (ACK flag, Seq = 1001, Ack = 5001).\n\nAt this exact moment, both sides have verified that the two-way telephone line works in both directions, both agreed on starting counters, and real payload bytes can now flow safely.',
      technicalExplanation:
        'Transmission Control Protocol (TCP, RFC 793 / RFC 9293) establishes full-duplex, reliable byte-stream synchronization using the Three-Way Handshake and terminates via an independent Four-Way Teardown.\n\n1. Initial Sequence Number (ISN) Selection (RFC 6528):\nWhy don’t TCP sequence numbers always start at zero?\n• Reason 1 - Security (Off-Path Spoofing Attacks): If ISNs started at 0 or incremented predictably, an attacker could forge TCP packets with guessed sequence numbers and hijack sessions (the Kevin Mitnick IP-spoofing attack).\n• Reason 2 - Stale Duplicate Collision: Packets can get delayed in router buffers. If a previous connection on the same 5-tuple closed and a new incarnation immediately reused Seq=0, delayed "zombie" packets from the dead connection would be accepted as valid payload data.\n• Solution (RFC 6528): $ISN = M + F(\\text{LocalIP}, \\text{LocalPort}, \\text{RemoteIP}, \\text{RemotePort}, \\text{SecretKey})$, where $M$ is a monotonic clock advancing every 4 microseconds and $F$ is a cryptographic hash (PRF).\n\n2. The "Phantom Byte" Theorem:\nWhy do SYN and FIN flags increment the sequence number by 1 ($Ack = Seq + 1$) even though they carry ZERO data bytes?\n• Sequence numbers exist to guarantee reliability. Any control flag that alters the connection state MUST be reliably acknowledged.\n• If SYN consumed 0 sequence numbers, the server’s ACK would be $Ack = Seq$. The client would have no way to distinguish between an ACK acknowledging the SYN flag itself versus an ACK acknowledging a zero-byte probe packet! Hence, SYN and FIN each consume exactly one logical sequence number (a "phantom byte"). Pure ACK packets, by contrast, consume zero sequence numbers.\n\n3. The 3-Way Handshake Exchange Ladder:\nClient (Active Opener)                               Server (Passive Listener)\n[CLOSED]                                             [LISTEN]\n   |                                                    |\n   | ─── Step 1: SYN (Seq=X, Ack=0) ─────────────────>  | [SYN_RCVD] (Kernel allocates backlog)\n[SYN_SENT]                                              |\n   |                                                    |\n   | <── Step 2: SYN+ACK (Seq=Y, Ack=X+1) ────────────  |\n   |                                                    |\n[ESTABLISHED]                                           |\n   | ─── Step 3: ACK (Seq=X+1, Ack=Y+1) ─────────────>  | [ESTABLISHED]\n   |                                                    |\n   ═════════════════ FULL-DUPLEX DATA TRANSFER ═════════════════\n\n4. Why a 2-Way Handshake Fails (Proof by Counter-Example):\nSuppose TCP used only 2 messages (Client SYN -> Server ACK). Consider an old duplicate SYN delayed in network queues for 5 minutes. The original client already timed out and gave up. When the zombie SYN finally reaches the server, the server replies with an ACK and immediately transitions to ESTABLISHED, allocating memory and waiting for data that will NEVER arrive (a half-open ghost connection). In a 3-way handshake, the server replies with SYN-ACK; the client receives an ACK for a connection it knows nothing about, and immediately transmits an RST (Reset) segment, instantly aborting the ghost session.\n\n5. Connection Teardown (4-Way Handshake) & The 2MSL TIME_WAIT State:\nBecause TCP is full-duplex, the forward and reverse directions are shut down independently:\nHost A (Active Closer)                               Host B (Passive Closer)\n[ESTABLISHED]                                        [ESTABLISHED]\n   | ─── Step 1: FIN (Seq=U, Ack=W) ─────────────────>  | [CLOSE_WAIT] (App flushes remaining buffers)\n[FIN_WAIT_1]                                            |\n   | <── Step 2: ACK (Seq=W, Ack=U+1) ────────────────  |\n[FIN_WAIT_2] (Half-closed: can still read)              |\n   | <── Step 3: FIN (Seq=V, Ack=U+1) ────────────────  | [LAST_ACK]\n[TIME_WAIT]                                             |\n   | ─── Step 4: ACK (Seq=U+1, Ack=V+1) ─────────────>  | [CLOSED]\n   | (Waits 2 * MSL = 60 to 120 seconds)                |\n[CLOSED]                                                |\n\nWhy does Host A linger in TIME_WAIT for 2*MSL (Maximum Segment Lifetime)?\n1. Reliable Teardown Guarantee: If Host A’s final ACK (Step 4) is dropped by the network, Host B will time out and retransmit its FIN. If Host A had closed immediately, it would respond with an RST, making Host B believe an abnormal error occurred.\n2. Draining Zombie Packets: Guarantees that all lingering duplicate packets traveling across the Internet fully expire before a new socket incarnation reuses the same 5-tuple.',
      realWorldAnalogy: {
        title: 'Ending a Formal Diplomatic Call',
        story: 'Ambassador A says: "I have concluded my remarks, I am hanging up" (FIN). Ambassador B replies: "Understood, but let me finish my last two sentences" (ACK). Ambassador B finishes speaking and says: "I am now concluded as well, goodbye" (FIN). Ambassador A says: "Goodbye" (ACK), but waits with the handset to their ear for 30 seconds (TIME_WAIT) just in case Ambassador B shouts: "Wait, did you hear my goodbye?" If so, Ambassador A can repeat "Goodbye" without causing confusion.',
        takeaway: 'TIME_WAIT prevents orphan packets from corrupting future connections.',
      },
      tanglishExplanation:
        'TCP 3-Way Handshake step-by-step: 1) Client Server-kku `SYN` anuppum (Seq = X). 2) Server Client-kku `SYN-ACK` anuppum (Seq = Y, Ack = X + 1). 3) Client Server-kku `ACK` anuppum (Seq = X + 1, Ack = Y + 1). Connection ESTABLISHED! Close pannumpothu 4 steps: FIN -> ACK -> FIN -> ACK. Client kadaisiya `TIME_WAIT` state-la 2 * MSL (approx 1-2 mins) wait pannum. Enna kaaranam-na, final ACK lost aana server thirumba FIN anuppum, adha handle panna thaan!',
      practicalExamples: [
        {
          title: 'Simulating SYN Flood Attack & SYN Cookies Defense',
          scenario: 'An attacker floods a web server with thousands of spoofed SYN packets, never sending the third ACK.',
          solution: 'Server’s SYN backlog queue overflows, rejecting legitimate clients. Mitigation: SYN Cookies (RFC 4987), where server does not allocate memory for half-open sockets; instead, it encodes session parameters into the server ISN mathematically.',
        },
      ],
      numericalProblems: [
        {
          problem: 'In a TCP connection, Client initiates handshake with ISN_c = 5000. Server replies with ISN_s = 9000. In Step 3, the client establishes connection and piggybacks a 250-byte HTTP GET request. What are: (a) Step 2 Server Seq and Ack, (b) Step 3 Client Seq and Ack, (c) Server’s subsequent ACK number after successfully receiving the 250-byte HTTP request?',
          given: { 'Client ISN (X)': '5000', 'Server ISN (Y)': '9000', 'Payload Size': '250 Bytes' },
          formula: 'SYN consumes 1 phantom byte; Data payload consumes N sequence numbers (Seq_next = Seq + N)',
          stepByStepSolution: [
            'Step 2 (Server SYN-ACK): Seq = Server ISN = 9000; Ack = Client ISN + 1 (consuming client SYN) = 5000 + 1 = 5001.',
            'Step 3 (Client ACK + Piggybacked HTTP Request): Seq = 5001; Ack = Server ISN + 1 (consuming server SYN) = 9000 + 1 = 9001.',
            'Client sends 250 bytes of HTTP data with sequence numbers 5001 through 5250 (5001 + 250 - 1 = 5250).',
            'Subsequent Server ACK: Server acknowledges all bytes received through 5250, specifying the next expected byte: Ack = 5001 + 250 = 5251.',
          ],
          answer: 'Step 2: Seq=9000, Ack=5001; Step 3: Seq=5001, Ack=9001; Subsequent Server ACK = 5251.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking connection termination is always a 3-way exchange.',
          reality: 'TCP connection teardown is inherently a 4-way exchange because it is full-duplex. However, if the server has no remaining data to transmit, its operating system can combine step 2 (ACK) and step 3 (FIN) into a single FIN+ACK packet, optimizing it into 3 packets in practice.',
          whyItMatters: 'Understanding both the theoretical 4-way and combined 3-way teardowns is vital for packet capture analysis.',
        },
        {
          mistake: 'Assuming a pure ACK segment consumes a sequence number.',
          reality: 'Only segments carrying payload data or connection-altering flags (SYN or FIN) consume sequence numbers. A standalone ACK consumes zero sequence numbers.',
          whyItMatters: 'Miscalculating sequence numbers leads to completely erroneous protocol trace analysis.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why does TCP require a 3-way handshake rather than a 2-way handshake to establish a connection?',
          frequency: 'Essential',
          target: 'FAANG / Cisco',
          answer:
            'A 2-way handshake fails in the presence of delayed duplicate packets. Suppose a client sends a SYN that gets delayed in the network. The client times out, opens a new connection, finishes, and closes it. Later, the old duplicate SYN finally arrives at the server. With a 2-way handshake, the server would send an ACK and immediately assume a live connection is open, allocating memory and waiting for data that will never arrive (a half-open ghost connection). In a 3-way handshake, the server sends a SYN-ACK, but the client rejects it with an RST (Reset) because the acknowledgment does not match any active client sequence expectation.',
        },
        {
          question: 'Which host enters the TIME_WAIT state and why is its duration set to 2*MSL?',
          frequency: 'High',
          target: 'FAANG',
          answer:
            'Only the active closer (the side that initiates the teardown by transmitting the first FIN) enters TIME_WAIT. It waits 2*MSL (typically 60 to 120 seconds) for two reasons: 1) To be able to retransmit the final ACK if it was lost and the remote side retransmits its FIN; 2) To ensure all lingering duplicate packets in the network expire before the same IP/Port socket pair can be reopened.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-6-2-1',
          question: 'Which TCP state does the active closer enter after sending the final ACK in a 4-way connection termination?',
          type: 'single',
          options: ['FIN_WAIT_2', 'CLOSE_WAIT', 'TIME_WAIT', 'LAST_ACK'],
          correctIndex: 2,
          explanation: 'The host that initiated the close enters TIME_WAIT and remains there for 2*MSL to ensure the remote host received the final ACK.',
        },
        {
          id: 'p-6-2-2',
          question: 'If a client initiates a TCP handshake with ISN = 4000 and the server responds with ISN = 8000, what are the Seq and Ack numbers in the server’s SYN-ACK segment?',
          type: 'single',
          options: [
            'Seq = 8000, Ack = 4000',
            'Seq = 8000, Ack = 4001',
            'Seq = 8001, Ack = 4001',
            'Seq = 4001, Ack = 8001',
          ],
          correctIndex: 1,
          explanation: 'The server sets its own sequence number to its ISN (8000) and acknowledges the client’s SYN by consuming 1 phantom byte: Ack = 4000 + 1 = 4001.',
        },
      ],
      keyTakeaways: [
        '3-Way Handshake synchronizes bidirectional Initial Sequence Numbers (ISNs).',
        'SYN and FIN control flags consume exactly 1 sequence number space (phantom byte).',
        'TIME_WAIT prevents delayed duplicate packets from corrupting reincarnated connections and ensures reliable teardown.',
      ],
      flashcards: [
        { front: 'How many sequence numbers does a SYN flag consume?', back: 'Exactly 1 sequence number.' },
        { front: 'Why does TCP stay in TIME_WAIT for 2*MSL?', back: 'To allow lingering network packets to expire and guarantee the remote peer received the final ACK.' },
      ],
    },
    {
      id: 'm6-l3',
      moduleId: 6,
      chapterNumber: '6.3',
      title: 'TCP Flow Control vs Congestion Control (Tahoe, Reno & CUBIC)',
      slug: 'tcp-flow-control-and-congestion-control',
      readTime: '15 min read',
      summary: 'Master TCP sliding window flow control (Receive Window rwnd) vs network bottleneck congestion control (Congestion Window cwnd), Slow Start, Congestion Avoidance, and Fast Recovery.',
      learningObjectives: [
        'Differentiate Flow Control (preventing receiver buffer overflow via rwnd) from Congestion Control (preventing intermediate router queue drops via cwnd).',
        'Trace the 4 phases: Slow Start (exponential growth), Congestion Avoidance (additive increase), Fast Retransmit, and Fast Recovery (multiplicative decrease - AIMD).',
        'Calculate effective transmission window: W = min(cwnd, rwnd).',
      ],
      prerequisites: ['Lesson 6.2: TCP 3-Way Handshake'],
      beginnerExplanation:
        'Imagine drinking water through a straw. Flow Control is the receiver saying: "Hey, do not pour faster than my mouth can swallow, or I will choke" (Receiver Window). Congestion Control is checking whether the water pipes on the entire street are bursting from too much pressure (Router queues). Even if the receiver has an enormous mouth, if the city water pipes are clogged, the sender must slow down.',
      technicalExplanation:
        'The sender transmits data bounded by: $W = \\min(\\text{cwnd}, \\text{rwnd})$\n- `rwnd` (Receive Window): Advertised by receiver in TCP header based on available socket buffer space. Prevents receiver overflow.\n- `cwnd` (Congestion Window): Dynamically estimated by sender based on network feedback (RTT and packet loss). Prevents network collapse.\n\nKey Algorithms (RFC 5681):\n1. Slow Start:\n- Starts with initial cwnd = 1 to 10 MSS (Maximum Segment Size, typically 1460 bytes).\n- For every incoming ACK received, cwnd increments by 1 MSS: $\\text{cwnd} = \\text{cwnd} + 1 \\text{ MSS}$.\n- This produces EXPONENTIAL growth ($1 \\to 2 \\to 4 \\to 8 \\to 16$ MSS per RTT).\n- Continues until cwnd reaches the Slow Start Threshold (`ssthresh`).\n\n2. Congestion Avoidance (AIMD - Additive Increase Multiplicative Decrease):\n- Once $\\text{cwnd} \\ge \\text{ssthresh}$, growth switches from exponential to linear.\n- Increases by 1 MSS per RTT (or $\\frac{\\text{MSS} \\times \\text{MSS}}{\\text{cwnd}}$ per ACK).\n- Probes network capacity gently.\n\n3. Loss Detection & Recovery:\n- Case A: Retransmission Timeout (RTO expires):\n  - Severe congestion indicator.\n  - $\\text{ssthresh} = \\max(2 \\text{ MSS}, \\text{cwnd} / 2)$.\n  - $\\text{cwnd} = 1 \\text{ MSS}$ (resets completely to Slow Start).\n- Case B: 3 Duplicate ACKs (Fast Retransmit & Fast Recovery - TCP Reno):\n  - Mild loss (packets are still getting through, triggering duplicate ACKs for missing packet).\n  - Fast Retransmit: Immediately retransmits missing packet without waiting for RTO timer.\n  - Fast Recovery: Sets $\\text{ssthresh} = \\text{cwnd} / 2$, and sets $\\text{cwnd} = \\text{ssthresh} + 3 \\text{ MSS}$. Enters Congestion Avoidance without dropping back to cwnd = 1!\n\nModern TCP Variants:\n- TCP CUBIC (default in Linux, Windows): Replaces linear AIMD with a cubic growth function centered around the previous congestion window for high-bandwidth-delay product links.\n- BBR (Bottleneck Bandwidth and RTT, Google): Model-based congestion control that measures delivery rate and min RTT directly rather than relying on packet drops.',
      realWorldAnalogy: {
        title: 'Entering a Crowded Highway',
        story: 'When you merge onto a dark highway, you speed up quickly: 20, 40, 80 km/h (Slow Start exponential). Once you reach the speed limit threshold (ssthresh), you accelerate very cautiously, 1 km/h at a time (Congestion Avoidance). If you suddenly see brake lights ahead (3 duplicate ACKs), you tap the brakes to half speed, let the jam clear, and resume cruising (Fast Recovery). But if you smash into a complete standstill pileup (Timeout), you stop completely to 0 km/h and start crawling in first gear all over again.',
        takeaway: 'AIMD provides mathematical stability and fair resource sharing among competing TCP flows.',
      },
      tanglishExplanation:
        'Flow Control-na receiver buffer overflow aagama paathukradhu (`rwnd`). Congestion Control-na internet routers overload aagi packets drop aagama paathukradhu (`cwnd`). Effective window = min(cwnd, rwnd). Slow Start-la window exponential-a double aagum (1, 2, 4, 8...). `ssthresh` reach aanavudan Congestion Avoidance linear-a (+1 per RTT) pogum. Oru packet drop aana: 3 Duplicate ACKs vandha window half aagum (Fast Recovery), aana Timeout aana window 1-kku drop aagidum!',
      practicalExamples: [
        {
          title: 'Checking Linux TCP Congestion Control Algorithm',
          scenario: 'Inspect current default congestion control on your machine.',
          solution: 'Run `sysctl net.ipv4.tcp_congestion_control`. On modern Ubuntu/Debian, it outputs: `net.ipv4.tcp_congestion_control = cubic` (or `bbr`).',
        },
      ],
      numericalProblems: [
        {
          problem: 'A TCP connection is in Congestion Avoidance with cwnd = 32 KB and ssthresh = 32 KB. MSS is 1 KB. A timeout occurs. What are the new values of ssthresh and cwnd?',
          given: { 'Current cwnd': '32 KB', 'MSS': '1 KB', 'Event': 'Retransmission Timeout (RTO)' },
          formula: 'ssthresh = max(2*MSS, cwnd / 2) ; cwnd = 1 * MSS',
          stepByStepSolution: [
            'ssthresh = cwnd / 2 = 32 KB / 2 = 16 KB',
            'Because event is a Timeout (not 3 dup ACKs), cwnd drops to 1 MSS',
            'cwnd = 1 KB',
          ],
          answer: 'New ssthresh = 16 KB ; New cwnd = 1 KB (Slow Start begins)',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming "Slow Start" is slow in data transmission rate.',
          reality: 'Slow Start is actually the FASTEST growth phase in TCP! It grows exponentially, doubling the congestion window every single round-trip time ($2^k$). It is only named "slow" in contrast to blasting the entire link at full line rate on packet 1.',
          whyItMatters: 'Slow start can saturate gigabit links in just a few round trips.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why does TCP Reno use 3 Duplicate ACKs as the trigger for Fast Retransmit instead of just 1 Duplicate ACK?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'In packet-switched networks, IP packets often take slightly different paths and arrive out of order. A single out-of-order packet immediately triggers 1 or 2 duplicate ACKs at the receiver before the missing packet arrives. If TCP reacted to a single duplicate ACK, it would needlessly halve its congestion window on minor packet reordering. Waiting for 3 Duplicate ACKs provides high statistical confidence that a packet was truly dropped rather than merely delivered out of order.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-6-3',
          question: 'In TCP congestion control, what growth pattern does the Congestion Window (cwnd) follow during the Slow Start phase?',
          type: 'single',
          options: ['Linear growth (+1 MSS per RTT)', 'Exponential growth (doubles every RTT)', 'Logarithmic growth', 'Constant window'],
          correctIndex: 1,
          explanation: 'During Slow Start, cwnd increases by 1 MSS for every ACK received, causing the window to double every RTT (exponential growth).',
        },
      ],
      keyTakeaways: [
        'Flow Control uses receiver window (rwnd); Congestion Control uses congestion window (cwnd).',
        'Effective sending window is $\\min(\\text{cwnd}, \\text{rwnd})$.',
        'AIMD (Additive Increase, Multiplicative Decrease) guarantees stability across shared network links.',
      ],
      flashcards: [
        { front: 'What is the formula for the effective TCP sending window?', back: 'W = min(cwnd, rwnd)' },
        { front: 'Why does Fast Retransmit trigger specifically on 3 duplicate ACKs?', back: 'To distinguish genuine packet loss from normal out-of-order packet arrival.' },
      ],
    },
  ],
};
