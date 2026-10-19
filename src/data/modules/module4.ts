import { Module } from '../../types/network';

export const module4: Module = {
  id: 4,
  title: 'Data Link Layer',
  tagline: 'Framing, Error Detection, ARQ Flow Control, MAC & ARP',
  description: 'Master framing, parity, checksum, CRC, Hamming code, Stop-and-Wait, Go-Back-N, Selective Repeat ARQ, Ethernet IEEE 802.3, and ARP resolution.',
  iconName: 'ShieldCheck',
  level: 'Intermediate',
  lessons: [
    {
      id: 'm4-l1',
      moduleId: 4,
      chapterNumber: '4.1',
      title: 'Framing, Error Detection: Parity, Checksum & CRC',
      slug: 'framing-and-error-detection-crc',
      readTime: '15 min read',
      summary: 'Delve into bit-stuffing and byte-stuffing framing, one’s complement Internet Checksum, and Cyclic Redundancy Check (CRC) polynomial division.',
      learningObjectives: [
        'Understand character-oriented (byte stuffing) and bit-oriented (HDLC bit stuffing) framing.',
        'Perform modulo-2 polynomial long division to generate and verify CRC codewords.',
        'Contrast simple parity with 16-bit Internet Checksum and CRC-32 error detection capabilities.',
        'Prove mathematically why CRC catches 100% of single-bit, double-bit, and burst errors of length <= r.',
      ],
      prerequisites: ['Module 2 & 3: Bits, Signals, and Physical Media'],
      beginnerExplanation:
        'When raw electrical signals travel down a network cable, the receiver faces two immediate problems:\n1. Where does one frame start and where does it end? (Framing)\n2. Did electrical noise flip any 0s into 1s during transit? (Error Detection)\n\n• Parity bits are like a crude tally mark: they tell you if an odd number of bits flipped, but are completely blind if two bits flip simultaneously.\n• A CRC (Cyclic Redundancy Check) is like rigorous long division: the sender treats the bitstream as a large mathematical polynomial, divides it by a standardized divisor, and glues the remainder to the end of the frame. The receiver repeats the exact same division. If the remainder is zero, the frame is pristine; if even a single bit flipped, the remainder is non-zero and the frame is rejected.',
      technicalExplanation:
        'Data Link Layer Framing and Error Detection guarantee that continuous bitstreams are bounded into discrete frames and validated for transmission integrity.\n\n1. Framing Techniques:\n\nA. Character-Oriented (Byte Stuffing):\n- Uses delimiter bytes such as DLE (Data Link Escape), STX (Start of Text), and ETX (End of Text).\n- Rule: If user data happens to contain the byte pattern of a delimiter or ESC, the sender inserts an extra escape character (`ESC`) immediately before it. The receiver strips the first `ESC` and interprets the following byte as pure payload data.\n\nB. Bit-Oriented (HDLC Bit Stuffing - Flag Pattern: `01111110` / 0x7E):\nTo ensure user data never mimics the 8-bit frame boundary flag `01111110`:\n- Sender Rule: Scans outgoing bits. Whenever it encounters FIVE consecutive 1s (`11111`), it UNCONDITIONALLY inserts a `0` bit immediately after the fifth 1, regardless of what the next bit was. This guarantees user data never contains six consecutive 1s.\n- Receiver 3-Way Decision Tree: Scans incoming bits. When five consecutive 1s are encountered, it inspects the 6th bit:\n  • If 6th bit is `0`: Stuffed bit detected! Receiver strips the 0 and preserves the data.\n  • If 6th bit is `1` and 7th bit is `0`: Frame delimiter flag `01111110` detected! Marks frame boundary.\n  • If 6th bit is `1` and 7th bit is `1`: Seven consecutive 1s detected! Hardware abort / line idle signal.\n\n2. Modulo-2 Polynomial Arithmetic in GF(2):\nIn Galois Field GF(2), arithmetic operations are performed on binary coefficients:\n- Addition and Subtraction are IDENTICAL and equivalent to bitwise XOR ($\\oplus$):\n$$0 \\oplus 0 = 0, \\quad 0 \\oplus 1 = 1, \\quad 1 \\oplus 0 = 1, \\quad 1 \\oplus 1 = 0$$\n- Core Property: There are NO carries in addition and NO borrows in subtraction.\n- Division Rule: Align the divisor under the current dividend bits. If the leading bit is 1, XOR with the divisor. If the leading bit is 0, XOR with zeros (bring down the next bit).\n\n3. Cyclic Redundancy Check (CRC) Generation Algorithm:\nGiven data bitstring $D(x)$ of $k$ bits and a Generator Polynomial $G(x)$ of degree $r$ ($r+1$ bits):\n- Step 1: Append $r$ zero bits to $D(x)$ to form the dividend $D(x) \\cdot 2^r$.\n- Step 2: Divide $D(x) \\cdot 2^r$ by $G(x)$ using modulo-2 long division.\n- Step 3: The division yields a quotient $Q(x)$ and an $r$-bit remainder $R(x)$:\n$$D(x) \\cdot 2^r = Q(x) G(x) \\oplus R(x)$$\n- Step 4: Add $R(x)$ to the dividend modulo-2 to create the transmitted codeword $T(x)$:\n$$T(x) = D(x) \\cdot 2^r \\oplus R(x) = Q(x) G(x)$$\n(Notice that $T(x)$ is now an exact multiple of the generator $G(x)$!).\n- Step 5 (Receiver Verification): Receiver divides received codeword $T\'(x)$ by $G(x)$. If remainder is all zeros ($0^r$), the frame is accepted; otherwise, an error is flagged and the frame is dropped.\n\n4. Error-Detecting Capabilities of CRC:\nLet $E(x)$ be the transmission error polynomial. Received frame is $T\'(x) = T(x) \\oplus E(x)$. The error escapes detection if and only if $E(x)$ is divisible by $G(x)$.\nBy designing $G(x)$ with specific algebraic factors:\n- If $G(x)$ has two or more terms (contains $x^0=1$): Catches 100% of all single-bit errors.\n- If $G(x)$ contains factor $(x+1)$: Catches 100% of all odd numbers of bit errors.\n- Catches 100% of all double-bit errors as long as $G(x)$ does not divide $x^k + 1$.\n- Catches 100% of all burst errors of length $L \\le r$ bits.\nStandard Ethernet IEEE 802.3 uses CRC-32 ($r = 32$), providing $99.99999997\\%$ error detection across high-speed copper and optical networks.',
      realWorldAnalogy: {
        title: 'The Escape Character and the Long Division Check',
        story: 'If you send a telegram that ends with the code word "STOP", what happens if your message actually contains the sentence: "Do not stop the train STOP"? The operator would prematurely cut the message! To fix this, you put an escape tag before the word: "Do not \\STOP the train STOP" (Byte Stuffing). For error checking, CRC is like computing a remainder in school: 14 divided by 3 has remainder 2. You write 14-2 on the envelope. The recipient checks if 14 minus 2 is divisible by 3.',
        takeaway: 'Framing delimits boundaries; CRC provides robust burst error detection.',
      },
      tanglishExplanation:
        'Framing-la data anuppumpothu continuous bits-ah frames-ah piripom. 01111110 flag use pannuvom. Data-kullaye flag vandhutta bit-stuffing pannuvom (5 ones vandha udane oru 0-va inject pannuvom). CRC-la (Cyclic Redundancy Check) modulo-2 binary division (XOR) panni remainder-ah data kooda serthu anuppuvom. Receiver vandhu andha generator-vechu divide panni paarpanga, remainder 0 vandha data safe!',
      practicalExamples: [
        {
          title: 'HDLC Bit Stuffing Example',
          scenario: 'Data stream contains: `01111110111110`',
          solution: 'Sender injects 0 after five consecutive 1s: `011111[0]1011111[0]0`. Receiver recognizes flag `01111110` at frame boundaries and destuffs the highlighted zeros.',
        },
      ],
      numericalProblems: [
        {
          problem: 'Given data bitstring D = 100100 (6 bits) and generator polynomial G(x) = x^3 + x^2 + 1 (binary: 1101, degree r = 3). (a) Calculate the 3-bit CRC remainder. (b) Write the transmitted codeword T. (c) Prove mathematically that the receiver accepts the frame by showing that T mod G(x) = 000.',
          given: { 'Data D': '100100', 'Generator G(x)': '1101 (degree r = 3)', 'Appended Zeros': '3 zeros -> 100100000' },
          formula: 'Dividend = Data + r zeros; Modulo-2 division via XOR; T = Data concatenated with Remainder',
          stepByStepSolution: [
            'Step 1: Append r=3 zeros to D: Dividend = 100100000 (9 bits).',
            'Step 2 - Modulo-2 division on 100100000 by 1101:',
            '  100100000',
            '  1101      (1001 XOR 1101 = 0100, bring down 0 -> 1000)',
            '  ----',
            '   1000',
            '   1101     (1000 XOR 1101 = 0101, bring down 0 -> 1010)',
            '   ----',
            '    1010',
            '    1101    (1010 XOR 1101 = 0111, bring down 0 -> 1110)',
            '    ----',
            '     1110',
            '     1101   (1110 XOR 1101 = 0011, bring down 0 -> 0110)',
            '     ----',
            '      0110  (leading bit is 0: XOR with 0000, bring down 0 -> 1100... final 3 bits)',
            '  Resulting 3-bit remainder R = 001.',
            'Step 3: Transmitted Codeword T = Data + Remainder = 100100001.',
            'Step 4 - Receiver Verification: Divide T (100100001) by 1101:',
            '  1001 XOR 1101 = 0100 -> 1000',
            '  1000 XOR 1101 = 0101 -> 1010',
            '  1010 XOR 1101 = 0111 -> 1110',
            '  1110 XOR 1101 = 0011 -> 0111 (last bit 1 brought down)',
            '  0111 XOR 0111 -> exactly 000! Frame confirmed error-free.',
          ],
          answer: 'Remainder = 001; Codeword T = 100100001; Receiver remainder = 000 (Accepted).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using regular arithmetic subtraction instead of XOR during CRC division.',
          reality: 'Modulo-2 arithmetic has NO borrows or carries. 1 - 1 = 0, 1 - 0 = 1, 0 - 1 = 1 (identical to bitwise XOR: 1^1=0, 1^0=1, 0^1=1).',
          whyItMatters: 'Using decimal subtraction yields completely incorrect remainder and broken codewords.',
        },
        {
          mistake: 'Stuffing a zero only if the 6th bit is a 1.',
          reality: 'In HDLC, the sender UNCONDITIONALLY inserts a 0 after every five consecutive 1s, even if the 6th bit in the original payload was already a 0.',
          whyItMatters: 'If the sender omitted the 0 when the 6th bit was 0, the receiver would mistakenly de-stuff the real user bit, corrupting data.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why does Ethernet Data Link layer discard corrupted frames rather than requesting retransmissions?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Ethernet is designed to be as fast and lightweight as possible. In modern high-reliability switched networks, packet corruption is rare. Layer 2 simply drops corrupted frames (detected via FCS/CRC-32) silently. End-to-end reliable retransmission is delegated to Layer 4 (TCP), following the End-to-End Argument in system design.',
        },
        {
          question: 'Why do we append r zeros to a data bitstring before performing CRC division with a degree-r polynomial?',
          frequency: 'High',
          target: 'Network Engineer',
          answer:
            'Appending r zeros multiplies the polynomial by 2^r, creating r empty positions at the low-order end of the codeword. When the division D(x)*2^r / G(x) is performed, it yields an r-bit remainder R(x). Replacing the r zeros with R(x) (via modulo-2 addition) yields T(x) = D(x)*2^r ^ R(x), which is mathematically guaranteed to be exactly divisible by G(x) with zero remainder.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-4-1-1',
          question: 'If the generator polynomial has degree r = 4, how many zero bits must be appended to the data bitstring before division?',
          type: 'single',
          options: ['2', '3', '4', '5'],
          correctIndex: 2,
          explanation: 'The number of zeros appended is equal to the degree of the generator polynomial r (4 zeros).',
        },
        {
          id: 'p-4-1-2',
          question: 'In HDLC framing, when does the sender perform bit-stuffing?',
          type: 'single',
          options: [
            'Whenever six consecutive 1s occur in the payload.',
            'Unconditionally after any sequence of five consecutive 1s.',
            'Only at the beginning of a frame.',
            'Whenever an ASCII ESC character is detected.',
          ],
          correctIndex: 1,
          explanation: 'In HDLC, the sender unconditionally inserts a 0 bit immediately after any sequence of five consecutive 1s.',
        },
      ],
      keyTakeaways: [
        'Bit stuffing inserts a 0 after five consecutive 1s to prevent data from mimicking frame flags.',
        'CRC uses modulo-2 XOR polynomial division to detect burst errors.',
        'Codeword = Data bits concatenated with remainder bits.',
      ],
      flashcards: [
        { front: 'What bit is stuffed after five consecutive 1s in HDLC framing?', back: 'A zero bit (0).' },
        { front: 'What operation replaces addition/subtraction in CRC modulo-2 arithmetic?', back: 'Bitwise XOR (Exclusive OR).' },
      ],
    },
    {
      id: 'm4-l2',
      moduleId: 4,
      chapterNumber: '4.2',
      title: 'Hamming Code: Error Correction & Single-Bit Recovery',
      slug: 'hamming-code-error-correction',
      readTime: '12 min read',
      summary: 'Learn how Richard Hamming designed error-correcting codes using parity bits at powers of 2 to locate and auto-correct single-bit transmission errors.',
      learningObjectives: [
        'Place parity bits at positions that are powers of 2 (1, 2, 4, 8...).',
        'Encode 4 data bits into a 7-bit Hamming(7,4) codeword.',
        'Calculate the error syndrome to pinpoint the exact erroneous bit position and flip it back.',
      ],
      prerequisites: ['Lesson 4.1: Framing & CRC'],
      beginnerExplanation:
        'Error detection tells you "Your letter has a typo, throw it away." Error correction is like a magical spell that says "The typo is at line 3, character 5; change the E to an A and read it." Hamming code does this by interleaving check bits at specific binary powers (positions 1, 2, 4). When the receiver checks all three parity tests, the answers form a binary number that literally spells out the corrupted bit position!',
      technicalExplanation:
        'In 1950, Richard Hamming formulated error-correcting codes based on Hamming Distance $d_{min}$. To detect $d$ errors, $d_{min} \\ge d + 1$. To correct $t$ errors, $d_{min} \\ge 2t + 1$. Hamming(7,4) encodes $k = 4$ data bits with $r = 3$ parity bits into an $n = 7$ bit codeword ($2^r \\ge k + r + 1 \\implies 2^3 \\ge 4 + 3 + 1 = 8$).\n\nBit position layout (1-indexed):\n- Position 1: $P_1$ ($2^0$)\n- Position 2: $P_2$ ($2^1$)\n- Position 3: $D_1$\n- Position 4: $P_4$ ($2^2$)\n- Position 5: $D_2$\n- Position 6: $D_3$\n- Position 7: $D_4$\n\nParity calculations (even parity):\n- $P_1$ covers all positions with bit 0 set in binary (1, 3, 5, 7): $P_1 = D_1 \\oplus D_2 \\oplus D_4$\n- $P_2$ covers all positions with bit 1 set in binary (2, 3, 6, 7): $P_2 = D_1 \\oplus D_3 \\oplus D_4$\n- $P_4$ covers all positions with bit 2 set in binary (4, 5, 6, 7): $P_4 = D_2 \\oplus D_3 \\oplus D_4$\n\nDecoding & Syndrome:\nSyndrome bits $S_4 S_2 S_1$ are calculated:\n- $S_1 = b_1 \\oplus b_3 \\oplus b_5 \\oplus b_7$\n- $S_2 = b_2 \\oplus b_3 \\oplus b_6 \\oplus b_7$\n- $S_4 = b_4 \\oplus b_5 \\oplus b_6 \\oplus b_7$\nIf syndrome is 000, no error occurred. If syndrome is non-zero, its integer value $(S_4 \\cdot 4 + S_2 \\cdot 2 + S_1)$ gives the exact 1-based index of the flipped bit!',
      realWorldAnalogy: {
        title: 'The Three Interrogating Detectives',
        story: 'Three detectives cross-examine four suspects. Detective 1 questions suspects 1, 2, 4. Detective 2 questions 1, 3, 4. Detective 4 questions 2, 3, 4. Each detective writes a 0 if the story checked out or 1 if an alibi broke down. If Detectives 1 and 2 report a lie but Detective 4 says clean, the suspect checked by 1 and 2 but NOT 4 is Suspect 3 (binary 011 = 3). The liar is immediately identified without a retrial.',
        takeaway: 'Intersecting parity sets pinpoint the exact position of single-bit corruption.',
      },
      tanglishExplanation:
        'Hamming Code (7,4)-la 4 data bits kooda 3 parity bits serthu 7 bits anuppuvom. Parity bits positions 1, 2, 4 (powers of 2). Receiver side-la syndrome bits $S_4 S_2 S_1$ calculate pannuvom. Result 000 vandha error illa. 011 (decimal 3) vandha 3rd bit flip aayiduchu! Adha mattum flip (0-va 1, 1-a 0) panni auto-correct pannidalaam!',
      practicalExamples: [
        {
          title: 'ECC Memory (Error-Correcting Code RAM) in Servers',
          scenario: 'Cosmic rays flip a memory bit in an enterprise database server.',
          solution: 'Server ECC RAM uses Hamming code (SECDED: Single Error Correction, Double Error Detection) to silently detect and correct the flipped bit on-the-fly without crashing the operating system.',
        },
      ],
      numericalProblems: [
        {
          problem: 'Given 4 data bits D = 1011 (D1=1, D2=0, D3=1, D4=1), compute the 7-bit Hamming codeword using even parity.',
          given: { 'D1': '1', 'D2': '0', 'D3': '1', 'D4': '1' },
          formula: 'P1 = D1^D2^D4 ; P2 = D1^D3^D4 ; P4 = D2^D3^D4',
          stepByStepSolution: [
            'P1 = 1 ^ 0 ^ 1 = 0',
            'P2 = 1 ^ 1 ^ 1 = 1',
            'P4 = 0 ^ 1 ^ 1 = 0',
            'Arranging: P1 P2 D1 P4 D2 D3 D4 = 0 1 1 0 0 1 1',
          ],
          answer: 'Codeword = 0110011',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Putting parity bits at indices 0, 1, 2 in 1-based formulas.',
          reality: 'Hamming codes strictly place parity bits at positions that are powers of 2 (1, 2, 4, 8, 16...) so that every integer position can be uniquely expressed as a sum of powers of 2.',
          whyItMatters: 'Placing parity bits elsewhere destroys the binary syndrome decoding property.',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is the relationship between minimum Hamming distance (d_min) and error detection/correction capabilities?',
          frequency: 'Essential',
          target: 'University Exam',
          answer:
            'To detect up to d bit errors, the minimum Hamming distance must satisfy $d_{min} \\ge d + 1$. To correct up to t bit errors, the minimum Hamming distance must satisfy $d_{min} \\ge 2t + 1$. For Hamming(7,4), $d_{min} = 3$, allowing it to correct $t = \\lfloor(3-1)/2\\rfloor = 1$ single-bit error, or detect up to 2 bit errors.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-4-2',
          question: 'If the syndrome calculated from a 7-bit Hamming code is 101 in binary, which bit position has the error?',
          type: 'single',
          options: ['Bit 3', 'Bit 4', 'Bit 5', 'Bit 6'],
          correctIndex: 2,
          explanation: 'Binary 101 equals 4 + 0 + 1 = 5 in decimal, meaning Bit 5 was corrupted.',
        },
      ],
      keyTakeaways: [
        'Hamming code adds parity bits at positions 1, 2, 4, 8... ($2^k$).',
        'Syndrome directly indicates the binary index of the single corrupted bit.',
        'SECDED adds an overall 8th parity bit to detect double errors while correcting single errors.',
      ],
      flashcards: [
        { front: 'Formula for minimum Hamming distance to correct t errors?', back: 'd_min >= 2t + 1' },
        { front: 'Where are parity bits placed in a Hamming codeword?', back: 'At bit positions that are powers of 2 (1, 2, 4, 8, 16...).' },
      ],
    },
    {
      id: 'm4-l3',
      moduleId: 4,
      chapterNumber: '4.3',
      title: 'Flow Control & ARQ: Stop-and-Wait, Go-Back-N, Selective Repeat',
      slug: 'flow-control-and-arq-protocols',
      readTime: '15 min read',
      summary: 'Analyze sliding window flow control protocols, sender/receiver window sizes, sequence number spaces, utilization math, and ARQ retransmission mechanisms.',
      learningObjectives: [
        'Derive efficiency of Stop-and-Wait: η = 1 / (1 + 2a) where a = T_prop / T_trans.',
        'Contrast Go-Back-N (cumulative ACK, receiver window = 1) with Selective Repeat (individual ACK, receiver window = sender window = 2^(m-1)).',
        'Calculate minimum sequence numbers required to prevent duplicate frame confusion in GBN and SR.',
      ],
      prerequisites: ['Lesson 4.1: Framing'],
      beginnerExplanation:
        'Imagine mailing letters. In Stop-and-Wait, you send 1 letter and freeze until the postal delivery person walks all the way back with a confirmation. If the journey takes 5 days, your throughput is terrible! In Go-Back-N, you can send 4 letters in a row without waiting. But if letter 2 gets lost in the rain, the receiver throws away letters 3 and 4 as well, forcing you to go back and resend all of them from 2 onward. In Selective Repeat, the receiver has a smart shelf that holds onto 3 and 4, politely asking you to ONLY resend the missing letter 2.',
      technicalExplanation:
        'Automatic Repeat reQuest (ARQ) protocols ensure reliable delivery over noisy channels:\n\n1. Stop-and-Wait ARQ:\n- Sender window size $W_s = 1$, Receiver window size $W_r = 1$.\n- Sender transmits Frame 0, starts timer, waits for ACK 1. If timer expires, retransmits Frame 0.\n- Efficiency: $\\eta = \\frac{T_{trans}}{T_{trans} + 2 T_{prop}} = \\frac{1}{1 + 2a}$ where $a = \\frac{T_{prop}}{T_{trans}}$. When propagation delay dominates (e.g. satellite links), efficiency collapses to near 0%.\n\n2. Go-Back-N (GBN) ARQ:\n- Uses sliding window with $m$-bit sequence numbers.\n- Sender window $W_s \\le 2^m - 1$, Receiver window $W_r = 1$.\n- Cumulative ACKs: ACK $n$ acknowledges all frames up to $n-1$.\n- If an out-of-order frame arrives, receiver discards it and re-sends ACK for highest in-order frame.\n- On timeout of frame $k$, sender retransmits ALL unacknowledged frames $k, k+1, ...$ (Go Back N).\n- Efficiency: $\\eta = \\min\\left(1, \\frac{W_s}{1 + 2a}\\right)$.\n\n3. Selective Repeat (SR) ARQ:\n- Sender window $W_s \\le 2^{m-1}$, Receiver window $W_r = W_s$.\n- Receiver accepts out-of-order frames within its window and buffers them.\n- Uses selective ACKs (or NAKs). Sender maintains an independent timer for EVERY transmitted frame and retransmits ONLY the specific timed-out packet.\n- Maximizes bandwidth utilization on high packet-loss links, but requires buffering memory at both sender and receiver.',
      realWorldAnalogy: {
        title: 'Factory Assembly Line Workers',
        story: 'Stop-and-Wait is a worker who assembles one widget, walks across the entire warehouse to hand it to the tester, waits for the tester to nod, and walks back. Go-Back-N is sending a conveyor belt of 10 widgets. If widget 3 is scratched, the stubborn tester throws widgets 3, 4, 5, and 6 straight into the trash and shouts "Send everything from 3 again!". Selective Repeat is a smart tester who puts widgets 4, 5, and 6 on a holding rack and simply calls back: "Send me another widget 3 only; the others are fine."',
        takeaway: 'Selective Repeat trades buffering complexity for dramatically lower retransmission overhead.',
      },
      tanglishExplanation:
        'Stop-and-Wait-la oru frame anuppitu ACK vara varaikum summa wait pannuvom. Efficiency romba low: 1 / (1 + 2a). Go-Back-N-la sender N frames continuous-a anuppalam, aana receiver window size = 1. Oru packet drop aana, adhuku apram vandha ellathaiyum discard pannitu, dropped packet-la irundhu thirumba ellam anuppanum. Selective Repeat-la receiver buffer vechu missing packet-ah mattum retransmit panna sollum. Sender window = Receiver window = 2^(m-1).',
      practicalExamples: [
        {
          title: 'TCP Sliding Window Evolution',
          scenario: 'Modern internet TCP uses concepts of both GBN and Selective Repeat.',
          solution: 'TCP originally used cumulative ACKs like GBN, but RFC 2018 introduced TCP Selective Acknowledgment (SACK), allowing receivers to selectively acknowledge discontinuous blocks of packets.',
        },
      ],
      numericalProblems: [
        {
          problem: 'A channel has a bandwidth of 1 Mbps and a round-trip propagation delay (2*T_prop) of 40 ms. Frame size is 1000 Bytes (8000 bits). Calculate the efficiency of Stop-and-Wait ARQ.',
          given: { 'Bandwidth': '10^6 bps', 'Frame Size': '8000 bits', '2 * T_prop': '0.040 s (40 ms)' },
          formula: 'T_trans = L / B ; a = T_prop / T_trans ; eta = 1 / (1 + 2a)',
          stepByStepSolution: [
            'T_trans = 8000 / 1,000,000 = 0.008 s = 8 ms',
            'T_prop = 40 ms / 2 = 20 ms',
            'a = 20 ms / 8 ms = 2.5',
            'eta = 1 / (1 + 2 * 2.5) = 1 / (1 + 5) = 1 / 6 ≈ 0.1667 (16.67%)',
          ],
          answer: 'Efficiency = 16.67%',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Setting sender window size to 2^m in Go-Back-N with m-bit sequence numbers.',
          reality: 'If W_s = 2^m, if all ACKs are lost, the sender retransmits window 0..2^m-1. The receiver cannot distinguish whether the incoming frame is a retransmission or a brand new frame! Therefore, W_s <= 2^m - 1.',
          whyItMatters: 'Failing this constraint leads to catastrophic silent data duplication.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why must the sender and receiver window sizes in Selective Repeat be at most 2^(m-1) for m-bit sequence numbers?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'If $W_s + W_r > 2^m$, the receiver window wraps around and overlaps with the old sequence number space. If all ACKs for a transmitted window are lost, the sender retransmits. If $W_s > 2^{m-1}$, the receiver cannot distinguish whether an incoming frame $k$ is a retransmission of an unacknowledged frame from the previous cycle or a brand-new frame from the advanced window. Setting $W_s = W_r = 2^{m-1}$ guarantees zero overlap.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-4-3',
          question: 'In a 3-bit sequence numbering scheme (m = 3), what is the maximum sender window size for Go-Back-N and Selective Repeat respectively?',
          type: 'single',
          options: ['7 and 4', '8 and 4', '7 and 7', '8 and 8'],
          correctIndex: 0,
          explanation: 'GBN maximum W_s = 2^3 - 1 = 7. Selective Repeat maximum W_s = 2^(3-1) = 2^2 = 4.',
        },
      ],
      keyTakeaways: [
        'Stop-and-Wait efficiency is $\\frac{1}{1 + 2a}$; pipelined sliding windows achieve up to 100% link utilization.',
        'Go-Back-N has $W_r = 1$ and cumulative ACKs; discards out-of-order packets.',
        'Selective Repeat buffers out-of-order packets with $W_s = W_r \\le 2^{m-1}$ and retransmits only lost packets.',
      ],
      flashcards: [
        { front: 'Maximum sender window size in Go-Back-N with m-bit sequence numbers?', back: '2^m - 1' },
        { front: 'Maximum sender window size in Selective Repeat with m-bit sequence numbers?', back: '2^(m - 1)' },
      ],
    },
    {
      id: 'm4-l4',
      moduleId: 4,
      chapterNumber: '4.4',
      title: 'Ethernet, MAC Addressing & ARP Resolution',
      slug: 'ethernet-mac-and-arp-protocol',
      readTime: '12 min read',
      summary: 'Inspect Ethernet II frame structure, 48-bit MAC addressing, CSMA/CD minimum frame size calculations, and Address Resolution Protocol (ARP) query-reply flow.',
      learningObjectives: [
        'Analyse Ethernet II frame headers (Preamble, SFD, MACs, EtherType, Payload, FCS).',
        'Derive the minimum Ethernet frame size formula for CSMA/CD: L_min = 2 * T_prop * Bandwidth.',
        'Trace ARP broadcast query and unicast reply lifecycle.',
      ],
      prerequisites: ['Lesson 4.1 & 4.2'],
      beginnerExplanation:
        'Every network card manufactured on Earth has a permanent 48-bit physical passport stamped onto its chip: its MAC address (e.g. 00:1A:2B:3C:4D:5E). But when your computer wants to talk to 192.168.1.5, it only knows the IP address! How does it find the physical MAC? It shouts onto the local network: "Who has IP 192.168.1.5? Tell me your MAC!" (ARP Request broadcast). The host with that IP whispers back: "I do, my MAC is 00:1A:2B:3C:4D:5E" (ARP Reply unicast).',
      technicalExplanation:
        'Ethernet II (DIX) is the ubiquitous LAN framing standard:\n- Preamble (7 Bytes): Alternating 10101010 for clock synchronization.\n- Start Frame Delimiter SFD (1 Byte): 10101011 signaling frame start.\n- Destination MAC (6 Bytes): 48 bits (first 24 bits = OUI Organizationally Unique Identifier; last 24 bits = vendor NIC serial).\n- Source MAC (6 Bytes): Transmitting NIC address.\n- EtherType (2 Bytes): Indicates encapsulated L3 protocol (0x0800 for IPv4, 0x86DD for IPv6, 0x0806 for ARP).\n- Payload: 46 to 1500 Bytes (MTU = 1500 Bytes).\n- FCS / CRC-32 (4 Bytes): Integrity verification.\nTotal frame size: 64 to 1518 Bytes (excluding preamble/SFD).\n\nCSMA/CD Minimum Frame Size:\nTo detect collisions before transmission completes, the transmission time of the frame must be at least twice the one-way propagation delay: $T_{trans} \\ge 2 \\times T_{prop} \\implies \\frac{L_{min}}{B} \\ge 2 \\times T_{prop} \\implies L_{min} = 2 \\times T_{prop} \\times B$. In classical 10 Mbps Ethernet over 2.5 km coaxial bus, $L_{min} = 64 \\text{ Bytes}$ (512 bits).\n\nAddress Resolution Protocol (ARP - RFC 826):\nMaps dynamic Layer 3 IPv4 addresses to physical Layer 2 MAC addresses on the local broadcast domain:\n1. Host A checks its local ARP Cache table.\n2. If not found, Host A broadcasts an ARP Request frame: Destination MAC = `FF:FF:FF:FF:FF:FF`, Target IP = 192.168.1.5.\n3. Every host in the VLAN receives the frame. Hosts with non-matching IPs drop it.\n4. Host B recognizes its IP and sends a unicast ARP Reply directly to Host A’s MAC.\n5. Host A caches the entry with a TTL timer (typically 20 minutes).',
      realWorldAnalogy: {
        title: 'Calling a Name in a Classroom',
        story: 'The teacher knows student "John Doe" (IP address) needs a permission slip. The teacher stands up and announces to the entire room: "Whoever is John Doe, raise your hand!" (ARP Request broadcast). Everyone hears it, but only John raises his hand and says "I am sitting at Desk 14" (ARP Reply unicast). The teacher notes down Desk 14 in their seating chart (ARP Cache).',
        takeaway: 'ARP bridges logical IP addresses to physical link-layer hardware addresses.',
      },
      tanglishExplanation:
        'MAC address vandhu 48-bit hardware address (Hexadecimal-la irukkum: 00:1A:2B:...). Namma computer-kku orutharoda IP theriyum, aana frame anuppa avanga MAC theriyanum. Appo ARP (Address Resolution Protocol) use pannuvom. ARP Request vandhu broadcast (FF:FF:FF:FF:FF:FF) aagum: "Yaaru kitta indha IP irukku?". Andha computer mattum unicast-la "En MAC idho" nu ARP Reply anuppum. Adha ARP cache-la save pannikuvom.',
      practicalExamples: [
        {
          title: 'Checking Your ARP Cache in Terminal',
          scenario: 'Inspect active IP-to-MAC mappings on your machine.',
          solution: 'Run `arp -a` in Windows/macOS/Linux terminal. You will see listings like: `192.168.1.1 at 74:83:c2:11:22:33 [ether] on eth0`.',
        },
      ],
      numericalProblems: [
        {
          problem: 'In a CSMA/CD network running at 100 Mbps, the maximum cable distance between two stations is 1 km and signal propagation speed is 2 * 10^8 m/s. What is the minimum frame size needed to ensure collision detection?',
          given: { 'Bandwidth (B)': '100 * 10^6 bps', 'Distance (d)': '1000 m', 'Speed (v)': '2 * 10^8 m/s' },
          formula: 'T_prop = d / v ; L_min = 2 * T_prop * B',
          stepByStepSolution: [
            'T_prop = 1000 / (2 * 10^8) = 5 * 10^-6 seconds = 5 μs',
            '2 * T_prop = 10 μs = 10 * 10^-6 s',
            'L_min = (10 * 10^-6 s) * (100 * 10^6 bps) = 1000 bits',
            'Convert to Bytes: 1000 / 8 = 125 Bytes',
          ],
          answer: 'Minimum Frame Size = 125 Bytes (1000 bits)',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thinking ARP works across the global internet through routers.',
          reality: 'ARP is strictly confined to the local broadcast domain (Layer 2 subnet). A router will NOT forward broadcast ARP requests to another subnet.',
          whyItMatters: 'To send a packet to an external IP (e.g., 8.8.8.8), the host resolves the MAC address of its DEFAULT GATEWAY router, not 8.8.8.8!',
        },
      ],
      interviewQuestions: [
        {
          question: 'What is ARP Spoofing / ARP Poisoning and how do modern enterprise switches mitigate it?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Because ARP is stateless and unauthenticated, an attacker on the local LAN can broadcast unsolicited ARP replies claiming the Default Gateway’s IP belongs to the attacker’s MAC address. Victim machines update their ARP tables and route all outbound traffic through the attacker (Man-in-the-Middle). Enterprise switches mitigate this using Dynamic ARP Inspection (DAI), which intercepts ARP packets and validates sender IP-to-MAC bindings against a trusted DHCP Snooping database.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-4-4',
          question: 'What is the destination MAC address of an ARP Request frame?',
          type: 'single',
          options: ['00:00:00:00:00:00', '127.0.0.1', 'FF:FF:FF:FF:FF:FF', '255.255.255.255'],
          correctIndex: 2,
          explanation: 'ARP requests are broadcast at Layer 2 to all stations using the broadcast MAC address FF:FF:FF:FF:FF:FF.',
        },
      ],
      keyTakeaways: [
        'Ethernet II frames require a minimum size of 64 bytes and maximum MTU payload of 1500 bytes.',
        'CSMA/CD requires $L_{min} \\ge 2 \\times T_{prop} \\times B$ to ensure collisions are detected during transmission.',
        'ARP resolves local IPv4 addresses to hardware MAC addresses; ARP spoofing is mitigated by Dynamic ARP Inspection (DAI).',
      ],
      flashcards: [
        { front: 'Formula for minimum frame size in CSMA/CD?', back: 'L_min = 2 * T_prop * Bandwidth' },
        { front: 'What is the broadcast MAC address in hexadecimal?', back: 'FF:FF:FF:FF:FF:FF' },
      ],
    },
  ],
};
