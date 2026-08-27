import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  NavigationTab,
  IoTDevice,
  ThreatDetection,
  SecurityAlert,
  FirewallRule,
  SuspiciousConnection,
  SimulationScenario,
  SimulationLog,
  NotificationItem,
  SystemSettings,
  AIModelMetrics,
  NetworkTrafficPoint,
  AttackType
} from '../types';
import {
  INITIAL_DEVICES,
  INITIAL_THREATS,
  INITIAL_ALERTS,
  INITIAL_RULES,
  INITIAL_SUSPICIOUS_CONNECTIONS,
  SIMULATION_SCENARIOS,
  INITIAL_AI_METRICS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface SecurityContextType {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Navigation
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Devices
  devices: IoTDevice[];
  addDevice: (device: Omit<IoTDevice, 'id' | 'riskScore' | 'lastActivity'>) => void;
  removeDevice: (id: string) => void;
  updateDevice: (device: IoTDevice) => void;
  scanDevice: (id: string) => Promise<{ findings: string[]; newScore: number }>;
  isolateDevice: (id: string) => void;
  reconnectDevice: (id: string) => void;
  patchDeviceVulnerabilities: (id: string) => void;

  // Threats & Detection
  threats: ThreatDetection[];
  mitigateThreat: (id: string) => void;
  deleteThreat: (id: string) => void;

  // Alerts
  alerts: SecurityAlert[];
  mitigateAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  deleteAlert: (id: string) => void;

  // Prevention & Firewall
  rules: FirewallRule[];
  addRule: (rule: Omit<FirewallRule, 'id' | 'createdAt' | 'hits'>) => void;
  toggleRule: (id: string) => void;
  deleteRule: (id: string) => void;
  blockIpImmediately: (ip: string, reason?: string) => void;
  resetDeviceConnection: (deviceId: string) => void;

  // Network Monitoring
  suspiciousConnections: SuspiciousConnection[];
  blockSuspiciousConnection: (id: string) => void;
  liveTraffic: NetworkTrafficPoint[];
  livePacketRate: number;
  liveBandwidthMbps: number;

  // Simulation Engine
  isSimulating: boolean;
  currentScenario: SimulationScenario | null;
  simulationProgress: number; // 0 to 100
  simulationLogs: SimulationLog[];
  startSimulation: (scenarioId: string) => void;
  cancelSimulation: () => void;

  // AI Model
  aiMetrics: AIModelMetrics;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Settings
  systemSettings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Statistics
  stats: {
    totalDevices: number;
    activeDevices: number;
    secureDevices: number;
    suspiciousDevices: number;
    criticalDevices: number;
    isolatedDevices: number;
    attacksDetected: number;
    attacksBlocked: number;
    activeRules: number;
    currentThreatLevel: 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe';
  };

  // Toast
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'danger' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

const DEFAULT_SETTINGS: SystemSettings = {
  autoMitigationEnabled: true,
  minConfidenceThreshold: 90,
  detectionSensitivity: 'Aggressive',
  alertSoundEnabled: false,
  simulationPpsMultiplier: 1.0,
  theme: 'cyber-dark',
  emailAlerts: true,
  socAnalystName: 'Capt. Alex Rivera',
  analystRole: 'Lead IoT SOC Analyst'
};

const DEFAULT_USER: UserProfile = {
  name: 'Alex Rivera (SOC Lead)',
  email: 'admin@soc.corp',
  role: 'Ethical Hacker / SOC Lead',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticated for quick demo review, with full logout support
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Primary Entities State
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [threats, setThreats] = useState<ThreatDetection[]>(INITIAL_THREATS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [rules, setRules] = useState<FirewallRule[]>(INITIAL_RULES);
  const [suspiciousConnections, setSuspiciousConnections] = useState<SuspiciousConnection[]>(INITIAL_SUSPICIOUS_CONNECTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [aiMetrics, setAiMetrics] = useState<AIModelMetrics>(INITIAL_AI_METRICS);

  // Toast State
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Telemetry state
  const [liveTraffic, setLiveTraffic] = useState<NetworkTrafficPoint[]>(() => {
    const initialPoints: NetworkTrafficPoint[] = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initialPoints.push({
        time: timeStr,
        incoming: Math.floor(25 + Math.random() * 20),
        outgoing: Math.floor(15 + Math.random() * 15),
        packets: Math.floor(120 + Math.random() * 60),
        suspicious: Math.floor(Math.random() * 12)
      });
    }
    return initialPoints;
  });
  const [livePacketRate, setLivePacketRate] = useState<number>(4320);
  const [liveBandwidthMbps, setLiveBandwidthMbps] = useState<number>(48.6);

  // Attack Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario | null>(null);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([]);

  // Toast Helpers
  const showToast = useCallback((title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev.slice(-4), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Login / Logout
  const login = useCallback((email: string, pass: string): boolean => {
    if (email.trim() && pass.length >= 4) {
      setIsAuthenticated(true);
      setUser({
        name: email.split('@')[0] || 'SecOps Analyst',
        email,
        role: 'SOC Security Analyst',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      showToast('Authentication Successful', `Welcome back, ${email}`, 'success');
      return true;
    }
    showToast('Login Failed', 'Please check your email and password.', 'danger');
    return false;
  }, [showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    showToast('Logged Out', 'Session terminated securely.', 'info');
  }, [showToast]);

  // Notifications
  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...item
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 24)]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Marked', 'All notifications marked as read', 'info');
  }, [showToast]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    showToast('Cleared', 'Notification queue cleared', 'info');
  }, [showToast]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Configuration Updated', 'SOC system settings have been saved.', 'success');
  }, [showToast]);

  // Device CRUD & Operations
  const addDevice = useCallback((newDevData: Omit<IoTDevice, 'id' | 'riskScore' | 'lastActivity'>) => {
    const id = `dev-${String(Date.now()).slice(-4)}`;
    const newDevice: IoTDevice = {
      ...newDevData,
      id,
      riskScore: 15,
      lastActivity: 'Just now',
      riskFactors: ['Newly provisioned IoT node', 'Zero-trust baseline monitoring initialized']
    };
    setDevices(prev => [newDevice, ...prev]);
    addNotification({
      title: 'New IoT Device Added',
      message: `${newDevice.name} (${newDevice.ipAddress}) added to monitoring inventory.`,
      type: 'info',
      linkTab: 'devices'
    });
    showToast('Device Registered', `${newDevice.name} is now actively monitored.`, 'success');
  }, [addNotification, showToast]);

  const removeDevice = useCallback((id: string) => {
    const dev = devices.find(d => d.id === id);
    setDevices(prev => prev.filter(d => d.id !== id));
    showToast('Device Decommissioned', `${dev?.name || 'Device'} removed from IoT inventory.`, 'info');
  }, [devices, showToast]);

  const updateDevice = useCallback((updated: IoTDevice) => {
    setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
    showToast('Device Updated', `${updated.name} configurations updated.`, 'success');
  }, [showToast]);

  const isolateDevice = useCallback((id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          connectionStatus: 'isolated',
          securityStatus: 'suspicious',
          isIsolated: true,
          riskFactors: ['Device isolated in sandbox VLAN segment by SOC analyst', ...d.riskFactors]
        };
      }
      return d;
    }));

    // Auto add firewall isolate rule
    const dev = devices.find(d => d.id === id);
    if (dev) {
      const newRule: FirewallRule = {
        id: `FW-ISO-${Date.now().toString().slice(-4)}`,
        ruleCode: `RULE_ISOLATE_${dev.id.toUpperCase()}`,
        targetIp: `${dev.ipAddress}/32`,
        port: 'ALL',
        protocol: 'ALL',
        action: 'ISOLATE',
        reason: `Manual isolation of ${dev.name} by SOC team`,
        status: 'active',
        hits: 1,
        createdAt: new Date().toLocaleTimeString(),
        autoCreated: true
      };
      setRules(prev => [newRule, ...prev]);
      addNotification({
        title: 'Device Isolated',
        message: `${dev.name} (${dev.ipAddress}) has been quarantined from the network.`,
        type: 'warning',
        linkTab: 'prevention'
      });
      showToast('Device Quarantined', `${dev.name} traffic is now blocked from internal subnets.`, 'warning');
    }
  }, [devices, addNotification, showToast]);

  const reconnectDevice = useCallback((id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          connectionStatus: 'online',
          securityStatus: 'secure',
          isIsolated: false,
          riskScore: Math.min(d.riskScore, 25),
          riskFactors: ['Re-authenticated and verified via Zero-Trust policy']
        };
      }
      return d;
    }));

    const dev = devices.find(d => d.id === id);
    if (dev) {
      // remove isolating rules
      setRules(prev => prev.filter(r => !r.ruleCode.includes(dev.id.toUpperCase())));
      showToast('Device Reconnected', `${dev.name} re-admitted to standard IoT network.`, 'success');
    }
  }, [devices, showToast]);

  const scanDevice = useCallback(async (id: string): Promise<{ findings: string[]; newScore: number }> => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, connectionStatus: 'scanning' } : d));
    
    // Simulate deep diagnostic scan
    await new Promise(res => setTimeout(res, 2200));

    const dev = devices.find(d => d.id === id);
    const hasTelnet = dev?.openPorts.includes(23);
    const findings = [
      'Port Scan & Banner Grabbing completed (65,535 ports audited)',
      hasTelnet ? '⚠️ CRITICAL: Telnet daemon on port 23 sending cleartext credentials' : '✅ Encryption: TLS/mTLS verified on primary ports',
      'AI Flow Analyzer: Shannon entropy score 7.42 (Normal baseline)',
      'Firmware vulnerability signature check: 0 unknown rootkits detected',
      'MQTT/CoAP ACL check: Validated access controls'
    ];

    const newScore = hasTelnet ? 75 : 18;
    const newStatus = hasTelnet ? 'suspicious' : 'secure';

    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          connectionStatus: d.isIsolated ? 'isolated' : 'online',
          securityStatus: newStatus,
          riskScore: newScore,
          lastActivity: 'Scanned just now',
          riskFactors: findings
        };
      }
      return d;
    }));

    showToast('AI Diagnostic Scan Complete', `Audit complete for ${dev?.name || 'Device'}. Risk Score: ${newScore}/100`, 'info');
    return { findings, newScore };
  }, [devices, showToast]);

  const patchDeviceVulnerabilities = useCallback((id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          securityStatus: 'secure',
          riskScore: 12,
          firmwareVersion: 'v5.0.1-Hardened (Latest)',
          openPorts: d.openPorts.filter(p => p !== 23 && p !== 8008),
          riskFactors: [
            'Firmware patched to v5.0.1-Hardened',
            'Insecure ports (23, 8008) closed',
            'Zero-Trust certificate rotation applied'
          ],
          cveAlerts: []
        };
      }
      return d;
    }));

    showToast('Remediation Applied', 'Firmware updated, insecure ports closed, and risk score reduced to 12.', 'success');
  }, [showToast]);

  // Threats Management
  const mitigateThreat = useCallback((id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, mitigated: true, actionTaken: 'Mitigated by SOC Analyst' } : t));
    showToast('Threat Mitigated', `Threat ${id} marked as resolved and countermeasure applied.`, 'success');
  }, [showToast]);

  const deleteThreat = useCallback((id: string) => {
    setThreats(prev => prev.filter(t => t.id !== id));
  }, []);

  // Alerts Management
  const mitigateAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'mitigated' } : a));
    showToast('Alert Mitigated', `Incident ${id} successfully contained.`, 'success');
  }, [showToast]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
    showToast('Alert Acknowledged', `Incident ${id} assigned to active review.`, 'info');
  }, [showToast]);

  const deleteAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  // Prevention & Firewall Rules
  const addRule = useCallback((ruleData: Omit<FirewallRule, 'id' | 'createdAt' | 'hits'>) => {
    const id = `FW-${Date.now().toString().slice(-4)}`;
    const newRule: FirewallRule = {
      ...ruleData,
      id,
      createdAt: new Date().toLocaleTimeString(),
      hits: 0
    };
    setRules(prev => [newRule, ...prev]);
    showToast('Firewall Rule Deployed', `Rule ${newRule.ruleCode} is active on the network.`, 'success');
  }, [showToast]);

  const toggleRule = useCallback((id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'active' ? 'disabled' : 'active';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    showToast('Rule Deleted', 'Firewall rule removed from edge router.', 'info');
  }, [showToast]);

  const blockIpImmediately = useCallback((ip: string, reason: string = 'SOC Manual Blacklist') => {
    const id = `FW-BLK-${Date.now().toString().slice(-4)}`;
    const cleanIp = ip.includes('/') ? ip : `${ip}/32`;
    const newRule: FirewallRule = {
      id,
      ruleCode: `RULE_BLOCK_${ip.replace(/[^a-zA-Z0-9]/g, '_')}`,
      targetIp: cleanIp,
      port: 'ALL',
      protocol: 'ALL',
      action: 'BLOCK',
      reason,
      status: 'active',
      hits: 1,
      createdAt: new Date().toLocaleTimeString(),
      autoCreated: false
    };
    setRules(prev => [newRule, ...prev]);
    
    // Also update any suspicious connection matching this IP
    setSuspiciousConnections(prev => prev.map(c => c.sourceIp.includes(ip.split('/')[0]) ? { ...c, status: 'blocked' } : c));

    addNotification({
      title: 'IP Address Blocked',
      message: `IP ${ip} has been blacklisted and blocked across all IoT subnets.`,
      type: 'warning',
      linkTab: 'prevention'
    });
    showToast('IP Blocked', `Traffic from ${ip} is now completely dropped.`, 'danger');
  }, [addNotification, showToast]);

  const resetDeviceConnection = useCallback((deviceId: string) => {
    const dev = devices.find(d => d.id === deviceId);
    showToast('TCP Session Reset', `RST packets dispatched to drop all active sessions on ${dev?.name || deviceId}.`, 'info');
  }, [devices, showToast]);

  const blockSuspiciousConnection = useCallback((id: string) => {
    const conn = suspiciousConnections.find(c => c.id === id);
    if (conn) {
      blockIpImmediately(conn.sourceIp, `Blocked suspicious traffic (${conn.threatCategory})`);
    }
  }, [suspiciousConnections, blockIpImmediately]);

  // Attack Simulator Engine
  const startSimulation = useCallback((scenarioId: string) => {
    const scenario = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    setIsSimulating(true);
    setCurrentScenario(scenario);
    setSimulationProgress(5);
    setSimulationLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        stage: 'INITIALIZING',
        message: `[SIMULATION] Initializing attack range for "${scenario.name}". Target: ${scenario.targetDeviceId}`,
        level: 'info'
      }
    ]);

    const targetDev = devices.find(d => d.id === scenario.targetDeviceId) || devices[0];

    // Stage 1: Attack Ingress (at 20% progress)
    setTimeout(() => {
      setSimulationProgress(25);
      setSimulationLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'ATTACK_INGRESS',
          message: `[INGRESS] ${scenario.steps[0] || 'Injecting attack payloads'} | Target IP: ${targetDev.ipAddress}`,
          level: 'threat'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'ATTACK_INGRESS',
          message: `[NETWORK] Anomalous packet rate surge detected: 142,500 pps towards ${targetDev.name}`,
          level: 'warn'
        }
      ]);
      setLivePacketRate(prev => prev + 12000);
      setLiveBandwidthMbps(prev => prev + 65.4);
    }, 1800);

    // Stage 2: AI Detection & Classification (at 55% progress)
    setTimeout(() => {
      setSimulationProgress(60);
      const confScore = +(98 + Math.random() * 1.8).toFixed(1);
      setSimulationLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'AI_DETECTION',
          message: `[AI ENGINE] Anomaly signature match: ${scenario.attackType} (Confidence: ${confScore}%)`,
          level: 'threat'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'AI_DETECTION',
          message: `[MITRE ATT&CK] Mapping to ${scenario.mitreId} - Severity: CRITICAL`,
          level: 'warn'
        }
      ]);

      // Add to Threat Detection Feed
      const newThreatId = `THR-SIM-${Date.now().toString().slice(-4)}`;
      const newThreat: ThreatDetection = {
        id: newThreatId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        deviceId: targetDev.id,
        deviceName: targetDev.name,
        ipAddress: targetDev.ipAddress,
        trafficBehavior: `Simulated ${scenario.attackType} payload storm detected in sandbox lab`,
        detectedAttack: scenario.attackType,
        confidenceScore: confScore,
        riskLevel: 'critical',
        actionTaken: 'Auto-Prevention Engine Triggered',
        mitigated: false,
        rawPayloadSnippet: `[SIM_TEST] HEX: 0xDEADBEEF attack=${scenario.id} pps=150k target=${targetDev.ipAddress}`,
        mitreCode: `${scenario.mitreId} - ${scenario.name}`
      };
      setThreats(prev => [newThreat, ...prev]);

      // Add to Security Alert Queue
      const newAlertId = `ALT-SIM-${Date.now().toString().slice(-4)}`;
      const newAlert: SecurityAlert = {
        id: newAlertId,
        severity: 'critical',
        attackType: scenario.attackType,
        deviceId: targetDev.id,
        deviceName: targetDev.name,
        sourceIp: '198.51.100.99 (Simulated Botnet Origin)',
        destinationIp: `${targetDev.ipAddress}:554`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        description: `[SIMULATION] Active ${scenario.attackType} detected against ${targetDev.name}.`,
        aiConfidence: confScore,
        recommendedAction: 'Execute automated network isolation and deploy edge firewall drop rule.',
        mitreTechnique: `${scenario.mitreId} - ${scenario.name}`,
        status: 'active'
      };
      setAlerts(prev => [newAlert, ...prev]);

      // Mark device status to critical
      setDevices(prev => prev.map(d => d.id === targetDev.id ? { ...d, securityStatus: 'critical', riskScore: 94 } : d));

      addNotification({
        title: `CRITICAL ATTACK SIMULATION DETECTED`,
        message: `${scenario.attackType} detected on ${targetDev.name} (${confScore}% confidence).`,
        type: 'critical',
        linkTab: 'threats'
      });
    }, 4000);

    // Stage 3: Automated Prevention & Containment (at 85% progress)
    setTimeout(() => {
      setSimulationProgress(85);
      setSimulationLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'AUTO_PREVENTION',
          message: `[FIREWALL] Deploying automatic countermeasure RULE_BLOCK_SIM_${scenario.id.toUpperCase()}`,
          level: 'info'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'AUTO_PREVENTION',
          message: `[CONTAINMENT] Dropped 148,200 malicious packets. Device ${targetDev.name} shielded!`,
          level: 'success'
        }
      ]);

      // Add blocking firewall rule
      const simRule: FirewallRule = {
        id: `FW-SIM-${Date.now().toString().slice(-4)}`,
        ruleCode: `RULE_BLOCK_SIM_${scenario.id.toUpperCase()}`,
        targetIp: '198.51.100.99/32',
        port: 'ALL',
        protocol: 'ALL',
        action: 'BLOCK',
        reason: `[Auto-Mitigation] Blocked simulated attack source for ${scenario.name}`,
        status: 'active',
        hits: 148200,
        createdAt: new Date().toLocaleTimeString(),
        autoCreated: true
      };
      setRules(prev => [simRule, ...prev]);
    }, 6200);

    // Stage 4: Completed Forensic Summary (at 100% progress)
    setTimeout(() => {
      setSimulationProgress(100);
      setIsSimulating(false);
      setSimulationLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'FORENSIC_SUMMARY',
          message: `[SUCCESS] Attack simulation successfully Detected -> Analyzed -> Blocked in 7.8s.`,
          level: 'success'
        }
      ]);

      // Mark threat as mitigated
      setThreats(prev => prev.map(t => t.id.startsWith('THR-SIM') ? { ...t, mitigated: true } : t));
      setAlerts(prev => prev.map(a => a.id.startsWith('ALT-SIM') ? { ...a, status: 'mitigated' } : a));

      // Reset telemetry spikes
      setLivePacketRate(4450);
      setLiveBandwidthMbps(49.2);

      // Trigger victory confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore if not supported
      }

      showToast('Simulation Successful', `AI Engine successfully detected and blocked ${scenario.name}!`, 'success');
    }, 8500);
  }, [devices, addNotification, showToast]);

  const cancelSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationProgress(0);
    setSimulationLogs(prev => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        stage: 'FORENSIC_SUMMARY',
        message: '[CANCELLED] Simulation aborted by user.',
        level: 'warn'
      }
    ]);
    setLivePacketRate(4320);
    setLiveBandwidthMbps(48.6);
    showToast('Simulation Aborted', 'Attack scenario was halted.', 'info');
  }, [showToast]);

  // Live background telemetry generator (simulates dynamic packet stream and subtle live fluctuations)
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newPoint: NetworkTrafficPoint = {
        time: timeStr,
        incoming: Math.floor(30 + Math.sin(Date.now() / 10000) * 15 + Math.random() * 8),
        outgoing: Math.floor(20 + Math.cos(Date.now() / 12000) * 10 + Math.random() * 6),
        packets: Math.floor(130 + Math.random() * 40),
        suspicious: Math.floor(Math.random() * 6)
      };

      setLiveTraffic(prev => [...prev.slice(1), newPoint]);
      if (!isSimulating) {
        setLivePacketRate(Math.floor(4100 + Math.random() * 500));
        setLiveBandwidthMbps(+(46 + Math.random() * 8).toFixed(1));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Computed Global Statistics
  const stats = useMemo(() => {
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.connectionStatus === 'online' || d.connectionStatus === 'scanning').length;
    const secureDevices = devices.filter(d => d.securityStatus === 'secure').length;
    const suspiciousDevices = devices.filter(d => d.securityStatus === 'suspicious').length;
    const criticalDevices = devices.filter(d => d.securityStatus === 'critical').length;
    const isolatedDevices = devices.filter(d => d.connectionStatus === 'isolated' || d.isIsolated).length;

    const attacksDetected = threats.length;
    const attacksBlocked = threats.filter(t => t.mitigated).length + rules.reduce((acc, r) => acc + (r.hits > 0 ? 1 : 0), 0);
    const activeRules = rules.filter(r => r.status === 'active').length;

    let currentThreatLevel: 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe' = 'Guarded';
    if (criticalDevices > 0 || isSimulating) {
      currentThreatLevel = 'Severe';
    } else if (suspiciousDevices > 1) {
      currentThreatLevel = 'High';
    } else if (suspiciousDevices === 1) {
      currentThreatLevel = 'Elevated';
    } else if (totalDevices > 0) {
      currentThreatLevel = 'Guarded';
    }

    return {
      totalDevices,
      activeDevices,
      secureDevices,
      suspiciousDevices,
      criticalDevices,
      isolatedDevices,
      attacksDetected,
      attacksBlocked,
      activeRules,
      currentThreatLevel
    };
  }, [devices, threats, rules, isSimulating]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    currentTab,
    setCurrentTab,
    searchTerm,
    setSearchTerm,
    devices,
    addDevice,
    removeDevice,
    updateDevice,
    scanDevice,
    isolateDevice,
    reconnectDevice,
    patchDeviceVulnerabilities,
    threats,
    mitigateThreat,
    deleteThreat,
    alerts,
    mitigateAlert,
    acknowledgeAlert,
    deleteAlert,
    rules,
    addRule,
    toggleRule,
    deleteRule,
    blockIpImmediately,
    resetDeviceConnection,
    suspiciousConnections,
    blockSuspiciousConnection,
    liveTraffic,
    livePacketRate,
    liveBandwidthMbps,
    isSimulating,
    currentScenario,
    simulationProgress,
    simulationLogs,
    startSimulation,
    cancelSimulation,
    aiMetrics,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    clearNotifications,
    addNotification,
    systemSettings,
    updateSettings,
    stats,
    toasts,
    showToast,
    removeToast
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
