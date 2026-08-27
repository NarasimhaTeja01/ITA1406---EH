import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { IoTDevice } from '../../types';
import {
  Gauge,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Wrench,
  Lock,
  Unlock,
  CheckCircle,
  Cpu,
  Zap,
  TrendingDown,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const RiskAnalysisView: React.FC = () => {
  const {
    devices,
    patchDeviceVulnerabilities,
    isolateDevice,
    reconnectDevice,
    scanDevice
  } = useSecurity();

  const [selectedDevice, setSelectedDevice] = useState<IoTDevice>(devices[0] || null);
  const [isScanning, setIsScanning] = useState(false);

  // Sync selected device with global state changes
  const activeDevice = devices.find(d => d.id === selectedDevice?.id) || devices[0] || null;

  const handleScan = async (id: string) => {
    setIsScanning(true);
    await scanDevice(id);
    setIsScanning(false);
  };

  const getRiskCategory = (score: number) => {
    if (score > 80) return { label: 'CRITICAL RISK', color: 'text-red-400', border: 'border-red-500/60', bg: 'bg-red-950/40', stroke: '#ef4444' };
    if (score > 60) return { label: 'HIGH RISK', color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-950/40', stroke: '#f97316' };
    if (score > 30) return { label: 'MEDIUM RISK', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/30', stroke: '#f59e0b' };
    return { label: 'LOW RISK (SECURE)', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/30', stroke: '#10b981' };
  };

  const overallAvgRisk = Math.round(devices.reduce((acc, d) => acc + d.riskScore, 0) / (devices.length || 1));
  const overallCategory = getRiskCategory(overallAvgRisk);

  return (
    <div id="device-risk-analysis-view" className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <span>AI-Driven IoT Device Risk Score Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Dynamic Multidimensional Vulnerability Scoring (0–100) • Real-Time Remediation Impact Simulator
          </p>
        </div>

        {/* Global Average Risk Pill */}
        <div className={`px-4 py-2 rounded-lg border ${overallCategory.border} ${overallCategory.bg} flex items-center gap-3`}>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono leading-none">Fleet Average Risk</p>
            <p className={`text-base font-extrabold font-mono mt-0.5 ${overallCategory.color}`}>
              {overallAvgRisk} / 100 ({overallCategory.label})
            </p>
          </div>
        </div>
      </div>

      {/* Risk Scoring Legend Scale */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#10172A] border border-emerald-500/20 text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-emerald-400">0 – 30</span>
            <span className="text-[9px] uppercase font-bold text-emerald-300 tracking-wider">Low Risk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hardened config, TLS 1.3 enforced, no exposed ports.</p>
        </div>

        <div className="p-3 rounded-lg bg-[#10172A] border border-amber-500/20 text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-amber-400">31 – 60</span>
            <span className="text-[9px] uppercase font-bold text-amber-300 tracking-wider">Medium Risk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Minor behavioral variance, open broadcast ports.</p>
        </div>

        <div className="p-3 rounded-lg bg-[#10172A] border border-orange-500/20 text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-orange-400">61 – 80</span>
            <span className="text-[9px] uppercase font-bold text-orange-300 tracking-wider">High Risk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Suspicious traffic anomalies, failed auth bursts.</p>
        </div>

        <div className="p-3 rounded-lg bg-[#10172A] border border-red-500/20 text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-red-400">81 – 100</span>
            <span className="text-[9px] uppercase font-bold text-red-300 tracking-wider">Critical Risk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active attack, cleartext Telnet/RCE vulnerability.</p>
        </div>
      </div>

      {/* Main Interactive Risk Matrix (Device Picker + Deep Dive Gauge & Factor Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Device Selection List */}
        <div className="bg-[#0A0F1E] p-4 rounded-xl border border-[#1E293B] space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider px-2">
            Select IoT Asset to Inspect
          </h3>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {devices.map((dev) => {
              const cat = getRiskCategory(dev.riskScore);
              const isSelected = activeDevice?.id === dev.id;

              return (
                <button
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#10172A] border-cyan-500 shadow-md'
                      : 'bg-[#10172A] border-[#1E293B] hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{dev.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{dev.ipAddress} • {dev.type}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${cat.bg} ${cat.border} ${cat.color}`}>
                      {dev.riskScore}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Deep Dive Risk Gauge & Factor Remediation */}
        {activeDevice && (
          <div className="lg:col-span-2 bg-[#0A0F1E] p-6 rounded-xl border border-[#1E293B] space-y-6">
            {/* Header with Title & Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeDevice.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-[#10172A] text-cyan-400 font-mono text-[10px] border border-[#1E293B]">
                    {activeDevice.ipAddress}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Vendor: {activeDevice.vendor} • Protocol: {activeDevice.protocol} • Firmware: {activeDevice.firmwareVersion}
                </p>
              </div>

              <button
                onClick={() => handleScan(activeDevice.id)}
                disabled={isScanning}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Recalculating AI Risk...' : 'Run Real-time Audit'}</span>
              </button>
            </div>

            {/* Gauge & Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Circular Risk Score Gauge Meter */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#10172A] rounded-xl border border-[#1E293B] relative">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-[#1E293B] fill-none"
                      strokeWidth="10"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="fill-none transition-all duration-700 ease-out"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * activeDevice.riskScore) / 100}
                      stroke={getRiskCategory(activeDevice.riskScore).stroke}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                      {activeDevice.riskScore}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">OUT OF 100</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`text-xs font-bold font-mono px-3 py-1 rounded-md border ${getRiskCategory(activeDevice.riskScore).bg} ${getRiskCategory(activeDevice.riskScore).border} ${getRiskCategory(activeDevice.riskScore).color}`}>
                    {getRiskCategory(activeDevice.riskScore).label}
                  </span>
                </div>
              </div>

              {/* Sub-factor Breakdown Meters */}
              <div className="md:col-span-2 space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Insecure Open Ports (Telnet/UPnP)</span>
                    <span className={activeDevice.openPorts.includes(23) ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {activeDevice.openPorts.includes(23) ? 'Critical (Port 23 Exposed)' : 'Secure (No Cleartext Ports)'}
                    </span>
                  </div>
                  <div className="h-2 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activeDevice.openPorts.includes(23) ? 'bg-red-500 w-9/12' : 'bg-emerald-500 w-2/12'}`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Traffic Entropy & Outbound Spikes</span>
                    <span className={activeDevice.riskScore > 60 ? 'text-orange-400 font-bold' : 'text-cyan-400'}>
                      {activeDevice.riskScore > 60 ? 'Anomalous (Shannon 7.82)' : 'Normal (Shannon 4.12)'}
                    </span>
                  </div>
                  <div className="h-2 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activeDevice.riskScore > 60 ? 'bg-orange-500 w-8/12' : 'bg-cyan-500 w-3/12'}`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Authentication Failure Frequency</span>
                    <span className={activeDevice.riskScore > 70 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {activeDevice.riskScore > 70 ? 'High (>15 retries/min)' : 'Low (0 retries)'}
                    </span>
                  </div>
                  <div className="h-2 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activeDevice.riskScore > 70 ? 'bg-red-500 w-10/12' : 'bg-emerald-500 w-1/12'}`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Known CVE / Firmware Patch Level</span>
                    <span className={activeDevice.firmwareVersion.includes('Vulnerable') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {activeDevice.firmwareVersion.includes('Vulnerable') ? 'CVE-2021-36260 Found' : 'Up to Date (Zero Known CVEs)'}
                    </span>
                  </div>
                  <div className="h-2 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activeDevice.firmwareVersion.includes('Vulnerable') ? 'bg-red-500 w-11/12' : 'bg-emerald-500 w-1/12'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors Explanation */}
            <div className="p-4 rounded-lg bg-[#10172A] border border-[#1E293B] space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Why did this device receive this score?</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeDevice.riskFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Remediation Simulator Box */}
            <div className="p-4 rounded-lg bg-[#10172A] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">
                    Vulnerability Remediation Simulator
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Apply security hardening countermeasures to patch firmware and watch the risk score recalculate.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeDevice.riskScore > 30 ? (
                  <button
                    onClick={() => patchDeviceVulnerabilities(activeDevice.id)}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Hardening Patch (Reduce to 12)</span>
                  </button>
                ) : (
                  <span className="px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Asset Fully Hardened</span>
                  </span>
                )}

                {activeDevice.isIsolated || activeDevice.connectionStatus === 'isolated' ? (
                  <button
                    onClick={() => reconnectDevice(activeDevice.id)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Unquarantine
                  </button>
                ) : (
                  <button
                    onClick={() => isolateDevice(activeDevice.id)}
                    className="px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Quarantine Node
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
