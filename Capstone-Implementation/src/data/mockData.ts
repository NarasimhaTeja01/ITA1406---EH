import { 
  IoTDevice, 
  ThreatDetection, 
  SecurityAlert, 
  FirewallRule, 
  SuspiciousConnection, 
  SimulationScenario,
  AIModelMetrics,
  NotificationItem
} from '../types';

export const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'dev-001',
    name: 'Smart Camera - Front Entrance',
    type: 'Smart Camera',
    ipAddress: '192.168.1.104',
    macAddress: '00:1A:79:B4:42:19',
    location: 'Building A - North Entrance',
    connectionStatus: 'online',
    securityStatus: 'critical',
    riskScore: 88,
    lastActivity: 'Just now',
    firmwareVersion: 'v2.4.1 (Vulnerable)',
    protocol: 'RTSP / HTTP (Port 554, 80)',
    openPorts: [80, 554, 23, 8080],
    bandwidthUsageKbps: 4850,
    packetsPerSec: 1240,
    vendor: 'HikVision VisionPro',
    riskFactors: [
      'Insecure open Telnet port (23) exposed',
      'Sudden 340% outbound packet spike to unknown IP',
      'CVE-2021-36260 unpatched RCE vulnerability',
      'Multiple failed root auth attempts (18 in 5 mins)'
    ],
    cveAlerts: ['CVE-2021-36260', 'CVE-2023-28821']
  },
  {
    id: 'dev-002',
    name: 'Smart Door Lock - Main Server Room',
    type: 'Smart Door Lock',
    ipAddress: '192.168.1.112',
    macAddress: 'B8:27:EB:9A:11:F4',
    location: 'Data Center - Floor 2',
    connectionStatus: 'online',
    securityStatus: 'suspicious',
    riskScore: 68,
    lastActivity: '42s ago',
    firmwareVersion: 'v3.1.0',
    protocol: 'Zigbee 3.0 / MQTT (Port 1883)',
    openPorts: [1883, 8883],
    bandwidthUsageKbps: 120,
    packetsPerSec: 85,
    vendor: 'Yale Access Matrix',
    riskFactors: [
      'Repeated anomalous unlock token payloads',
      'Unsigned MQTT broker message injection attempts',
      'High login retry frequency from internal subnet'
    ]
  },
  {
    id: 'dev-003',
    name: 'Core IoT Gateway & Firewall',
    type: 'Smart Router',
    ipAddress: '192.168.1.1',
    macAddress: 'F0:9F:C2:55:1A:00',
    location: 'Network Core Rack 01',
    connectionStatus: 'online',
    securityStatus: 'secure',
    riskScore: 18,
    lastActivity: 'Active stream',
    firmwareVersion: 'v5.8.4-Hardened',
    protocol: 'HTTPS / SSH-KeyOnly (Port 443, 2222)',
    openPorts: [443, 2222],
    bandwidthUsageKbps: 24500,
    packetsPerSec: 6800,
    vendor: 'Cisco Industrial IoT',
    riskFactors: [
      'Standard baseline traffic parameters',
      'TLS 1.3 enforced across all ingress tunnels'
    ]
  },
  {
    id: 'dev-004',
    name: 'Smart HVAC Thermostat - Lab Zone',
    type: 'Smart Thermostat',
    ipAddress: '192.168.1.125',
    macAddress: 'DC:A6:32:41:88:E2',
    location: 'Cleanroom Chemistry Lab',
    connectionStatus: 'online',
    securityStatus: 'secure',
    riskScore: 22,
    lastActivity: '2m ago',
    firmwareVersion: 'v4.0.2',
    protocol: 'CoAP / BACnet (Port 5683, 47808)',
    openPorts: [5683],
    bandwidthUsageKbps: 45,
    packetsPerSec: 12,
    vendor: 'Honeywell Ecowise',
    riskFactors: [
      'Normal telemetry intervals (30s polling)',
      'Encrypted CoAP payload verified'
    ]
  },
  {
    id: 'dev-005',
    name: 'Smart Environmental Sensor Matrix',
    type: 'Smart Sensor',
    ipAddress: '192.168.1.140',
    macAddress: '24:0A:C4:DE:99:3B',
    location: 'Warehouse Perimeter',
    connectionStatus: 'online',
    securityStatus: 'secure',
    riskScore: 12,
    lastActivity: '15s ago',
    firmwareVersion: 'v1.9.0-IoT',
    protocol: 'MQTT over TLS (Port 8883)',
    openPorts: [8883],
    bandwidthUsageKbps: 18,
    packetsPerSec: 8,
    vendor: 'Bosch IoT Sense',
    riskFactors: [
      'Payload hash verified via HMAC-SHA256',
      'Strict rate limiting active'
    ]
  },
  {
    id: 'dev-006',
    name: 'Smart Display & Conference TV',
    type: 'Smart TV',
    ipAddress: '192.168.1.155',
    macAddress: '70:2C:1F:33:AA:89',
    location: 'Executive Boardroom',
    connectionStatus: 'online',
    securityStatus: 'suspicious',
    riskScore: 54,
    lastActivity: '1m ago',
    firmwareVersion: 'v1.4.3',
    protocol: 'mDNS / DLNA / HTTP (Port 5353, 8008)',
    openPorts: [8008, 8080, 5353],
    bandwidthUsageKbps: 3200,
    packetsPerSec: 420,
    vendor: 'Samsung DisplayOS',
    riskFactors: [
      'Unusual outbound DNS requests to unverified domains',
      'Port 8008 UPnP broadcasting unauthenticated commands',
      'Non-standard background telemetry streaming'
    ]
  },
  {
    id: 'dev-007',
    name: 'Smart Medical Infusion Pump 04',
    type: 'Medical Device',
    ipAddress: '192.168.1.180',
    macAddress: '00:50:56:C0:00:08',
    location: 'Emergency Medical Bay 3',
    connectionStatus: 'online',
    securityStatus: 'secure',
    riskScore: 15,
    lastActivity: 'Just now',
    firmwareVersion: 'v6.1.1-MedCert',
    protocol: 'HL7 / TLS (Port 2575)',
    openPorts: [2575],
    bandwidthUsageKbps: 80,
    packetsPerSec: 35,
    vendor: 'Baxter MedSecure',
    riskFactors: [
      'Isolated VLAN subnet with Zero-Trust firewalling',
      'Cryptographic token authentication enforced'
    ]
  },
  {
    id: 'dev-008',
    name: 'SCADA Water Pressure Valve Gateway',
    type: 'Industrial Gateway',
    ipAddress: '192.168.1.200',
    macAddress: '00:80:F4:71:3E:AA',
    location: 'Utility Infrastructure Substation',
    connectionStatus: 'offline',
    securityStatus: 'offline',
    riskScore: 0,
    lastActivity: '4 hours ago',
    firmwareVersion: 'v2.0.0-Legacy',
    protocol: 'Modbus TCP (Port 502)',
    openPorts: [502],
    bandwidthUsageKbps: 0,
    packetsPerSec: 0,
    vendor: 'Schneider Electric SCADA',
    riskFactors: [
      'Device currently powered down for maintenance'
    ]
  }
];

