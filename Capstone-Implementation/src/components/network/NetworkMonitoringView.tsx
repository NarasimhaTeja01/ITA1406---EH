import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Radio,
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Globe,
  Ban,
  Terminal,
  Play,
  Pause,
  Trash2,
  Filter,
  CheckCircle,
  Wifi,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

interface SnifferPacket {
  id: string;
  time: string;
  src: string;
  dst: string;
  proto: string;
  len: number;
  info: string;
  isThreat?: boolean;
}

export const NetworkMonitoringView: React.FC = () => {
  const {
    liveTraffic,
    livePacketRate,
    liveBandwidthMbps,
    suspiciousConnections,
    blockSuspiciousConnection,
    blockIpImmediately,
    devices
  } = useSecurity();

  const [isSnifferActive, setIsSnifferActive] = useState(true);
  const [snifferProtoFilter, setSnifferProtoFilter] = useState('ALL');
  const [snifferPackets, setSnifferPackets] = useState<SnifferPacket[]>(() => [
    { id: 'pkt-01', time: '13:40:01', src: '192.168.1.104', dst: '185.220.101.5:554', proto: 'TCP', len: 64, info: '[SYN] Seq=0 Win=65535 Len=0', isThreat: true },
    { id: 'pkt-02', time: '13:40:02', src: '192.168.1.1', dst: '192.168.1.112:1883', proto: 'MQTT', len: 128, info: 'PUBLISH topic=/home/security/door/status', isThreat: false },
    { id: 'pkt-03', time: '13:40:02', src: '192.168.1.125', dst: '192.168.1.1:5683', proto: 'CoAP', len: 82, info: 'CON 0.01 GET /sensors/temperature', isThreat: false },
    { id: 'pkt-04', time: '13:40:03', src: '45.142.214.78', dst: '192.168.1.104:23', proto: 'TELNET', len: 48, info: 'IAC DO ECHO - auth dict attempt', isThreat: true },
    { id: 'pkt-05', time: '13:40:04', src: '192.168.1.155', dst: '8.8.8.8:53', proto: 'DNS', len: 142, info: 'Standard query 0x24a1 TXT payload.c2.xyz', isThreat: true },
    { id: 'pkt-06', time: '13:40:05', src: '192.168.1.180', dst: '192.168.1.1:2575', proto: 'TLSv1.3', len: 512, info: 'Application Data (Medical Infusion Rate)', isThreat: false }
  ]);

  // Protocol distribution data
  const protocolData = [
    { name: 'MQTT (1883/8883)', value: 34, fill: '#06b6d4' },
    { name: 'RTSP Video (554)', value: 28, fill: '#3b82f6' },
    { name: 'HTTPS / TLS (443)', value: 18, fill: '#10b981' },
    { name: 'CoAP / BACnet', value: 10, fill: '#8b5cf6' },
    { name: 'DNS (53)', value: 6, fill: '#f59e0b' },
    { name: 'Telnet/Raw (Insecure)', value: 4, fill: '#ef4444' }
  ];

  // Sniffer background live generator
  useEffect(() => {
    if (!isSnifferActive) return;

    const protos = ['MQTT', 'CoAP', 'TCP', 'RTSP', 'DNS', 'HTTP', 'TLS'];
    const interval = setInterval(() => {
      const proto = protos[Math.floor(Math.random() * protos.length)];
      const isThreat = Math.random() < 0.2;
      const targetDev = devices[Math.floor(Math.random() * devices.length)] || devices[0];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newPacket: SnifferPacket = {
        id: `pkt-${Date.now().toString().slice(-4)}`,
        time: now,
        src: isThreat ? '185.220.101.5' : targetDev.ipAddress,
        dst: isThreat ? `${targetDev.ipAddress}:554` : '192.168.1.1:8883',
        proto,
        len: Math.floor(40 + Math.random() * 800),
        info: isThreat ? `[ANOMALOUS BURST] ${proto} Packet Entropy > 7.9` : `Standard ${proto} telemetry keepalive`,
        isThreat
      };

      setSnifferPackets(prev => [newPacket, ...prev.slice(0, 40)]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isSnifferActive, devices]);

  const filteredPackets = snifferPackets.filter(p => {
    if (snifferProtoFilter === 'ALL') return true;
    if (snifferProtoFilter === 'THREATS') return p.isThreat;
    return p.proto.includes(snifferProtoFilter);
  });

  return (
    <div id="network-monitoring-view" className="space-y-6 pb-8">
      {/* Top Telemetry Header */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Real-Time IoT Network Monitoring & Packet Sniffer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Promiscuous Mode Packet Capture • Flow Bandwidth Tracking • Geo-Threat Origin Mapping
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">TAP: ONLINE</span>
          </div>
        </div>

        {/* 4 Network KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#1E293B]">
          <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Inbound Traffic</p>
              <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{liveBandwidthMbps} Mb/s</p>
            <span className="text-[10px] text-slate-500 font-mono">Ingress Gateway Rack 1</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Outbound Traffic</p>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{(liveBandwidthMbps * 0.65).toFixed(1)} Mb/s</p>
            <span className="text-[10px] text-slate-500 font-mono">Egress IoT Uplink</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Packet Rate</p>
              <Activity className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-purple-400 font-mono mt-0.5">{livePacketRate.toLocaleString()} pps</p>
            <span className="text-[10px] text-slate-500 font-mono">Layer 3/4 Frame Stream</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-red-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Suspicious Connections</p>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            <p className="text-xl font-bold text-red-400 font-mono mt-0.5">{suspiciousConnections.length}</p>
            <span className="text-[10px] text-red-400 font-mono">External IP flags</span>
          </div>
        </div>
      </div>

      {/* Network Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Bandwidth Stream */}
        <div className="lg:col-span-2 bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live Bandwidth & Packet Flow Stream (Mbps)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Incoming vs Outgoing vs Suspicious Anomaly Spikes</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold uppercase">
              Live Tap
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveTraffic}>
                <defs>
                  <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="incoming" name="Inbound Traffic (Mbps)" stroke="#06b6d4" fill="url(#inboundGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="outgoing" name="Outbound Traffic (Mbps)" stroke="#10b981" fill="url(#outboundGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="suspicious" name="Suspicious Packets (kpps)" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IoT Protocol Distribution */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>IoT Protocol Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">L7 Application Layer Telemetry</p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={protocolData} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#1E293B] text-[11px] font-mono">
            {protocolData.slice(0, 4).map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
                  <span className="text-slate-400">{p.name}</span>
                </div>
                <span className="text-slate-200 font-bold">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suspicious External Connection Inspector */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1E293B] bg-[#10172A] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Suspicious External Connection Geo-Intel</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Unrecognized external IP endpoints communicating with internal IoT assets</p>
          </div>
          <span className="text-xs text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-bold uppercase">
            {suspiciousConnections.filter(c => c.status !== 'blocked').length} Active Probes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#10172A] text-[9px] uppercase font-bold tracking-widest text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Source IP & Geo Origin</th>
                <th className="py-3 px-4">Target IoT Node</th>
                <th className="py-3 px-4">Port / Protocol</th>
                <th className="py-3 px-4">Threat Classification</th>
                <th className="py-3 px-4">Packets</th>
                <th className="py-3 px-4">Threat Score</th>
                <th className="py-3 px-4 text-right">Defense Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-sans">
              {suspiciousConnections.map((conn) => (
                <tr key={conn.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <p className="font-bold text-slate-200">{conn.sourceIp}</p>
                    <p className="text-[10px] text-slate-400">{conn.country}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-200">{conn.targetDeviceName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {conn.targetDeviceId}</p>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    Port {conn.targetPort} ({conn.protocol})
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 text-[11px] font-mono font-semibold">
                      {conn.threatCategory}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                    {conn.packetsCount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {conn.reputationScore} / 100
                  </td>

                  <td className="py-3 px-4 text-right">
                    {conn.status === 'blocked' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-mono font-semibold">
                        <Ban className="w-3.5 h-3.5" /> Blocked
                      </span>
                    ) : (
                      <button
                        onClick={() => blockSuspiciousConnection(conn.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold font-mono flex items-center gap-1 ml-auto shadow-sm"
                      >
                        <Ban className="w-3 h-3" />
                        <span>Block IP</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Packet Sniffer Terminal Feed */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Wireshark / PCAP Live Promiscuous Sniffer Terminal
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex items-center gap-1 text-xs">
              {(['ALL', 'THREATS', 'MQTT', 'CoAP', 'DNS', 'TCP'] as const).map((proto) => (
                <button
                  key={proto}
                  onClick={() => setSnifferProtoFilter(proto)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    snifferProtoFilter === proto
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsSnifferActive(!isSnifferActive)}
              className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 ${
                isSnifferActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
              title={isSnifferActive ? 'Pause capture' : 'Resume capture'}
            >
              {isSnifferActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Clear */}
            <button
              onClick={() => setSnifferPackets([])}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              title="Clear capture buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-950 font-mono text-xs max-h-72 overflow-y-auto divide-y divide-slate-900 leading-relaxed">
          {filteredPackets.length === 0 ? (
            <div className="py-6 text-center text-slate-600">
              No packet frames in capture buffer matching filter.
            </div>
          ) : (
            filteredPackets.map((pkt) => (
              <div
                key={pkt.id}
                className={`py-1.5 px-2 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-900/60 rounded transition-colors ${
                  pkt.isThreat ? 'text-red-400 bg-red-950/20' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[10px] shrink-0">{pkt.time}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded font-bold ${
                    pkt.isThreat ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-900 text-cyan-400'
                  }`}>
                    {pkt.proto}
                  </span>
                  <span className="text-slate-400">{pkt.src} &rarr; {pkt.dst}</span>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <span className="text-slate-400 text-[11px] truncate max-w-sm">{pkt.info}</span>
                  <span className="text-slate-500 text-[10px] shrink-0">Len: {pkt.len}B</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
