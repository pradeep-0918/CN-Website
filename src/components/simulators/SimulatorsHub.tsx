import React, { useState } from 'react';
import { OSIVisualizer } from './OSIVisualizer';
import { OSIEncapsulationVisualizer } from './OSIEncapsulationVisualizer';
import { TCPHandshakeSimulator } from './TCPHandshakeSimulator';
import { SubnetCalculator } from './SubnetCalculator';
import { RoutingSimulator } from './RoutingSimulator';
import { DNSVisualizer } from './DNSVisualizer';
import { HTTPRequestSimulator } from './HTTPRequestSimulator';
import { ErrorDetectionPlayground } from './ErrorDetectionPlayground';
import { DelayCalculator } from './DelayCalculator';
import { SlidingWindowSimulator } from './SlidingWindowSimulator';
import { PacketJourneyVisualizer } from './PacketJourneyVisualizer';
import { PacketExplorer } from './PacketExplorer';
import {
  Zap,
  Layers,
  Cpu,
  Network,
  Share2,
  Globe,
  Send,
  ShieldAlert,
  Clock,
  Sliders,
  FileCode
} from 'lucide-react';

interface SimulatorsHubProps {
  initialSimulatorId?: string;
}

const SIMULATORS = [
  { id: 'packet-journey', name: 'Flagship: Packet Journey', icon: Zap, component: PacketJourneyVisualizer },
  { id: 'osi', name: 'OSI Encapsulation', icon: Layers, component: OSIEncapsulationVisualizer },
  { id: 'tcp', name: 'TCP 3-Way Handshake', icon: Cpu, component: TCPHandshakeSimulator },
  { id: 'subnet', name: 'Subnet & VLSM Calculator', icon: Network, component: SubnetCalculator },
  { id: 'routing', name: 'Routing & Dijkstra SPF', icon: Share2, component: RoutingSimulator },
  { id: 'dns', name: 'DNS Resolution', icon: Globe, component: DNSVisualizer },
  { id: 'http', name: 'HTTP Request Lifecycle', icon: Send, component: HTTPRequestSimulator },
  { id: 'error', name: 'Error Detection & CRC', icon: ShieldAlert, component: ErrorDetectionPlayground },
  { id: 'delay', name: 'Transmission & Delay', icon: Clock, component: DelayCalculator },
  { id: 'sliding', name: 'Sliding-Window ARQ', icon: Sliders, component: SlidingWindowSimulator },
  { id: 'packet', name: 'Packet Header Explorer', icon: FileCode, component: PacketExplorer },
];

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({ initialSimulatorId = 'osi' }) => {
  const [selectedSimId, setSelectedSimId] = useState<string>(initialSimulatorId);

  const activeSim = SIMULATORS.find((s) => s.id === selectedSimId) || SIMULATORS[0];
  const ComponentToRender = activeSim.component;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Horizontal Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {SIMULATORS.map((sim) => {
          const Icon = sim.icon;
          const isActive = sim.id === selectedSimId;
          return (
            <button
              key={sim.id}
              onClick={() => setSelectedSimId(sim.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sim.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Simulator */}
      <div className="pt-2">
        <ComponentToRender />
      </div>
    </div>
  );
};