export const INITIAL_THREATS: ThreatDetection[] = [
  {
    id: 'THR-8891',
    timestamp: '2026-08-24 13:35:10',
    deviceId: 'dev-001',
    deviceName: 'Smart Camera - Front Entrance',
    ipAddress: '192.168.1.104',
    trafficBehavior: 'Massive SYN flood packet burst (94.2k pps) targeting external C2',
    detectedAttack: 'DDoS SYN Flood',
    confidenceScore: 98.8,
    riskLevel: 'critical',
    actionTaken: 'Traffic Rate-Limited & IP 185.220.101.5 Blocked',
    mitigated: true,
    rawPayloadSnippet: 'SYN 0x4f81 Seq=1049281 Win=512 Len=0 [Flood Pattern Match ID: 994]',
    mitreCode: 'T1498.001 - Direct Network Flood'
  },
  {
    id: 'THR-8890',
    timestamp: '2026-08-24 13:31:45',
    deviceId: 'dev-001',
    deviceName: 'Smart Camera - Front Entrance',
    ipAddress: '192.168.1.104',
    trafficBehavior: 'Rapid dictionary brute-force on exposed Telnet port 23 (45 req/sec)',
    detectedAttack: 'SSH/Telnet Brute Force',
    confidenceScore: 99.4,
    riskLevel: 'critical',
    actionTaken: 'Port 23 Dynamically Closed by Auto-Firewall',
    mitigated: true,
    rawPayloadSnippet: 'TELNET IAC WILL ECHO user: admin pass: root/123456/hikvision',
    mitreCode: 'T1110.001 - Password Guessing'
  },
  {
    id: 'THR-8889',
    timestamp: '2026-08-24 13:24:12',
    deviceId: 'dev-002',
    deviceName: 'Smart Door Lock - Main Server Room',
    ipAddress: '192.168.1.112',
    trafficBehavior: 'Repeated unauthorized publish requests on /door/lock/override topic',
    detectedAttack: 'MQTT Injection',
    confidenceScore: 94.2,
    riskLevel: 'high',
    actionTaken: 'Client ID [attacker-anon-99] Quarantined',
    mitigated: false,
    rawPayloadSnippet: 'MQTT PUBLISH topic="/door/lock/override" qos=0 payload={"force_unlock": true}',
    mitreCode: 'T1078.003 - Valid Accounts / Insecure Protocol'
  },
  {
    id: 'THR-8888',
    timestamp: '2026-08-24 13:10:05',
    deviceId: 'dev-006',
    deviceName: 'Smart Display & Conference TV',
    ipAddress: '192.168.1.155',
    trafficBehavior: 'Continuous sequential TCP SYN probes across ports 1-1024',
    detectedAttack: 'Port Scanning (Nmap)',
    confidenceScore: 97.5,
    riskLevel: 'medium',
    actionTaken: 'Source IP 104.244.76.12 Temporarily Blacklisted',
    mitigated: true,
    rawPayloadSnippet: 'TCP Port scan sweep detected: 80->443->8080->22->21->23',
    mitreCode: 'T1046 - Network Service Discovery'
  },
  {
    id: 'THR-8887',
    timestamp: '2026-08-24 12:48:30',
    deviceId: 'dev-006',
    deviceName: 'Smart Display & Conference TV',
    ipAddress: '192.168.1.155',
    trafficBehavior: 'Encoded base64 data chunks in high-frequency TXT DNS queries',
    detectedAttack: 'Data Exfiltration via DNS',
    confidenceScore: 91.8,
    riskLevel: 'high',
    actionTaken: 'DNS Tunneling Domain sinkholed',
    mitigated: true,
    rawPayloadSnippet: 'DNS QNAME: exfil-payload-chunk-9.c2-darknet.xyz IN TXT',
    mitreCode: 'T1048.003 - Exfiltration Over Alternative Protocol'
  },
  {
    id: 'THR-8886',
    timestamp: '2026-08-24 12:15:22',
    deviceId: 'dev-001',
    deviceName: 'Smart Camera - Front Entrance',
    ipAddress: '192.168.1.104',
    trafficBehavior: 'Synchronous command & control heartbeat matching Mirai Botnet signature',
    detectedAttack: 'Botnet Activity (Mirai)',
    confidenceScore: 98.1,
    riskLevel: 'critical',
    actionTaken: 'Device Network Isolation Triggered',
    mitigated: true,
    rawPayloadSnippet: 'TCP 0x6e69676761 (Mirai Botnet C2 handshake ACK)',
    mitreCode: 'T1071.001 - Application Layer Protocol'
  }
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-1092',
    severity: 'critical',
    attackType: 'DDoS SYN Flood',
    deviceId: 'dev-001',
    deviceName: 'Smart Camera - Front Entrance',
    sourceIp: '185.220.101.5 (Tor Exit Node / RU)',
    destinationIp: '192.168.1.104:554',
    timestamp: '2026-08-24 13:35:10',
    description: 'High-volume distributed SYN flood detected exceeding normal baseline by 850%. Potential IoT botnet weaponization.',
    aiConfidence: 98.8,
    recommendedAction: 'Enforce immediate MAC/IP network isolation and activate SYN cookies on Gateway Router.',
    mitreTechnique: 'T1498.001 - Network Denial of Service',
    status: 'active'
  },
  {
    id: 'ALT-1091',
    severity: 'critical',
    attackType: 'SSH/Telnet Brute Force',
    deviceId: 'dev-001',
    deviceName: 'Smart Camera - Front Entrance',
    sourceIp: '45.142.214.78 (Hosting Provider / NL)',
    destinationIp: '192.168.1.104:23',
    timestamp: '2026-08-24 13:31:45',
    description: 'Automated credential dictionary attack detected on raw Telnet daemon using common default IoT credentials.',
    aiConfidence: 99.4,
    recommendedAction: 'Permanently disable Telnet protocol and require key-based SSH authentication.',
    mitreTechnique: 'T1110.001 - Brute Force',
    status: 'mitigated'
  },
  {
    id: 'ALT-1090',
    severity: 'high',
    attackType: 'MQTT Injection',
    deviceId: 'dev-002',
    deviceName: 'Smart Door Lock - Main Server Room',
    sourceIp: '192.168.1.199 (Rogue Internal IP)',
    destinationIp: '192.168.1.112:1883',
    timestamp: '2026-08-24 13:24:12',
    description: 'Unauthenticated MQTT packet injection attempting to force actuator unlock state on physical access point.',
    aiConfidence: 94.2,
    recommendedAction: 'Enable MQTT TLS/mTLS mutual certificate authentication and revoke anonymous write ACLs.',
    mitreTechnique: 'T1078.003 - Insecure Default Authentication',
    status: 'active'
  },
  {
    id: 'ALT-1089',
    severity: 'high',
    attackType: 'Data Exfiltration via DNS',
    deviceId: 'dev-006',
    deviceName: 'Smart Display & Conference TV',
    sourceIp: '192.168.1.155',
    destinationIp: '8.8.8.8:53 (Tunnel to c2-darknet.xyz)',
    timestamp: '2026-08-24 12:48:30',
    description: 'Base64 encoded conference room audio buffer packet stream detected inside DNS TXT request tunneling.',
    aiConfidence: 91.8,
    recommendedAction: 'Sinkhole resolving domain and isolate Smart Display VLAN segment.',
    mitreTechnique: 'T1048.003 - Exfiltration Over Alternative Protocol',
    status: 'mitigated'
  },
  {
    id: 'ALT-1088',
    severity: 'medium',
    attackType: 'Port Scanning (Nmap)',
    deviceId: 'dev-006',
    deviceName: 'Smart Display & Conference TV',
    sourceIp: '104.244.76.12 (External Scanner)',
    destinationIp: '192.168.1.155:1-1024',
    timestamp: '2026-08-24 13:10:05',
    description: 'Stealth FIN/NULL scan reconnaissance detected assessing open broadcast ports.',
    aiConfidence: 97.5,
    recommendedAction: 'Apply stateful firewall rule to drop unsolicited TCP probe packets.',
    mitreTechnique: 'T1046 - Network Service Scanning',
    status: 'acknowledged'
  }
];

