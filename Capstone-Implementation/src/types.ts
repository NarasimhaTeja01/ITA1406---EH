export type NavigationTab = 
  | 'dashboard'
  | 'devices'
  | 'threats'
  | 'prevention'
  | 'network'
  | 'alerts'
  | 'risk_analysis'
  | 'simulation'
  | 'reports'
  | 'ai_model'
  | 'settings';

export type DeviceType = 
  | 'Smart Camera'
  | 'Smart Door Lock'
  | 'Smart Thermostat'
  | 'Smart Router'
  | 'Smart Sensor'
  | 'Smart TV'
  | 'Medical Device'
  | 'Industrial Gateway';

export type SecurityStatus = 'secure' | 'suspicious' | 'critical' | 'offline';

export type ConnectionStatus = 'online' | 'offline' | 'isolated' | 'scanning';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  ipAddress: string;
  macAddress: string;
  location: string;
  connectionStatus: ConnectionStatus;
  securityStatus: SecurityStatus;
  riskScore: number; // 0 to 100
  lastActivity: string;
  firmwareVersion: string;
  protocol: string;
  openPorts: number[];
  bandwidthUsageKbps: number;
  packetsPerSec: number;
  riskFactors: string[];
  cveAlerts?: string[];
  vendor: string;
  isIsolated?: boolean;
}

export type AttackType = 
  | 'DDoS SYN Flood'
  | 'SSH/Telnet Brute Force'
  | 'Port Scanning (Nmap)'
  | 'Malware C2 Traffic'
  | 'Unauthorized Access'
  | 'Botnet Activity (Mirai)'
  | 'Suspicious Login'
  | 'Data Exfiltration via DNS'
  | 'MQTT Injection';

export interface ThreatDetection {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  trafficBehavior: string;
  detectedAttack: AttackType;
  confidenceScore: number; // e.g. 98.5
  riskLevel: RiskLevel;
  actionTaken: string;
  mitigated: boolean;
  rawPayloadSnippet?: string;
  mitreCode?: string;
}

export interface SecurityAlert {
  id: string;
  severity: RiskLevel;
  attackType: AttackType;
  deviceId: string;
  deviceName: string;
  sourceIp: string;
  destinationIp: string;
  timestamp: string;
  description: string;
  aiConfidence: number;
  recommendedAction: string;
  mitreTechnique: string;
  status: 'active' | 'mitigated' | 'acknowledged';
}

export interface FirewallRule {
  id: string;
  ruleCode: string;
  targetIp: string;
  port: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL' | 'MQTT' | 'HTTP/S';
  action: 'BLOCK' | 'DROP' | 'ISOLATE' | 'RATE_LIMIT';
  reason: string;
  status: 'active' | 'disabled';
  hits: number;
  createdAt: string;
  autoCreated: boolean;
}

export interface NetworkTrafficPoint {
  time: string;
  incoming: number; // Mbps
  outgoing: number; // Mbps
  packets: number; // kpps
  suspicious: number; // kpps
}

export interface SuspiciousConnection {
  id: string;
  sourceIp: string;
  country: string;
  targetDeviceId: string;
  targetDeviceName: string;
  targetPort: number;
  protocol: string;
  packetsCount: number;
  threatCategory: string;
  reputationScore: number; // 0-100 (high = bad)
  status: 'active' | 'blocked' | 'inspecting';
}

export interface SimulationScenario {
  id: string;
  name: string;
  attackType: AttackType;
  targetDeviceId: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Severe';
  estimatedDurationSec: number;
  mitreId: string;
  steps: string[];
}

export interface SimulationLog {
  timestamp: string;
  stage: 'INITIALIZING' | 'ATTACK_INGRESS' | 'AI_DETECTION' | 'ALERT_GENERATED' | 'AUTO_PREVENTION' | 'FORENSIC_SUMMARY';
  message: string;
  level: 'info' | 'warn' | 'threat' | 'success';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkTab?: NavigationTab;
}

export interface SystemSettings {
  autoMitigationEnabled: boolean;
  minConfidenceThreshold: number; // e.g. 85
  detectionSensitivity: 'Aggressive' | 'Balanced' | 'Conservative';
  alertSoundEnabled: boolean;
  simulationPpsMultiplier: number;
  theme: 'cyber-dark' | 'navy-stealth' | 'high-contrast-neon';
  emailAlerts: boolean;
  socAnalystName: string;
  analystRole: string;
}

export interface AIModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  totalPredictions: number;
  threatDetectionRate: number;
  falsePositiveRate: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}
