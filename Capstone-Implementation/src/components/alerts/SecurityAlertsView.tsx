import React, { useState, useMemo } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { SecurityAlert, RiskLevel } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Flame,
  Search,
  Check,
  Download,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
  Ban,
  Lock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SecurityAlertsView: React.FC = () => {
  const {
    alerts,
    mitigateAlert,
    acknowledgeAlert,
    deleteAlert,
    blockIpImmediately,
    isolateDevice,
    searchTerm,
    setSearchTerm
  } = useSecurity();

  const [severityFilter, setSeverityFilter] = useState<'all' | RiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'mitigated' | 'acknowledged'>('all');

  // Sorted and filtered alerts (Critical sorted to top)
  const filteredAlerts = useMemo(() => {
    const severityRank: Record<RiskLevel, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    return alerts
      .filter(a => {
        const matchesSearch =
          searchTerm === '' ||
          a.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => {
        // Active critical first
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (b.status === 'active' && a.status !== 'active') return 1;
        return severityRank[b.severity] - severityRank[a.severity];
      });
  }, [alerts, searchTerm, severityFilter, statusFilter]);

  const handleExportSingleAlert = (alert: SecurityAlert) => {
    const blob = new Blob([JSON.stringify(alert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOC_ALERT_${alert.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (sev: RiskLevel) => {
    if (sev === 'critical') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-red-950/90 border border-red-500/60 text-red-300 text-[11px] font-bold font-mono uppercase flex items-center gap-1.5 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span>CRITICAL SEVERITY</span>
        </span>
      );
    }
    if (sev === 'high') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-orange-950/80 border border-orange-500/50 text-orange-300 text-[11px] font-bold font-mono uppercase">
          HIGH SEVERITY
        </span>
      );
    }
    if (sev === 'medium') {
      return (
        <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono uppercase">
          MEDIUM SEVERITY
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-bold font-mono uppercase">
        LOW SEVERITY
      </span>
    );
  };

  return (
    <div id="security-alerts-view" className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>Real-Time Security Incident & Alert Dispatch</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            MITRE ATT&CK Framework Mapping • Automated Remediation Playbooks • Real-time Threat Triage
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-slate-400">
            {alerts.filter(a => a.status === 'active').length} Active Incidents Pending
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#10172A] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by incident ID, attack type, device, IP or description..."
              className="w-full bg-[#0A0F1E] border border-[#1E293B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-mono mr-1 text-[11px]">Severity:</span>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[10px] transition-colors ${
                  severityFilter === sev
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0A0F1E]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'active', 'acknowledged', 'mitigated'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-mono text-[11px] transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#0A0F1E] p-12 text-center rounded-xl border border-[#1E293B]">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-200">No Security Alerts Found</h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              All detected anomalies have been mitigated or no incidents match current filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isActive = alert.status === 'active';

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border transition-all ${
                  isCritical && isActive
                    ? 'bg-[#0A0F1E] border-red-500/40 relative overflow-hidden'
                    : isActive
                    ? 'bg-[#0A0F1E] border-amber-500/30'
                    : 'bg-[#0A0F1E] border-[#1E293B]'
                }`}
              >
                {isCritical && isActive && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
                  <div className="flex items-start gap-3.5">
                    <div className="pt-0.5">
                      {isCritical ? (
                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                          <Flame className="w-5 h-5 animate-pulse" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-[#10172A] border border-[#1E293B] text-cyan-400">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cyan-400">{alert.id}</span>
                        <h3 className="text-sm font-bold text-white">{alert.attackType}</h3>
                        {getSeverityBadge(alert.severity)}
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-mono">
                        Target: <span className="text-white font-semibold">{alert.deviceName}</span> • Time: {alert.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* AI Confidence & Status */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">AI Confidence</span>
                      <span className="text-sm font-bold text-cyan-300 font-mono">{alert.aiConfidence}%</span>
                    </div>

                    <div className="h-8 w-px bg-[#1E293B]" />

                    <div>
                      {alert.status === 'mitigated' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>MITIGATED</span>
                        </span>
                      ) : alert.status === 'acknowledged' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>ACKNOWLEDGED</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold font-mono border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>ACTION REQUIRED</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description & IPs Grid */}
                <div className="py-3.5 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {alert.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Source Attacker IP</span>
                      <span className="text-red-400 font-bold mt-0.5 block truncate">{alert.sourceIp}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Destination IoT IP:Port</span>
                      <span className="text-cyan-400 font-bold mt-0.5 block truncate">{alert.destinationIp}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">MITRE ATT&CK Technique</span>
                      <span className="text-purple-400 font-bold mt-0.5 block truncate">{alert.mitreTechnique}</span>
                    </div>
                  </div>

                  {/* Recommended Action Playbook */}
                  <div className="p-3 rounded-lg bg-[#10172A] border border-cyan-500/25 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold block">
                        Recommended SOC Playbook & Action
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">{alert.recommendedAction}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => {
                            blockIpImmediately(alert.sourceIp.split(' ')[0], `Auto-Mitigation from Alert ${alert.id}`);
                            mitigateAlert(alert.id);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Block Attacker IP Immediately</span>
                        </button>

                        <button
                          onClick={() => {
                            isolateDevice(alert.deviceId);
                            mitigateAlert(alert.id);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Isolate Device</span>
                        </button>

                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-200 border border-[#1E293B] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Acknowledge</span>
                        </button>
                      </>
                    )}

                    {alert.status !== 'active' && (
                      <button
                        onClick={() => mitigateAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30 uppercase tracking-wider"
                      >
                        ✓ Incident Verified & Contained
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportSingleAlert(alert)}
                      className="px-3 py-1.5 rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-[#1E293B]"
                      title="Download Incident Audit JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
