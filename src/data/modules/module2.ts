import { Module } from '../../types/network';

export const module2: Module = {
  id: 2,
  title: 'Network Models and Architectures',
  tagline: 'The Seven-Layer OSI & Four/Five-Layer TCP/IP Architectures',
  description: 'Master protocol layering, the 7 OSI layers, TCP/IP model, encapsulation, decapsulation, Protocol Data Units (PDUs), headers, and trailers.',
  iconName: 'Layers',
  level: 'Beginner',
  lessons: [
    {
      id: 'm2-l1',
      moduleId: 2,
      chapterNumber: '2.1',
      title: 'OSI Reference Model: The Seven Layers in Depth',
      slug: 'osi-reference-model-seven-layers',
      readTime: '12 min read',
      summary: 'Explore why networking is layered, examine each of the 7 OSI layers, their protocol data units (PDU), and core responsibilities.',
      learningObjectives: [
        'Memorize the 7 OSI layers in top-down and bottom-up order with standard mnemonics.',
        'Identify the exact Protocol Data Unit (PDU) at each layer (Data, Segment, Packet, Frame, Bit).',
        'State the unique responsibilities of L7 down to L1.',
      ],
      prerequisites: ['Module 1: Introduction to Computer Networks'],
      beginnerExplanation:
        'Sending an email across the globe is like sending a fragile gift. You write the note (Application), wrap it in bubble wrap (Presentation), schedule the pickup window (Session), put it into a sturdy shipping box (Transport), write the destination city and zip code on it (Network), seal it inside the local delivery truck with a barcode (Data Link), and drive the truck along the asphalt road (Physical). Each layer has only ONE job and passes the package down to the next specialist.',
      technicalExplanation:
        'The International Organization for Standardization (ISO) introduced the Open Systems Interconnection (OSI) reference model (ISO/IEC 7498-1) in 1984 to standardize vendor-neutral interoperability. The 7 layers are:\n\n1. Physical (L1): Bitstream transmission over electrical, optical, or radio media (voltages, pinouts, cable specs). PDU: Bit.\n2. Data Link (L2): Node-to-node framing, hardware MAC addressing, error detection (CRC/FCS), and flow control across a single physical link. PDU: Frame.\n3. Network (L3): End-to-end host addressing (IPv4/IPv6), logical routing, fragmentation, and packet forwarding across heterogeneous networks. PDU: Packet.\n4. Transport (L4): Process-to-process communication via port numbers, end-to-end reliability, sequence numbering, flow control (sliding window), and congestion control (TCP/UDP). PDU: Segment (TCP) or Datagram (UDP).\n5. Session (L5): Dialog control, session establishment, maintenance, token management, and synchronization checkpoints (e.g., RPC, NetBIOS).\n6. Presentation (L6): Data syntax translation, character encoding (ASCII, UTF-8), compression (gzip), and encryption/decryption (SSL/TLS record layer concepts).\n7. Application (L7): User and application interface directly interacting with software services (HTTP, DNS, SMTP, FTP, SSH). PDU: Application Data.\n\nMnemonic top-down: "All People Seem To Need Data Processing" (Application -> Physical).\nMnemonic bottom-up: "Please Do Not Throw Sausage Pizza Away" (Physical -> Application).',
      realWorldAnalogy: {
        title: 'The Multi-Department International Corporation',
        story: 'The CEO (Application) dictates a contract. The translator converts it to French and encrypts it (Presentation). The secretary calls Paris to ensure their line is open and sets a 10-minute check-in call (Session). The shipping manager breaks the 200-page document into numbered 10-page booklets so none are lost (Transport). The mailroom puts the street address and postal code on each envelope (Network). The local courier puts the envelopes into delivery pouches with local depot tags (Data Link). The van driver transports the raw fuel and rubber on the highway asphalt (Physical).',
        takeaway: 'Separation of concerns allows modifying physical fiber to Wi-Fi without rewriting your web browser code.',
      },
      tanglishExplanation:
        'OSI model-la total-a 7 layers irukku. Bottom-la irundhu: Physical (Bits), Data Link (Frames - MAC address), Network (Packets - IP address), Transport (Segments - Port numbers), Session (Connection management), Presentation (Encryption/Format conversion), Application (Browser, HTTP, DNS). Mnemonics: "Please Do Not Throw Sausage Pizza Away". Idhula ovvoru layer-kum specific PDU per irukku!',
      practicalExamples: [
        {
          title: 'Mapping a Web Browser Request to OSI Layers',
          scenario: 'A user loads https://example.com in Chrome.',
          solution: 'L7: HTTP GET request. L6: TLS encryption / JSON parsing. L5: Persistent HTTP/2 multiplexed session. L4: TCP segment with Dest Port 443. L3: IP packet with Dest IP 93.184.216.34. L2: Ethernet frame with router default gateway MAC. L1: 1000BASE-T voltage pulses over Cat6 cable.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming the Internet runs on the 7-layer OSI model.',
          reality: 'The global Internet is built on the pragmatic TCP/IP 4-layer (or 5-layer) stack. OSI is primarily a theoretical reference and diagnostic model.',
          whyItMatters: 'In TCP/IP, the functions of OSI Layers 5, 6, and 7 are all collapsed into the single Application Layer.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between hop-by-hop delivery and end-to-end delivery in the OSI model?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Data Link (L2) provides hop-by-hop delivery between two directly connected adjacent nodes (source MAC to router interface MAC, changing at every hop). Network (L3) provides source-to-destination host delivery across multiple hops (IP addresses remain constant end-to-end, except with NAT). Transport (L4) provides end-to-end process-to-process delivery (differentiating which application process receives the data via port numbers).',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-2-1',
          question: 'What is the correct PDU for the Transport layer, Network layer, and Data Link layer respectively?',
          type: 'single',
          options: [
            'Packet, Segment, Frame',
            'Segment, Packet, Frame',
            'Frame, Packet, Segment',
            'Datagram, Frame, Bit',
          ],
          correctIndex: 1,
          explanation: 'Transport layer PDU is Segment/Datagram, Network layer is Packet, and Data Link layer is Frame.',
        },
      ],
      keyTakeaways: [
        'Layering isolates functions, allowing protocols at any layer to evolve independently.',
        'PDUs: L7/6/5 Data -> L4 Segment -> L3 Packet -> L2 Frame -> L1 Bit.',
        'L2 is hop-by-hop (MAC); L3 is host-to-host (IP); L4 is process-to-process (Port).',
      ],
      flashcards: [
        { front: 'What is the PDU of the Network Layer?', back: 'Packet' },
        { front: 'Which OSI layer handles encryption, decryption, and compression?', back: 'Presentation Layer (Layer 6)' },
        { front: 'Which OSI layer handles process-to-process communication via port numbers?', back: 'Transport Layer (Layer 4)' },
      ],
    },
    {
      id: 'm2-l2',
      moduleId: 2,
      chapterNumber: '2.2',
      title: 'TCP/IP Model, Encapsulation & Decapsulation',
      slug: 'tcp-ip-model-encapsulation-decapsulation',
      readTime: '10 min read',
      summary: 'Compare OSI vs TCP/IP models, trace how packets are encapsulated down the stack and decapsulated up the stack with headers and trailers.',
      learningObjectives: [
        'Compare the 7-layer OSI model with the 4-layer / 5-layer TCP/IP model.',
        'Diagram the encapsulation process as data descends from Application to Physical.',
        'Explain why only the Data Link layer adds both a header AND a trailer (FCS/CRC).',
      ],
      prerequisites: ['Lesson 2.1: OSI Reference Model'],
      beginnerExplanation:
        'Think of Russian nesting dolls (Matryoshka). You start with your message doll. The transport layer puts it inside a box with port numbers on it. The network layer puts that box inside another box with IP addresses on it. The data link layer wraps that box in a courier bag with MAC addresses on the front and a tamper-evident seal (trailer CRC) on the back. When the destination receives it, they unpack each layer in reverse (decapsulation).',
      technicalExplanation:
        'The TCP/IP model (RFC 1122) emerged from ARPANET research and was designed around protocol pragmatism and survivability. It is typically represented as 4 layers:\n1. Application: Combines OSI Layers 5, 6, and 7 (HTTP, SSH, DNS).\n2. Transport: Host-to-host process communication (TCP, UDP).\n3. Internet: Inter-network packet routing (IP, ICMP, ARP).\n4. Network Access / Link: Physical media and framing (Ethernet, Wi-Fi).\n\nEncapsulation is the process where each descending layer treats the higher layer’s entire PDU as opaque payload and prepends its own protocol control header (and L2 appends a trailer):\n- Data: User payload.\n- L4 Header: Added (Source Port, Destination Port, Sequence Number, Flags, Checksum). Creates Segment.\n- L3 Header: Added (Source IP, Destination IP, TTL, Protocol ID). Creates Packet.\n- L2 Header + Trailer: Added (Source MAC, Destination MAC, EtherType, and Frame Check Sequence FCS/CRC at trailer). Creates Frame.\n- L1: Encodes frame bits into physical signals.\nDecapsulation occurs on the receiving host: L2 verifies FCS, strips frame header/trailer; L3 verifies IP header, strips it; L4 directs payload to the listening socket matching the destination port.',
      realWorldAnalogy: {
        title: 'Certified Courier Express Bag',
        story: 'When you mail confidential legal papers, you put them in an envelope with an internal case number (Transport). That goes into an express delivery pouch with sender/receiver street addresses (Network). The courier puts an outer barcoded manifest sticker on the front and a tamper-evident security tape seal on the back (Data Link Frame Check Sequence). If the seal is broken or checksum fails, the package is rejected.',
        takeaway: 'Headers provide steering instructions; trailers provide integrity verification.',
      },
      tanglishExplanation:
        'Encapsulation-na oru layer thoda data-kku munnadi adhadhu header-ah add pannitu porathu. L7 Application Data -> L4 TCP Header add aagi Segment aagum -> L3 IP Header add aagi Packet aagum -> L2 MAC Header munnadiyum, CRC/FCS trailer pinnadiyum add aagi Frame aagum -> L1-la 0s and 1s electrical signal-a pogum. Receiver side-la idhu decapsulation: oru oru wrapper-a remove pannite mela pogum!',
      practicalExamples: [
        {
          title: 'Inspecting Encapsulation in Wireshark',
          scenario: 'Capturing an HTTP GET request to http://neverssl.com.',
          solution: 'Wireshark displays Frame (Wire details) -> Ethernet II (Src/Dst MAC) -> Internet Protocol Version 4 (Src/Dst IP) -> Transmission Control Protocol (Src Port 54321, Dst Port 80) -> Hypertext Transfer Protocol (GET /).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Believing intermediate routers decapsulate all the way to Layer 7.',
          reality: 'Standard IP routers only decapsulate up to Layer 3 (Network Layer) to inspect the destination IP address, decrement TTL, recalculate IP checksum, and re-encapsulate into a new Layer 2 frame for the next hop.',
          whyItMatters: 'Routers do not alter or inspect TCP/UDP payloads unless they are performing NAT, stateful firewalling, or DPI.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why does Layer 2 (Data Link) have a trailer (FCS), while Layer 3 and Layer 4 only have headers?',
          frequency: 'High',
          target: 'Network Engineer',
          answer:
            'Hardware network interface cards (NICs) compute the Frame Check Sequence (FCS/CRC) on-the-fly as bits stream out of the transceiver. By placing the checksum at the end of the frame (trailer), the transmitter computes and transmits the CRC in real-time without buffering the entire frame in memory first. The receiving NIC similarly computes the running CRC and compares it against the incoming trailer.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-2-2',
          question: 'What is the term for the process of stripping off headers as a packet moves up the protocol stack at the destination?',
          type: 'single',
          options: ['Fragmentation', 'Segmentation', 'Decapsulation', 'Multiplexing'],
          correctIndex: 2,
          explanation: 'Decapsulation is the removal of protocol control headers as data ascends from physical bits up to application data.',
        },
      ],
      keyTakeaways: [
        'Encapsulation adds headers going down; Decapsulation removes headers going up.',
        'TCP/IP combines OSI Presentation, Session, and Application into a single Application layer.',
        'Switches inspect L2; Routers inspect up to L3; End hosts decapsulate up to L7.',
      ],
      flashcards: [
        { front: 'Why does the Data Link layer include a trailer?', back: 'To allow hardware NICs to calculate and append the Frame Check Sequence (CRC) on-the-fly as bits are serialized.' },
        { front: 'Up to which layer does a standard router inspect an incoming packet?', back: 'Layer 3 (Network Layer).' },
      ],
    },
  ],
};
