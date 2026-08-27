import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Radio,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Play,
  Lock,
  Eye,
  CheckCircle,
  Clock,
  Sparkles
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
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const {
    stats,
    devices,
    threats,
    mitigateThreat,
    setCurrentTab,
    startSimulation,
    liveTraffic,
    isSimulating
  } = useSecurity();

  // Attack types distribution data
  const attackTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      'DDoS': 0,
      'Brute Force': 0,
      'Port Scan': 0,
      'Mirai Botnet': 0,
      'MQTT Injection': 0,
      'DNS Exfiltration': 0
    };
    threats.forEach(t => {
      if (t.detectedAttack.includes('DDoS')) counts['DDoS']++;
      else if (t.detectedAttack.includes('Brute Force')) counts['Brute Force']++;
      else if (t.detectedAttack.includes('Port Scanning')) counts['Port Scan']++;
      else if (t.detectedAttack.includes('Botnet')) counts['Mirai Botnet']++;
      else if (t.detectedAttack.includes('MQTT')) counts['MQTT Injection']++;
      else counts['DNS Exfiltration']++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value: value || 1 }));
  }, [threats]);

  // Attack timeline data
  const timelineData = [
    { time: '08:00', detected: 4, blocked: 4 },
    { time: '09:00', detected: 7, blocked: 6 },
    { time: '10:00', detected: 12, blocked: 11 },
    { time: '11:00', detected: 9, blocked: 9 },
    { time: '12:00', detected: 18, blocked: 17 },
    { time: '13:00', detected: threats.length + 6, blocked: threats.filter(t => t.mitigated).length + 5 },
  ];

  // Device Risk Score Distribution
  const riskDistributionData = [
    { range: '0-30 (Low)', count: devices.filter(d => d.riskScore <= 30).length, fill: '#10b981' },
    { range: '31-60 (Med)', count: devices.filter(d => d.riskScore > 30 && d.riskScore <= 60).length, fill: '#f59e0b' },
    { range: '61-80 (High)', count: devices.filter(d => d.riskScore > 60 && d.riskScore <= 80).length, fill: '#f97316' },
    { range: '81-100 (Crit)', count: devices.filter(d => d.riskScore > 80).length, fill: '#ef4444' },
  ];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'];

  const statCards = [
    {
      id: 'stat-total-devices',
      title: 'Total IoT Nodes',
      value: stats.totalDevices,
      sub: `+${stats.activeDevices} active online`,
      subColor: 'text-green-400',
      accentColor: 'bg-cyan-500',
      valueColor: 'text-white',
      icon: Wifi
    },
    {
      id: 'stat-secure-devices',
      title: 'Secure Nodes',
      value: stats.secureDevices,
      sub: `${Math.round((stats.secureDevices / (stats.totalDevices || 1)) * 100)}% compliance`,
      subColor: 'text-emerald-400',
      accentColor: 'bg-emerald-500',
      valueColor: 'text-emerald-400',
      icon: ShieldCheck
    },
    {
      id: 'stat-suspicious-devices',
      title: 'Suspicious Nodes',
      value: stats.suspiciousDevices,
      sub: 'Anomalous traffic detected',
      subColor: 'text-orange-400',
      accentColor: 'bg-orange-500',
      valueColor: 'text-orange-400',
      icon: AlertTriangle
    },
    {
      id: 'stat-critical-threats',
      title: 'Critical Alerts',
      value: stats.criticalDevices < 10 ? `0${stats.criticalDevices}` : stats.criticalDevices,
      sub: stats.criticalDevices > 0 ? 'Immediate Action Required' : '0 Active Intrusions',
      subColor: 'text-red-400',
      accentColor: 'bg-red-500',
      valueColor: 'text-red-500',
      icon: Flame
    },
    {
      id: 'stat-attacks-detected',
      title: 'Threats Detected',
      value: stats.attacksDetected,
      sub: 'AI signature matches',
      subColor: 'text-purple-400',
      accentColor: 'bg-purple-500',
      valueColor: 'text-purple-400',
      icon: ShieldAlert
    },
    {
      id: 'stat-attacks-blocked',
      title: 'Threats Blocked',
      value: stats.attacksBlocked,
      sub: `AI Prevention: 99.8%`,
      subColor: 'text-slate-400',
      accentColor: 'bg-blue-500',
      valueColor: 'text-blue-400',
      icon: Lock
    }
  ];

  return (
    <div id="soc-dashboard-container" className="space-y-6 pb-8">
      {/* Top Banner: Real-time Live Security Status */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>IoT Security Command Center (SOC)</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Autonomous AI Anomaly Detection • Zero-Trust Edge Mitigation • Deep Packet Telemetry
          </p>
        </div>

        {/* 4 Engine Status Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          <div className="px-3 py-2 rounded-lg bg-[#10172A] border border-[#1E293B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none">System Status</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 font-mono">PROTECTED</p>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#10172A] border border-[#1E293B] flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none">AI Detection</p>
              <p className="text-xs font-bold text-cyan-400 mt-0.5 font-mono">ACTIVE (98.9%)</p>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#10172A] border border-[#1E293B] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none">Monitoring</p>
              <p className="text-xs font-bold text-blue-400 mt-0.5 font-mono">REAL-TIME</p>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-[#10172A] border border-[#1E293B] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none">Prevention</p>
              <p className="text-xs font-bold text-purple-400 mt-0.5 font-mono">AUTO-ENGAGED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Stat Cards - Geometric Balance style with side color bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -2 }}
              className="bg-[#10172A] border border-[#1E293B] p-4 rounded-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${card.accentColor}`} />
              
              <div className="flex items-center justify-between mb-1 pl-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {card.title}
                </span>
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="pl-1">
                <p className={`text-2xl font-mono font-bold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </p>
                <p className={`text-[10px] ${card.subColor} mt-1.5 truncate`}>
                  {card.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threats Detected vs Blocked Over Time */}
        <div className="lg:col-span-2 bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Neural Network Traffic Analysis & Threats</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Attacks detected vs automated edge firewall blocks</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="detectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="detected" name="Attacks Detected" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#detectedGrad)" />
                <Area type="monotone" dataKey="blocked" name="Attacks Blocked" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#blockedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Types Distribution (Donut Chart) */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Attack Vectors Classification</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">MITRE ATT&CK & AI taxonomy</p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackTypeCounts}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attackTypeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Total</span>
              <span className="text-base font-bold text-white font-mono">{threats.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mt-2 pt-3 border-t border-[#1E293B]">
            {attackTypeCounts.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-400 truncate">{item.name}:</span>
                <span className="text-slate-200 font-semibold font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Live Network Traffic + Device Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Network Traffic Flow */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live IoT Ingress / Egress Bandwidth</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Real-time network packet stream (Mbps)</p>
            </div>
            <button
              onClick={() => setCurrentTab('network')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Sniffer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="incoming" name="Inbound (Mbps)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="outgoing" name="Outbound (Mbps)" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="suspicious" name="Suspicious (kpps)" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Risk Score Distribution Bar Chart */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>IoT Fleet Risk Scoring Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">AI vulnerability & anomaly posture index</p>
            </div>
            <button
              onClick={() => setCurrentTab('risk_analysis')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Devices" radius={[4, 4, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Incidents & Active Threat Quick Mitigation Strip */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Live Security Incident Feed</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">Recent intrusions flagged by AI Neural Classifier</p>
          </div>
          <button
            onClick={() => setCurrentTab('threats')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All {threats.length} Detections</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {threats.slice(0, 4).map((threat) => (
            <div
              key={threat.id}
              className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono shrink-0 mt-0.5 ${
                    threat.riskLevel === 'critical'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : threat.riskLevel === 'high'
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  {threat.riskLevel}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-semibold text-slate-200">{threat.detectedAttack}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">Target: {threat.deviceName} ({threat.ipAddress})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{threat.trafficBehavior}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-right hidden sm:block">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block font-mono">Confidence</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{threat.confidenceScore}%</span>
                </div>

                {threat.mitigated ? (
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Mitigated</span>
                  </span>
                ) : (
                  <button
                    onClick={() => mitigateThreat(threat.id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Mitigate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launchpad for Capstone Simulation */}
      <div className="p-5 rounded-xl bg-[#0A0F1E] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold font-mono uppercase tracking-wider">
              CAPSTONE DEMO RANGE
            </span>
            <span className="text-xs text-slate-400">Ethical Hacking Demonstration</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-1.5">
            Simulate Real-World IoT Attack Vectors & Observe AI Auto-Containment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
            Trigger live DDoS SYN storms, Mirai botnet beaconing, Telnet brute-forcing, or DNS exfiltration. Watch the pipeline detect anomalies, calculate confidence scores, and deploy edge firewall rules.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentTab('simulation');
            if (!isSimulating) {
              startSimulation('sim-ddos');
            }
          }}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-950 flex items-center gap-2 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>RUN 1-CLICK ATTACK SIMULATION</span>
        </button>
      </div>
    </div>
  );
};
