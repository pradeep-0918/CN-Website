import React, { useState } from 'react';
import { calculateDijkstra } from '../../utils/networkMath';
import { Share2, Play, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface Edge {
  id: string;
  from: string;
  to: string;
  cost: number;
  isDown: boolean;
}

const DEFAULT_NODES = ['A', 'B', 'C', 'D', 'E'];

const DEFAULT_EDGES: Edge[] = [
  { id: 'e1', from: 'A', to: 'B', cost: 4, isDown: false },
  { id: 'e2', from: 'A', to: 'C', cost: 2, isDown: false },
  { id: 'e3', from: 'B', to: 'C', cost: 1, isDown: false },
  { id: 'e4', from: 'B', to: 'D', cost: 5, isDown: false },
  { id: 'e5', from: 'C', to: 'D', cost: 8, isDown: false },
  { id: 'e6', from: 'C', to: 'E', cost: 10, isDown: false },
  { id: 'e7', from: 'D', to: 'E', cost: 2, isDown: false },
];

export const RoutingSimulator: React.FC = () => {
  const [sourceNode, setSourceNode] = useState<string>('A');
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [protocolView, setProtocolView] = useState<'link-state' | 'distance-vector'>('link-state');

  // Filter active edges
  const activeEdges = edges.filter((e) => !e.isDown);

  // Compute Dijkstra
  const dijkstraResult = calculateDijkstra(DEFAULT_NODES, activeEdges, sourceNode);
  const steps = dijkstraResult.steps;

  const currentStep = steps[Math.min(activeStepIndex, steps.length - 1)] || {
    visitedNode: sourceNode,
    distances: { [sourceNode]: 0 },
    previous: {},
  };

  const toggleEdgeStatus = (edgeId: string) => {
    setEdges(
      edges.map((e) => (e.id === edgeId ? { ...e, isDown: !e.isDown } : e))
    );
    setActiveStepIndex(0);
  };

  const updateEdgeCost = (edgeId: string, newCost: number) => {
    if (newCost <= 0) return;
    setEdges(
      edges.map((e) => (e.id === edgeId ? { ...e, cost: newCost } : e))
    );
    setActiveStepIndex(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Share2 className="w-4 h-4" /> Network Layer Routing Engine
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Routing Simulator & Dijkstra Visualizer</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure router topologies, simulate link failure reconvergence, and step through Dijkstra’s Shortest Path algorithm.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setProtocolView('link-state')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              protocolView === 'link-state' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Link-State (OSPF / Dijkstra)
          </button>
          <button
            onClick={() => setProtocolView('distance-vector')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              protocolView === 'distance-vector' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Distance-Vector (RIP / Bellman-Ford)
          </button>
        </div>
      </div>

      {/* Source Selector & Disclaimer Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 mb-6 text-xs font-mono">
        <div className="flex items-center gap-3">
          <label htmlFor="source-router-select" className="text-slate-400">Select Source Router:</label>
          <select
            id="source-router-select"
            value={sourceNode}
            onChange={(e) => {
              setSourceNode(e.target.value);
              setActiveStepIndex(0);
            }}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sky-400 font-bold focus:outline-none"
          >
            {DEFAULT_NODES.map((n) => (
              <option key={n} value={n}>
                Router {n}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Educational demonstration of shortest path calculation under SPF/Bellman-Ford principles.</span>
        </div>
      </div>

      {/* Grid: Graph Topology Interactive Board & Steps Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topology Links Editor & Graph Display */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Network Topology Links & Failure Injection
            </h3>
            <button
              onClick={() => {
                setEdges(DEFAULT_EDGES);
                setActiveStepIndex(0);
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Default Topology
            </button>
          </div>

          {/* Links list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            {edges.map((edge) => (
              <div
                key={edge.id}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-all ${
                  edge.isDown
                    ? 'bg-rose-950/20 border-rose-900/60 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {edge.from} ↔ {edge.to}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Cost:</span>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={edge.cost}
                      aria-label={`Cost for link between ${edge.from} and ${edge.to}`}
                      onChange={(e) => updateEdgeCost(edge.id, Number(e.target.value))}
                      disabled={edge.isDown}
                      className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-sky-400 font-bold text-center focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => toggleEdgeStatus(edge.id)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    edge.isDown
                      ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {edge.isDown ? 'LINK DOWN' : 'UP (Click to Kill)'}
                </button>
              </div>
            ))}
          </div>

          {/* Computed Shortest Paths from Source */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase mb-3">
              Computed Shortest Paths from Router {sourceNode}
            </h4>
            <div className="space-y-2 text-xs font-mono">
              {DEFAULT_NODES.map((dest) => {
                const dist = dijkstraResult.distances[dest];
                const path = dijkstraResult.paths[dest];
                const isReachable = dist !== Infinity;

                return (
                  <div
                    key={dest}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800/80"
                  >
                    <span className="font-bold text-white">
                      To Router {dest}:
                    </span>
                    <div className="flex items-center gap-2">
                      {isReachable ? (
                        <>
                          <span className="text-slate-400">
                            Path: <strong className="text-sky-300">{path.join(' → ')}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold">
                            Total Metric: {dist}
                          </span>
                        </>
                      ) : (
                        <span className="text-rose-400 font-bold">Unreachable (Link Down)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Dijkstra or Routing Table */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase">
                  {protocolView === 'link-state' ? 'Dijkstra SPF Execution' : 'Routing Information Base (RIB)'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {protocolView === 'link-state'
                    ? `Step ${activeStepIndex + 1} of ${Math.max(1, steps.length)}`
                    : `Router ${sourceNode} Forwarding Table`}
                </h3>
              </div>

              {protocolView === 'link-state' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeStepIndex === 0}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs text-slate-300"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={activeStepIndex === steps.length - 1}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded text-xs text-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {protocolView === 'link-state' ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="text-slate-400">Current Node Settled:</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">
                    Router {currentStep.visitedNode}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                  Tentative / Confirmed Distances:
                </div>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden text-xs font-mono">
                  {DEFAULT_NODES.map((node) => {
                    const dist = currentStep.distances[node];
                    const prev = currentStep.previous[node];
                    return (
                      <div
                        key={node}
                        className={`p-2.5 flex items-center justify-between ${
                          node === currentStep.visitedNode ? 'bg-sky-950/40 text-sky-200' : 'bg-slate-900/60'
                        }`}
                      >
                        <span className="font-bold">Router {node}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            Prev: {prev ? `Router ${prev}` : '-'}
                          </span>
                          <span className="font-bold text-emerald-400">
                            Dist: {dist === Infinity ? '∞' : dist}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Distance Vector Table */
              <div className="space-y-4 text-xs font-mono">
                <p className="text-slate-400 leading-relaxed">
                  Bellman-Ford equation: D_x(y) = min_v (c(x,v) + D_v(y)). Routers periodically exchange vectors with directly connected neighbors.
                </p>

                <table className="w-full text-left border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Destination</th>
                      <th className="p-2.5">Next Hop</th>
                      <th className="p-2.5">Metric (Cost)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950">
                    {DEFAULT_NODES.map((dest) => {
                      const dist = dijkstraResult.distances[dest];
                      const path = dijkstraResult.paths[dest];
                      const nextHop = path.length > 1 ? path[1] : 'Direct';
                      return (
                        <tr key={dest} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-bold text-white">Router {dest}</td>
                          <td className="p-2.5 text-sky-400">{dist === Infinity ? '-' : nextHop}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">
                            {dist === Infinity ? 'Unreachable (16)' : dist}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
