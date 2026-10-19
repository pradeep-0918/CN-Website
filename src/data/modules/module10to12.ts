import { Module } from '../../types/network';

export const module10: Module = {
  id: 10,
  title: 'Modern Networking',
  tagline: 'Software-Defined Networking (SDN), Cloud Networks, CDNs & Zero Trust',
  description: 'Understand the decoupled control and data planes in SDN, Network Function Virtualization (NFV), Layer 4 vs Layer 7 Load Balancers, Content Delivery Networks (CDNs), and Zero Trust network security.',
  iconName: 'Cloud',
  level: 'Advanced',
  lessons: [
    {
      id: 'm10-l1',
      moduleId: 10,
      chapterNumber: '10.1',
      title: 'Software-Defined Networking (SDN) & Control/Data Plane Separation',
      slug: 'software-defined-networking-sdn',
      readTime: '12 min read',
      summary: 'Explore why traditional distributed routing was superseded by SDN in hyperscale clouds, OpenFlow, centralized controllers, and programmable forwarding pipelines.',
      learningObjectives: [
        'Differentiate the Control Plane (routing logic, path calculation) from the Data Plane (packet forwarding).',
        'Explain how centralized SDN controllers program distributed white-box switch flow tables.',
        'Contrast Northbound APIs (business applications) with Southbound APIs (OpenFlow, P4, gNMI).',
      ],
      prerequisites: ['Module 5 & 6'],
      beginnerExplanation:
        'In traditional networks, every router is like an individual autonomous driver who makes independent decisions on which street to turn. If you want to change traffic rules across a 1,000-router network, you have to log into all 1,000 routers one by one! In Software-Defined Networking (SDN), all 1,000 routers become simple fast conveyor belts (Data Plane). A single centralized supercomputer brain in the cloud (Control Plane) observes the entire global traffic map and pushes instant forwarding instructions to every switch.',
      technicalExplanation:
        'Traditional routers tightly couple two planes in proprietary ASIC boxes:\n1. Control Plane: Runs distributed routing protocols (OSPF, BGP), computes next-hops, and builds the Routing Information Base (RIB).\n2. Data / Forwarding Plane: Inspects incoming packet headers against the Forwarding Information Base (FIB) in Ternary CAM (TCAM) and forwards packets out physical ports at multi-terabit line rates.\n\nSoftware-Defined Networking (SDN) Decoupling:\n- The control plane is extracted from individual hardware switches and centralized into a scalable software controller cluster (e.g., OpenDaylight, ONOS, Google Andromeda).\n- Switches become simplified "white-box" packet forwarding engines running commodity switching silicon (Broadcom Tomahawk, Intel Tofino).\n- Southbound APIs (e.g., OpenFlow, P4, gNMI/OpenConfig): Protocol through which the controller pushes flow match-action rules (`Match: IP src/dst, TCP port -> Action: Forward out Port 3, decrement TTL`).\n- Northbound APIs (REST, gRPC): Allow network orchestration systems and cloud management platforms (Kubernetes, AWS VPC managers) to program network policies dynamically.',
      realWorldAnalogy: {
        title: 'Air Traffic Control Tower vs Pilots',
        story: 'If every airline pilot had to radio every other plane in the sky to negotiate flight paths and landing queues, the sky would descend into chaos (distributed routing). Instead, pilots follow instructions from a centralized Air Traffic Control tower with radar of the entire airspace (SDN Control Plane). The planes simply fly the designated bearings and altitudes (SDN Data Plane).',
        takeaway: 'Centralized visibility optimizes global traffic without local route oscillation.',
      },
      tanglishExplanation:
        'Traditional networking-la ovvoru router-kullaiyum rendu plane irukkum: Control Plane (Brain - OSPF/BGP run aagi path calculate pannum) and Data Plane (Body - actual packets-ah forward pannum). SDN-la (Software-Defined Networking) andha Brain-ah veliya eduthu oru Centralized Cloud Controller-a maathitom. Switches ellam dumb hardware forwarders (OpenFlow or P4 protocols vechu rules receive pannum). Google, AWS data centers ellam SDN mela thaan run aagudhu!',
      practicalExamples: [
        {
          title: 'Google B4 Private WAN',
          scenario: 'Google connects hundreds of global data centers with an internal SDN WAN called B4.',
          solution: 'By using centralized OpenFlow controllers that dynamically route traffic based on application priority (search queries vs background backup sync), Google pushed backbone link utilization from 30% up to nearly 100%.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking the SDN centralized controller forwards all user data packets through itself.',
          reality: 'The SDN controller NEVER touches user data packets! User packets travel strictly through the hardware data plane switches at hardware line rate. The controller only pushes control table instructions.',
          whyItMatters: 'Routing user data through a software controller would choke throughput to megabits and create an intolerable latency bottleneck.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the architectural difference between Northbound and Southbound APIs in SDN?',
          frequency: 'High',
          target: 'FAANG',
          answer:
            'Southbound APIs (e.g. OpenFlow, P4, NETCONF, gNMI) connect the centralized SDN controller downward to the physical and virtual switches in the data plane, allowing the controller to install and modify packet forwarding match-action tables. Northbound APIs (typically RESTful JSON or gRPC interfaces) expose the network state upward to orchestration platforms, DevOps tools, and cloud management software, enabling automated provisioning of VPCs, firewalls, and QoS policies without touching switch hardware.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-10-1',
          question: 'In Software-Defined Networking (SDN), which plane is decoupled from hardware and centralized in software?',
          type: 'single',
          options: ['Data Plane', 'Forwarding Plane', 'Control Plane', 'Physical Plane'],
          correctIndex: 2,
          explanation: 'SDN decouples the Control Plane (the decision-making brain) from the Data/Forwarding Plane.',
        },
      ],
      keyTakeaways: [
        'SDN decouples the centralized software Control Plane from distributed hardware Data Planes.',
        'Southbound APIs program physical switches; Northbound APIs allow cloud apps to request network resources.',
        'Enables programmatic flexibility, higher link utilization, and rapid cloud multi-tenancy.',
      ],
      flashcards: [
        { front: 'What is the role of OpenFlow in SDN?', back: 'OpenFlow is a Southbound API standard that enables the centralized controller to modify the flow forwarding tables of data-plane switches.' },
        { front: 'What is the distinction between Northbound and Southbound APIs in SDN?', back: 'Northbound APIs connect business applications to the SDN controller; Southbound APIs connect the SDN controller to physical network switches.' },
      ],
    },
    {
      id: 'm10-l2',
      moduleId: 10,
      chapterNumber: '10.2',
      title: 'Load Balancing (L4 vs L7), CDNs, Cloud VPCs & Zero Trust',
      slug: 'load-balancing-cdns-vpcs-and-zero-trust',
      readTime: '15 min read',
      summary: 'Master Layer 4 (TCP/UDP IPVS) vs Layer 7 (HTTP Envoy/Nginx) reverse proxies, Anycast CDN edge caching, Kubernetes CNI container namespaces, and Zero Trust security.',
      learningObjectives: [
        'Differentiate L4 (transport-layer packet forwarding) from L7 (application-aware reverse proxying) load balancing.',
        'Explain how BGP Anycast routes user traffic to the geographically closest CDN Point of Presence (PoP).',
        'Define Zero Trust architecture: "Never Trust, Always Verify" using mTLS and identity-aware proxies.',
      ],
      prerequisites: ['Lesson 10.1: SDN & Control Plane'],
      beginnerExplanation:
        'Imagine a busy hospital. An L4 load balancer is a receptionist at the front revolving doors who directs every second person to Wing A and every third to Wing B without looking inside their folders. An L7 load balancer is a triage doctor who opens each patient\'s medical chart, reads that they need cardiology, and sends them to the specialized heart ward. A CDN is having mini clinics in every neighborhood so you don\'t have to fly across the country for common medications.',
      technicalExplanation:
        'Modern internet infrastructure relies on layered traffic distribution:\n\n1. Layer 4 vs Layer 7 Load Balancing:\n- Layer 4 (Transport / e.g. Linux IPVS, AWS NLB, HAProxy TCP mode):\n  - Forwards packets based solely on Socket 5-tuple: (Src IP, Src Port, Dst IP, Dst Port, TCP/UDP).\n  - Does NOT terminate TCP connection or inspect application payload.\n  - Blazing performance (> 10 million packets/second per server) with low memory footprint.\n  - Cannot route by URL path, HTTP cookies, or HTTP headers.\n- Layer 7 (Application / e.g. Nginx, Envoy, AWS ALB, Traefik):\n  - Terminates client TCP connection, decrypts TLS, and parses full HTTP request stream.\n  - Routes based on URI path (e.g. `/api/*` to Go service, `/static/*` to S3), HTTP headers, JWT tokens, or cookies.\n  - Supports sticky sessions, WebSocket upgrades, rate limiting, and compression.\n  - Higher CPU and latency overhead due to buffer serialization and TLS termination.\n\n2. Content Delivery Networks (CDNs) & BGP Anycast:\n- Distributes static assets (images, video, JS/CSS) and cached API responses across hundreds of edge Points of Presence (PoPs).\n- BGP Anycast: The exact same IP address (e.g. Cloudflare 1.1.1.1) is advertised by border routers across 300+ global data centers. Internet routers automatically deliver user packets to the topological nearest PoP based on shortest BGP AS-Path, slashing latency from 150ms to < 10ms.\n\n3. Cloud VPCs & Container Networking (CNI):\n- Virtual Private Cloud (VPC): Software-defined isolated overlay network within public clouds using VXLAN / Geneve encapsulation.\n- Container Network Interface (CNI): In Kubernetes, every Pod receives a unique, routable IP address in its own network namespace (`veth` pair bridged to `cbr0` or routed via eBPF Cilium / Calico).\n\n4. Zero-Trust Architecture (NIST SP 800-207):\n- Replaces traditional perimeter "castle-and-moat" security.\n- Core tenet: Assume the internal network is already compromised. No implicit trust granted based on network location or IP.\n- Every single service-to-service RPC must be authenticated, authorized, and encrypted via Mutual TLS (mTLS) with short-lived cryptographic identities (SPIFFE/SPIRE).',
      realWorldAnalogy: {
        title: 'The Neighborhood Post Offices and Diplomatic Passports',
        story: 'If every letter in the country had to be shipped to the capital before being delivered, local mail would take weeks. CDNs are local neighborhood postal hubs that store copies of daily newspapers for instant morning delivery. Zero Trust is requiring a biometric retina scan and identity badge at every single door inside the building, rather than just checking your driver’s license at the front parking gate.',
        takeaway: 'Zero Trust enforces cryptographic verification at every hop rather than relying on subnet boundaries.',
      },
      tanglishExplanation:
        'L4 Load Balancer (AWS NLB) IP & Port mattum paathu raw speed-la packets-ah distribute pannum. L7 Load Balancer (Nginx/ALB) HTTP request-ah open panni, URL path (`/api` or `/images`) and cookies paathu route pannum. CDN (Content Delivery Network) BGP Anycast use pannum: world full-a irukra servers ellathukum orae IP address irukkum, user-kku pakkathula irukra data center-kku packets automatic-a pogum. Zero Trust-na "Internal network-layum yaarayum namba koodadhu, ovvoru microservice call-kum mTLS verification venum"!',
      practicalExamples: [
        {
          title: 'Configuring Nginx Layer 7 Path-Based Routing',
          scenario: 'Direct `/auth/*` to Identity Service and `/billing/*` to Payments Service.',
          solution: '`location /auth/ { proxy_pass http://auth-svc:3000; }` and `location /billing/ { proxy_pass http://billing-svc:4000; }`. Only possible at Layer 7.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming BGP Anycast provides stateful session persistence without additional engineering.',
          reality: 'Because BGP can flap and re-route packets across different Anycast data centers mid-stream, subsequent TCP packets might land on a different physical server that has no knowledge of the TCP socket! Hyperscalers use consistent hashing (e.g., Maglev, Katran) to ensure packet flows remain coherent.',
          whyItMatters: 'Anycast TCP services require stateless load-balancing designs.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between Layer 4 and Layer 7 Load Balancing, and when would you choose one over the other?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Choose Layer 4 (e.g., IPVS, AWS NLB) when ultra-high throughput, minimal latency (microseconds), and low CPU overhead are mandatory (e.g., millions of concurrent database connections, streaming video, gaming UDP). Choose Layer 7 (e.g., Envoy, Nginx, AWS ALB) when intelligent routing is required: path-based routing (`/api/v1`), header inspection (JWT, cookies for sticky sessions), SSL/TLS offloading, gRPC HTTP/2 stream multiplexing, or canary A/B deployment traffic splitting.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-10-2',
          question: 'Which routing mechanism advertises the identical IP address from multiple global locations to route users to the nearest node via BGP?',
          type: 'single',
          options: ['Unicast', 'Broadcast', 'Multicast', 'Anycast'],
          correctIndex: 3,
          explanation: 'BGP Anycast allows multiple geographically distributed servers to advertise the exact same IP prefix, routing clients to the closest node.',
        },
      ],
      keyTakeaways: [
        'L4 load balancing routes on TCP/UDP 5-tuples; L7 load balancing terminates TLS and inspects HTTP payloads.',
        'BGP Anycast powers global CDN edge caching by steering users to the topologically nearest PoP.',
        'Zero Trust replaces perimeter defense with per-request mutual TLS (mTLS) authentication and fine-grained authorization.',
      ],
      flashcards: [
        { front: 'What is BGP Anycast?', back: 'A network routing technique where the same IP address is advertised by multiple global servers, routing users to the nearest node.' },
        { front: 'Why does Layer 4 load balancing achieve higher throughput than Layer 7?', back: 'It does not terminate TCP connections or parse application payloads; it forwards raw packets at wire speed.' },
      ],
    },
  ],
};

