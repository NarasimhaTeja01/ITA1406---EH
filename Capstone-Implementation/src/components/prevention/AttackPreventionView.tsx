import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { FirewallRule } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Zap,
  RotateCcw,
  Ban,
  Activity,
  CheckCircle,
  X,
  AlertTriangle,
  Sliders,
  Filter,
  Flame,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AttackPreventionView: React.FC = () => {
  const {
    stats,
    rules,
    addRule,
    toggleRule,
    deleteRule,
    devices,
    isolateDevice,
    blockIpImmediately,
    resetDeviceConnection,
    systemSettings,
    updateSettings
  } = useSecurity();

  // Modals
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [isBlockIpModalOpen, setIsBlockIpModalOpen] = useState(false);
  const [isIsolateModalOpen, setIsIsolateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Form states
  const [newTargetIp, setNewTargetIp] = useState('');
  const [newPort, setNewPort] = useState('ALL');
  const [newProtocol, setNewProtocol] = useState<'TCP' | 'UDP' | 'ICMP' | 'ALL' | 'MQTT' | 'HTTP/S'>('TCP');
  const [newAction, setNewAction] = useState<'BLOCK' | 'DROP' | 'ISOLATE' | 'RATE_LIMIT'>('BLOCK');
  const [newReason, setNewReason] = useState('');
  const [newRuleCode, setNewRuleCode] = useState('');

  // Quick action states
  const [blockIpInput, setBlockIpInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');
  const [selectedIsolateDeviceId, setSelectedIsolateDeviceId] = useState(devices[0]?.id || '');
  const [selectedResetDeviceId, setSelectedResetDeviceId] = useState(devices[0]?.id || '');

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetIp) return;

    addRule({
      ruleCode: newRuleCode || `RULE_${newAction}_${newTargetIp.replace(/[^a-zA-Z0-9]/g, '_')}`,
      targetIp: newTargetIp.includes('/') ? newTargetIp : `${newTargetIp}/32`,
      port: newPort || 'ALL',
      protocol: newProtocol,
      action: newAction,
      reason: newReason || 'SOC Administrator Policy Enforcement',
      status: 'active',
      autoCreated: false
    });

    setIsAddRuleModalOpen(false);
    setNewTargetIp('');
    setNewReason('');
    setNewRuleCode('');
  };

  const handleBlockIpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockIpInput) return;
    blockIpImmediately(blockIpInput, blockReasonInput || 'Direct IP Blacklisting from Prevention Center');
    setIsBlockIpModalOpen(false);
    setBlockIpInput('');
    setBlockReasonInput('');
  };

  const handleIsolateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIsolateDeviceId) return;
    isolateDevice(selectedIsolateDeviceId);
    setIsIsolateModalOpen(false);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResetDeviceId) return;
    resetDeviceConnection(selectedResetDeviceId);
    setIsResetModalOpen(false);
  };

  return (
    <div id="attack-prevention-view" className="space-y-6 pb-8">
      {/* Header & KPI Summary */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Automated Attack Prevention & Edge Firewall</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Dynamic Zero-Trust Policy Enforcement • Automated Incident Containment • Subnet Blackholing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateSettings({ autoMitigationEnabled: !systemSettings.autoMitigationEnabled })}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                systemSettings.autoMitigationEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#10172A] border-[#1E293B] text-slate-400'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${systemSettings.autoMitigationEnabled ? 'text-emerald-400 fill-emerald-400' : ''}`} />
              <span>Auto-Mitigation: {systemSettings.autoMitigationEnabled ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#1E293B]">
          <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Attacks Detected</p>
            <p className="text-xl font-bold text-purple-400 font-mono mt-0.5">{stats.attacksDetected}</p>
            <span className="text-[10px] text-slate-500 font-mono">Total AI detections</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Attacks Blocked</p>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{stats.attacksBlocked}</p>
            <span className="text-[10px] text-emerald-400 font-mono">100% containment</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Devices Isolated</p>
            <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{stats.isolatedDevices}</p>
            <span className="text-[10px] text-slate-500 font-mono">VLAN sandbox segment</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10172A] border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Active Firewall Rules</p>
            <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{stats.activeRules}</p>
            <span className="text-[10px] text-slate-500 font-mono">Live edge filters</span>
          </div>
        </div>
      </div>

      {/* Action Command Toolbar */}
      <div className="bg-[#10172A] p-4 rounded-xl border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tactical Controls:</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-block-ip-modal"
            onClick={() => setIsBlockIpModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block Malicious IP</span>
          </button>

          <button
            id="btn-isolate-device-modal"
            onClick={() => setIsIsolateModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Isolate Target IoT</span>
          </button>

          <button
            id="btn-reset-connection-modal"
            onClick={() => setIsResetModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset TCP Session</span>
          </button>

          <button
            id="btn-add-firewall-rule-modal"
            onClick={() => setIsAddRuleModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Custom Rule</span>
          </button>
        </div>
      </div>

      {/* Active Prevention Firewall Rules Table */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1E293B] bg-[#10172A] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Active IoT Edge Defense & Firewall Rules Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Real-time packet filtering policies</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {rules.filter(r => r.status === 'active').length} of {rules.length} Rules Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#10172A] text-[9px] uppercase font-bold tracking-widest text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Rule Code & ID</th>
                <th className="py-3 px-4">Target Subnet / IP</th>
                <th className="py-3 px-4">Port & Protocol</th>
                <th className="py-3 px-4">Enforced Action</th>
                <th className="py-3 px-4">Trigger Justification</th>
                <th className="py-3 px-4">Malicious Packet Hits</th>
                <th className="py-3 px-4 text-right">Rule State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-sans">
              {rules.map((rule) => {
                let actionBadge = 'bg-red-950/80 text-red-300 border-red-500/50';
                if (rule.action === 'DROP') actionBadge = 'bg-orange-950/80 text-orange-300 border-orange-500/50';
                else if (rule.action === 'ISOLATE') actionBadge = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
                else if (rule.action === 'RATE_LIMIT') actionBadge = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';

                return (
                  <tr key={rule.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-slate-200">{rule.ruleCode}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500">{rule.id}</span>
                        {rule.autoCreated && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                            AI AUTO
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                      {rule.targetIp}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <p className="text-slate-300">Port: {rule.port}</p>
                      <p className="text-[10px] text-slate-500">{rule.protocol}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border ${actionBadge}`}>
                        {rule.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-slate-300 text-xs truncate max-w-xs">{rule.reason}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Deployed: {rule.createdAt}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {rule.hits.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 ${
                            rule.status === 'active'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-slate-900 text-slate-500 border-slate-700 hover:bg-slate-800'
                          }`}
                          title={rule.status === 'active' ? 'Click to Disable' : 'Click to Enable'}
                        >
                          {rule.status === 'active' ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                          <span className="hidden sm:inline uppercase text-[10px]">{rule.status}</span>
                        </button>

                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                          title="Delete Firewall Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Malicious IP Modal */}
      <AnimatePresence>
        {isBlockIpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Ban className="w-4 h-4" />
                  <span>Immediate Malicious IP Quarantine</span>
                </div>
                <button onClick={() => setIsBlockIpModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBlockIpSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Target Malicious IP / CIDR</label>
                  <input
                    type="text"
                    required
                    value={blockIpInput}
                    onChange={(e) => setBlockIpInput(e.target.value)}
                    placeholder="e.g. 185.220.101.5 or 45.142.214.0/24"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Block Justification / Incident Reference</label>
                  <input
                    type="text"
                    value={blockReasonInput}
                    onChange={(e) => setBlockReasonInput(e.target.value)}
                    placeholder="e.g. Malicious Tor exit node performing DDoS SYN flood"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBlockIpModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-950"
                  >
                    DEPLOY BLOCK RULE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Isolate IoT Device Modal */}
      <AnimatePresence>
        {isIsolateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Quarantine IoT Node to Sandbox VLAN</span>
                </div>
                <button onClick={() => setIsIsolateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIsolateSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Select Target IoT Device</label>
                  <select
                    value={selectedIsolateDeviceId}
                    onChange={(e) => setSelectedIsolateDeviceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.ipAddress}) - Risk: {d.riskScore}/100
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Isolating a device instantly blocks all inbound and outbound TCP/UDP traffic to other internal IoT nodes while preserving telemetry capture in an isolated sandbox segment.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsIsolateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-950"
                  >
                    ISOLATE DEVICE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Session Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>TCP RST Session Disconnect</span>
                </div>
                <button onClick={() => setIsResetModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Select Device to Reset</label>
                  <select
                    value={selectedResetDeviceId}
                    onChange={(e) => setSelectedResetDeviceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.ipAddress})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-950"
                  >
                    DISPATCH TCP RST
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Firewall Rule Modal */}
      <AnimatePresence>
        {isAddRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Configure Edge Firewall Defense Rule</span>
                </div>
                <button onClick={() => setIsAddRuleModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRuleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Rule Code Identifier</label>
                  <input
                    type="text"
                    value={newRuleCode}
                    onChange={(e) => setNewRuleCode(e.target.value)}
                    placeholder="e.g. RULE_BLOCK_UNAUTHORIZED_PORT_554"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Target IP / CIDR</label>
                    <input
                      type="text"
                      required
                      value={newTargetIp}
                      onChange={(e) => setNewTargetIp(e.target.value)}
                      placeholder="192.168.1.104 or 0.0.0.0/0"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Port Range</label>
                    <input
                      type="text"
                      value={newPort}
                      onChange={(e) => setNewPort(e.target.value)}
                      placeholder="e.g. 23 or 1-1024 or ALL"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Protocol</label>
                    <select
                      value={newProtocol}
                      onChange={(e) => setNewProtocol(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                      <option value="MQTT">MQTT</option>
                      <option value="HTTP/S">HTTP / HTTPS</option>
                      <option value="ALL">ALL (Any Protocol)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Enforcement Action</label>
                    <select
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    >
                      <option value="BLOCK">BLOCK (Drop with RST)</option>
                      <option value="DROP">DROP (Silent Discard)</option>
                      <option value="ISOLATE">ISOLATE (VLAN Sandbox)</option>
                      <option value="RATE_LIMIT">RATE_LIMIT (Throttle PPS)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Trigger Justification</label>
                  <input
                    type="text"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="e.g. Prevent unauthenticated Telnet spray on IoT front cameras"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddRuleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950"
                  >
                    DEPLOY FIREWALL RULE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
