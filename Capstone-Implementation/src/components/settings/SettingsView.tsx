import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Settings,
  User,
  Bell,
  Sliders,
  Shield,
  Save,
  CheckCircle,
  Database,
  Download,
  Upload,
  Zap,
  Lock,
  Key,
  Globe,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  const {
    user,
    systemSettings,
    updateSettings,
    showToast
  } = useSecurity();

  const [formData, setFormData] = useState({
    autoMitigationEnabled: systemSettings.autoMitigationEnabled,
    minConfidenceThreshold: systemSettings.minConfidenceThreshold,
    detectionSensitivity: systemSettings.detectionSensitivity,
    alertSoundEnabled: systemSettings.alertSoundEnabled,
    emailAlerts: systemSettings.emailAlerts,
    socAnalystName: systemSettings.socAnalystName,
    analystRole: systemSettings.analystRole,
    syslogServer: 'syslog.soc-defense.corp:514',
    slackWebhook: 'https://hooks.slack.com/services/T000/B000/XXXX'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      autoMitigationEnabled: formData.autoMitigationEnabled,
      minConfidenceThreshold: formData.minConfidenceThreshold,
      detectionSensitivity: formData.detectionSensitivity,
      alertSoundEnabled: formData.alertSoundEnabled,
      emailAlerts: formData.emailAlerts,
      socAnalystName: formData.socAnalystName,
      analystRole: formData.analystRole
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify({ systemSettings: formData, exportedAt: new Date() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOC_CONFIGURATION_BACKUP_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Configuration Exported', 'System settings JSON saved to local disk.', 'success');
  };

  return (
    <div id="system-settings-view" className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>SOC System Preferences & Engine Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Zero-Trust Thresholds • SIEM Syslog Forwarding • Analyst RBAC Credentials
          </p>
        </div>

        {saved && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>CONFIG COMMITTED & APPLIED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: User Profile & RBAC Card */}
          <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1E293B]">
              <User className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
                Analyst Profile & Credentials
              </h3>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#10172A] border border-[#1E293B]">
              <div className="w-12 h-12 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-base shadow-md font-mono">
                {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Security Analyst'}</p>
                <p className="text-xs text-cyan-400 font-mono truncate">{user?.email || 'admin@soc.corp'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono uppercase font-bold tracking-wider">
                  {user?.role || 'SOC Administrator'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#10172A] border border-[#1E293B]">
                <span className="text-slate-400">Two-Factor Auth (2FA):</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hardware FIDO2
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#10172A] border border-[#1E293B]">
                <span className="text-slate-400">Session Timeout:</span>
                <span className="text-slate-200">120 Minutes Idle</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#10172A] border border-[#1E293B]">
                <span className="text-slate-400">Security Clearance:</span>
                <span className="text-purple-400 font-bold">Level 4 (Full Kernel)</span>
              </div>
            </div>

            {/* Backup / Export Config */}
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <button
                type="button"
                onClick={handleExportConfig}
                className="w-full py-2 px-3 rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-300 border border-[#1E293B] text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Configuration Backup</span>
              </button>
            </div>
          </div>

          {/* Center & Right Columns: Automated Mitigation & Notification Config */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auto-Mitigation Engine Thresholds */}
            <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1E293B]">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
                  Automated Defense & AI Thresholds
                </h3>
              </div>

              {/* Auto Mitigation Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
                <div>
                  <p className="text-xs font-bold text-white">Automated Attack Prevention & Zero-Touch Isolation</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automatically generates edge firewall rules and quarantines target IoT nodes when AI confidence threshold is met.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={formData.autoMitigationEnabled}
                    onChange={(e) => setFormData({ ...formData, autoMitigationEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#0A0F1E] border border-[#1E293B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* AI Confidence Slider */}
              <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">AI Detection Trigger Sensitivity Threshold</span>
                  <span className="font-mono font-bold text-cyan-400">{formData.minConfidenceThreshold}% Confidence</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="99"
                  value={formData.minConfidenceThreshold}
                  onChange={(e) => setFormData({ ...formData, minConfidenceThreshold: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#0A0F1E] border border-[#1E293B] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>75% (Aggressive Catch)</span>
                  <span>90% (Standard SOC Balanced)</span>
                  <span>99% (Strict / Ultra-Low False Positives)</span>
                </div>
              </div>

              {/* Sensitivity Mode */}
              <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B] space-y-2">
                <label className="block text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">Detection Sensitivity Profile</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Aggressive', 'Balanced', 'Conservative'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({ ...formData, detectionSensitivity: mode })}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                        formData.detectionSensitivity === mode
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold'
                          : 'bg-[#0A0F1E] text-slate-400 border-[#1E293B] hover:bg-[#10172A]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification & SIEM Integrations */}
            <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1E293B]">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
                  Alert Channels & SIEM Syslog Forwarding
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase tracking-wider">
                    SIEM Syslog Remote Host (RFC 5424)
                  </label>
                  <input
                    type="text"
                    value={formData.syslogServer}
                    onChange={(e) => setFormData({ ...formData, syslogServer: e.target.value })}
                    placeholder="syslog.soc-defense.corp:514"
                    className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase tracking-wider">
                    Incident Webhook Dispatch (Slack/Discord)
                  </label>
                  <input
                    type="text"
                    value={formData.slackWebhook}
                    onChange={(e) => setFormData({ ...formData, slackWebhook: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formData.emailAlerts}
                    onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                    className="rounded bg-[#10172A] border-[#1E293B] text-cyan-500 focus:ring-0"
                  />
                  <span>Dispatch Email on Critical Alerts</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={formData.alertSoundEnabled}
                    onChange={(e) => setFormData({ ...formData, alertSoundEnabled: e.target.checked })}
                    className="rounded bg-[#10172A] border-[#1E293B] text-cyan-500 focus:ring-0"
                  />
                  <span>Audio Alert on Threat Ingress</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Deploy Configurations</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