export const module11: Module = {
  id: 11,
  title: 'Network Numerical Problems',
  tagline: 'Delays, Throughput, Capacity, ARQ & Subnetting Problem Sets',
  description: 'Master quantitative calculations: Transmission delay, Propagation delay, Bandwidth-Delay Product (BDP), Shannon capacity, CRC division, and complex VLSM design exercises.',
  iconName: 'Calculator',
  level: 'Advanced',
  lessons: [
    {
      id: 'm11-l1',
      moduleId: 11,
      chapterNumber: '11.1',
      title: 'End-to-End Delays & Bandwidth-Delay Product (BDP) Mastery',
      slug: 'delays-and-bandwidth-delay-product',
      readTime: '15 min read',
      summary: 'Deconstruct total delay into transmission, propagation, queuing, and processing components. Solve high-frequency examination numerical problems.',
      learningObjectives: [
        'Calculate Transmission Delay: T_trans = L / R (Packet length / Transmission rate).',
        'Calculate Propagation Delay: T_prop = d / s (Distance / Propagation velocity).',
        'Compute Bandwidth-Delay Product (BDP = R * RTT) and explain its relationship to TCP buffer sizing.',
      ],
      prerequisites: ['Module 1 & 3'],
      beginnerExplanation:
        'Think of a toll booth on a turnpike. Transmission delay is how long it takes the toll booth gate to process a line of 10 cars and push them onto the highway (depends on car count and booth speed). Propagation delay is how long one car takes to cruise at 100 km/h across the 100-mile highway to the next city (depends only on distance and vehicle speed). Total delay is the sum of both!',
      technicalExplanation:
        'The total packet delay experienced at an intermediate network node or end-to-end is given by:\n\n$$D_{total} = D_{trans} + D_{prop} + D_{proc} + D_{queue}$$\n\n1. Transmission Delay ($D_{trans}$):\n- Time required to push all packet bits onto the physical transmission medium.\n- Formula: $D_{trans} = \\frac{L}{R}$ seconds, where $L$ is packet length in bits and $R$ is link bandwidth in bits per second (bps).\n- Governed by link bandwidth.\n\n2. Propagation Delay ($D_{prop}$):\n- Time required for a single bit to travel from sender to receiver over the physical distance.\n- Formula: $D_{prop} = \\frac{d}{s}$ seconds, where $d$ is distance in meters and $s$ is propagation velocity through the medium (typically $2.0 \\times 10^8\\text{ m/s}$ in copper/fiber, and $3.0 \\times 10^8\\text{ m/s}$ in vacuum/air).\n- Governed by physical distance and speed of light in medium.\n\n3. Processing Delay ($D_{proc}$):\n- Time router takes to inspect packet header, verify IP checksum, and determine output interface (typically microseconds).\n\n4. Queuing Delay ($D_{queue}$):\n- Time packet spends waiting in router buffer queues before transmission. Varies with traffic intensity $I = \\frac{L \\cdot a}{R}$. When $I \\to 1$, queuing delay approaches infinity.\n\nBandwidth-Delay Product (BDP):\n$$BDP = R \\times \\text{RTT} \\text{ bits}$$\nMeasures the volume of data that can be in flight simultaneously within the "network pipe". For high-speed transatlantic links (e.g., 10 Gbps with 100ms RTT), $BDP = 10^{10} \\times 0.1 = 1\\text{ Gigabit} = 125\\text{ Megabytes}$. TCP sender and receiver socket buffers MUST be sized to at least the BDP; otherwise, the connection stalls waiting for ACKs and cannot fill the link capacity.',
      realWorldAnalogy: {
        title: 'Water Pipe Volume vs Pump Rate',
        story: 'If you have a 100-meter garden hose with a cross-section that holds 50 liters of water: BDP is the 50 liters. You must pump 50 liters of water into the hose before a single drop drips out of the far end. If your water reservoir only holds 2 liters (small TCP window), you have to pump 2 liters, stop, wait for the recipient to shout "Received!", and then pump another 2 liters—wasting 96% of the hose capacity.',
        takeaway: 'TCP window size must match or exceed BDP to saturate the available bandwidth.',
      },
      tanglishExplanation:
        'Transmission Delay ($T_{trans} = L / R$): Namma computer-la irundhu bits-ah wire mela push panna aagura time (Packet size / Bandwidth). Propagation Delay ($T_{prop} = d / s$): Andha signal wire vazhiya travel aagi receiver reach aaga aagura time (Distance / Speed of light). Bandwidth-Delay Product (BDP = Bandwidth * RTT): Network wire-kulla orae nerathula ethana bits in-flight irukka mudiyum nu sollum. TCP window size BDP-kku equal-a illana, gigabit internet irundhalum slow-a thaan download aagum!',
      practicalExamples: [
        {
          title: 'Linux TCP Window Auto-Tuning for High BDP',
          scenario: 'Modern 10Gbps cloud instances transfer large multi-gigabyte datasets over transatlantic links.',
          solution: 'Linux automatically tunes TCP receive buffers using `net.ipv4.tcp_rmem` and `net.ipv4.tcp_wmem` up to 16 MB or 32 MB to match large BDP requirements.',
        },
      ],
      numericalProblems: [
        {
          problem: 'A host sends a file of 1 Megabyte (10^6 bytes) over a 10 Mbps point-to-point link. The distance is 20,000 km and propagation speed is 2 * 10^8 m/s. Calculate the Transmission Delay, Propagation Delay, and the Bandwidth-Delay Product (for RTT = 2 * T_prop).',
          given: { 'File Size (L)': '10^6 * 8 = 8 * 10^6 bits', 'Bandwidth (R)': '10 * 10^6 bps', 'Distance (d)': '20,000,000 meters', 'Speed (s)': '2 * 10^8 m/s' },
          formula: 'T_trans = L / R ; T_prop = d / s ; BDP = R * (2 * T_prop)',
          stepByStepSolution: [
            '1. T_trans = (8 * 10^6 bits) / (10 * 10^6 bps) = 0.8 seconds (800 ms)',
            '2. T_prop = 20,000,000 m / (2 * 10^8 m/s) = 0.1 seconds (100 ms)',
            '3. RTT = 2 * T_prop = 2 * 0.1 s = 0.2 seconds (200 ms)',
            '4. BDP = (10 * 10^6 bps) * 0.2 s = 2 * 10^6 bits = 250,000 Bytes (250 KB)',
          ],
          answer: 'T_trans = 800 ms ; T_prop = 100 ms ; BDP = 250 KB (2 Mb)',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Multiplying Bytes by 8 in propagation delay calculation.',
          reality: 'Propagation delay depends solely on distance and speed of light ($d/s$). It has ZERO relationship with packet size or number of bits!',
          whyItMatters: 'A 1-byte ping packet and a 1-gigabyte movie travel across the physical fiber at the exact same propagation speed.',
        },
      ],
      interviewQuestions: [
        {
          question: 'How does high latency in satellite links (geostationary orbit ~36,000 km) affect TCP performance?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'A GEO satellite has a one-way distance of ~36,000 km, causing a one-way propagation delay of ~120 ms, and an RTT of at least 500-600 ms including ground station hops. In TCP Slow Start, the congestion window doubles only once per RTT. With a 500ms RTT, ramping up cwnd takes seconds. Furthermore, the massive BDP requires huge TCP window buffers and RFC 7323 Window Scale options. Any minor packet loss causes AIMD to halve cwnd, taking many seconds to recover.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-11-1',
          question: 'Which delay component depends directly on the physical distance between the sender and receiver?',
          type: 'single',
          options: ['Transmission Delay', 'Propagation Delay', 'Queuing Delay', 'Processing Delay'],
          correctIndex: 1,
          explanation: 'Propagation delay is distance divided by propagation speed (d / s).',
        },
      ],
      keyTakeaways: [
        'Transmission delay is packet size divided by link bandwidth ($L / R$).',
        'Propagation delay is distance divided by propagation speed ($d / s$).',
        'Bandwidth-Delay Product (BDP) represents the maximum volume of bits that can fill the network transit pipe.',
      ],
      flashcards: [
        { front: 'Formula for Transmission Delay?', back: 'T_trans = L / R (Packet length in bits / Bandwidth in bps)' },
        { front: 'Formula for Propagation Delay?', back: 'T_prop = d / s (Distance in meters / Propagation speed in m/s)' },
      ],
    },
  ],
};

