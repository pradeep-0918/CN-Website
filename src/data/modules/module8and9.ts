import { Module } from '../../types/network';

export const module8: Module = {
  id: 8,
  title: 'Wireless and Mobile Networks',
  tagline: 'Wi-Fi 802.11, CSMA/CA, Hidden Terminal & Cellular Networks',
  description: 'Understand unguided transmission, IEEE 802.11 standards, CSMA/CA protocol flow, RTS/CTS handshake for the hidden terminal problem, and cellular architecture.',
  iconName: 'Wifi',
  level: 'Intermediate',
  lessons: [
    {
      id: 'm8-l1',
      moduleId: 8,
      chapterNumber: '8.1',
      title: 'Wi-Fi Fundamentals, CSMA/CA & The Hidden Terminal Problem',
      slug: 'wifi-csma-ca-and-hidden-terminal',
      readTime: '12 min read',
      summary: 'Explore why wireless networks cannot use CSMA/CD, master CSMA/CA collision avoidance, DIFS/SIFS timings, and the RTS/CTS reservation handshake.',
      learningObjectives: [
        'Explain why wireless transceivers cannot perform collision detection (CSMA/CD) while transmitting.',
        'Diagram the Hidden Terminal and Exposed Terminal problems.',
        'Trace the 802.11 CSMA/CA protocol flow with RTS/CTS, DIFS, SIFS, and random backoff.',
      ],
      prerequisites: ['Module 1 & 4'],
      beginnerExplanation:
        'In wired Ethernet, if two computers shout at once, they detect the voltage surge immediately and back off (Collision Detection). But in wireless radio, your own transmitter is shouting so loudly right next to your antenna that you cannot hear if someone 50 feet away is also speaking at that exact microsecond. So wireless networks use Collision Avoidance: before transmitting, you ask permission with a quick whisper ("Request to Send"), the Access Point gives a green light ("Clear to Send"), and everyone else remains silent.',
      technicalExplanation:
        'IEEE 802.11 wireless networks cannot use Ethernet’s CSMA/CD because of two physical limitations:\n1. Transmit/Receive Power Disparity: Transmit power is orders of magnitude stronger than received signal power ($100\\text{ mW}$ vs $-70\\text{ dBm} = 10^{-7}\\text{ mW}$). A wireless NIC’s own transmission swamps any simultaneous incoming collision.\n2. Radio Range & Attenuation: Radios have limited coverage spheres, creating the Hidden Terminal Problem.\n\nHidden Terminal Problem:\nStation A and Station C both communicate with Access Point (AP) B. However, A and C are out of radio range of each other ("hidden"). If both sense the medium, both hear silence and transmit simultaneously to B, causing a catastrophic collision at AP B.\n\nCSMA/CA Protocol Solution (RFC 802.11 / RTS-CTS):\n1. Carrier Sensing: Station senses medium for DCF Interframe Space (DIFS) duration.\n2. Random Backoff: If medium is busy, picks random slot time backoff from Contention Window $[0, CW]$.\n3. RTS (Request to Send): Station A transmits short RTS frame containing the requested transmission duration $T$.\n4. CTS (Clear to Send): AP B replies with CTS containing duration $T$. Station C (hidden from A, but within range of B) hears the CTS and updates its Network Allocation Vector (NAV) timer, freezing all transmissions until A is done.\n5. Data Frame transmitted by A.\n6. SIFS (Short Interframe Space): AP B waits SIFS (shorter than DIFS) and transmits ACK.\n7. If no ACK received, CW is doubled (binary exponential backoff) and frame is retried.',
      realWorldAnalogy: {
        title: 'Two Mountain Climbers Calling to Base Camp',
        story: 'Climber A is on the North ridge and Climber C is on the South ridge. Neither can see or hear each other because the mountain peak blocks their line of sight. But both can radio Base Camp B in the valley. If both shout a message at once, Base Camp B hears static. To prevent this, Climber A first calls: "Base camp, I have a 30-second report" (RTS). Base camp radios on a giant loudspeaker: "All climbers clear the channel, Climber A has 30 seconds" (CTS). Climber C hears Base Camp’s loudspeaker and pauses their radio (NAV).',
        takeaway: 'RTS/CTS reserves the shared airwaves through the central coordinator.',
      },
      tanglishExplanation:
        'Wired Ethernet-la CSMA/CD use pannuvom, aana Wi-Fi-la CSMA/CD panna mudiyadhu (own antenna transmit power romba jaasthi, collision detect panna mudiyadhu). Adhunala CSMA/CA (Collision Avoidance) use pannuvom. Hidden Terminal problem: Host A and Host C Access Point (B)-kku connect aayirukum, aana A-vum C-yum thooram-la irukradhala onnuku onnu theriyadhu. Rendum onna transmit panna AP-la collide aagum. Solution: RTS (Request To Send) and CTS (Clear To Send) handshake! CTS ketta udane matha ellarum NAV timer vechu silent aagiduvanga.',
      practicalExamples: [
        {
          title: 'Configuring RTS/CTS Threshold in Wi-Fi Routers',
          scenario: 'High packet loss in a dense office with many cubicle partitions.',
          solution: 'Lower the router’s RTS Threshold from 2347 to 500 bytes. Smaller frames skip RTS/CTS, while larger data packets use RTS/CTS reservation to eliminate hidden-node collisions.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using RTS/CTS for every single packet in high-density Wi-Fi.',
          reality: 'RTS and CTS frames add significant protocol overhead (control frames, SIFS delays). For small packets (like voice packets or ACK packets), the RTS/CTS exchange wastes more airtime than a collision would consume.',
          whyItMatters: 'RTS/CTS is only activated for frames exceeding a configured byte threshold.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the Network Allocation Vector (NAV) in 802.11 wireless networking?',
          frequency: 'High',
          target: 'Network Engineer',
          answer:
            'The Network Allocation Vector (NAV) is a virtual carrier-sensing mechanism in 802.11. When any station overhears an RTS, CTS, or Data frame not addressed to itself, it reads the "Duration" field in the MAC header. The station sets its internal NAV countdown timer to this duration and treats the physical medium as busy, remaining completely silent until the timer reaches zero, without having to physically sense radio RF energy.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-8-1',
          question: 'Which frame is sent by the Access Point to reserve the wireless channel and silence hidden terminals?',
          type: 'single',
          options: ['RTS', 'CTS', 'DIFS', 'ACK'],
          correctIndex: 1,
          explanation: 'CTS (Clear to Send) is broadcast by the receiving Access Point, alerting all stations within its range to remain silent.',
        },
      ],
      keyTakeaways: [
        'Wi-Fi uses CSMA/CA because radios cannot reliably detect collisions while transmitting.',
        'The Hidden Terminal Problem is resolved via RTS/CTS handshaking and the NAV timer.',
        'SIFS is shorter than DIFS, giving priority to immediate ACKs over new packet contention.',
      ],
      flashcards: [
        { front: 'Why does Wi-Fi use CSMA/CA instead of CSMA/CD?', back: 'Wireless transceivers cannot transmit and listen for faint collisions simultaneously over RF airwaves.' },
        { front: 'What is the Network Allocation Vector (NAV)?', back: 'A virtual carrier-sensing timer indicating how long the medium will remain reserved by another station.' },
      ],
    },
    {
      id: 'm8-l2',
      moduleId: 8,
      chapterNumber: '8.2',
      title: 'Cellular Networks, Bluetooth, Mobile IP & Signal Interference',
      slug: 'cellular-bluetooth-mobile-ip-and-interference',
      readTime: '14 min read',
      summary: 'Explore cellular frequency reuse, 4G LTE vs 5G architectures, Bluetooth piconets/scatternets, Mobile IP triangular routing, and RF interference mitigation.',
      learningObjectives: [
        'Analyze the cellular frequency reuse factor and derive capacity improvements.',
        'Contrast 4G LTE EPC (Evolved Packet Core) with 5G Standalone (gNodeB and Service-Based Architecture).',
        'Trace Mobile IP Home Agent, Foreign Agent, and Care-of-Address (CoA) routing.',
      ],
      prerequisites: ['Lesson 8.1: Wi-Fi Fundamentals'],
      beginnerExplanation:
        'When you ride in a car talking on your mobile phone, you pass dozens of cellular towers without your call dropping. How? The phone continuously measures radio signal strength and hands your call off to the next cell tower like an Olympic baton pass (Handover). And when you travel to another city, your phone gets a temporary "guest badge" (Care-of Address) while your home network automatically forwards all your packets to your current location (Mobile IP).',
      technicalExplanation:
        'Cellular network architectures utilize hexagonal cell clustering with frequency reuse to maximize spectrum capacity without mutual interference. The minimum distance between co-channel cells is $D = R \\sqrt{3N}$, where $R$ is cell radius and $N$ is the cluster reuse size (e.g., $N=7$).\n\nGenerational Transitions:\n- 4G LTE: All-IP architecture based on OFDMA downstream and SC-FDMA upstream. Core network: EPC (MME for control plane, SGW/PGW for user plane data).\n- 5G (3GPP Rel 15+): Features sub-6 GHz and millimeter-wave (mmWave) spectrum, massive MIMO beamforming, Network Slicing, and Service-Based Architecture (SBA). Three pillars: eMBB (Enhanced Mobile Broadband > 1 Gbps), URLLC (Ultra-Reliable Low-Latency Communication < 1 ms latency for autonomous vehicles), and mMTC (Massive Machine-Type Communication for IoT).\n\nBluetooth (IEEE 802.15.1):\nOperates in 2.4 GHz ISM band with Frequency-Hopping Spread Spectrum (FHSS) hopping 1600 times/second across 79 channels to resist RF interference. Topologies: Piconet (1 Master, up to 7 active Slaves) and Scatternet (interconnected piconets where a node acts as Slave in one and Master in another).\n\nMobile IP (RFC 5944):\nEnables a mobile node to retain its permanent Home Address ($IP_{home}$) while roaming across foreign subnets:\n1. Mobile Node (MN) arrives at foreign network and acquires a temporary Care-of Address (CoA) via DHCP or Foreign Agent advertisement.\n2. MN registers CoA with its Home Agent (HA).\n3. Triangular Routing: Correspondent Node (CN) sends packets to $IP_{home}$. HA intercepts packets via proxy ARP, encapsulates them inside an outer IP header addressed to CoA (IP-in-IP tunneling), and forwards to the foreign network. MN sends return packets directly to CN.',
      realWorldAnalogy: {
        title: 'Mail Forwarding During a Summer Road Trip',
        story: 'If you leave your hometown apartment for a summer in Seattle, your permanent address is still your hometown apartment (Home Address). When mail arrives at your apartment, your landlord (Home Agent) slips the letter inside a new priority envelope stamped with your temporary Seattle Airbnb address (Care-of Address) and drops it in the mail. When you write back to your bank, you mail letters directly from Seattle without going through your hometown landlord (Triangular routing).',
        takeaway: 'Mobile IP preserves transport-layer TCP socket state across physical subnet changes.',
      },
      tanglishExplanation:
        'Cellular networks-la frequency reuse concept use pannuvom: pakkathu cell tower-la vera frequency use panni interference thavirkalam. Namma car-la travel pannumpothu call cut aagama next tower-kku seamless-a switch aagradhu thaan Handover. Mobile IP-la namma vera network ponaalum Home Address maaradhu; Home Agent namma Care-of-Address (CoA)-kku packets-ah tunnel panni anuppum. Bluetooth-la 1 Master and 7 Slaves piconet form pannum, 1600 hops/sec speed-la frequency hop aagum!',
      practicalExamples: [
        {
          title: '5G Network Slicing in Smart Cities',
          scenario: 'A single physical 5G base station simultaneously serves remote surgery and casual video streaming.',
          solution: 'Network slicing creates virtual end-to-end networks over the same physical hardware: Slice A (URLLC: < 1ms latency, 99.999% reliability) for robotic surgical telemetry, and Slice B (eMBB) for 4K video downloads.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming Mobile IP requires replacing IPv4 on all intermediate routers.',
          reality: 'Mobile IP uses standard IP-in-IP tunneling. Intermediate routers along the Internet path only inspect the outer IP header; they require zero awareness of Mobile IP.',
          whyItMatters: 'Allowed rapid global adoption without upgrading legacy backbone routers.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is Triangular Routing in Mobile IP, and how does Route Optimization solve it?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'In standard Mobile IP, inbound packets from Correspondent Node (CN) must travel first to the Home Agent (HA) and then tunnel to the Care-of Address (CoA), while outbound packets travel directly from Mobile Node to CN. This inefficient triangular path increases latency and creates a single point of failure at the HA. Mobile IPv6 solves this via Route Optimization: the Mobile Node sends Binding Updates directly to the CN, allowing the CN to cache the CoA and tunnel packets directly to the mobile node, bypassing the Home Agent entirely.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-8-2',
          question: 'What is the maximum number of active slave nodes that can operate in a single standard Bluetooth piconet?',
          type: 'single',
          options: ['3', '7', '15', '255'],
          correctIndex: 1,
          explanation: 'A Bluetooth piconet consists of 1 master device and up to 7 active slave devices simultaneously.',
        },
      ],
      keyTakeaways: [
        'Cellular clusters reuse frequencies at distance $D = R\\sqrt{3N}$ to prevent co-channel interference.',
        '5G standardizes eMBB (high speed), URLLC (ultra-low latency), and mMTC (massive IoT).',
        'Mobile IP uses Home Agents and Care-of Addresses to preserve socket connections during roaming.',
      ],
      flashcards: [
        { front: 'What three service pillars define 5G capabilities?', back: 'eMBB (Broadband), URLLC (Ultra-Reliable Low Latency), and mMTC (Massive IoT).' },
        { front: 'What is a Care-of Address (CoA) in Mobile IP?', back: 'A temporary IP address assigned to a mobile node while roaming in a foreign network.' },
      ],
    },
  ],
};

