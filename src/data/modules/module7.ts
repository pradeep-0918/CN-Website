import { Module } from '../../types/network';

export const module7: Module = {
  id: 7,
  title: 'Application Layer',
  tagline: 'DNS Resolution, HTTP/1.1 to HTTP/3 QUIC, TLS & Web Architecture',
  description: 'Understand the end-to-end request lifecycle: recursive DNS lookup, HTTP methods and status codes, HTTP/2 multiplexing, HTTP/3 QUIC, TLS 1.3 handshake, DHCP, and WebSockets.',
  iconName: 'Server',
  level: 'Intermediate',
  lessons: [
    {
      id: 'm7-l1',
      moduleId: 7,
      chapterNumber: '7.1',
      title: 'DNS: Domain Name System & Hierarchical Resolution',
      slug: 'dns-domain-name-system-resolution',
      readTime: '12 min read',
      summary: 'Explore recursive resolvers, Root, TLD, and Authoritative servers, record types (A, AAAA, CNAME, MX, TXT, NS), TTL, and DNS caching.',
      learningObjectives: [
        'Diagram the 8-step recursive DNS resolution process from browser to authoritative server.',
        'Differentiate key DNS record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver), TXT (SPF/DKIM).',
        'Explain DNS caching hierarchy and TTL (Time-To-Live).',
      ],
      prerequisites: ['Module 1 & 6'],
      beginnerExplanation:
        'Computers do not understand names like "google.com"; they only understand numbers like "142.250.190.46". DNS is the global phonebook of the Internet. When you type a website name, your computer asks a series of phonebook clerks: first your local Wi-Fi router, then your ISP’s clerk, who asks the grand Master Clerk (Root Server), who points to the ".com" clerk (TLD), who finally gives you the exact home number of the website owner (Authoritative Server).',
      technicalExplanation:
        'The Domain Name System (DNS - RFC 1034 / 1035) is an internationally distributed, hierarchical database mapping human-readable FQDNs (Fully Qualified Domain Names) to IP addresses. Operates over UDP/TCP port 53.\n\nHierarchical Architecture:\n1. Root DNS Servers (`.`): 13 logical root server addresses (named a.root-servers.net to m.root-servers.net), distributed across hundreds of physical locations worldwide using BGP Anycast routing. Managed by IANA/ICANN.\n2. Top-Level Domain (TLD) Servers: Manage generic TLDs (.com, .org, .edu) and country-code ccTLDs (.in, .uk, .de). E.g., Verisign operates .com.\n3. Authoritative DNS Servers: Maintain the actual official DNS records for an organization (e.g., Cloudflare, Route53, GoDaddy). The final authority for the domain.\n\nResolution Steps (Cache Miss):\n1. User enters `www.example.com`. Browser and OS check local in-memory DNS cache.\n2. Query sent to Local Recursive Resolver (e.g. ISP or 8.8.8.8 / 1.1.1.1).\n3. Resolver queries Root Server (`.`). Root replies with referral to `.com` TLD servers.\n4. Resolver queries `.com` TLD Server. TLD replies with referral to `example.com` Authoritative Name Servers (`ns1.example.com`).\n5. Resolver queries Authoritative Server for `www.example.com`.\n6. Authoritative server returns the `A` record (`93.184.216.34`) with a TTL (e.g., 3600s).\n7. Recursive resolver caches the record and returns it to the client OS.\n8. Browser connects to IP 93.184.216.34.',
      realWorldAnalogy: {
        title: 'Looking up a Specialty Doctor in a Directory',
        story: 'You ask your family physician (Recursive Resolver): "Who is the best heart surgeon in town?" The physician does not know offhand, so they call the Medical Board President (Root Server). The President says: "Call the Cardiology Department director" (TLD Server). The Cardiology director says: "Here is the clinic of Dr. Smith" (Authoritative Server). Dr. Smith’s clinic secretary gives the exact room number (A record). Your physician writes this in their quick rolodex (Cache) so if you ask again tomorrow, they answer in 1 second.',
        takeaway: 'Delegated authority allows billions of domain names to be managed without a central bottleneck.',
      },
      tanglishExplanation:
        'DNS vandhu Internet-oda phonebook. Namma `google.com` nu type panna, computer-kku IP address theriyanum. First local cache check pannum -> illana Recursive Resolver (like 8.8.8.8) Root Server kitta pogum -> Root Server `.com` TLD server-kku refer pannum -> TLD server `google.com` authoritative server-kku refer pannum -> Authoritative server actual IP address-ah (A record) tharum. TTL (Time To Live) mudiyara varaikum idhu cache-la irukkum.',
      practicalExamples: [
        {
          title: 'Querying DNS Records with DIG in Terminal',
          scenario: 'Inspect all DNS records for a domain directly.',
          solution: 'Run `dig google.com ANY +noall +answer` or `dig google.com A`. You see: `google.com. 300 IN A 142.250.190.46` (TTL = 300 seconds).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assuming CNAME can be applied to the zone apex (naked domain like `example.com`).',
          reality: 'Per RFC 1912 section 2.4, a CNAME record cannot coexist with other records (such as SOA and NS) for the same name. Therefore, `example.com` (root apex) cannot have a CNAME. DNS providers created workarounds like ALIAS or ANAME records.',
          whyItMatters: 'Attempting to put a CNAME on `example.com` breaks domain MX mail routing and NS records.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is DNS Cache Poisoning (Kaminsky attack) and how does DNSSEC resolve it?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'In DNS cache poisoning, an attacker floods a recursive resolver with forged DNS responses containing spoofed IP addresses for a target domain. If the attacker guesses the 16-bit DNS Transaction ID and source UDP port before the authoritative server replies, the resolver caches the fraudulent IP, redirecting all users to phishing sites. DNSSEC (DNS Security Extensions, RFC 4033) prevents this by cryptographically signing all DNS resource records using public-key cryptography (RRSIG records) forming an unbroken chain of trust from the Root Key-Signing Key down to the zone.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-7-1',
          question: 'Which DNS record type maps a domain name to an IPv6 address?',
          type: 'single',
          options: ['A record', 'AAAA record', 'CNAME record', 'PTR record'],
          correctIndex: 1,
          explanation: 'AAAA ("quad-A") records map hostnames to 128-bit IPv6 addresses (A records map to 32-bit IPv4).',
        },
      ],
      keyTakeaways: [
        'DNS resolution progresses from Root (.) -> TLD (.com) -> Authoritative Server.',
        'Key records: A (IPv4), AAAA (IPv6), CNAME (canonical alias), MX (mail exchange), TXT (verification).',
        'DNSSEC provides cryptographic integrity and authenticity against cache poisoning.',
      ],
      flashcards: [
        { front: 'What is the default port and transport protocol for standard DNS queries?', back: 'Port 53 over UDP.' },
        { front: 'What is the function of a CNAME record?', back: 'An alias that maps one domain name to another canonical domain name.' },
      ],
    },
    {
      id: 'm7-l2',
      moduleId: 7,
      chapterNumber: '7.2',
      title: 'HTTP Request Lifecycle: HTTP/1.1, HTTP/2, HTTP/3 (QUIC) & TLS',
      slug: 'http-lifecycle-http2-http3-and-tls',
      readTime: '15 min read',
      summary: 'Trace what happens when you type a URL into a browser: DNS, TCP, TLS 1.3 handshake, HTTP methods, headers, status codes, and HTTP/1.1 vs HTTP/2 vs HTTP/3 comparisons.',
      learningObjectives: [
        'Walk through the complete browser-to-server request lifecycle step-by-step.',
        'Compare HTTP/1.1 (pipelining, head-of-line blocking), HTTP/2 (binary framing, multiplexing), and HTTP/3 (QUIC over UDP).',
        'Identify common HTTP status codes (200, 301, 304, 400, 401, 403, 404, 500, 502, 503).',
      ],
      prerequisites: ['Lesson 7.1: DNS', 'Module 6: Transport Layer'],
      beginnerExplanation:
        'When you type `https://github.com` and hit Enter, thousands of things happen in half a second: your browser finds the IP (DNS), shakes hands with the server (TCP), exchanges secret encryption keys so no hacker can eavesdrop (TLS), sends a letter asking for the homepage (HTTP GET), receives HTML/CSS/JS (Server 200 OK), and renders the graphical website on your screen.',
      technicalExplanation:
        'Complete Request Lifecycle:\n1. URL Parsing: Extracts protocol (`https`), host (`github.com`), port (`443`), path (`/`).\n2. DNS Lookup: Browser cache -> OS cache -> Recursive Resolver -> A/AAAA record.\n3. TCP Handshake: 3-Way Handshake (SYN, SYN-ACK, ACK) - 1 RTT.\n4. TLS 1.3 Handshake: Client Hello (with supported cipher suites & key share) -> Server Hello (server cert & key share) -> Session Keys derived. (TLS 1.3 achieves 1-RTT connection setup, or 0-RTT with session resumption pre-shared keys).\n5. HTTP Request Transmitted: Method (GET/POST/PUT/DELETE/PATCH), URI, Headers (Host, User-Agent, Accept, Cookie), Body.\n6. Server Processing: Reverse proxy (Nginx) -> Application server -> Database query -> Response generated.\n7. HTTP Response Returned: Status line (`HTTP/2 200 OK`), Headers (`Content-Type: text/html`, `Set-Cookie`, `Cache-Control`), Response Body.\n8. Client Rendering: DOM tree construction, CSSOM tree, Render tree, Layout, Painting, JS execution.\n\nEvolution of HTTP Protocol:\n- HTTP/1.1 (RFC 2616): Text-based, persistent keep-alive connections. Suffers from Head-of-Line (HoL) Blocking at the application layer: requests on a single TCP connection must be served sequentially in FIFO order.\n- HTTP/2 (RFC 7540): Binary framing layer, single TCP connection with concurrent multiplexed streams, stream prioritization, header compression (HPACK), and server push. However, if a single TCP packet is dropped at Layer 4, ALL concurrent HTTP/2 streams stall (TCP Head-of-Line blocking).\n- HTTP/3 (RFC 9114): Replaces TCP with QUIC (Quick UDP Internet Connections) over UDP. Independent byte streams at Layer 4: packet loss on stream 1 does NOT block stream 2. Eliminates Head-of-Line blocking entirely, provides 0-RTT connection resumption, and supports seamless connection migration when switching between Wi-Fi and Cellular without resetting sockets.',
      realWorldAnalogy: {
        title: 'Single-Lane Highway vs Multi-Track Freight vs Drone Fleet',
        story: 'HTTP/1.1 is a narrow one-lane tunnel where every delivery truck must wait behind the slow refrigerated meat truck (Head-of-Line blocking). HTTP/2 is a long train with many freight cars linked together; if one box falls off in the middle, the whole train must stop for repairs. HTTP/3 is a fleet of independent flying drones (QUIC over UDP); if one drone gets delayed by a gust of wind, the other 99 drones continue flying directly to your balcony without pausing.',
        takeaway: 'QUIC decouples application multiplexing from transport-layer packet loss.',
      },
      tanglishExplanation:
        'Browser-la URL type panna enna nadakkum: 1) DNS lookup (IP kedaikkum), 2) TCP 3-way handshake (1 RTT), 3) TLS 1.3 cryptographic handshake (1 RTT), 4) HTTP Request (GET /), 5) Server Response (200 OK + HTML), 6) DOM rendering! HTTP/1.1 text-based, Head-of-Line blocking irukkum. HTTP/2 binary multiplexing (single TCP connection-la multiple requests). HTTP/3 vandhu TCP-ye vitutu UDP mela QUIC protocol use pannum—super fast zero HoL blocking!',
      practicalExamples: [
        {
          title: 'Examining HTTP/2 Multiplexing in Chrome DevTools',
          scenario: 'Open Network tab in Chrome DevTools when loading a modern website.',
          solution: 'Enable the "Protocol" column. You will see `h2` or `h3`. Notice that 50 images and scripts are downloaded simultaneously over a single connection ID without queuing delays.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking HTTP/2 completely eliminated Head-of-Line (HoL) blocking.',
          reality: 'HTTP/2 eliminated APPLICATION-layer HoL blocking, but because it runs over a single TCP connection, it actually MADE transport-layer HoL blocking worse! A single dropped TCP packet halts all multiplexed streams until retransmitted.',
          whyItMatters: 'This fundamental TCP flaw was the explicit engineering motivation behind Google and the IETF creating HTTP/3 over QUIC.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What happens from the moment you type https://www.google.com in a browser address bar and hit Enter until the page renders?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'A legendary interview question spanning all layers: 1) URL parsing & HSTS preloading check. 2) DNS resolution (browser cache, OS hosts file, recursive resolver query to Root/TLD/Authoritative). 3) Socket creation & ARP resolution for default gateway MAC. 4) TCP 3-Way Handshake (SYN, SYN-ACK, ACK) on port 443. 5) TLS 1.3 handshake (ClientHello, Key Exchange, Certificate validation via CA chain, symmetric AES-GCM session key established). 6) HTTP GET request sent with headers. 7) Load balancer / CDN termination and reverse proxy routing. 8) HTTP 200 response with HTML/CSS/JS payloads. 9) Browser parsing: HTML tokenization -> DOM tree, CSS parsing -> CSSOM tree, Layout reflow, and GPU compositing.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-7-2',
          question: 'Which HTTP version runs over QUIC and UDP rather than standard TCP?',
          type: 'single',
          options: ['HTTP/1.0', 'HTTP/1.1', 'HTTP/2', 'HTTP/3'],
          correctIndex: 3,
          explanation: 'HTTP/3 runs over QUIC, a transport protocol built on top of UDP to eliminate TCP head-of-line blocking.',
        },
      ],
      keyTakeaways: [
        'The web request lifecycle coordinates DNS, TCP, TLS 1.3, HTTP, and browser rendering.',
        'HTTP/1.1 suffered from application HoL blocking; HTTP/2 introduced binary multiplexing over TCP.',
        'HTTP/3 runs QUIC over UDP, eliminating transport-layer HoL blocking and enabling 0-RTT handshakes.',
      ],
      flashcards: [
        { front: 'What protocol underlies HTTP/3?', back: 'QUIC (running over UDP).' },
        { front: 'What does HTTP status code 304 indicate?', back: 'Not Modified (client can use its cached copy).' },
      ],
    },
  ],
};
