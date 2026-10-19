import { Module } from '../../types/network';

export const module1: Module = {
  id: 1,
  title: 'Introduction to Computer Networks',
  tagline: 'Foundations of Connected Systems & Communication Models',
  description: 'Understand what makes a network, basic topologies, performance metrics (latency, bandwidth, throughput, jitter), client-server vs P2P, and hardware devices.',
  iconName: 'Network',
  level: 'Beginner',
  lessons: [
    {
      id: 'm1-l1',
      moduleId: 1,
      chapterNumber: '1.1',
      title: 'What is a Computer Network & Communication Models',
      slug: 'what-is-a-computer-network',
      readTime: '8 min read',
      summary: 'Explore the fundamental definition of computer networks, transmission components, and simplex, half-duplex, and full-duplex communication models.',
      learningObjectives: [
        'Define a computer network and identify its 5 essential components.',
        'Contrast Simplex, Half-Duplex, and Full-Duplex communication with hardware examples.',
        'Explain the core tradeoff between bandwidth, throughput, latency, and packet loss.',
      ],
      prerequisites: ['Basic computer literacy', 'Familiarity with bits and bytes'],
      beginnerExplanation:
        'A computer network is simply two or more electronic devices linked together so they can share files, messages, and hardware resources (like printers or internet gateways). Think of it as a postal network: letters (packets) travel through roads (cables or radio waves) to reach specific addresses (IP/MAC).',
      technicalExplanation:
        'A computer network consists of autonomous computing devices interconnected through physical transmission media or wireless channels adhering to established communication protocols. Communication involves 5 key elements: Sender (source host), Receiver (destination host), Medium (guided or unguided channel), Message (data encoded into signals), and Protocol (the syntax, semantics, and timing rules governing exchange). Modes of transmission are defined by directionality: Simplex (unidirectional, e.g., radio broadcast, keyboard to PC), Half-Duplex (bidirectional but strictly one at a time, e.g., Walkie-Talkies, traditional Ethernet with hubs using CSMA/CD), and Full-Duplex (simultaneous bidirectional transmission, e.g., modern switched Ethernet with dedicated TX/RX pairs, telephone calls).',
      realWorldAnalogy: {
        title: 'The Walkie-Talkie vs Telephone Call',
        story: 'When two security guards speak over a walkie-talkie, one speaks while pressing a push-to-talk button, and ends with "Over" so the other guard knows it is safe to speak. If both speak at the same time, their audio collides into screeching noise (Half-Duplex). On a modern smartphone call, however, both people can speak and hear each other simultaneously without collision (Full-Duplex).',
        takeaway: 'Half-duplex requires turn-taking protocols to avoid collisions, whereas full-duplex separates transmission and reception channels.',
      },
      tanglishExplanation:
        'Computer Network-na simple-a sonna, rendu illa adhuku mela computers onna connect aagi data share panradhu thaan. Simplex-na orae direction (TV broadcast maadhiri), Half-Duplex-na rendu pakkamum pesalaam aana orae nerathula pesa mudiyaadhu (Walkie-talkie maadhiri "Over" sollanum), Full-Duplex-na telephone call maadhiri rendu perum at the same time pesi ketka mudiyum.',
      practicalExamples: [
        {
          title: 'Simplex: Keyboard to Motherboard',
          scenario: 'The USB keyboard continuously sends keycode scan events to the host controller; the keyboard never receives display data.',
          solution: 'Data flows strictly unidirectional, requiring minimal control overhead.',
        },
        {
          title: 'Full-Duplex: Gigabit Ethernet (1000BASE-T)',
          scenario: 'Cat5e/Cat6 uses four twisted copper pairs to simultaneously transmit and receive 1 Gbps traffic in both directions without collisions.',
          solution: 'Modern network switches negotiate full-duplex auto-negotiation, disabling CSMA/CD collisions entirely.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Confusing Bandwidth with Throughput.',
          reality: 'Bandwidth is the theoretical maximum channel capacity (like a 6-lane highway); Throughput is the actual data delivered successfully per unit of time (the actual flow of cars during rush hour).',
          whyItMatters: 'Paying for a 1 Gbps fiber link does not guarantee 1 Gbps download if server bottlenecks or packet loss restrict TCP window sizes.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the fundamental difference between Latency, Jitter, and Throughput?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Latency is the one-way or round-trip time required for a packet to traverse the network from source to destination (measured in ms). Jitter is the statistical variation in packet transit delay over time (critical for real-time UDP video/voice). Throughput is the actual volume of data successfully transmitted and acknowledged per unit of time (measured in Mbps/Gbps).',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-1-1',
          question: 'Which communication mode allows bidirectional communication, but only one party transmitting at any given instant?',
          type: 'single',
          options: ['Simplex', 'Half-Duplex', 'Full-Duplex', 'Multiplex'],
          correctIndex: 1,
          explanation: 'Half-Duplex allows both parties to communicate, but not concurrently (e.g., CSMA/CD hubs or walkie-talkies).',
        },
      ],
      keyTakeaways: [
        'A network requires Sender, Receiver, Medium, Message, and Protocol.',
        'Duplex modes dictate whether transmission is unidirectional (Simplex), alternating (Half-Duplex), or simultaneous (Full-Duplex).',
        'Latency measures delay, Jitter measures delay variability, and Throughput measures actual useful payload delivered.',
      ],
      flashcards: [
        { front: 'What are the 5 components of data communication?', back: 'Sender, Receiver, Transmission Medium, Message, and Protocol.' },
        { front: 'Why does Gigabit Ethernet not suffer from collisions?', back: 'Gigabit Ethernet runs in Full-Duplex mode over dedicated TX/RX channels on switched networks, obsoleting CSMA/CD.' },
      ],
    },
    {
      id: 'm1-l2',
      moduleId: 1,
      chapterNumber: '1.2',
      title: 'LAN, MAN, WAN, PAN & Network Topologies',
      slug: 'network-topologies-and-types',
      readTime: '10 min read',
      summary: 'Differentiate PAN, LAN, MAN, and WAN geographical scales, and analyze Bus, Star, Ring, Mesh, and Hybrid physical/logical topologies.',
      learningObjectives: [
        'Categorize networks by scale: PAN (Bluetooth), LAN (Campus/Home), MAN (City), WAN (Internet).',
        'Analyze Star, Mesh, Bus, and Ring topologies regarding fault tolerance, cost, and cabling complexity.',
        'Derive the formula for number of links in a full mesh network: N*(N-1)/2.',
      ],
      prerequisites: ['Lesson 1.1: What is a Computer Network'],
      beginnerExplanation:
        'Networks are classified by how far they stretch. Your smartwatch talking to your phone is a PAN (Personal Area Network). Your home or office Wi-Fi is a LAN. A city surveillance system is a MAN (Metropolitan). The worldwide Internet is the ultimate WAN. The topology is how the devices are arranged and wired together—like spokes on a bicycle wheel (Star) or every device connected to every other (Mesh).',
      technicalExplanation:
        'Geographical categorization spans PAN (~1-10m radius, IEEE 802.15), LAN (~10m-1km, IEEE 802.3 Ethernet / 802.11 Wi-Fi), MAN (~5-50km, Metro Ethernet / FDDI / Cable TV systems), and WAN (Global, optical backbones, BGP autonomous systems). Topologies dictate physical layout and logical signal paths. In Bus topology, a single backbone coaxial cable is shared with terminators at both ends; a single cable break halts all communication. In Ring topology (e.g., Token Ring), nodes form a closed loop where tokens circulate unidirectionally. In Star topology, every node connects to a central multiport switch; if one cable breaks, only that node goes down. In Full Mesh topology, every node has a direct point-to-point link to every other node. For N nodes, the required number of duplex links is N*(N - 1) / 2 and each node requires (N - 1) physical I/O ports. Mesh provides the highest redundancy and zero contention, but quadratic cabling cost.',
      realWorldAnalogy: {
        title: 'Flight Routes vs Train Lines',
        story: 'A Bus topology is like a single train track running through 10 towns. If a tree falls across the track, all train service stops everywhere. A Star topology is like an airline hub in Atlanta: flights go from your town to Atlanta, then to the destination. A Full Mesh is every town having a direct airport flight to every other single town—fastest and completely resilient, but insanely expensive to build.',
        takeaway: 'Star balances cost and resilience; Mesh offers supreme fault-tolerance at quadratic link cost.',
      },
      tanglishExplanation:
        'LAN-na unga office/college campus network. WAN-na world-wide Internet. Topologies-la Star topology thaan modern offices-la use pannuvom (center-la oru switch irukkum, ellam adhoda connect aagum). Mesh topology-la ovvoru computer-um direct-a matha ellathodaiyum wire aagum. Formula: N*(N-1)/2 wires venum. Redundancy super, but cost romba jaasthi!',
      practicalExamples: [
        {
          title: 'Calculating Full Mesh Links for a Data Center Core',
          scenario: 'A cloud provider has 8 core aggregation routers that need a fully-meshed backbone.',
          solution: 'Number of links = N*(N-1)/2 = 8 * 7 / 2 = 28 high-speed optical fiber links. Each router needs 7 ports.',
        },
      ],
      numericalProblems: [
        {
          problem: 'How many physical duplex links are needed to interconnect 12 regional branch offices in a Full Mesh topology?',
          given: { 'Number of nodes (N)': '12', 'Topology': 'Full Mesh' },
          formula: 'Links = N * (N - 1) / 2',
          stepByStepSolution: [
            'Substitute N = 12 into formula: Links = 12 * (12 - 1) / 2',
            'Compute numerator: 12 * 11 = 132',
            'Divide by 2: 132 / 2 = 66 links',
          ],
          answer: '66 duplex links',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming modern Wi-Fi is a Mesh topology by default.',
          reality: 'Standard Wi-Fi operates as a Star (Infrastructure mode) where all stations associate with a single Access Point (AP). Wi-Fi Mesh (802.11s) is a specific multi-hop extension.',
          whyItMatters: 'If the central AP reboots, all stations immediately disconnect in standard Wi-Fi.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why has Star topology completely replaced Bus and Ring topologies in modern enterprise LANs?',
          frequency: 'High',
          target: 'University Exam',
          answer:
            'Star topology isolates faults: a severed cable only disconnects the affected endpoint without bringing down the entire broadcast domain. Centralized switches also eliminate collision domains with full-duplex dedicated micro-segmentation, enable easy port monitoring/VLAN configuration, and support hot-plugging without network disruption.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-1-2',
          question: 'If a network has 6 routers and each router must connect directly to every other router, how many links are needed?',
          type: 'single',
          options: ['12', '15', '30', '36'],
          correctIndex: 1,
          explanation: 'N*(N-1)/2 = 6 * 5 / 2 = 15 links.',
        },
      ],
      keyTakeaways: [
        'LAN covers small areas; WAN interconnects autonomous systems across countries.',
        'Star topology is the dominant physical LAN standard due to fault isolation and ease of administration.',
        'Full Mesh offers maximum redundancy with N*(N-1)/2 links, used in ISP core backbones.',
      ],
      flashcards: [
        { front: 'Formula for duplex links in a full mesh with N nodes?', back: 'N * (N - 1) / 2' },
        { front: 'Single point of failure in a star topology?', back: 'The central switch or hub.' },
      ],
    },
    {
      id: 'm1-l3',
      moduleId: 1,
      chapterNumber: '1.3',
      title: 'Network Hardware: Hubs, Switches, Routers, Bridges & Gateways',
      slug: 'network-hardware-devices',
      readTime: '10 min read',
      summary: 'Deep dive into Layer 1 Hubs, Layer 2 Switches & Bridges, Layer 3 Routers, and Application Gateways. Understand collision vs broadcast domains.',
      learningObjectives: [
        'Differentiate Hub (L1), Switch (L2), and Router (L3) based on OSI layers and forwarding mechanisms.',
        'Explain Collision Domains vs Broadcast Domains with visual boundary diagrams.',
        'Trace how a switch populates its MAC Address Table via backward learning.',
      ],
      prerequisites: ['Lesson 1.1: What is a Computer Network'],
      beginnerExplanation:
        'Imagine a conference room. A Hub is like a person with a megaphone repeating every whispered word to everyone in the room. A Switch is like a courteous postman inside the building who knows exactly which desk belongs to Bob and only walks Bob’s letter to Bob. A Router is like the international shipping port that takes letters out of the building across highways and oceans to another company.',
      technicalExplanation:
        'A Hub operates at Layer 1 (Physical). It is a multiport repeater: incoming electrical pulses on one port are amplified and regenerated out of all other ports indiscriminately. All ports on a hub reside in a SINGLE collision domain and a SINGLE broadcast domain. A Bridge / Switch operates at Layer 2 (Data Link). It inspects 48-bit MAC addresses. A switch maintains a Content-Addressable Memory (CAM) MAC table populated via "backward learning" (reading source MACs from frames). A switch breaks up collision domains: each port is its own isolated collision domain. However, default switched LANs remain a single broadcast domain (broadcast MAC FF:FF:FF:FF:FF:FF is flooded to all ports). A Router operates at Layer 3 (Network). It inspects 32-bit IPv4 or 128-bit IPv6 destination addresses and consults routing tables (FIB/RIB). A router breaks BOTH collision domains AND broadcast domains (it drops broadcast packets by default unless explicitly configured for DHCP relay). Gateways operate across all 7 layers to translate disparate protocol suites (e.g., VoIP SIP to PSTN).',
      realWorldAnalogy: {
        title: 'Megaphone vs Private Intercom vs Post Office',
        story: 'If you shout on a megaphone in a shared hall, no one else can talk at that moment without their words colliding into gibberish (Hub). If each desk has a targeted intercom button to desk 4, people at desks 1 and 2 can converse while desks 5 and 6 also converse without overlap (Switch). If you need to mail a package from New York to Tokyo, you need customs clearance, international zip codes, and cross-border transport (Router).',
        takeaway: 'Switches manage internal local traffic by MAC address; Routers manage global cross-network traffic by IP address.',
      },
      tanglishExplanation:
        'Hub vandhu Layer 1 device: incoming data-va ellarukum blind-a broadcast pannum (romba dummy!). Switch vandhu Layer 2 device: MAC address vechu yaaruku poganumo avangaluku mattum accurate-a forward pannum. Router vandhu Layer 3 device: IP address paathu different networks-ah connect pannum. Switch collision domain-ah break pannum; Router broadcast domain-ayum break pannum!',
      practicalExamples: [
        {
          title: 'Switch MAC Learning Algorithm',
          scenario: 'Host A (MAC: AA) sends a ping to Host B (MAC: BB) for the first time on a 4-port switch.',
          solution: 'Switch inspects frame: learns Host A is on Port 1. It looks up BB in its CAM table; not found! Switch floods the frame out of Ports 2, 3, and 4. Host B responds; switch inspects reply, learns BB is on Port 2. Subsequent packets are forwarded directly between Port 1 and Port 2 (unicast).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking a switch stops broadcast packets.',
          reality: 'A standard switch floods broadcast packets (like ARP requests) to every active port in the VLAN. Only a router or VLAN boundary blocks broadcasts.',
          whyItMatters: 'Broadcast storms can overwhelm switch CPU and link capacity if loops exist without Spanning Tree Protocol (STP).',
        },
      ],
      interviewQuestions: [
        {
          question: 'If a 24-port switch has 24 computers connected, how many collision domains and how many broadcast domains exist?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'There are 24 collision domains (each switch port is its own micro-segmented collision domain in full-duplex) and 1 broadcast domain (assuming all ports belong to default VLAN 1). If it were a 24-port hub, there would be only 1 collision domain and 1 broadcast domain.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-1-3',
          question: 'Which networking device operates at Layer 3 and breaks both collision and broadcast domains?',
          type: 'single',
          options: ['Repeater', 'Bridge', 'Switch', 'Router'],
          correctIndex: 3,
          explanation: 'Routers operate at the Network Layer (L3) and delimit broadcast domains as well as collision domains.',
        },
      ],
      keyTakeaways: [
        'Hub (L1): Multiport repeater; 1 collision domain, 1 broadcast domain.',
        'Switch (L2): Filters by MAC address; separate collision domain per port, 1 broadcast domain per VLAN.',
        'Router (L3): Forwards by IP address; breaks both collision and broadcast domains.',
      ],
      flashcards: [
        { front: 'What is a collision domain?', back: 'A network segment where packet frames can collide if transmitted simultaneously by two hosts.' },
        { front: 'What is a broadcast domain?', back: 'A logical division of a computer network in which all nodes can reach each other by broadcast at the data link layer.' },
      ],
    },
  ],
};
