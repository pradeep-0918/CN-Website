import React, { useState } from 'react';
import { Layers, FileCode, Search, Sparkles, Check } from 'lucide-react';

interface HeaderField {
  name: string;
  bits: number;
  widthClass: string;
  valueHex: string;
  description: string;
  wiresharkExample: string;
}

interface ProtocolHeader {
  name: string;
  rfc: string;
  minBytes: number;
  fields: HeaderField[];
}

const PROTOCOLS: Record<string, ProtocolHeader> = {
  ipv4: {
    name: 'IPv4 Header',
    rfc: 'RFC 791',
    minBytes: 20,
    fields: [
      {
        name: 'Version (4 bits)',
        bits: 4,
        widthClass: 'col-span-1',
        valueHex: '0x4',
        description: 'Specifies the IP protocol version (always binary 0100 for IPv4).',
        wiresharkExample: 'Version: 4',
      },
      {
        name: 'IHL (4 bits)',
        bits: 4,
        widthClass: 'col-span-1',
        valueHex: '0x5',
        description: 'Internet Header Length in 32-bit (4-byte) words. Minimum value is 5 (5 * 4 = 20 Bytes).',
        wiresharkExample: 'Header Length: 20 bytes (5)',
      },
      {
        name: 'DSCP / ECN (8 bits)',
        bits: 8,
        widthClass: 'col-span-2',
        valueHex: '0x00',
        description: 'Differentiated Services Code Point (QoS priority) and Explicit Congestion Notification bits.',
        wiresharkExample: 'Differentiated Services Field: 0x00 (DSCP: CS0, ECN: Not-ECT)',
      },
      {
        name: 'Total Length (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x05DC (1500)',
        description: 'Total size of the entire IP packet including header and data payload in bytes (Max 65,535 B).',
        wiresharkExample: 'Total Length: 1500',
      },
      {
        name: 'Identification (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x4A2F',
        description: 'Unique sequence identifier assigned by sender to reassemble fragments of an IP datagram.',
        wiresharkExample: 'Identification: 0x4a2f (18991)',
      },
      {
        name: 'Flags (3 bits)',
        bits: 3,
        widthClass: 'col-span-1',
        valueHex: '0x2 (DF set)',
        description: 'Bit 0: Reserved (0). Bit 1: DF (Don\'t Fragment). Bit 2: MF (More Fragments).',
        wiresharkExample: 'Flags: 0x2, Don\'t fragment',
      },
      {
        name: 'Fragment Offset (13 bits)',
        bits: 13,
        widthClass: 'col-span-3',
        valueHex: '0x0000',
        description: 'Position of this fragment\'s payload in the original unfragmented packet, measured in 8-byte units.',
        wiresharkExample: 'Fragment Offset: 0',
      },
      {
        name: 'Time to Live / TTL (8 bits)',
        bits: 8,
        widthClass: 'col-span-2',
        valueHex: '0x40 (64)',
        description: 'Hop counter decremented by 1 at every router. Prevents packets from looping forever. Drops at 0 (ICMP Time Exceeded).',
        wiresharkExample: 'Time to Live: 64',
      },
      {
        name: 'Protocol (8 bits)',
        bits: 8,
        widthClass: 'col-span-2',
        valueHex: '0x06 (TCP)',
        description: 'Specifies encapsulated L4 protocol: 1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF.',
        wiresharkExample: 'Protocol: TCP (6)',
      },
      {
        name: 'Header Checksum (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0xB4C8',
        description: '16-bit 1\'s complement checksum covering ONLY the IP header. Recalculated by every router as TTL decrements.',
        wiresharkExample: 'Header Checksum: 0xb4c8 [validation: verified]',
      },
      {
        name: 'Source IP Address (32 bits)',
        bits: 32,
        widthClass: 'col-span-8',
        valueHex: '192.168.1.100',
        description: '32-bit IPv4 address of the original sending host.',
        wiresharkExample: 'Source Address: 192.168.1.100',
      },
      {
        name: 'Destination IP Address (32 bits)',
        bits: 32,
        widthClass: 'col-span-8',
        valueHex: '93.184.216.34',
        description: '32-bit IPv4 address of the final destination host.',
        wiresharkExample: 'Destination Address: 93.184.216.34',
      },
    ],
  },
  tcp: {
    name: 'TCP Segment Header',
    rfc: 'RFC 793 / 9293',
    minBytes: 20,
    fields: [
      {
        name: 'Source Port (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0xD431 (54321)',
        description: 'Client ephemeral port sending this segment.',
        wiresharkExample: 'Source Port: 54321',
      },
      {
        name: 'Destination Port (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x01BB (443)',
        description: 'Target process service port (e.g. 443 for HTTPS, 80 for HTTP, 22 for SSH).',
        wiresharkExample: 'Destination Port: 443',
      },
      {
        name: 'Sequence Number (32 bits)',
        bits: 32,
        widthClass: 'col-span-8',
        valueHex: '0x3E189A4B',
        description: 'Sequence number of the first data byte in this segment. Synchronized during handshake.',
        wiresharkExample: 'Sequence Number (raw): 1041807947',
      },
      {
        name: 'Acknowledgment Number (32 bits)',
        bits: 32,
        widthClass: 'col-span-8',
        valueHex: '0x7F2B0144',
        description: 'Next expected byte sequence from remote peer (cumulative acknowledgment). Valid when ACK flag set.',
        wiresharkExample: 'Acknowledgment Number (raw): 2133524804',
      },
      {
        name: 'Data Offset (4 bits)',
        bits: 4,
        widthClass: 'col-span-1',
        valueHex: '0x5 (20 Bytes)',
        description: 'Header length in 32-bit words (5 = 20 Bytes without options).',
        wiresharkExample: 'Header Length: 20 bytes (5)',
      },
      {
        name: 'Reserved (4 bits)',
        bits: 4,
        widthClass: 'col-span-1',
        valueHex: '0x0',
        description: 'Reserved for future use. Must be 0.',
        wiresharkExample: 'Reserved: 0',
      },
      {
        name: 'Control Flags (8 bits: U,A,P,R,S,F)',
        bits: 8,
        widthClass: 'col-span-2',
        valueHex: '0x18 (ACK, PSH)',
        description: 'URG, ACK, PSH, RST, SYN, FIN control bit flags.',
        wiresharkExample: 'Flags: 0x018 (PSH, ACK)',
      },
      {
        name: 'Window Size (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0xFFFF (65535)',
        description: 'Flow control receive window (rwnd) advertised by receiver in bytes.',
        wiresharkExample: 'Window: 65535 [Calculated window size: 1048560]',
      },
      {
        name: 'Checksum (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x2D1F',
        description: '1\'s complement checksum covering TCP pseudo-header (IPs), TCP header, and data payload.',
        wiresharkExample: 'Checksum: 0x2d1f [correct]',
      },
      {
        name: 'Urgent Pointer (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x0000',
        description: 'Points to urgent out-of-band data when URG flag is set.',
        wiresharkExample: 'Urgent Pointer: 0',
      },
    ],
  },
  udp: {
    name: 'UDP Datagram Header',
    rfc: 'RFC 768',
    minBytes: 8,
    fields: [
      {
        name: 'Source Port (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0xC214 (49684)',
        description: 'Port number of the transmitting process.',
        wiresharkExample: 'Source Port: 49684',
      },
      {
        name: 'Destination Port (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x0035 (53)',
        description: 'Port number of the destination service (e.g. 53 for DNS).',
        wiresharkExample: 'Destination Port: 53 (Domain Name System)',
      },
      {
        name: 'Length (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x0028 (40 Bytes)',
        description: 'Length in bytes of UDP header PLUS data payload (Minimum 8 bytes).',
        wiresharkExample: 'Length: 40',
      },
      {
        name: 'Checksum (16 bits)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x1F4A',
        description: '1\'s complement checksum covering IPv4 pseudo-header and UDP datagram (mandatory in IPv6).',
        wiresharkExample: 'Checksum: 0x1f4a [verified]',
      },
    ],
  },
  ethernet: {
    name: 'Ethernet II Frame',
    rfc: 'IEEE 802.3',
    minBytes: 18,
    fields: [
      {
        name: 'Destination MAC Address (48 bits / 6 Bytes)',
        bits: 48,
        widthClass: 'col-span-4',
        valueHex: '00:1A:2B:3C:4D:5E',
        description: 'Physical hardware MAC address of the next-hop receiver (e.g. Default Gateway).',
        wiresharkExample: 'Destination: Cisco_3c:4d:5e (00:1a:2b:3c:4d:5e)',
      },
      {
        name: 'Source MAC Address (48 bits / 6 Bytes)',
        bits: 48,
        widthClass: 'col-span-4',
        valueHex: '74:83:C2:11:22:33',
        description: 'Physical hardware MAC address of transmitting interface NIC.',
        wiresharkExample: 'Source: Intel_11:22:33 (74:83:c2:11:22:33)',
      },
      {
        name: 'EtherType (16 bits / 2 Bytes)',
        bits: 16,
        widthClass: 'col-span-4',
        valueHex: '0x0800 (IPv4)',
        description: 'Identifies encapsulated L3 protocol: 0x0800 = IPv4, 0x86DD = IPv6, 0x0806 = ARP.',
        wiresharkExample: 'Type: IPv4 (0x0800)',
      },
      {
        name: 'FCS / CRC-32 Trailer (32 bits / 4 Bytes)',
        bits: 32,
        widthClass: 'col-span-4',
        valueHex: '0xC92B81F4',
        description: 'Cyclic Redundancy Check trailer verifying frame integrity across physical link.',
        wiresharkExample: 'Frame Check Sequence: 0xc92b81f4 [correct]',
      },
    ],
  },
};