export const INITIAL_RULES: FirewallRule[] = [
  {
    id: 'FW-RULE-001',
    ruleCode: 'RULE_BLOCK_BOTNET_C2',
    targetIp: '185.220.101.5/32',
    port: 'ALL',
    protocol: 'TCP',
    action: 'BLOCK',
    reason: 'Active DDoS SYN Flood source and known Tor exit malicious relay',
    status: 'active',
    hits: 14280,
    createdAt: '2026-08-24 13:35:12',
    autoCreated: true
  },
  {
    id: 'FW-RULE-002',
    ruleCode: 'RULE_DISABLE_INSECURE_TELNET',
    targetIp: '192.168.1.104/32',
    port: '23',
    protocol: 'TCP',
    action: 'DROP',
    reason: 'Prohibit unencrypted Telnet access to Smart Camera after brute-force detection',
    status: 'active',
    hits: 840,
    createdAt: '2026-08-24 13:31:50',
    autoCreated: true
  },
  {
    id: 'FW-RULE-003',
    ruleCode: 'RULE_ISOLATE_ROGUE_MQTT',
    targetIp: '192.168.1.199/32',
    port: '1883,8883',
    protocol: 'MQTT',
    action: 'ISOLATE',
    reason: 'Rogue internal node attempting MQTT topic hijacking on Server Room Door Lock',
    status: 'active',
    hits: 125,
    createdAt: '2026-08-24 13:24:18',
    autoCreated: true
  },
  {
    id: 'FW-RULE-004',
    ruleCode: 'RULE_SINKHOLE_DNS_EXFIL',
    targetIp: '198.51.100.44/32',
    port: '53',
    protocol: 'UDP',
    action: 'DROP',
    reason: 'Block DNS tunneling domain c2-darknet.xyz exfiltration channel',
    status: 'active',
    hits: 310,
    createdAt: '2026-08-24 12:48:35',
    autoCreated: false
  },
  {
    id: 'FW-RULE-005',
    ruleCode: 'RULE_RATE_LIMIT_ICMP',
    targetIp: '0.0.0.0/0',
    port: 'ICMP',
    protocol: 'ICMP',
    action: 'RATE_LIMIT',
    reason: 'Cap ICMP echo requests to 5 packets/sec per IoT device subnet',
    status: 'active',
    hits: 5920,
    createdAt: '2026-08-24 08:00:00',
    autoCreated: false
  }
];

