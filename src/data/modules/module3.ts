import { Module } from '../../types/network';

export const module3: Module = {
  id: 3,
  title: 'Physical Layer',
  tagline: 'Signals, Transmission Media, Multiplexing & Channel Capacity',
  description: 'Understand analog vs digital transmission, twisted pair, coaxial, optical fiber, FDM/TDM/WDM multiplexing, Nyquist bit rate, and Shannon capacity theorem.',
  iconName: 'Zap',
  level: 'Intermediate',
  lessons: [
    {
      id: 'm3-l1',
      moduleId: 3,
      chapterNumber: '3.1',
      title: 'Signals, Data Transmission & Impairments',
      slug: 'signals-and-transmission-impairments',
      readTime: '10 min read',
      summary: 'Explore analog vs digital signals, frequency, wavelength, attenuation, distortion, thermal noise, and signal-to-noise ratio (SNR).',
      learningObjectives: [
        'Differentiate continuous analog signals from discrete digital signals.',
        'Calculate Signal-to-Noise Ratio in decibels: SNR_dB = 10 * log10(Signal_Power / Noise_Power).',
        'Identify the three primary transmission impairments: Attenuation, Distortion, and Noise.',
      ],
      prerequisites: ['Module 1 & 2'],
      beginnerExplanation:
        'When you speak, your vocal cords create continuous sound waves (analog). When you turn a light switch on and off to send Morse code, you are sending distinct, stepped states (digital). As signals travel down long copper wires, they get weaker (attenuation, like your voice fading down a long hallway), lose their crisp square shapes (distortion), and pick up random electrical crackles from microwave ovens and lightning (noise).',
      technicalExplanation:
        'Data can be represented as analog signals (continuous electromagnetic waves varying in amplitude, frequency, and phase) or digital signals (discrete voltage levels representing binary 0s and 1s, requiring infinite theoretical bandwidth per Fourier analysis). As signals propagate over physical media, they suffer three major impairments:\n1. Attenuation: Loss of signal energy as distance increases due to medium resistance. Compensated by amplifiers (analog) or repeaters/regenerators (digital). Attenuation in decibels: $dB = 10 \\log_{10}(P_2 / P_1)$.\n2. Distortion: Occurs because composite signals consist of different harmonic frequency components which travel at slightly differing phase velocities through a medium, altering the composite waveform.\n3. Noise: External electromagnetic interference added to the signal. Major types include Thermal/Johnson-Nyquist noise (random electron motion), Intermodulation noise (mixing of adjacent frequencies), Crosstalk (inductive coupling from neighboring wire pairs), and Impulse noise (spikes from lightning or motor relays).\nSignal-to-Noise Ratio (SNR) measures signal quality: $SNR = \\frac{P_{signal}}{P_{noise}}$. In decibels: $SNR_{dB} = 10 \\log_{10}(SNR)$.',
      realWorldAnalogy: {
        title: 'Whispering in a Crowded Subway Station',
        story: 'If you whisper to a friend 20 meters away in an echoing subway tunnel: your voice gets softer the farther it travels (attenuation); the tunnel echoes warp the pitch of your words (distortion); and the screeching train wheels drown out your syllables (noise). To hear clearly, your voice power must be far louder than the screeching train (high SNR).',
        takeaway: 'High signal power relative to background noise is essential for error-free data decoding.',
      },
      tanglishExplanation:
        'Signal travel aagumpothu 3 main problems varum: 1) Attenuation - wire length jaasthi aana signal weak aagidum (Decibel-la measure pannuvom), 2) Distortion - different frequencies different speed-la travel aagi shape maaridum, 3) Noise - external interference (like microwave or lightning). Signal-to-Noise Ratio (SNR) nalla irundha thaan zero error-la decode panna mudiyum!',
      practicalExamples: [
        {
          title: 'Wi-Fi RSSI and SNR Thresholds',
          scenario: 'A laptop reports an RSSI of -60 dBm and noise floor of -90 dBm.',
          solution: 'SNR = (-60 dBm) - (-90 dBm) = 30 dB. An SNR of 30+ dB is considered excellent for 802.11ax high-order modulation (1024-QAM).',
        },
      ],
      numericalProblems: [
        {
          problem: 'A signal power is measured at 10 mW and the noise power is measured at 1 μW. Calculate the SNR and the SNR in decibels.',
          given: { 'Signal Power (P_s)': '10 mW = 10 * 10^-3 W', 'Noise Power (P_n)': '1 μW = 1 * 10^-6 W' },
          formula: 'SNR = P_s / P_n ; SNR_dB = 10 * log10(SNR)',
          stepByStepSolution: [
            'Calculate SNR ratio: (10 * 10^-3) / (1 * 10^-6) = 10,000',
            'Compute log10(10,000) = 4',
            'Multiply by 10: 10 * 4 = 40 dB',
          ],
          answer: 'SNR = 10,000; SNR_dB = 40 dB',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using an amplifier instead of a regenerator for digital signals.',
          reality: 'An analog amplifier amplifies the signal AND the noise together. A digital regenerator (repeater) samples the waveform, extracts the clean 1s and 0s, and emits a brand-new pristine digital signal with zero accumulated noise.',
          whyItMatters: 'Repeated analog amplification causes noise to accumulate until the signal is unrecoverable.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Why are digital signals preferred over analog signals for long-distance computer communication?',
          frequency: 'High',
          target: 'University Exam',
          answer:
            'Digital signals can be regenerated completely noise-free at intermediate repeaters by threshold detection (0 or 1), preventing noise accumulation. Digital hardware is also cheaper, supports seamless integration of voice/video/data as uniform bitstreams, and enables easy cryptographic encryption and mathematical error correction (e.g., CRC, Reed-Solomon).',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-3-1',
          question: 'If the signal power is 100 times the noise power, what is the SNR in decibels (dB)?',
          type: 'single',
          options: ['10 dB', '20 dB', '30 dB', '100 dB'],
          correctIndex: 1,
          explanation: 'SNR_dB = 10 * log10(100) = 10 * 2 = 20 dB.',
        },
      ],
      keyTakeaways: [
        'Impairments include Attenuation (energy loss), Distortion (phase variation), and Noise (external interference).',
        'Repeaters regenerate clean digital pulses; amplifiers amplify both signal and noise.',
        'SNR_dB = 10 * log10(SNR ratio).',
      ],
      flashcards: [
        { front: 'Formula for SNR in decibels (dB)?', back: 'SNR_dB = 10 * log10(Signal_Power / Noise_Power)' },
        { front: 'Difference between amplifier and digital repeater?', back: 'Amplifier boosts signal and noise; repeater decodes and transmits a fresh, noise-free bitstream.' },
      ],
    },
    {
      id: 'm3-l2',
      moduleId: 3,
      chapterNumber: '3.2',
      title: 'Nyquist Bit Rate & Shannon Capacity Theorem',
      slug: 'nyquist-and-shannon-capacity',
      readTime: '14 min read',
      summary: 'Calculate maximum theoretical data rates for noiseless channels using Nyquist and noisy channels using Shannon’s landmark capacity formula.',
      learningObjectives: [
        'Differentiate Baud Rate (symbols/second) from Bit Rate (bits/second).',
        'Apply the Nyquist formula for noiseless channels: C = 2 * B * log2(M).',
        'Convert SNR from decibels to linear power ratios and apply Shannon’s theorem: C = B * log2(1 + SNR).',
        'Synthesize both theorems to determine required signal levels M for a target bandwidth and noise floor: M <= sqrt(1 + SNR).',
      ],
      prerequisites: ['Lesson 3.1: Signals and Impairments'],
      beginnerExplanation:
        'Imagine asking how many words per minute you can speak over the telephone:\n• Nyquist says: If there is zero background noise on the line, your speed depends solely on two things: how fast your vocal cords can change tone (frequency bandwidth B) and how many distinct pitch tones you can produce (signal levels M).\n• Shannon says: In the real world, wires crackle with thermal noise and static. There is an inescapable speed limit dictated by thermodynamics and physics. No matter how clever your engineering or error-correcting algorithms are, you cannot transmit data faster than Shannon’s limit without errors.\n\nIn short: Nyquist describes hardware engineering potential; Shannon defines nature’s absolute physical speed barrier.',
      technicalExplanation:
        'Transmission capacity on physical communication channels is governed by two complementary mathematical laws discovered by Harry Nyquist (1928) and Claude Shannon (1948).\n\n1. Nyquist Bit Rate for Noiseless Channels (1928):\nAccording to the Nyquist Sampling Theorem, a continuous analog signal bandlimited to maximum frequency $B$ Hz has at most $2B$ independent degrees of freedom per second. It can be perfectly reconstructed without information loss if sampled at least $2B$ times per second (the Nyquist Rate):\n$$\\text{Baud Rate (Symbol Rate)} = 2B \\text{ symbols/second}$$\nIf each transmitted symbol is chosen from $M$ discrete voltage levels, each symbol carries $\\log_2(M)$ bits of information:\n$$C_{\\text{Nyquist}} = \\text{Baud Rate} \\times \\log_2(M) = 2B \\log_2(M) \\text{ bps}$$\n\n• Crucial Distinction: Baud Rate vs. Bit Rate:\n  - Baud Rate: The number of physical signal state changes (voltage shifts, phase transitions) per second.\n  - Bit Rate: The number of user data bits transported per second.\n  - Example: A 1000-Baud link using 16-QAM ($M = 16$, $\\log_2(16) = 4$ bits/symbol) achieves a Bit Rate of $1000 \\times 4 = 4000$ bps.\n\n2. Shannon Capacity Theorem for Noisy Channels (1948):\nWhy can’t network engineers simply make $M$ arbitrarily large (e.g., $M = 1,000,000$) to achieve infinite speed on a copper wire?\nBecause in real physical media, thermal vibrations of electrons (Johnson-Nyquist thermal noise) create random Gaussian white noise voltage fluctuations $N$. If voltage levels are squeezed too close together, thermal noise perturbations exceed the difference between adjacent levels ($\\Delta V \\le \\sigma_{\\text{noise}}$), causing bits to flip randomly.\nClaude Shannon formulated the absolute theoretical upper bound for reliable, error-free communication over a channel perturbed by additive white Gaussian noise (AWGN):\n$$C_{\\text{Shannon}} = B \\times \\log_2\\left(1 + \\frac{S}{N}\\right) \\text{ bps}$$\nwhere:\n  • $B$ is channel bandwidth in Hertz.\n  • $S/N$ (or $SNR$) is the LINEAR signal-to-noise power ratio ($P_{\\text{signal}} / P_{\\text{noise}}$).\n  • Critical Rule: Never plug decibel values into Shannon’s formula! Always convert decibels ($SNR_{\\text{dB}}$) to a linear power ratio:\n$$SNR = 10^{\\left(\\frac{SNR_{\\text{dB}}}{10}\\right)}$$\n(Example: $30 \\text{ dB} \\implies 10^{30/10} = 10^3 = 1000$).\n\n3. Synthesizing Nyquist and Shannon in Hardware Architecture:\nEngineers use Shannon’s theorem to determine the upper limit imposed by physics, then use Nyquist’s formula to determine how many discrete modulation levels ($M$) hardware must support:\n$$C_{\\text{Nyquist}} \\le C_{\\text{Shannon}}$$\n$$2B \\log_2(M) \\le B \\log_2(1 + SNR)$$\n$$\\log_2(M^2) \\le \\log_2(1 + SNR) \\implies M \\le \\sqrt{1 + SNR}$$\n• Example: On a channel with linear $SNR = 63$, the maximum discrete signal levels the hardware can reliably resolve is $M \\le \\sqrt{1 + 63} = \\sqrt{64} = 8$ levels (3 bits/symbol, e.g., 8-PSK). Configuring $M = 16$ on this channel guarantees decoding errors because the noise exceeds the inter-level distance.',
      realWorldAnalogy: {
        title: 'Highway Speed vs Road Conditions',
        story: 'Nyquist tells you how fast a Ferrari can go on an infinitely smooth, empty test track if you keep adding more gears (signal levels). Shannon tells you how fast you can actually drive safely when it is pouring rain and fog (noise) without crashing into the guardrail. You cannot out-engineer the laws of friction and visibility.',
        takeaway: 'Nyquist governs signal levels; Shannon governs the inescapable noise barrier.',
      },
      tanglishExplanation:
        'Nyquist formula noiseless channel-kku: C = 2 * B * log2(M). Shannon formula real-world noisy channel-kku: C = B * log2(1 + SNR). SNR decibel-la irundha linear value-a maathanum (10^(dB/10)). Example: 30 dB SNR-na linear ratio 1000. Shannon capacity thaan maximum theoretical limit—edha thandi zero error-la data anuppa mudiyaadhu!',
      practicalExamples: [
        {
          title: 'Traditional Telephone Dial-Up Modem Limit',
          scenario: 'Telephone line bandwidth is approximately 3000 Hz (300 Hz to 3300 Hz) with typical SNR of 3162 (35 dB).',
          solution: 'C = 3000 * log2(1 + 3162) ≈ 3000 * log2(3163) ≈ 3000 * 11.627 ≈ 34.88 Kbps. With PCM v.90/v.92 downstream engineering, dial-up topped out at 56 Kbps.',
        },
      ],
      numericalProblems: [
        {
          problem: 'A communication channel has a bandwidth of 4 kHz and a signal-to-noise ratio of 30 dB. (a) Calculate the Shannon channel capacity. (b) If we wish to transmit at this maximum capacity over the same 4 kHz channel, how many discrete signal levels (M) must the transmitter engineer according to Nyquist?',
          given: { 'Bandwidth (B)': '4000 Hz', 'SNR_dB': '30 dB' },
          formula: 'SNR = 10^(SNR_dB / 10); C = B * log2(1 + SNR); M = ceil(2^(C / (2B))) or sqrt(1 + SNR)',
          stepByStepSolution: [
            'Part (a): Convert SNR_dB to linear power ratio: SNR = 10^(30 / 10) = 10^3 = 1000.',
            'Compute 1 + SNR = 1 + 1000 = 1001.',
            'Compute log2(1001) = ln(1001) / ln(2) ≈ 6.90875 / 0.69315 ≈ 9.9672 bits/symbol.',
            'Calculate Shannon Capacity: C = 4000 * 9.9672 = 39,869 bps ≈ 39.87 Kbps.',
            'Part (b): Equate Nyquist capacity to Shannon capacity: C_Nyquist = 2 * B * log2(M) = C_Shannon.',
            '2 * 4000 * log2(M) = 39,869 -> 8000 * log2(M) = 39,869 -> log2(M) = 39,869 / 8000 = 4.9836.',
            'Solve for M: M = 2^4.9836 ≈ 31.64. Or using direct formula M = sqrt(1 + SNR) = sqrt(1001) ≈ 31.64.',
            'Since M must be an integer power of two for binary encoding: choose M = 32 levels (5 bits/symbol, e.g., 32-QAM).',
          ],
          answer: 'Shannon Capacity = 39.87 Kbps; Required Signal Levels M = 32 levels (5 bits per baud).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Plugging SNR_dB directly into Shannon’s formula: C = B * log2(1 + SNR_dB).',
          reality: 'Shannon’s formula requires the LINEAR power ratio (P_signal / P_noise), never the decibel value.',
          whyItMatters: 'Plugging in 30 instead of 1000 produces C = 4000 * log2(31) ≈ 19.8 Kbps, which is roughly half the actual capacity!',
        },
        {
          mistake: 'Confusing Baud Rate with Bit Rate.',
          reality: 'Baud is the number of symbol state transitions per second. Bit rate is Baud multiplied by bits-per-symbol (log2(M)).',
          whyItMatters: 'A 2400 Baud modem using 16-QAM transmits at 9600 bps, not 2400 bps.',
        },
      ],
      interviewQuestions: [
        {
          question: 'How do network engineers use both Nyquist and Shannon theorems together when designing a communication system?',
          frequency: 'Essential',
          target: 'FAANG',
          answer:
            'Shannon capacity provides the physical theoretical ceiling $C$ for a given noisy channel. Once $C$ is known, engineers equate $C_{Nyquist} = C_{Shannon}$ to solve for the maximum number of discrete signal levels: $2B \\log_2(M) \\le C_{Shannon} \\implies M \\le 2^{C / (2B)}$. This tells hardware architects exactly what modulation scheme (e.g., QPSK, 16-QAM, 64-QAM, 256-QAM) can be reliably decoded by the receiver without exceeding the noise threshold.',
        },
        {
          question: 'Can you transmit data at 100 Mbps over a 10 MHz channel with an SNR of 15 dB? Justify mathematically.',
          frequency: 'High',
          target: 'Network Engineer',
          answer:
            'Convert SNR: SNR = 10^(15/10) = 10^1.5 ≈ 31.62. Compute Shannon capacity: C = 10 MHz * log2(1 + 31.62) = 10 * log2(32.62) ≈ 10 * 5.027 = 50.27 Mbps. Because 100 Mbps exceeds the Shannon theoretical upper bound of 50.27 Mbps, it is physically impossible to achieve error-free transmission at 100 Mbps on this channel.',
        },
      ],
      practiceQuestions: [
        {
          id: 'p-3-2-1',
          question: 'According to Nyquist, what is the maximum bit rate of a noiseless channel with bandwidth 3 kHz using 4 signal levels?',
          type: 'single',
          options: ['6,000 bps', '12,000 bps', '24,000 bps', '48,000 bps'],
          correctIndex: 1,
          explanation: 'C = 2 * B * log2(M) = 2 * 3000 * log2(4) = 6000 * 2 = 12,000 bps (12 Kbps).',
        },
        {
          id: 'p-3-2-2',
          question: 'If a channel has an SNR of 20 dB, what is the linear signal-to-noise power ratio to plug into Shannon’s formula?',
          type: 'single',
          options: ['20', '40', '100', '1000'],
          correctIndex: 2,
          explanation: 'Linear SNR = 10^(SNR_dB / 10) = 10^(20 / 10) = 10^2 = 100.',
        },
      ],
      keyTakeaways: [
        'Nyquist: Noiseless capacity C = 2 * B * log2(M).',
        'Shannon: Noisy capacity C = B * log2(1 + SNR) where SNR is linear.',
        'Combining both yields M <= sqrt(1 + SNR), determining the maximum practical modulation levels.',
      ],
      flashcards: [
        { front: 'Nyquist Bit Rate formula?', back: 'C = 2 * B * log2(M) bps' },
        { front: 'Shannon Capacity formula?', back: 'C = B * log2(1 + SNR) bps' },
      ],
    },
  ],
};