export const PacketExplorer: React.FC = () => {
  const [selectedProtoKey, setSelectedProtoKey] = useState<string>('ipv4');
  const [selectedField, setSelectedField] = useState<HeaderField>(PROTOCOLS['ipv4'].fields[0]);

  const activeProto = PROTOCOLS[selectedProtoKey];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <FileCode className="w-4 h-4" /> Header Dissection & Wireshark Explorer
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Packet Structure Explorer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Click any field in the visual protocol headers to inspect bit widths, field offsets, RFC definitions, and live Wireshark captures.
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          {Object.entries(PROTOCOLS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedProtoKey(key);
                setSelectedField(p.fields[0]);
              }}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                selectedProtoKey === key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Summary Bar */}
      <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 mb-6 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white text-sm">{activeProto.name}</span>
          <span className="text-slate-400">Spec: <strong className="text-sky-400">{activeProto.rfc}</strong></span>
          <span className="text-slate-400">Header Size: <strong className="text-emerald-400">{activeProto.minBytes} Bytes</strong></span>
        </div>
        <span className="text-slate-500">Click a field below to inspect details</span>
      </div>

      {/* Grid: Interactive Protocol Header Table on Left, Field Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 32-Bit Grid Header Representation */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-5">
          <div className="text-[11px] font-mono text-slate-500 mb-2 flex justify-between">
            <span>Bit 0</span>
            <span>Bit 8</span>
            <span>Bit 16</span>
            <span>Bit 24</span>
            <span>Bit 31</span>
          </div>

          <div className="grid grid-cols-8 gap-1.5 font-mono text-xs">
            {activeProto.fields.map((f, idx) => {
              const isSelected = selectedField.name === f.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedField(f)}
                  className={`${f.widthClass} p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/60 ring-2 ring-sky-500 text-white shadow-lg shadow-sky-500/10'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs truncate w-full">{f.name.split(' (')[0]}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{f.bits}b</span>
                    <span className="text-sky-300 font-bold">{f.valueHex}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Field Deep Dive */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase">Field Deep Dive</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedField.name}</h3>
              </div>
              <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                {selectedField.bits} Bits
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedField.description}
            </p>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs mb-4">
              <span className="text-slate-400 block mb-1">Example Hex Value:</span>
              <span className="text-base font-bold text-sky-300">{selectedField.valueHex}</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 block mb-1.5 uppercase text-[10px]">Wireshark Dissection Representation:</span>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-emerald-400 font-bold break-all">
                {selectedField.wiresharkExample}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 mt-6 text-xs text-slate-500 font-mono">
            Protocol: {activeProto.name} ({activeProto.rfc})
          </div>
        </div>
      </div>
    </div>
  );
};