export const INITIAL_SUSPICIOUS_CONNECTIONS: SuspiciousConnection[] = [
  {
    id: 'conn-01',
    sourceIp: '185.220.101.5',
    country: 'Netherlands (Tor Exit)',
    targetDeviceId: 'dev-001',
    targetDeviceName: 'Smart Camera - Front Entrance',
    targetPort: 554,
    protocol: 'TCP SYN',
    packetsCount: 48920,
    threatCategory: 'DDoS / Botnet Weaponization',
    reputationScore: 96,
    status: 'blocked'
  },
  {
    id: 'conn-02',
    sourceIp: '45.142.214.78',
    country: 'Russia',
    targetDeviceId: 'dev-001',
    targetDeviceName: 'Smart Camera - Front Entrance',
    targetPort: 23,
    protocol: 'Telnet',
    packetsCount: 1420,
    threatCategory: 'Credential Brute-Force',
    reputationScore: 92,
    status: 'blocked'
  },
  {
    id: 'conn-03',
    sourceIp: '192.168.1.199',
    country: 'Internal Subnet (Rogue Node)',
    targetDeviceId: 'dev-002',
    targetDeviceName: 'Smart Door Lock',
    targetPort: 1883,
    protocol: 'MQTT',
    packetsCount: 380,
    threatCategory: 'Unauthorized Actuator Override',
    reputationScore: 84,
    status: 'inspecting'
  },
  {
    id: 'conn-04',
    sourceIp: '104.244.76.12',
    country: 'United States',
    targetDeviceId: 'dev-006',
    targetDeviceName: 'Smart Display & Conference TV',
    targetPort: 8008,
    protocol: 'TCP FIN/SYN',
    packetsCount: 950,
    threatCategory: 'Port Reconnaissance (Nmap)',
    reputationScore: 78,
    status: 'blocked'
  },
  {
    id: 'conn-05',
    sourceIp: '194.135.24.11',
    country: 'Germany',
    targetDeviceId: 'dev-004',
    targetDeviceName: 'Smart HVAC Thermostat',
    targetPort: 5683,
    protocol: 'CoAP UDP',
    packetsCount: 45,
    threatCategory: 'Unusual Geographical Request',
    reputationScore: 52,
    status: 'inspecting'
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-ddos',
    name: 'Distributed Denial of Service (SYN Flood)',
    attackType: 'DDoS SYN Flood',
    targetDeviceId: 'dev-001',
    description: 'Floods the target IoT camera with 150,000 spoofed TCP SYN packets/sec to exhaust memory and cause buffer overflow.',
    complexity: 'Severe',
    estimatedDurationSec: 12,
    mitreId: 'T1498.001',
    steps: [
      'Generating 5,000 spoofed botnet source IPs across global subnets',
      'Injecting high-frequency TCP SYN packet storm to port 554/80',
      'AI Detection Engine monitors entropy and half-open connection spikes',
      'Machine Learning Anomaly Classifier predicts DDoS signature with 99.1% confidence',
      'Automated Security Alert dispatched to SOC Incident Queue',
      'Firewall Engine trips adaptive SYN-proxy & automatically drops attacking IPs'
    ]
  },
  {
    id: 'sim-bruteforce',
    name: 'SSH & Telnet Credential Brute-Force',
    attackType: 'SSH/Telnet Brute Force',
    targetDeviceId: 'dev-001',
    description: 'Executes rapid automated password dictionary spray using common default IoT credentials (admin/12345, root/root, default).',
    complexity: 'High',
    estimatedDurationSec: 10,
    mitreId: 'T1110.001',
    steps: [
      'Establishing persistent raw socket connections to Telnet port 23',
      'Injecting 60 credentials/sec from Mirai & IoT default password wordlist',
      'AI Login Behavior Model flags excessive auth failure velocity (Z-Score > 4.8)',
      'Threat identified as "Credential Guessing & Account Enumeration"',
      'Auto-Prevention closes Telnet daemon and isolates target IP address',
      'Risk score updated and incident logged with full packet captures'
    ]
  },
  {
    id: 'sim-portscan',
    name: 'Nmap Stealth SYN & Service Sweep',
    attackType: 'Port Scanning (Nmap)',
    targetDeviceId: 'dev-003',
    description: 'Runs an automated TCP SYN and ACK port scan across all 65,535 ports to map vulnerable open daemons and firmware versions.',
    complexity: 'Medium',
    estimatedDurationSec: 8,
    mitreId: 'T1046',
    steps: [
      'Crafting half-open SYN packets across sequential & randomized IoT ports',
      'Analyzing ICMP port-unreachable and TCP RST response patterns',
      'AI Flow Inspector detects horizontal port scanning signature (Confidence: 97.4%)',
      'Alert categorized as Reconnaissance / Service Discovery',
      'Dynamic blackholing applied to scanning IP subnet'
    ]
  },
  {
    id: 'sim-botnet',
    name: 'Mirai Botnet C2 Infection & Beaconing',
    attackType: 'Botnet Activity (Mirai)',
    targetDeviceId: 'dev-001',
    description: 'Simulates compromised IoT firmware executing a command & control heartbeat beacon and waiting for remote attack instructions.',
    complexity: 'Severe',
    estimatedDurationSec: 14,
    mitreId: 'T1071.001',
    steps: [
      'Injecting simulated payload into IoT process memory table',
      'Initiating periodic heartbeat beacons to external malicious C2 server',
      'AI Deep Packet Inspection flags known Mirai magic byte header (0x6e69676761)',
      'Risk score spikes to Critical (95/100)',
      'Automated Zero-Trust Isolation cuts device from internal IoT VLAN',
      'Emergency SOC alert triggered with forensic memory snapshot'
    ]
  },
  {
    id: 'sim-exfil',
    name: 'Stealth Data Exfiltration via DNS Tunneling',
    attackType: 'Data Exfiltration via DNS',
    targetDeviceId: 'dev-006',
    description: 'Chunks sensitive IoT sensor configuration and room data into base64 strings embedded inside legitimate DNS TXT queries.',
    complexity: 'High',
    estimatedDurationSec: 11,
    mitreId: 'T1048.003',
    steps: [
      'Encoding device telemetry into nested DNS subdomains',
      'Transmitting anomalous high-entropy DNS queries to external authoritative server',
      'AI Shannon Entropy Analyzer detects non-standard domain character randomness',
      'Classifier flags covert channel exfiltration with 92.6% confidence',
      'Gateway DNS sinkhole rule applied to drop malicious domain lookups'
    ]
  }
];

