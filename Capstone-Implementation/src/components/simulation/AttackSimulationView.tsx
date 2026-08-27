import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { AttackType, SimulationScenario } from '../../types';
import {
  Play,
  Square,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Terminal,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  Radio,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AttackSimulationView: React.FC = () => {
  const {
    devices,
    isSimulating,
    simulationLogs,
    simulationProgress,
    currentScenario,
    startSimulation,
    cancelSimulation
  } = useSecurity();

  const [selectedAttack, setSelectedAttack] = useState<AttackType>('DDoS SYN Flood');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-01');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | 'aggressive'>('aggressive');

  const attackScenarios: SimulationScenario[] = [
    {
      id: 'scen-ddos',
      name: 'DDoS SYN Flood Attack',
      attackType: 'DDoS SYN Flood',
      targetDeviceId: 'dev-01',
      description: 'Overwhelms the target IoT device with high-volume TCP SYN packets with forged IP headers to exhaust stateful connection tables.',
      complexity: 'Severe',
      estimatedDurationSec: 8,
      mitreId: 'T1498.001 - Network Denial of Service',
      steps: [
        'Transmitting 150,000 half-open SYN handshakes per second',
        'Target device TCP state table saturated',
        'AI anomaly feature detector extracts entropy variance',
        'Auto-mitigation drops spoofed TCP headers'
      ]
    },
    {
      id: 'scen-brute',
      name: 'SSH / Telnet Dictionary Brute Force',
      attackType: 'SSH/Telnet Brute Force',
      targetDeviceId: 'dev-01',
      description: 'Automated rapid-fire credential spraying using Mirai default credential lists (root:xc3511, admin:admin) against port 23/22.',
      complexity: 'High',
      estimatedDurationSec: 7,
      mitreId: 'T1110 - Brute Force Authentication',
      steps: [
        'Iterating through 500 credential pairs per minute',
        'Failed authentication attempts trip rate threshold',
        'AI classifies brute-force behavioral signature',
        'IP blacklisted and port 23 dynamically closed'
      ]
    },
    {
      id: 'scen-scan',
      name: 'IoT Port Scanning & OS Fingerprinting',
      attackType: 'Port Scanning (Nmap)',
      targetDeviceId: 'dev-02',
      description: 'Sequential TCP SYN stealth probes (Nmap SYN scan) across ports 1-65535 searching for exposed RTSP and MQTT endpoints.',
      complexity: 'Medium',
      estimatedDurationSec: 6,
      mitreId: 'T1046 - Network Service Discovery',
      steps: [
        'Sequential probe frames dispatched to ports 1-1024',
        'Host response banner inspection initiated',
        'AI flags rapid sequential port sweep',
        'Edge firewall deploys silent DROP rule'
      ]
    },
    {
      id: 'scen-mirai',
      name: 'Mirai Botnet Propagation & C2 Beacon',
      attackType: 'Botnet Activity (Mirai)',
      targetDeviceId: 'dev-01',
      description: 'Infection payload downloads a malicious binary, connects to Command & Control (C2) server, and recruits the node into a botnet.',
      complexity: 'Severe',
      estimatedDurationSec: 9,
      mitreId: 'T1071 - Application Layer Protocol C2',
      steps: [
        'Malicious shellcode injected via command execution',
        'Outbound heartbeat beacon sent to external C2 host',
        'AI classifier matches known botnet entropy pattern',
        'Device quarantined to isolated sandbox VLAN'
      ]
    },
    {
      id: 'scen-mqtt',
      name: 'MQTT Topic Injection & Payload Tamper',
      attackType: 'MQTT Injection',
      targetDeviceId: 'dev-02',
      description: 'Injects unauthorized control payloads into critical IoT broker topics (e.g. /medical/infusion/bolus or /locks/front/unlock).',
      complexity: 'High',
      estimatedDurationSec: 7,
      mitreId: 'T1565 - Data Manipulation & Injection',
      steps: [
        'Injecting rogue telemetry payload on broker topic',
        'Payload exceeds statistical baseline distribution',
        'AI flags semantic payload anomaly',
        'Topic publisher revoked and mTLS token invalidated'
      ]
    },
    {
      id: 'scen-exfil',
      name: 'DNS Tunneling Data Exfiltration',
      attackType: 'Data Exfiltration via DNS',
      targetDeviceId: 'dev-03',
      description: 'Encodes sensitive IoT sensor telemetry into Base64 subdomains of DNS TXT/A queries to bypass perimeter edge filters.',
      complexity: 'Medium',
      estimatedDurationSec: 8,
      mitreId: 'T1048 - Exfiltration Over Alternative Protocol',
      steps: [
        'Sensor telemetry fragmented and encoded in DNS queries',
        'High frequency of unique subdomains queried',
        'AI Shannon entropy calculation trips alarm (>7.9)',
        'Anomalous DNS resolver sinkholed'
      ]
    }
  ];

  const handleStartSimulation = () => {
    const matchingScenario = attackScenarios.find(s => s.attackType === selectedAttack) || attackScenarios[0];
    startSimulation(matchingScenario.id);
  };

  const selectedScenarioConfig = attackScenarios.find(s => s.attackType === selectedAttack) || attackScenarios[0];

  return (
    <div id="attack-simulation-view" className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <span>Interactive Attack Simulation & Demonstration Lab</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            College Capstone Live Defense Validation Engine • Real-time AI Pipeline Verification
          </p>
        </div>

        {isSimulating ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>SIMULATION IN PROGRESS ({simulationProgress}%)</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-[#10172A] border border-[#1E293B] text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">
            LAB STATUS: READY FOR INJECTION
          </div>
        )}
      </div>

      {/* Main Grid: Control Panel + Live Pipeline + Console Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Simulation Launcher Controls */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Configure Attack Vector</span>
          </h3>

          {/* Attack Scenarios List */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Select Threat Scenario
            </label>
            <div className="space-y-1.5">
              {attackScenarios.map((scen) => (
                <button
                  key={scen.id}
                  disabled={isSimulating}
                  onClick={() => setSelectedAttack(scen.attackType)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedAttack === scen.attackType
                      ? 'bg-red-500/10 border-red-500/40 text-white shadow-sm'
                      : 'bg-[#10172A] border-[#1E293B] text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <p className="font-bold">{scen.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{scen.mitreId}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target IoT Device */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Target IoT Asset
            </label>
            <select
              disabled={isSimulating}
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.ipAddress})
                </option>
              ))}
            </select>
          </div>

          {/* Attack Intensity */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Traffic Flood Intensity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['medium', 'high', 'aggressive'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={isSimulating}
                  onClick={() => setIntensity(lvl)}
                  className={`py-1.5 rounded-md border text-xs font-mono capitalize transition-colors ${
                    intensity === lvl
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold'
                      : 'bg-[#10172A] text-slate-400 border-[#1E293B] hover:bg-slate-800/50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Details Preview */}
          <div className="p-3 rounded-lg bg-[#10172A] border border-[#1E293B] text-xs space-y-1.5">
            <p className="text-slate-300 font-sans leading-relaxed">{selectedScenarioConfig.description}</p>
            <p className="text-[11px] text-cyan-400 font-mono font-semibold">
              Complexity: {selectedScenarioConfig.complexity} • Est. Duration: {selectedScenarioConfig.estimatedDurationSec}s
            </p>
          </div>

          {/* Launch / Abort Action */}
          <div className="pt-2">
            {!isSimulating ? (
              <button
                id="btn-trigger-attack-simulation"
                onClick={handleStartSimulation}
                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Inject Attack & Run SOC Defense</span>
              </button>
            ) : (
              <button
                onClick={cancelSimulation}
                className="w-full py-2.5 rounded-lg bg-[#10172A] hover:bg-slate-800 text-red-400 border border-red-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Square className="w-4 h-4 fill-red-400" />
                <span>Abort Live Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 2 Columns: 4-Stage Visual Pipeline & Live Terminal Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4-Stage Visual Pipeline */}
          <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Real-Time Defense Pipeline Architecture</span>
              </h3>
              {isSimulating && (
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Progress: {simulationProgress}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Stage 1: Ingress */}
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  isSimulating && simulationProgress >= 20 && simulationProgress < 50
                    ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
                    : simulationProgress >= 50
                    ? 'bg-[#10172A] border-emerald-500/40 text-emerald-400'
                    : 'bg-[#10172A] border-[#1E293B] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">01. INGRESS</span>
                  {simulationProgress >= 50 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : isSimulating && simulationProgress >= 20 ? <Radio className="w-3.5 h-3.5 text-red-400 animate-spin" /> : null}
                </div>
                <p className="text-xs font-bold text-slate-100 mt-1">Traffic Influx</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Simulated anomalous flow</p>
              </div>

              {/* Stage 2: AI Detection */}
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  isSimulating && simulationProgress >= 50 && simulationProgress < 80
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 animate-pulse'
                    : simulationProgress >= 80
                    ? 'bg-[#10172A] border-emerald-500/40 text-emerald-400'
                    : 'bg-[#10172A] border-[#1E293B] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">02. AI DETECT</span>
                  {simulationProgress >= 80 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : isSimulating && simulationProgress >= 50 ? <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> : null}
                </div>
                <p className="text-xs font-bold text-slate-100 mt-1">Neural Classifier</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Feature & entropy match</p>
              </div>

              {/* Stage 3: Prevention */}
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  isSimulating && simulationProgress >= 80 && simulationProgress < 100
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 animate-pulse'
                    : simulationProgress >= 100
                    ? 'bg-[#10172A] border-emerald-500/40 text-emerald-400'
                    : 'bg-[#10172A] border-[#1E293B] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">03. PREVENT</span>
                  {simulationProgress >= 100 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : isSimulating && simulationProgress >= 80 ? <Zap className="w-3.5 h-3.5 text-emerald-400 animate-ping" /> : null}
                </div>
                <p className="text-xs font-bold text-slate-100 mt-1">Auto-Firewall</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Subnet drop & isolation</p>
              </div>

              {/* Stage 4: Forensic */}
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  simulationProgress >= 100
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : 'bg-[#10172A] border-[#1E293B] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">04. FORENSIC</span>
                  {simulationProgress >= 100 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-xs font-bold text-slate-100 mt-1">Incident Audit</p>
                <p className="text-[10px] text-slate-400 mt-0.5">MITRE ATT&CK logs</p>
              </div>
            </div>
          </div>

          {/* Live SOC Pipeline Console Stream */}
          <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
            <div className="p-3.5 bg-[#10172A] border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-200 font-mono uppercase">
                  SOC Diagnostic Console Log Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                {simulationLogs.length} Events Logged
              </span>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs max-h-80 overflow-y-auto space-y-2 leading-relaxed">
              {simulationLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  Ready to simulate. Click "Inject Attack & Run SOC Defense" to observe real-time containment.
                </div>
              ) : (
                simulationLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded text-[11px] flex items-start gap-2 ${
                      log.level === 'success'
                        ? 'text-emerald-400 bg-emerald-950/20'
                        : log.level === 'threat'
                        ? 'text-red-400 bg-red-950/20'
                        : log.level === 'warn'
                        ? 'text-amber-400 bg-amber-950/20'
                        : 'text-cyan-300 bg-cyan-950/20'
                    }`}
                  >
                    <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">[{log.timestamp}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