export const module12: Module = {
  id: 12,
  title: 'Interview & Examination Preparation',
  tagline: 'Top Technical Interview Questions, Packet Analysis & Exam Strategies',
  description: 'Curated technical interview questions from top software and infrastructure engineering companies, Wireshark packet capture analysis scenarios, and university exam revision strategies.',
  iconName: 'Award',
  level: 'Advanced',
  lessons: [
    {
      id: 'm12-l1',
      moduleId: 12,
      chapterNumber: '12.1',
      title: 'Top 25 Core Networking Interview Scenarios & Packet Analysis',
      slug: 'top-interview-scenarios-and-packet-analysis',
      readTime: '15 min read',
      summary: 'Master the most frequently asked networking interview scenarios across software engineering, systems design, and site reliability engineering (SRE) roles.',
      learningObjectives: [
        'Formulate comprehensive answers to standard senior engineering interview questions.',
        'Diagnose packet captures involving TCP RST, duplicate ACKs, window full, and zero-window probes.',
        'Articulate systematic troubleshooting using the bottom-up OSI methodology.',
      ],
      prerequisites: ['All prior modules'],
      beginnerExplanation:
        'Networking interviews do not just test rote definitions. They test whether you can systematically diagnose what went wrong when a user reports: "The website is slow" or "The connection is dropping." By thinking layer-by-layer (from physical cables up to DNS and application timeouts), you can isolate and resolve complex production incidents logically.',
      technicalExplanation:
        'Key High-Frequency Interview Scenarios:\n\n1. "Why can I ping 8.8.8.8 but cannot open google.com in my browser?"\n- Diagnosis: Layer 3 network connectivity and Default Gateway routing are functional (since ICMP echo reply succeeds to a public IP). The failure is at Layer 7: DNS resolution failure (misconfigured `/etc/resolv.conf`, unreachable recursive resolver port 53, or local DNS service crash).\n\n2. "What causes TCP `Connection Refused` vs `Connection Timed Out`?"\n- `Connection Refused` (immediate TCP RST flag returned): Packet successfully reached the destination host, but no process is listening on the destination port, or a firewall actively rejected the socket with an ICMP Port Unreachable / TCP Reset.\n- `Connection Timed Out` (SYN packets sent repeatedly with no reply): Packets are being silently dropped by an intermediate network partition, black-hole route, or stateful firewall dropping packets without rejection notification.\n\n3. Wireshark Packet Analysis Signatures:\n- TCP Zero Window: Receiver’s receive buffer is 100% full (`Win=0`). Sender pauses and sends periodic 1-byte Zero-Window Probes.\n- TCP Out-of-Order / Retransmission: Indicates packet loss or multi-path routing jitter.\n- TCP Spurious Retransmission: Sender retransmitted because RTO timer expired, but original ACK arrived shortly after.',
      realWorldAnalogy: {
        title: 'The Plumbing vs Phone Directory Diagnosis',
        story: 'If water flows through your pipes when you turn on the garden tap (ping 8.8.8.8 works), the water main is connected! If you cannot call the plumber because your telephone book was burned (DNS resolution fails), the issue is not the pipes, it is the phone directory.',
        takeaway: 'Isolate the physical/routing layer before troubleshooting application naming services.',
      },
      tanglishExplanation:
        'Interview-la romba common question: "8.8.8.8-ku ping aagudhu, aana browser-la google.com open aaga maattengudhu, yen?". Answer: Layer 3 internet connectivity super-a irukku. Problem Application Layer DNS resolution-la thaan (DNS server down or misconfigured). `Connection Refused`-na server port open-la illa, RST packet thirumba vandhuduchu. `Connection Timed Out`-na packet drop aayiduchu, badhil-e varala!',
      practicalExamples: [
        {
          title: 'Diagnosing Network Bottlenecks with MTR',
          scenario: 'A user reports intermittent connection drops during video calls.',
          solution: 'Run `mtr --report google.com`. MTR combines traceroute and ping over 100 cycles, pinpointing the exact hop router where packet loss or latency spikes originate.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming `traceroute` uses only ICMP packets.',
          reality: 'On Windows, `tracert` defaults to ICMP Echo Requests. On Linux and macOS, standard `traceroute` defaults to sending high-port UDP packets (port 33434+), but can be configured for TCP SYN (`-T`) or ICMP (`-I`).',
          whyItMatters: 'Firewalls frequently block UDP/ICMP, requiring TCP SYN traceroutes for accurate server diagnostics.',
        },
      ],
      interviewQuestions: [
        {
          question: 'How would you systematically troubleshoot a server that cannot reach external internet services?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Use the Bottom-Up OSI Approach: 1) Physical & Link (L1/L2): Check link carrier status (`ip link`), interface errors/drops, and verify default gateway ARP resolution (`ip neigh` / `arp -n`). 2) Network (L3): Check IP address assignment (`ip addr`), verify local loopback (`ping 127.0.0.1`), ping local default gateway, check routing table (`ip route`), and ping external IP (`ping 8.8.8.8`). 3) Transport/Security (L4): Verify local firewall rules (`iptables -L`, `nftables`, security groups) and check outbound socket connectivity via netcat (`nc -zv 8.8.8.8 53`). 4) Application (L7): Test DNS lookup (`dig @1.1.1.1 google.com`), check `/etc/resolv.conf`, and test HTTPS endpoint via `curl -Iv https://example.com`.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-12-1',
          question: 'If a client receives a TCP segment with the RST flag set immediately after sending a SYN, what does this indicate?',
          type: 'single',
          options: [
            'The network cable is unplugged',
            'No process is listening on the destination port, or a firewall rejected the connection',
            'The client IP address is duplicated',
            'DNS resolution timed out',
          ],
          correctIndex: 1,
          explanation: 'A TCP RST response signifies that the destination host received the SYN but has no active listening socket on that port, generating an immediate Connection Refused.',
        },
      ],
      keyTakeaways: [
        'Use the bottom-up OSI model (L1 -> L7) for structured incident troubleshooting.',
        'Distinguish TCP Reset (Connection Refused) from silent drops (Connection Timed Out).',
        'Ping tests L3 connectivity; DNS tests L7 hostname resolution.',
      ],
      flashcards: [
        { front: 'What causes a TCP "Connection Refused" error?', back: 'The target host received the SYN packet and actively responded with a TCP RST (no listening socket on that port).' },
        { front: 'What does TCP "Win=0" indicate in Wireshark?', back: 'The receiver socket buffer is completely full, pausing the sender.' },
      ],
    },
  ],
};
