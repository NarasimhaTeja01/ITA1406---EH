import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  FileSpreadsheet,
  FileCode,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Search,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportTemplate {
  id: string;
  title: string;
  category: 'threats' | 'devices' | 'network' | 'ai' | 'compliance';
  period: string;
  description: string;
  lastGenerated: string;
  fileSize: string;
}

export const ReportsView: React.FC = () => {
  const {
    devices,
    threats,
    alerts,
    rules,
    aiMetrics,
    stats,
    showToast
  } = useSecurity();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('daily-threat');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily-threat',
      title: 'Daily IoT Threat & Incident Summary',
      category: 'threats',
      period: 'Last 24 Hours',
      description: 'Comprehensive log of all detected DDoS attacks, brute-force events, MITRE techniques, and mitigation outcomes.',
      lastGenerated: 'Today, 08:00 AM',
      fileSize: '420 KB'
    },
    {
      id: 'device-vuln',
      title: 'Fleet Vulnerability & Risk Posture Audit',
      category: 'devices',
      period: 'Current State',
      description: 'Device risk scores (0–100), firmware CVE analysis, open Telnet/RTSP ports, and quarantine isolation status.',
      lastGenerated: 'Yesterday, 18:30 PM',
      fileSize: '680 KB'
    },
    {
      id: 'firewall-log',
      title: 'Edge Firewall & Automated Prevention Log',
      category: 'network',
      period: 'Last 7 Days',
      description: 'Active firewall rules, auto-isolation logs, malicious IP blacklist hits, and rate-limiting metrics.',
      lastGenerated: '3 days ago',
      fileSize: '1.2 MB'
    },
    {
      id: 'ai-accuracy',
      title: 'AI Classifier Validation & Model Retraining Benchmark',
      category: 'ai',
      period: 'Monthly',
      description: 'Precision, Recall, F1-Score, Confusion Matrix, and feature weightings across 148,000 live packet telemetry streams.',
      lastGenerated: '1 week ago',
      fileSize: '890 KB'
    },
    {
      id: 'nist-compliance',
      title: 'NIST SP 800-213 / OWASP IoT Top 10 Compliance',
      category: 'compliance',
      period: 'Quarterly',
      description: 'Zero-trust segmentation verification, encrypted credential audit, and firmware integrity checklist for capstone review.',
      lastGenerated: '2 weeks ago',
      fileSize: '1.5 MB'
    }
  ];

  const handleGenerateAndExport = (format: 'pdf' | 'csv' | 'json') => {
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      if (format === 'json') {
        const payload = {
          reportTitle: reportTemplates.find(t => t.id === selectedTemplate)?.title,
          generatedAt: new Date().toISOString(),
          fleetSummary: {
            totalDevices: devices.length,
            averageRisk: Math.round(devices.reduce((a, b) => a + b.riskScore, 0) / devices.length),
            activeFirewallRules: rules.length
          },
          aiMetrics,
          activeAlerts: alerts,
          devices: devices.map(d => ({
            id: d.id,
            name: d.name,
            ip: d.ipAddress,
            riskScore: d.riskScore,
            status: d.securityStatus,
            openPorts: d.openPorts
          }))
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SOC_REPORT_${selectedTemplate}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Device Name,IP Address,Device Type,Location,Risk Score,Security Status,Firmware\n';
        devices.forEach(d => {
          csvContent += `"${d.name}","${d.ipAddress}","${d.type}","${d.location}",${d.riskScore},"${d.securityStatus}","${d.firmwareVersion}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `SOC_AUDIT_${selectedTemplate}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF Printable Preview
        window.print();
      }

      showToast('Report Exported Successfully', `Generated ${format.toUpperCase()} export for capstone review.`, 'success');
    }, 800);
  };

  return (
    <div id="security-reports-view" className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Audit, Compliance & Security Report Generation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Automated Executive PDF Reports • Raw CSV Data Exports • NIST SP 800-213 Assessment Logs
          </p>
        </div>
      </div>

      {/* Main Grid: Template Selector + Export Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Available Report Templates */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
            Available Report Templates
          </h3>

          <div className="space-y-2">
            {reportTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  selectedTemplate === tpl.id
                    ? 'bg-[#10172A] border-cyan-500 shadow-md text-white'
                    : 'bg-[#10172A]/60 border-[#1E293B] text-slate-300 hover:bg-[#10172A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">{tpl.title}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{tpl.fileSize}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-[#1E293B]">
                  <span>Frequency: {tpl.period}</span>
                  <span>{tpl.lastGenerated}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Selected Report Live Preview & Download Formats */}
        <div className="lg:col-span-2 bg-[#0A0F1E] border border-[#1E293B] p-6 rounded-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-wider">Document Preview</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {reportTemplates.find(t => t.id === selectedTemplate)?.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Author: AI SOC Cyber-Engine • Generated on: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerateAndExport('pdf')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => handleGenerateAndExport('csv')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => handleGenerateAndExport('json')}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Rendered Live Report Summary Layout */}
          <div className="p-5 rounded-lg bg-[#10172A] border border-[#1E293B] space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-slate-100 uppercase tracking-wide">
                  Executive Cybersecurity Capstone Audit Summary
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                AUDIT PASS (99.4%)
              </span>
            </div>

            {/* Quick Metrics in Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-2.5 rounded-lg bg-[#0A0F1E] border border-[#1E293B]">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">TOTAL ASSETS</span>
                <span className="text-sm font-bold text-slate-200">{devices.length} Devices</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1E] border border-[#1E293B]">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">ATTACKS BLOCKED</span>
                <span className="text-sm font-bold text-emerald-400">{stats.attacksBlocked} Contained</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1E] border border-[#1E293B]">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">AI ACCURACY</span>
                <span className="text-sm font-bold text-cyan-300">{aiMetrics.accuracy}% F1</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0F1E] border border-[#1E293B]">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">FIREWALL RULES</span>
                <span className="text-sm font-bold text-purple-400">{rules.length} Enforced</span>
              </div>
            </div>

            {/* Sample Asset Table in Preview */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                Asset Inventory & Threat Exposure Matrix
              </p>
              <div className="rounded-lg border border-[#1E293B] overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#0A0F1E] text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Asset</th>
                      <th className="py-2 px-3">IP Address</th>
                      <th className="py-2 px-3">Risk</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-slate-300 font-mono">
                    {devices.slice(0, 4).map((d) => (
                      <tr key={d.id} className="hover:bg-[#0A0F1E]/50">
                        <td className="py-2 px-3 font-sans font-semibold text-slate-200">{d.name}</td>
                        <td className="py-2 px-3">{d.ipAddress}</td>
                        <td className="py-2 px-3">{d.riskScore} / 100</td>
                        <td className="py-2 px-3 uppercase text-emerald-400 font-bold">{d.securityStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A0F1E]/80 border border-[#1E293B] text-slate-400 text-[11px] leading-relaxed font-sans">
              <strong>Capstone Audit Conclusion:</strong> All IoT perimeter devices are continuously supervised under an AI ensemble classifier. Suspicious anomalous telemetry instantly triggers automated firewall containment, enforcing zero-trust microsegmentation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