export const module9: Module = {
  id: 9,
  title: 'Network Security',
  tagline: 'CIA Triad, Cryptography, TLS/PKI, Firewalls & Network Defenses',
  description: 'Master confidentiality, integrity, availability, symmetric vs asymmetric encryption (AES, RSA, ECC), digital signatures, TLS certificates/PKI, firewalls, and attack mitigations.',
  iconName: 'Lock',
  level: 'Advanced',
  lessons: [
    {
      id: 'm9-l1',
      moduleId: 9,
      chapterNumber: '9.1',
      title: 'The CIA Triad, Symmetric vs Asymmetric Cryptography & Digital Signatures',
      slug: 'cia-triad-cryptography-and-digital-signatures',
      readTime: '15 min read',
      summary: 'Explore confidentiality, integrity, availability, AES symmetric encryption, RSA/ECC asymmetric key pairs, SHA-256 hashing, and digital signature authentication.',
      learningObjectives: [
        'Define Confidentiality (encryption), Integrity (hashing/MAC), and Availability (resilience/DDoS defense).',
        'Contrast Symmetric Encryption (AES-GCM, fast) with Asymmetric Encryption (RSA, ECC, slow key exchange).',
        'Explain how Digital Signatures prove authenticity and non-repudiation using the sender’s private key.',
      ],
      prerequisites: ['Module 1 & 7'],
      beginnerExplanation:
        'Symmetric encryption is like a padlock where both you and your bank have identical metal keys. It is blazing fast, but how do you mail that secret key to the bank without a postal thief copying it? Asymmetric encryption solves this with two magical keys: a Public Key (an open padlock you give to anyone in the world) and a Private Key (the only key that can unlock it, kept in your pocket). Anyone can snap the padlock shut, but only you can open it.',
      technicalExplanation:
        'The CIA Triad is the bedrock of information security:\n1. Confidentiality: Concealing information from unauthorized entities (implemented via symmetric/asymmetric encryption).\n2. Integrity: Ensuring data has not been modified or tampered with in transit (cryptographic hash functions SHA-256, HMAC).\n3. Availability: Ensuring authorized users have uninterrupted access to network services (redundancy, load balancing, DDoS protection).\n\nCryptographic Primitives:\n- Symmetric Key Encryption (AES-128, AES-256 in GCM mode):\n  - Single secret shared key for both encryption and decryption.\n  - Extremely fast ($> 10\\text{ Gbps}$ in hardware with Intel AES-NI).\n  - Key distribution problem: requires secure out-of-band key establishment.\n- Asymmetric Key Encryption (RSA-2048/4096, ECC ECDSA / Ed25519):\n  - Mathematically linked key pair: Public Key ($K_{pub}$) and Private Key ($K_{priv}$).\n  - Trapdoor one-way functions (factoring large primes for RSA, discrete logarithms on elliptic curves for ECC).\n  - Encrypt with $K_{pub} \\implies$ Decrypt ONLY with $K_{priv}$ (confidentiality).\n  - Computationally expensive (~1000x slower than AES).\n\nDigital Signatures & Non-Repudiation:\nTo prove Alice sent a message without tampering:\n1. Alice hashes the message: $H = \\text{SHA-256}(M)$.\n2. Alice encrypts the hash with HER Private Key: $\\text{Signature} = E(K_{priv\\_Alice}, H)$.\n3. Alice sends message $M$ and Signature to Bob.\n4. Bob decrypts the signature with Alice’s Public Key: $H\' = D(K_{pub\\_Alice}, \\text{Signature})$.\n5. Bob independently computes $H = \\text{SHA-256}(M)$. If $H\' == H$, the message is verified authentic and untampered (Authenticity + Integrity + Non-repudiation).',
      realWorldAnalogy: {
        title: 'The Wax Seal and the Safe Deposit Box',
        story: 'A king puts a secret treaty into a metal vault (AES encryption). To ensure the recipient knows the letter is genuinely from the king and was not altered by a traitor, the king drips hot wax on the envelope and presses his unique signet ring into it (Digital Signature). Anyone in the kingdom can compare the wax crest against the royal seal portrait in the town square (Public Key), but only the king possesses the physical ring (Private Key).',
        takeaway: 'Encryption hides data; digital signatures prove provenance and authenticity.',
      },
      tanglishExplanation:
        'Network Security-la CIA Triad: Confidentiality (Secret-a vechukanum - Encryption), Integrity (Yaarum edhayum maatha koodadhu - Hashing), Availability (System eppovum velai seiyanum - DDoS defence). Symmetric crypto-la (AES) orae key encrypt-kum decrypt-kum use pannuvom (super fast). Asymmetric-la (RSA, ECC) rendu keys: Public Key (ellarukum theriyalaam) and Private Key (secret). Digital Signature-la sender avanga Private Key vechu sign pannuvanga, receiver avanga Public Key vechu verify pannuvanga!',
      practicalExamples: [
        {
          title: 'Generating an SSH Key Pair with Ed25519',
          scenario: 'Set up passwordless cryptographic authentication to a remote server.',
          solution: 'Run `ssh-keygen -t ed25519 -C "admin@company.com"`. Creates `id_ed25519` (Private Key - keep strictly secret) and `id_ed25519.pub` (Public Key - copied to remote server `~/.ssh/authorized_keys`).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Encrypting large file payloads directly with RSA public key.',
          reality: 'Asymmetric encryption is computationally slow and can only encrypt payloads smaller than the key size (e.g., RSA-2048 can only encrypt up to 245 bytes of data).',
          whyItMatters: 'Real-world protocols (TLS, SSH, PGP) use Hybrid Cryptography: asymmetric keys exchange a quick ephemeral symmetric key, which then encrypts the bulk data using AES.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the role of a Certificate Authority (CA) and Public Key Infrastructure (PKI) in TLS/HTTPS?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Without a PKI, a client has no way of knowing whether a public key genuinely belongs to `google.com` or to an attacker executing a Man-in-the-Middle attack. A Certificate Authority (e.g. Let’s Encrypt, DigiCert) acts as a trusted third party. The CA verifies domain ownership and cryptographically signs the server’s public key and domain identity into an X.509 certificate using the CA’s private key. The client operating system and browser ship with pre-installed Root CA public keys, forming an unbroken cryptographic Chain of Trust.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-9-1',
          question: 'In digital signatures, which key is used by the sender to sign the hash of the message?',
          type: 'single',
          options: ['Receiver’s Public Key', 'Receiver’s Private Key', 'Sender’s Public Key', 'Sender’s Private Key'],
          correctIndex: 3,
          explanation: 'The sender signs using their own Private Key; anyone can verify the signature using the sender’s corresponding Public Key.',
        },
      ],
      keyTakeaways: [
        'Symmetric cryptography (AES) is fast and encrypts bulk data; Asymmetric (RSA/ECC) securely establishes keys.',
        'Digital signatures encrypt a message hash with the sender’s private key to provide authenticity and non-repudiation.',
        'PKI and Certificate Authorities bind public keys to identities via signed X.509 digital certificates.',
      ],
      flashcards: [
        { front: 'What three pillars constitute the CIA Triad?', back: 'Confidentiality, Integrity, Availability' },
        { front: 'Why do modern secure protocols use hybrid cryptography?', back: 'To combine the key distribution advantages of asymmetric crypto with the high-speed throughput of symmetric AES.' },
      ],
    },
    {
      id: 'm9-l2',
      moduleId: 9,
      chapterNumber: '9.2',
      title: 'Firewalls, VPNs, IDS/IPS & Network Attack Mitigations',
      slug: 'firewalls-vpns-ids-and-attack-mitigations',
      readTime: '15 min read',
      summary: 'Explore stateless vs stateful firewalls, Next-Gen Firewalls (NGFW), IPsec vs WireGuard VPNs, IDS/IPS signatures, and defense strategies against SYN floods, DDoS, and MITM attacks.',
      learningObjectives: [
        'Compare Stateless Packet Filters (ACLs) with Stateful Inspection Firewalls and Layer 7 NGFWs.',
        'Contrast IPsec tunnel vs transport modes with modern WireGuard UDP cryptography.',
        'Analyze signature-based vs anomaly-based Intrusion Detection/Prevention Systems (IDS/IPS).',
      ],
      prerequisites: ['Lesson 9.1: Cryptography & Signatures'],
      beginnerExplanation:
        'A stateless firewall is like a security guard who only checks if you have a ticket, but forgets your face the second you walk past. A stateful firewall remembers that you walked out to grab coffee, so it welcomes you back without questioning. A VPN is an armored, bulletproof private tunnel running straight through a crowded public street. And an IDS/IPS is a watchdog scanning luggage for known weapons and locking the gate if an intruder attacks.',
      technicalExplanation:
        'Network perimeter security mechanisms operate at distinct abstraction layers:\n\n1. Firewall Generations:\n- Packet Filtering (Stateless / L3-L4): Evaluates individual packets in isolation against Access Control Lists (ACLs: source IP, destination IP, port, protocol). Ignores connection state.\n- Stateful Inspection Firewalls: Tracks connection state tables (e.g. TCP connection state machine: SYN, ESTABLISHED, FIN). Automatically allows inbound return traffic matching an outbound session without opening static inbound ports.\n- Next-Generation Firewalls (NGFW / L7): Performs Deep Packet Inspection (DPI), application identification regardless of port (e.g. recognizing BitTorrent over port 80), SSL/TLS interception, and integrated IPS.\n\n2. Virtual Private Networks (VPNs):\n- IPsec (RFC 4301): Operates at Layer 3. Two core protocols: Authentication Header (AH - integrity/authenticity only) and Encapsulating Security Payload (ESP - confidentiality, integrity, authenticity). Transport Mode: encrypts only payload, keeps original IP header (host-to-host). Tunnel Mode: encrypts entire original IP packet and prepends new outer gateway IP header (site-to-site / gateway-to-gateway).\n- WireGuard: Modern, state-of-the-art cryptographic VPN running entirely in Linux kernel space over UDP. Uses Noise protocol framework with Curve25519, ChaCha20, Poly1305, BLAKE2s, and SIPHash, achieving 4x faster throughput than OpenVPN/IPsec with ~4,000 lines of auditable code.\n\n3. Attack Vectors & Defenses:\n- SYN Flood: Attacker floods server with SYN packets without completing handshake. Defense: SYN Cookies (RFC 4987) encoding state mathematically in ISN rather than allocating memory tables.\n- DNS Cache Poisoning: Forging responses to trick recursive resolvers. Defense: DNSSEC (RFC 4033) cryptographic signatures and random source port/transaction ID randomization.\n- Man-in-the-Middle (MITM): Attacker eavesdrops and modifies packets. Defense: Mutual TLS (mTLS) and HSTS (HTTP Strict Transport Security) preloading.',
      realWorldAnalogy: {
        title: 'Armored Diplomatic Tunnel and the Watchdog Gate',
        story: 'If an ambassador needs to send gold across a bandit-infested desert, sending it in an open cart invites robbery. Instead, they build a private subterranean armored railway directly between the two embassies (VPN tunnel). At the tunnel entrance, a guard checks diplomatic credentials, opens files to inspect for smuggled poison (NGFW Deep Packet Inspection), and memorizes who leaves so they can return safely (Stateful connection tracking).',
        takeaway: 'Stateful firewalls and VPNs create secure, authenticated overlays on top of hostile public networks.',
      },
      tanglishExplanation:
        'Firewall-la Stateless-na ovvoru packet-aiyum thaniya paakum (ACL maadhiri). Stateful-na connection table vechu "Client request pannaanga, so response-ah ulla vidalam" nu nyabagam vechukum. Next-Gen Firewall (NGFW) L7-la actual application data-va inspect pannum. VPN (Virtual Private Network) vandhu public Internet-kulla encrypted tunnel create pannum (IPsec Tunnel mode & modern WireGuard). SYN Flood attack-kku SYN Cookies defense use pannuvom!',
      practicalExamples: [
        {
          title: 'Configuring Linux Stateful Firewall with IPTables / UFW',
          scenario: 'Allow outbound HTTP/HTTPS and only allow return packets matching established connections.',
          solution: '`sudo ufw default deny incoming` -> `sudo ufw default allow outgoing` -> `sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`. Drops all unsolicited incoming probe packets.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming IPsec Transport Mode hides the original destination IP from eavesdroppers.',
          reality: 'Transport mode encrypts only the L4 payload; the original IP source and destination remain completely visible in the clear. Only Tunnel Mode encrypts the entire original IP packet inside a new outer header.',
          whyItMatters: 'Site-to-site enterprise VPNs must strictly use Tunnel Mode to hide internal subnet topology.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the architectural difference between an IDS (Intrusion Detection System) and an IPS (Intrusion Prevention System)?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'An IDS operates out-of-band via a network TAP or switch SPAN/mirror port. It inspects a copy of the traffic and sends passive alerts/logs to a SIEM if malicious signatures or anomalies are detected, without adding in-line packet latency. An IPS is deployed strictly in-line (in-path) between network segments. It inspects live traffic in real-time and has active blocking authority: it can drop malicious packets, terminate TCP connections by injecting RST packets, or dynamically update firewall ACLs on-the-fly.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-9-2',
          question: 'Which IPsec mode encrypts the entire original IP packet including the original IP header, placing it inside a new outer IP packet?',
          type: 'single',
          options: ['Transport Mode', 'Tunnel Mode', 'AH Mode', 'BGP Mode'],
          correctIndex: 1,
          explanation: 'Tunnel Mode encapsulates the entire original IP packet inside a new outer IP header, providing complete confidentiality for internal network topology.',
        },
      ],
      keyTakeaways: [
        'Stateful firewalls track TCP connection states, automatically permitting return traffic.',
        'IPsec Tunnel Mode encrypts the entire packet; WireGuard provides modern high-speed lightweight tunneling.',
        'SYN Cookies mitigate SYN flood denial-of-service without allocating half-open socket memory.',
      ],
      flashcards: [
        { front: 'Difference between IPsec Transport Mode and Tunnel Mode?', back: 'Transport encrypts payload only (keeps original IP header); Tunnel encrypts entire original packet inside a new outer IP header.' },
        { front: 'How do SYN Cookies protect against SYN Flood attacks?', back: 'By encoding TCP handshake parameters mathematically into the initial sequence number, eliminating state allocation until the final ACK arrives.' },
      ],
    },
  ],
};
