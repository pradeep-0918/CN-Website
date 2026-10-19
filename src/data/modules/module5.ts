import { Module } from '../../types/network';

export const module5: Module = {
  id: 5,
  title: 'Network Layer',
  tagline: 'IP Addressing, CIDR, Subnetting, VLSM, Routing Protocols & NAT',
  description: 'Master IPv4 dotted-decimal math, subnet masks, CIDR prefix calculations, VLSM design, IPv6, ICMP, Distance-Vector vs Link-State routing (RIP, OSPF, BGP), and NAT/PAT.',
  iconName: 'Globe',
  level: 'Intermediate',
  lessons: [
    {
      id: 'm5-l1',
      moduleId: 5,
      chapterNumber: '5.1',
      title: 'IPv4 Addressing, Subnet Masks & Binary Conversions',
      slug: 'ipv4-addressing-and-subnet-masks',
      readTime: '15 min read',
      summary: 'Demystify 32-bit IPv4 addresses, binary octet conversions, network and host portions, default address classes (A, B, C), and subnet masks.',
      learningObjectives: [
        'Convert any dotted-decimal IPv4 address into its 32-bit binary representation.',
        'Distinguish the Network ID from the Host ID using bitwise AND with the subnet mask.',
        'Identify private IP ranges specified in RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).',
      ],
      prerequisites: ['Module 1 & 2'],
      beginnerExplanation:
        'An IPv4 address is like your home mailing address. It has two parts: the street name (Network ID) and your house number (Host ID). All houses on the same street share the exact same street name. In networking, the Subnet Mask acts like a highlighter: all the 1s in the mask highlight the Network portion, and all the 0s mark the Host portion.',
      technicalExplanation:
        'An IPv4 address is a 32-bit binary integer divided into four 8-bit octets separated by dots (e.g., 192.168.1.1). Range: 0.0.0.0 to 255.255.255.255 ($2^{32} \\approx 4.29$ billion addresses).\n\nHistorical Classful Addressing:\n- Class A: 1.0.0.0 to 126.255.255.255. Leading bits: `0`. Default mask: 255.0.0.0 (/8). Supports $2^{24} - 2 = 16,777,214$ hosts per network.\n- Class B: 128.0.0.0 to 191.255.255.255. Leading bits: `10`. Default mask: 255.255.0.0 (/16). Supports $2^{16} - 2 = 65,534$ hosts.\n- Class C: 192.0.0.0 to 223.255.255.255. Leading bits: `110`. Default mask: 255.255.255.0 (/24). Supports $2^8 - 2 = 254$ hosts.\n- Class D: 224.0.0.0 to 239.255.255.255. Leading bits: `1110`. Reserved for Multicast.\n- Class E: 240.0.0.0 to 255.255.255.255. Leading bits: `1111`. Experimental.\n- Loopback: 127.0.0.0/8 (127.0.0.1).\n\nRFC 1918 Private Address Allocations:\n- 10.0.0.0 to 10.255.255.255 (10.0.0.0/8, 1 Class A network)\n- 172.16.0.0 to 172.31.255.255 (172.16.0.0/12, 16 contiguous Class B networks)\n- 192.168.0.0 to 192.168.255.255 (192.168.0.0/16, 256 contiguous Class C networks)\n\nBitwise Subnetting Principle:\nNetwork Address = $\\text{IPv4} \\text{ AND } \\text{Subnet Mask}$.\nDirected Broadcast Address = $\\text{Network Address} \\text{ OR } (\\sim \\text{Subnet Mask})$.',
      realWorldAnalogy: {
        title: 'Telephone Area Codes and Extensions',
        story: 'In phone number `+1 (415) 867-5309`, `+1 (415)` routes your call to the San Francisco exchange (Network ID). Once the call reaches the local exchange switch, `867-5309` connects to the specific handset inside the office (Host ID). The subnet mask simply marks where the area code ends and the personal extension begins.',
        takeaway: 'Routers route by the network prefix; local switches deliver to the host identifier.',
      },
      tanglishExplanation:
        'IPv4 address-la total-a 32 bits irukkum (4 octets, ovvoru octet-layum 8 bits: 0 to 255). Idhula rendu part: Network ID (Area code) and Host ID (House number). Subnet Mask-la 1s irukka edathulam Network ID, 0s irukka edathulam Host ID. RFC 1918 Private IPs: 10.x.x.x, 172.16-31.x.x, 192.168.x.x. Idhellam Internet-la direct-a route aagaadhu, router-la NAT panni thaan public IP-kku maathuvom!',
      practicalExamples: [
        {
          title: 'Extracting Network Address with Bitwise AND',
          scenario: 'IP is 172.20.14.75 with Subnet Mask 255.255.240.0 (/20).',
          solution: 'Convert 3rd octets to binary: 14 = 00001110; 240 = 11110000. 14 AND 240 = 00000000 (0). Network Address is 172.20.0.0.',
        },
      ],
      numericalProblems: [
        {
          problem: 'Find the network address, broadcast address, and number of usable hosts for the host 192.168.10.130/26.',
          given: { 'IP Address': '192.168.10.130', 'Prefix': '/26' },
          formula: 'Host bits h = 32 - 26 = 6; Block size = 2^h = 64; Usable hosts = 2^h - 2',
          stepByStepSolution: [
            'Prefix /26 mask: 255.255.255.192 (11000000 in 4th octet)',
            'Host bits h = 32 - 26 = 6 bits -> Total addresses = 2^6 = 64',
            'Subnet blocks in 4th octet: 0..63, 64..127, 128..191, 192..255',
            '130 falls in the block 128..191',
            'Network Address: 192.168.10.128',
            'Broadcast Address: 192.168.10.191',
            'First Usable Host: 192.168.10.129; Last Usable Host: 192.168.10.190',
            'Usable hosts = 64 - 2 = 62 hosts',
          ],
          answer: 'Network: 192.168.10.128/26 ; Broadcast: 192.168.10.191 ; Usable Hosts: 62',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Assigning the first (.0 in /24) or last (.255 in /24) IP address to a computer.',
          reality: 'The all-zeros host identifier represents the Network Address itself; the all-ones host identifier is the Directed Broadcast Address. Neither can be assigned to a host NIC (except in /31 point-to-point links).',
          whyItMatters: 'Operating systems will reject configuring network or broadcast addresses with an invalid IP error.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why was classful addressing replaced by CIDR (Classless Inter-Domain Routing) in 1993?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Classful addressing caused catastrophic IPv4 address waste. An organization needing 300 hosts had to purchase a Class B license (65,534 addresses), wasting 65,200+ addresses. Conversely, Class C supported only 254 hosts, which was too small for most businesses. CIDR (RFC 1519) abolished rigid Class A, B, and C boundaries, allowing arbitrary prefix lengths (/23, /27, etc.) and hierarchical route aggregation (supernetting) to prevent global internet routing tables from exploding.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-5-1',
          question: 'How many usable host IP addresses are available in a /28 subnet?',
          type: 'single',
          options: ['14', '16', '30', '32'],
          correctIndex: 0,
          explanation: 'Host bits h = 32 - 28 = 4. Total = 2^4 = 16. Usable hosts = 16 - 2 = 14 hosts.',
        },
      ],
      keyTakeaways: [
        'IPv4 addresses are 32 bits divided into 4 octets.',
        'Subnet mask determines the division between Network ID and Host ID.',
        'Usable hosts on any standard subnet = $2^{32 - \\text{prefix}} - 2$.',
      ],
      flashcards: [
        { front: 'Formula for total IPv4 addresses in a /n prefix?', back: '2^(32 - n)' },
        { front: 'Name the three private IPv4 address blocks under RFC 1918.', back: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16' },
      ],
    },
    {
      id: 'm5-l2',
      moduleId: 5,
      chapterNumber: '5.2',
      title: 'CIDR, VLSM & Special Edge Cases (/31 and /32)',
      slug: 'cidr-vlsm-and-special-subnets',
      readTime: '15 min read',
      summary: 'Master Variable Length Subnet Masking (VLSM) algorithms, mathematical boundary alignment theorems, step-by-step hierarchical address allocation, and RFC 3021 /31 point-to-point links.',
      learningObjectives: [
        'Derive the mathematical boundary alignment rule: NetworkAddress mod 2^(32 - prefix) == 0.',
        'Execute the VLSM descending host-allocation algorithm without address fragmentation.',
        'Explain why RFC 3021 /31 subnets have 2 usable hosts with zero wasted broadcast addresses.',
        'Explain why /32 prefixes are used for router loopback interfaces and host routes.',
      ],
      prerequisites: ['Lesson 5.1: IPv4 Addressing & Classes'],
      beginnerExplanation:
        'Imagine you are an architect designing floor plans for an office tower. Under old rigid rules (Class C), every company had to rent a fixed 256-desk floor. A 10-person startup rented 256 desks (wasting 246 empty seats!), while a 300-person company had to awkwardly split across multiple floors. VLSM (Variable Length Subnet Masking) solves this by letting you custom-slice the floor plan into exact power-of-two rooms: a 128-desk wing (/25) for Engineering, a 64-desk room (/26) for Sales, a 32-desk room (/27) for HR, and tiny 2-desk phone booths (/30 or /31) for router-to-router links.\n\nCRITICAL RULE: You must always give rooms to the largest teams first! If you give a tiny 2-desk booth right in the center of the floor, you chop up the space and can never fit a 128-desk wing later.',
      technicalExplanation:
        'Variable Length Subnet Masking (VLSM, RFC 1878) allows a single IP network block to be recursively partitioned into subnets of different prefix lengths (/24, /26, /28, /30, /31), matching each subnet’s size to its exact host requirements.\n\n1. Foundational Concept: Why Are Two Addresses Reserved?\nIn any standard IPv4 subnet of prefix length /p ($p \\le 30$):\n- Total Addresses = $2^{32-p}$\n- Usable Host Addresses = $2^{32-p} - 2$\nWhy minus 2?\n• First Address (all host bits 0): The Subnet Network Identifier. It represents the subnet itself in router forwarding tables.\n• Last Address (all host bits 1): The Directed Broadcast Address. Any packet sent to this address is received and processed by every single host on that local subnet.\n\n2. The Binary Boundary Alignment Rule (Modulo Theorem):\nEvery subnet of prefix length /p has a block size of $S = 2^{32-p}$ addresses.\nTheorem: A valid subnet network address $N$ MUST satisfy:\n$$N \\equiv 0 \\pmod{S}$$\nIn binary, the lowest $(32-p)$ host bits of the network address MUST all be zero.\n• Example: A /26 subnet has block size $2^{32-26} = 64$. Its network address can ONLY start at .0, .64, .128, or .192.\n• It can NEVER start at .32 or .100 because 100 is not divisible by 64 (its binary representation would have 1s in the host bit fields).\n\n3. The VLSM Descending Allocation Algorithm:\nWhy must we sort requirements strictly in descending order ($N_1 \\ge N_2 \\ge \\dots \\ge N_k$)?\n• Proof by Counter-Example: Suppose you start with 192.168.1.0/24. If you allocate a small /30 subnet first (size 4), it occupies 192.168.1.0 to 192.168.1.3. The next available address is 192.168.1.4. If your next requirement needs a /26 (size 64), 192.168.1.4 is NOT divisible by 64! You would be forced to skip 60 addresses (192.168.1.4 to 192.168.1.63) just to reach the next valid 64-boundary at .64. This creates catastrophic address fragmentation.\n• Descending Rule Guarantee: Allocating larger blocks first ensures the allocation pointer always lands on a natural power-of-two boundary for all subsequent smaller blocks!\n\n4. Prefix Length & Mask Cheat Sheet:\n┌────────┬──────────────┬────────────┬──────────────┬────────────────────────┐\n│ Prefix │ Subnet Mask  │ Block Size │ Usable Hosts │ Primary Use Case       │\n├────────┼──────────────┼────────────┼──────────────┼────────────────────────┤\n│  /24   │ ...255.0     │    256     │     254      │ Large Office / VLAN    │\n│  /25   │ ...255.128   │    128     │     126      │ Mid Department         │\n│  /26   │ ...255.192   │     64     │      62      │ Small Department       │\n│  /27   │ ...255.224   │     32     │      30      │ Server Cluster         │\n│  /28   │ ...255.240   │     16     │      14      │ DMZ / Infrastructure   │\n│  /29   │ ...255.248   │      8     │       6      │ Small Branch           │\n│  /30   │ ...255.252   │      4     │       2      │ Legacy Point-to-Point  │\n│  /31   │ ...255.254   │      2     │       2      │ RFC 3021 Router P2P    │\n│  /32   │ ...255.255   │      1     │       1      │ Loopback / Host Route  │\n└────────┴──────────────┴────────────┴──────────────┴────────────────────────┘\n\n5. Special Edge Cases: /31 and /32 Subnets\n• RFC 3021 (/31 Subnets): On dedicated point-to-point links between two core routers, only two endpoints exist on the physical wire. There are no other hosts to broadcast to! Under RFC 3021, the host with the lower address and the host with the higher address are both valid unicast addresses (e.g., 10.1.1.0/31 has hosts 10.1.1.0 and 10.1.1.1). Eliminating reserved network and broadcast addresses saves 50% of IP space across telecom backbones.\n• /32 Subnets (Host Routes): A /32 mask (255.255.255.255) defines a single specific IP address. Routers assign /32 addresses to virtual Loopback interfaces (e.g., Loopback0) because a loopback interface never goes physically down as long as the router has power, providing a rock-solid router identifier for BGP and OSPF.\n\n6. CIDR Supernetting (Route Aggregation):\nCombining multiple contiguous, power-of-two subnets into a single advertised summary prefix to shrink global routing tables.\n• Rule: To aggregate $2^k$ contiguous /24 networks, they must start at a boundary divisible by $2^k$, and the resulting prefix is $/(24 - k)$.\n• Example: Combine 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24 ($2^2 = 4$ networks):\n  Third octets in binary: 00000000, 00000001, 00000010, 00000011.\n  The first 6 bits of the third octet are identical (`000000`).\n  Prefix length: $8 + 8 + 6 = 22$ bits.\n  Aggregated summary route: 192.168.0.0/22. One routing table entry replaces four.',
      realWorldAnalogy: {
        title: 'Apartment Building Floor Allocation',
        story: 'If an architect must allocate 128 rooms in a building: the ground floor is reserved for an anchor department store (needs 60 rooms -> /26, size 64), the second floor for a corporate firm (needs 25 rooms -> /27, size 32), the third floor for a boutique studio (needs 12 rooms -> /28, size 16), and the elevator maintenance lines get two private phone jacks (/31). Slicing the largest requirements first ensures no dead hallways or stranded spaces.',
        takeaway: 'Always allocate largest host blocks first to maintain natural binary power-of-two boundaries.',
      },
      tanglishExplanation:
        'VLSM-la (Variable Length Subnet Masking) different departments-kku avanga requirement-kku yethamaari different size subnets piripom. Golden Rule: Yaaruku jaasthi hosts thevaiyo (largest requirement) avangaluku first allocate pannanum! /30-la 4 IPs irukkum, aana 2 thaan use panna mudiyum (50% waste). Adhunala RFC 3021 /31 introduce pannanga: router-to-router link-la broadcast theva illa, so rendu IP-yume usable hosts! Supernetting-na multiple contiguous subnets-ah merge panni single summary route-ah BGP-la advertise panradhu.',
      practicalExamples: [
        {
          title: 'Configuring an RFC 3021 /31 Interface in Cisco IOS',
          scenario: 'Connecting core router R1 to core router R2 across a dedicated Gigabit Ethernet backhaul link.',
          solution: '`interface GigabitEthernet0/0/0` -> `ip address 10.1.1.0 255.255.255.254` (IOS accepts /31 per RFC 3021; peer R2 configures 10.1.1.1 255.255.255.254). Saves 2 IP addresses on every inter-router link across the entire enterprise.',
        },
      ],
      numericalProblems: [
        {
          problem: 'You are allocated 172.16.0.0/22. Design a complete VLSM plan for: Dept A (100 hosts), Dept B (50 hosts), Dept C (20 hosts), and two WAN point-to-point router links. Specify network address, mask, usable range, broadcast, and total remaining unallocated space.',
          given: {
            'Base Pool': '172.16.0.0/22 (1024 total addresses: 172.16.0.0 to 172.16.3.255)',
            'Requirements': 'Dept A: 100 hosts; Dept B: 50 hosts; Dept C: 20 hosts; WAN 1: 2 hosts; WAN 2: 2 hosts',
          },
          formula: 'Sort descending; Find h such that 2^h - 2 >= N; Block S = 2^h; Prefix p = 32 - h; NextNet = CurrentNet + S',
          stepByStepSolution: [
            'Step 1: Sort requirements in strict descending order: Dept A (100) -> Dept B (50) -> Dept C (20) -> WAN 1 (2) -> WAN 2 (2).',
            'Step 2 - Dept A (100 hosts): 2^h - 2 >= 100 -> h = 7 (2^7 = 128). Prefix = 32 - 7 = /25. Mask: 255.255.255.128. Subnet: 172.16.0.0/25. Usable Range: 172.16.0.1 - 172.16.0.126. Broadcast: 172.16.0.127. Next free IP = 172.16.0.128.',
            'Step 3 - Dept B (50 hosts): 2^h - 2 >= 50 -> h = 6 (2^6 = 64). Prefix = 32 - 6 = /26. Mask: 255.255.255.192. Boundary check: 128 mod 64 = 0 (valid!). Subnet: 172.16.0.128/26. Usable Range: 172.16.0.129 - 172.16.0.190. Broadcast: 172.16.0.191. Next free IP = 172.16.0.192.',
            'Step 4 - Dept C (20 hosts): 2^h - 2 >= 20 -> h = 5 (2^5 = 32). Prefix = 32 - 5 = /27. Mask: 255.255.255.224. Boundary check: 192 mod 32 = 0 (valid!). Subnet: 172.16.0.192/27. Usable Range: 172.16.0.193 - 172.16.0.222. Broadcast: 172.16.0.223. Next free IP = 172.16.0.224.',
            'Step 5 - WAN 1 (2 hosts): 2^h - 2 >= 2 -> h = 2 (2^2 = 4). Prefix = 32 - 2 = /30. Mask: 255.255.255.252. Subnet: 172.16.0.224/30. Usable Range: 172.16.0.225 - 172.16.0.226. Broadcast: 172.16.0.227. Next free IP = 172.16.0.228.',
            'Step 6 - WAN 2 (2 hosts): Subnet: 172.16.0.228/30. Usable Range: 172.16.0.229 - 172.16.0.230. Broadcast: 172.16.0.231. Next free IP = 172.16.0.232.',
            'Step 7 - Address Utilization Audit: Total addresses allocated = 128 (Dept A) + 64 (Dept B) + 32 (Dept C) + 4 (WAN 1) + 4 (WAN 2) = 232 addresses. Total free contiguous addresses remaining in /22 block = 1024 - 232 = 792 addresses (from 172.16.0.232 to 172.16.3.255).',
          ],
          answer: 'Dept A: 172.16.0.0/25; Dept B: 172.16.0.128/26; Dept C: 172.16.0.192/27; WAN 1: 172.16.0.224/30; WAN 2: 172.16.0.228/30. 792 contiguous addresses remain completely free.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Allocating the smallest subnets first.',
          reality: 'If you allocate a /30 subnet at 192.168.1.0, the next block is 192.168.1.4. You can no longer place a /26 (needs 64-aligned boundary) without skipping huge gaps, causing severe address fragmentation.',
          whyItMatters: 'Subnet masks must strictly align to binary block boundaries divisible by the block size.',
        },
        {
          mistake: 'Thinking a /31 subnet has 0 usable hosts because of the 2^h - 2 rule.',
          reality: 'RFC 3021 explicitly redefines /31 for point-to-point links by eliminating the broadcast address and network identifier on two-endpoint physical wires. Both addresses are usable.',
          whyItMatters: 'Using /30 instead of /31 on point-to-point links wastes billions of IP addresses globally.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is RFC 3021 and why does a /31 subnet have 2 usable host addresses instead of 0?',
          frequency: 'High',
          target: 'FAANG',
          answer:
            'RFC 3021 recognizes that on dedicated point-to-point router links, directed broadcast and network identifier semantics are unnecessary because there are no third-party hosts on the wire. By convention under RFC 3021, the host with the lower address treats the other as its peer, and neither address is reserved for broadcast. Thus 2^(32-31) = 2 addresses, both of which are usable hosts.',
        },
        {
          question: 'Can you assign the network address 192.168.1.96 to a /26 subnet? Explain why or why not.',
          frequency: 'High',
          target: 'Cisco / Juniper',
          answer:
            'No. A /26 subnet has a block size of 2^(32-26) = 64 addresses. By the binary boundary alignment theorem, every valid /26 network address must be an exact multiple of 64: .0, .64, .128, or .192. Because 96 mod 64 = 32 != 0, 192.168.1.96 falls inside the host portion of the 192.168.1.64/26 subnet and cannot be a valid /26 network identifier.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-5-2-1',
          question: 'What is the CIDR prefix for a subnet mask of 255.255.255.248?',
          type: 'single',
          options: ['/27', '/28', '/29', '/30'],
          correctIndex: 2,
          explanation: '248 in binary is 11111000 (5 leading ones). Total prefix = 8 + 8 + 8 + 5 = 29 (/29).',
        },
        {
          id: 'p-5-2-2',
          question: 'Why must VLSM subnet requests be allocated in descending order of host requirements?',
          type: 'single',
          options: [
            'Because routers sort routing tables alphabetically.',
            'To ensure allocation addresses automatically align to required binary power-of-two boundaries without fragmentation.',
            'Because smaller subnets require faster ARP resolution.',
            'Because Cisco IOS only permits subnets starting with odd numbers.',
          ],
          correctIndex: 1,
          explanation: 'Sorting in descending order guarantees that each allocated block starts at an address that naturally satisfies the modulo boundary condition for all subsequent smaller subnets.',
        },
      ],
      keyTakeaways: [
        'Always allocate subnets from largest host requirement to smallest.',
        'Subnet addresses must be divisible by their block size: NetworkAddress mod 2^(32-p) == 0.',
        'RFC 3021 /31 point-to-point links provide exactly 2 usable host addresses with zero waste.',
        '/32 represents a single host route with mask 255.255.255.255.',
      ],
      flashcards: [
        { front: 'How many usable IP addresses in an RFC 3021 /31 subnet?', back: '2 usable host IP addresses.' },
        { front: 'What is supernetting (route aggregation)?', back: 'Combining multiple smaller contiguous IP networks into a single larger CIDR prefix to reduce routing table size.' },
      ],
    },
    {
      id: 'm5-l3',
      moduleId: 5,
      chapterNumber: '5.3',
      title: 'Routing Protocols: Distance-Vector (Bellman-Ford) vs Link-State (Dijkstra)',
      slug: 'routing-protocols-rip-ospf-bgp',
      readTime: '18 min read',
      summary: 'Explore interior vs exterior routing protocols: Bellman-Ford (RIP), Dijkstra shortest path first (OSPF), Count-to-Infinity, Split Horizon, and Path-Vector BGP.',
      learningObjectives: [
        'Execute Dijkstra’s algorithm step-by-step on a network graph to construct a Shortest Path Tree (SPT).',
        'State and compute routing tables using the distributed Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) }.',
        'Trace the Count-to-Infinity problem and explain how Split Horizon and Poison Reverse extinguish routing loops.',
        'Contrast Interior Gateway Protocols (IGP: RIP, OSPF) with Exterior Gateway Protocols (EGP: BGP-4).',
      ],
      prerequisites: ['Lesson 5.1: IPv4 Addressing', 'Lesson 5.2: CIDR & VLSM'],
      beginnerExplanation:
        'When you use Google Maps to drive across the country, your phone downloads the entire satellite road network and calculates the fastest turn-by-turn route using Dijkstra’s Shortest Path First algorithm (Link-State / OSPF). Every highway, intersection, and bridge condition is known in advance.\n\nIn contrast, Distance-Vector (RIP) is like driving without a map and asking pedestrians at every corner: "Excuse me, how far to Central Station?" The pedestrian replies: "Turn left, it is 3 kilometers." You don’t know what the rest of the city looks like; you simply trust your neighbor’s rumor and distance estimate.\n\nBGP is the global customs and border control: it decides which national highways and commercial border gates are open between sovereign countries (Autonomous Systems).',
      technicalExplanation:
        'Routing algorithms compute optimal packet paths across complex internetworks. They are classified into two major paradigms based on topology awareness and computation scope:\n\n1. Distance-Vector Routing (e.g., RIP - RFC 2453)\n• Core Principle: "Routing by Rumor." A router does NOT know the complete network topology. It only knows:\n  1. Directly connected neighbors and link costs.\n  2. Distance estimates advertised by those neighbors.\n• Computational Engine: Distributed Bellman-Ford Equation:\n$$D_x(y) = \\min_{v \\in N(x)} \\{ c(x,v) + D_v(y) \\}$$\nwhere:\n  • $x$ is the local router executing the calculation.\n  • $y$ is the destination node.\n  • $N(x)$ is the set of directly attached neighbors of $x$.\n  • $c(x,v)$ is the physical link cost between $x$ and neighbor $v$.\n  • $D_v(y)$ is neighbor $v$’s advertised estimate of its shortest path to $y$.\n• Metric: Hop count (maximum 15 hops; 16 represents infinity/unreachable). Routing tables are periodically broadcasted every 30 seconds.\n\n2. The Count-to-Infinity Problem & Loop Prevention:\nConsider a 3-node linear topology: A ──(1)── B ──(1)── C\nInitially: A reaches C via B in 2 hops ($D_A(C)=2$). B reaches C in 1 hop ($D_B(C)=1$).\nSuppose the link between B and C breaks:\n• Step 1: B detects failure and sets $D_B(C) = \\infty$.\n• Step 2: Before B can broadcast the news, A sends its periodic update to B stating: "I can reach C with cost 2."\n• Step 3: B mistakenly thinks: "Great! A has another path to C that I didn’t know about!" B updates: $D_B(C) = c(B,A) + D_A(C) = 1 + 2 = 3$.\n• Step 4: B advertises this to A. A updates: $D_A(C) = c(A,B) + D_B(C) = 1 + 3 = 4$.\n• Step 5: The count bounces back and forth: 5, 6, 7... until reaching 16 (infinity). During this entire time, packets bounce endlessly in a routing loop!\n• Solutions:\n  - Split Horizon: A router NEVER advertises a route back out the same physical interface from which it learned that route.\n  - Poison Reverse: When advertising a route back out the interface it was learned on, the router explicitly sets the metric to 16 (infinity). This immediately poisons the loop.\n\n3. Link-State Routing (e.g., OSPF - RFC 2328, IS-IS)\n• Core Principle: "Global Knowledge." Every router acquires complete map of the entire network topology.\n• Protocol Operation:\n  1. Neighbor Discovery: Routers send periodic HELLO packets to discover neighbors and measure link status.\n  2. LSA Flooding: Each router generates a Link-State Advertisement (LSA) describing its local links and costs, and floods it reliably to ALL routers in the area.\n  3. Link-State Database (LSDB): Every router builds an IDENTICAL graph $G = (V, E)$ of the network.\n  4. Dijkstra SPF Execution: Each router independently runs Dijkstra’s algorithm using itself as the root to construct a loop-free Shortest Path Tree (SPT).\n• Metric: Cost inversely proportional to interface bandwidth ($Cost = \\frac{\\text{Reference Bandwidth}}{\\text{Interface Bandwidth}}$, default $10^8 / \\text{bps}$).\n• Advantages: Instant event-driven convergence, zero count-to-infinity loops, scalable hierarchical area design (Area 0 Backbone).\n\n4. Path-Vector Routing & Exterior Gateway Protocol: BGP-4 (RFC 4271)\n• Scope: Connects distinct Autonomous Systems (AS) across the global Internet over TCP port 179.\n• Mechanism: Advertises complete AS-Path (e.g., "To reach 8.8.8.0/24, go through AS 15169 -> AS 1299 -> AS 3356").\n• Loop Prevention: If an AS sees its own Autonomous System Number (ASN) anywhere inside the AS-Path, it immediately discards the update!\n• Policy-Driven: Unlike IGP which picks the shortest mathematical path, BGP chooses routes based on commercial contracts, customer-provider transit economics, and peering agreements.',
      realWorldAnalogy: {
        title: 'Asking Strangers vs GPS Navigation System',
        story: 'If you are driving across Europe: asking locals at gas stations "How far to Rome?" is Distance-Vector (RIP). You only know the next turn and rough distance. Having a satellite GPS navigation unit loaded with the complete map of every highway and bridge in Europe is Link-State (OSPF). The GPS independently recalculates the shortest path using Dijkstra. BGP is the international customs border treaties between nations deciding which truck lines are permitted through which geopolitical borders.',
        takeaway: 'OSPF maps the autonomous system; BGP negotiates cross-country policy agreements.',
      },
      tanglishExplanation:
        'Routing protocols-la rendu broad types: IGP (Internal company network-kulla) and EGP (Internet Autonomous Systems naduvula). Distance-Vector (RIP) Bellman-Ford algorithm use pannum: neighbor kitta irundhu table vaangi update pannum ("routing by rumor"). Link-State (OSPF) Dijkstra algorithm use pannum: network-la irukra full map ella router-kum theriyum, fastest path-ah calculate pannum. BGP vandhu global Internet-oda backbone protocol, TCP port 179-la run aagum.',
      practicalExamples: [
        {
          title: 'Tracepath and Autonomous Systems',
          scenario: 'Trace the BGP path from your computer to Cloudflare DNS 1.1.1.1.',
          solution: 'Run `traceroute 1.1.1.1` (or `tracert 1.1.1.1`). You can see packets hop from your local ISP’s AS, through internet exchange points (IXPs), into Cloudflare’s AS13335.',
        },
      ],
      numericalProblems: [
        {
          problem: 'Execute Dijkstra’s algorithm step-by-step from source router u for the 5-node network graph with undirected link costs: c(u,v)=2, c(u,w)=5, c(u,x)=1, c(v,w)=3, c(v,x)=2, c(x,w)=3, c(x,y)=1, c(w,y)=2. Construct the complete iteration table, find shortest path costs, and determine next-hop forwarding entries.',
          given: {
            'Graph Vertices': 'V = {u, v, w, x, y}',
            'Source Node': 'u',
            'Link Costs': 'c(u,x)=1, c(u,v)=2, c(u,w)=5, c(v,x)=2, c(v,w)=3, c(x,w)=3, c(x,y)=1, c(w,y)=2',
          },
          formula: 'D(v) = min(D(v), D(w) + c(w,v)) ; greedy selection of min D outside N\'',
          stepByStepSolution: [
            'Initialization (Step 0): N\' = {u}. Permanent: u. Tentative vectors: D(v)=2, p(v)=u; D(w)=5, p(w)=u; D(x)=1, p(x)=u; D(y)=inf, p(y)=nil.',
            'Iteration 1: Minimum tentative node outside N\' is x with D(x)=1. Add x to N\' -> N\' = {u, x}.',
            '  Relax neighbors of x:',
            '  • v: D(v) = min(2, D(x) + c(x,v)) = min(2, 1 + 2) = 2 (unchanged, via u).',
            '  • w: D(w) = min(5, D(x) + c(x,w)) = min(5, 1 + 3) = 4, p(w) becomes x.',
            '  • y: D(y) = min(inf, D(x) + c(x,y)) = min(inf, 1 + 1) = 2, p(y) becomes x.',
            'Iteration 2: Minimum tentative nodes outside N\' are v (cost 2) and y (cost 2). Tie-break select v. Add v to N\' -> N\' = {u, x, v}.',
            '  Relax neighbors of v:',
            '  • w: D(w) = min(4, D(v) + c(v,w)) = min(4, 2 + 3) = 4 (unchanged).',
            'Iteration 3: Minimum tentative node outside N\' is y with D(y)=2. Add y to N\' -> N\' = {u, x, v, y}.',
            '  Relax neighbors of y:',
            '  • w: D(w) = min(4, D(y) + c(y,w)) = min(4, 2 + 2) = 4 (unchanged).',
            'Iteration 4: Only remaining node is w with D(w)=4. Add w to N\' -> N\' = {u, x, v, y, w}. All nodes permanent.',
            'Final Shortest Path Tree (SPT) from source u:',
            '  • Destination x: Cost = 1, Path = u -> x, Next-Hop = x',
            '  • Destination v: Cost = 2, Path = u -> v, Next-Hop = v',
            '  • Destination y: Cost = 2, Path = u -> x -> y, Next-Hop = x',
            '  • Destination w: Cost = 4, Path = u -> x -> w (or u -> x -> y -> w), Next-Hop = x',
          ],
          answer: 'Shortest Distances: D(x)=1 (Next-hop x), D(v)=2 (Next-hop v), D(y)=2 (Next-hop x), D(w)=4 (Next-hop x).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking BGP selects paths based on lowest physical ping latency.',
          reality: 'BGP is a POLICY-based routing protocol. An ISP may route traffic across a longer geographic path because of peering agreements, transit costs, or regulatory compliance, rather than lowest latency.',
          whyItMatters: 'Internet traffic routing is determined by commercial contracts and AS-Path policies.',
        },
        {
          mistake: 'Confusing Distance-Vector periodic updates with Link-State event-triggered flooded LSAs.',
          reality: 'RIP sends its ENTIRE routing table to directly connected neighbors every 30 seconds. OSPF floods small LSAs only when link states change, flooding them across the whole area.',
          whyItMatters: 'Flooding small LSAs only on state changes saves immense bandwidth and converges in milliseconds.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the Count-to-Infinity problem in Distance-Vector routing and how do Split Horizon and Poison Reverse address it?',
          frequency: 'Essential',
          target: 'FAANG / GATE',
          answer:
            'When a link to destination X fails, router A marks X as unreachable. But router B (which previously learned route to X via A) advertises that it can reach X with cost 2. Router A mistakenly updates its table: "I can reach X through B with cost 3." B then updates to cost 4, A to cost 5, slowly incrementing until reaching 16 (infinity). Split Horizon prevents this by specifying that a router must never advertise a route back out the same interface it learned it from. Poison Reverse actively advertises that route back out with metric 16 (unreachable), immediately extinguishing the loop.',
        },
        {
          question: 'Why can’t Dijkstra’s algorithm handle graphs with negative edge weights?',
          frequency: 'High',
          target: 'FAANG',
          answer:
            'Dijkstra’s algorithm operates greedily: once a node is moved into the permanent set N\', its shortest distance is assumed finalized and never revisited. If negative edge weights exist, traversing a later edge could yield a lower total path cost, violating the fundamental greedy invariant. Network routing protocols like OSPF enforce strictly positive link costs based on bandwidth.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-5-3-1',
          question: 'Which routing protocol uses Dijkstra’s algorithm to compute the shortest path tree from a complete link-state database?',
          type: 'single',
          options: ['RIP', 'BGP', 'OSPF', 'NAT'],
          correctIndex: 2,
          explanation: 'OSPF (Open Shortest Path First) builds a full topology link-state database and executes Dijkstra’s algorithm.',
        },
        {
          id: 'p-5-3-2',
          question: 'In the Bellman-Ford equation D_x(y) = min_v { c(x,v) + D_v(y) }, what does the variable v represent?',
          type: 'single',
          options: [
            'The destination host machine.',
            'A directly connected physical neighbor of router x.',
            'The Autonomous System Number of the foreign network.',
            'The subnet mask of the target address.',
          ],
          correctIndex: 1,
          explanation: 'In the Bellman-Ford equation, v ranges over the set of directly attached neighbors of router x (N(x)).',
        },
      ],
      keyTakeaways: [
        'Bellman-Ford (RIP) computes routes iteratively from neighbors ("routing by rumor", max 15 hops).',
        'Dijkstra (OSPF) executes locally on a flooded, synchronized Link-State Database (LSDB) to generate a loop-free Shortest Path Tree.',
        'Count-to-Infinity is mitigated by Split Horizon and Poison Reverse.',
        'BGP is the Path-Vector protocol running over TCP port 179 that interconnects the Internet.',
      ],
      flashcards: [
        { front: 'What algorithm does OSPF execute to calculate routing tables?', back: 'Dijkstra’s Shortest Path First (SPF) algorithm.' },
        { front: 'Which transport-layer protocol and port does BGP use for peering?', back: 'TCP port 179.' },
      ],
    },
  ],
};