export const INITIAL_AI_METRICS: AIModelMetrics = {
  accuracy: 98.9,
  precision: 98.4,
  recall: 99.2,
  f1Score: 98.8,
  rocAuc: 0.995,
  totalPredictions: 148290,
  threatDetectionRate: 99.4,
  falsePositiveRate: 0.38,
  confusionMatrix: {
    truePositive: 14210,
    falsePositive: 54,
    trueNegative: 133980,
    falseNegative: 46
  }
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Critical Threat Blocked',
    message: 'AI Engine successfully blocked DDoS SYN flood targeting Smart Camera (192.168.1.104).',
    type: 'critical',
    timestamp: '2m ago',
    read: false,
    linkTab: 'threats'
  },
  {
    id: 'notif-02',
    title: 'Suspicious Device Identified',
    message: 'Smart Door Lock (192.168.1.112) received unauthorized MQTT payload injections.',
    type: 'warning',
    timestamp: '14m ago',
    read: false,
    linkTab: 'devices'
  },
  {
    id: 'notif-03',
    title: 'Firewall Rule Activated',
    message: 'New automated rule RULE_BLOCK_BOTNET_C2 deployed to block 185.220.101.5.',
    type: 'success',
    timestamp: '25m ago',
    read: true,
    linkTab: 'prevention'
  },
  {
    id: 'notif-04',
    title: 'New IoT Device Connected',
    message: 'Smart Medical Infusion Pump 04 authenticated onto VLAN 3 with Zero-Trust compliance.',
    type: 'info',
    timestamp: '1h ago',
    read: true,
    linkTab: 'devices'
  }
];
