import React, { useState, useMemo } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { ThreatDetection, RiskLevel, AttackType } from '../../types';
import {
  Cpu,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Code,
  Terminal,
  X,
  FileText,
  Lock,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThreatDetectionView: React.FC = () => {
  const {
    threats,
    mitigateThreat,
    deleteThreat,
    blockIpImmediately,
    isolateDevice,
    aiMetrics,
    stats,
    searchTerm,
    setSearchTerm
  } = useSecurity();

  const [selectedThreat, setSelectedThreat] = useState<ThreatDetection | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [attackFilter, setAttackFilter] = useState<string>('all');

  const filteredThreats = useMemo(() => {
    return threats.filter(t => {
      const matchesSearch =
        searchTerm === '' ||
        t.detectedAttack.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ipAddress.includes(searchTerm) ||
        t.trafficBehavior.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = riskFilter === 'all' || t.riskLevel === riskFilter;
      const matchesAttack = attackFilter === 'all' || t.detectedAttack.includes(attackFilter);

      return matchesSearch && matchesRisk && matchesAttack;
    });
  }, [threats, searchTerm, riskFilter, attackFilter]);

  const getRiskBadge = (level: RiskLevel) => {
    if (level === 'critical') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-red-950/90 border border-red-500/50 text-red-300 text-[11px] font-bold font-mono uppercase flex items-center gap-1">
          <Flame className="w-3 h-3 text-red-400" />
          <span>CRITICAL</span>
        </span>
      );
    }
    if (level === 'high') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-orange-950/80 border border-orange-500/50 text-orange-300 text-[11px] font-bold font-mono uppercase">
          HIGH
        </span>
      );
    }
    if (level === 'medium') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono uppercase">
          MEDIUM
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-bold font-mono uppercase">
        LOW
      </span>
    );
  };

  return (
    <div id="ai-threat-detection-view" className="space-y-6 pb-8">
      {/* Header Banner with AI Model Telemetry KPIs */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>AI Neural Threat Detection Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Deep Learning Ensemble Classifier • Real-Time Packet Entropy & Flow Behavioral Heuristics
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#10172A] border border-[#1E293B] flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Threat Level:</span>
            <span className={`font-bold uppercase ${
              stats.currentThreatLevel === 'Severe' ? 'text-red-400 animate-pulse' :
              stats.currentThreatLevel === 'High' ? 'text-orange-400' :
              stats.currentThreatLevel === 'Elevated' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {stats.currentThreatLevel}
            </span>
          </div>
        </div>

        {/* 5 AI Model KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#1E293B]">
          <div className="p-3 rounded-lg bg-[#10172A] border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Accuracy</p>
            <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{aiMetrics.accuracy}%</p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> High Precision
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Predictions</p>
            <p className="text-lg font-bold text-white font-mono mt-0.5">{aiMetrics.totalPredictions.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Live stream parsed</span>
          </div>

          <div className="p-3 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Detection Rate</p>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{aiMetrics.threatDetectionRate}%</p>
            <span className="text-[10px] text-slate-500">Known + Zero-Day</span>
          </div>

          <div className="p-3 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">False Positives</p>
            <p className="text-lg font-bold text-slate-200 font-mono mt-0.5">{aiMetrics.falsePositiveRate}%</p>
            <span className="text-[10px] text-emerald-400">Strictly Filtered</span>
          </div>

          <div className="p-3 rounded-lg bg-[#10172A] border border-[#1E293B] col-span-2 sm:col-span-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">F1-Score / ROC</p>
            <p className="text-lg font-bold text-purple-400 font-mono mt-0.5">{aiMetrics.f1Score}%</p>
            <span className="text-[10px] text-slate-500">AUC: {aiMetrics.rocAuc}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#10172A] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search detected attack, signature, IP or device..."
              className="w-full bg-[#0A0F1E] border border-[#1E293B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-mono mr-1 text-[11px] uppercase">Risk:</span>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[10px] font-bold tracking-wider transition-colors ${
                  riskFilter === r
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Category Dropdown */}
        <select
          value={attackFilter}
          onChange={(e) => setAttackFilter(e.target.value)}
          className="bg-[#0A0F1E] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Attack Categories</option>
          <option value="DDoS">DDoS SYN Flood</option>
          <option value="Brute Force">SSH/Telnet Brute Force</option>
          <option value="Port Scanning">Port Scanning</option>
          <option value="Botnet">Botnet Activity (Mirai)</option>
          <option value="MQTT">MQTT Injection</option>
          <option value="DNS">Data Exfiltration</option>
        </select>
      </div>

      {/* Threat Detection Log Table */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#10172A] text-[9px] uppercase font-bold tracking-widest text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Detection ID & Time</th>
                <th className="py-3 px-4">Target Device & IP</th>
                <th className="py-3 px-4">Detected Attack Vector</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-sans">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    No threat detections found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => (
                  <tr
                    key={threat.id}
                    className={`hover:bg-slate-850/50 transition-colors ${
                      threat.riskLevel === 'critical' && !threat.mitigated ? 'bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <p className="text-cyan-400 font-bold">{threat.id}</p>
                      <p className="text-[10px] text-slate-500">{threat.timestamp}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-200">{threat.deviceName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{threat.ipAddress}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="font-semibold text-slate-100">{threat.detectedAttack}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{threat.trafficBehavior}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${threat.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-cyan-300 font-bold text-xs">{threat.confidenceScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Neural match</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getRiskBadge(threat.riskLevel)}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-slate-300 text-[11px] truncate max-w-[180px]">{threat.actionTaken}</p>
                      {threat.mitigated ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold">
                          <CheckCircle className="w-3 h-3" /> Mitigated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono font-semibold animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Action Required
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedThreat(threat)}
                          className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-mono flex items-center gap-1 transition-colors"
                          title="Inspect Packet Payload"
                        >
                          <Code className="w-3 h-3" />
                          <span>Payload</span>
                        </button>

                        {!threat.mitigated ? (
                          <button
                            onClick={() => mitigateThreat(threat.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            Mitigate
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 text-xs font-semibold border border-emerald-800/60 opacity-80"
                          >
                            Shielded
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Packet Payload & MITRE ATT&CK Inspector Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-red-500/40 text-red-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Deep Forensic Payload Inspector • {selectedThreat.id}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedThreat.detectedAttack} • AI Confidence: {selectedThreat.confidenceScore}%
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MITRE Mapping & Behavior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Target Device</p>
                  <p className="text-xs font-bold text-slate-100 mt-0.5">{selectedThreat.deviceName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedThreat.ipAddress}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">MITRE ATT&CK Matrix</p>
                  <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5 truncate">
                    {selectedThreat.mitreCode || 'T1498 - Network Denial of Service'}
                  </p>
                </div>
              </div>

              {/* Raw Payload Stream Snippet */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Raw Packet Hex & String Signature Capture</span>
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                  <code>{selectedThreat.rawPayloadSnippet || 'SYN 0x4f81 Seq=1049281 Win=512 Len=0 [Flood Pattern Match ID: 994]'}</code>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      blockIpImmediately(selectedThreat.ipAddress, `Threat Mitigation ${selectedThreat.id}`);
                      mitigateThreat(selectedThreat.id);
                      setSelectedThreat(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                  >
                    Block Source IP ({selectedThreat.ipAddress})
                  </button>

                  <button
                    onClick={() => {
                      isolateDevice(selectedThreat.deviceId);
                      mitigateThreat(selectedThreat.id);
                      setSelectedThreat(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
                  >
                    Isolate Target Device
                  </button>
                </div>

                <button
                  onClick={() => setSelectedThreat(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
