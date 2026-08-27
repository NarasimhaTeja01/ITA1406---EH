import React, { useState, useMemo } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { IoTDevice, DeviceType, ConnectionStatus, SecurityStatus } from '../../types';
import {
  Wifi,
  Plus,
  Trash2,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Grid,
  List,
  CheckCircle,
  X,
  Activity,
  Cpu,
  Layers,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DevicesView: React.FC = () => {
  const {
    devices,
    addDevice,
    removeDevice,
    scanDevice,
    isolateDevice,
    reconnectDevice,
    patchDeviceVulnerabilities,
    setCurrentTab,
    searchTerm,
    setSearchTerm
  } = useSecurity();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [statusFilter, setStatusFilter] = useState<'all' | 'secure' | 'suspicious' | 'critical' | 'isolated' | 'offline'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [isScanning, setIsScanning] = useState<string | null>(null);

  // New device form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<DeviceType>('Smart Camera');
  const [newIp, setNewIp] = useState('192.168.1.160');
  const [newMac, setNewMac] = useState('00:2B:67:88:99:A1');
  const [newLocation, setNewLocation] = useState('Server Room B');
  const [newProtocol, setNewProtocol] = useState('HTTPS / MQTT (Port 443, 8883)');
  const [newVendor, setNewVendor] = useState('SecureLink IoT');
  const [newFirmware, setNewFirmware] = useState('v1.0.0-Prod');

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return devices.filter(dev => {
      // search filter
      const matchesSearch =
        searchTerm === '' ||
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.ipAddress.includes(searchTerm) ||
        dev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.macAddress.toLowerCase().includes(searchTerm.toLowerCase());

      // status filter
      let matchesStatus = true;
      if (statusFilter === 'secure') matchesStatus = dev.securityStatus === 'secure';
      else if (statusFilter === 'suspicious') matchesStatus = dev.securityStatus === 'suspicious';
      else if (statusFilter === 'critical') matchesStatus = dev.securityStatus === 'critical';
      else if (statusFilter === 'isolated') matchesStatus = dev.connectionStatus === 'isolated' || dev.isIsolated === true;
      else if (statusFilter === 'offline') matchesStatus = dev.connectionStatus === 'offline';

      // type filter
      const matchesType = typeFilter === 'all' || dev.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, searchTerm, statusFilter, typeFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newIp) return;

    addDevice({
      name: newName,
      type: newType,
      ipAddress: newIp,
      macAddress: newMac || '00:00:00:00:00:00',
      location: newLocation || 'Headquarters',
      connectionStatus: 'online',
      securityStatus: 'secure',
      firmwareVersion: newFirmware || 'v1.0.0',
      protocol: newProtocol || 'MQTT / TLS',
      openPorts: [80, 443],
      bandwidthUsageKbps: 150,
      packetsPerSec: 25,
      vendor: newVendor || 'Generic IoT Manufacturer',
      riskFactors: ['Newly enrolled device baseline']
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewIp(`192.168.1.${Math.floor(160 + Math.random() * 80)}`);
  };

  const handleTriggerScan = async (deviceId: string) => {
    setIsScanning(deviceId);
    await scanDevice(deviceId);
    setIsScanning(null);
  };

  const getStatusBadge = (dev: IoTDevice) => {
    if (dev.connectionStatus === 'isolated' || dev.isIsolated) {
      return (
        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase font-mono flex items-center gap-1">
          <Lock className="w-3 h-3 text-purple-400" />
          <span>ISOLATED</span>
        </span>
      );
    }
    if (dev.connectionStatus === 'offline') {
      return (
        <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase font-mono">
          OFFLINE
        </span>
      );
    }
    if (dev.connectionStatus === 'scanning') {
      return (
        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase font-mono animate-pulse flex items-center gap-1">
          <Scan className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>SCANNING</span>
        </span>
      );
    }
    if (dev.securityStatus === 'critical') {
      return (
        <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>CRITICAL</span>
        </span>
      );
    }
    if (dev.securityStatus === 'suspicious') {
      return (
        <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>SUSPECT</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase font-mono flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span>SECURE</span>
      </span>
    );
  };

  const getRiskScoreBadge = (score: number) => {
    let barColor = 'bg-green-500';
    let textColor = 'text-green-400';
    if (score > 80) {
      barColor = 'bg-red-500';
      textColor = 'text-red-400';
    } else if (score > 60) {
      barColor = 'bg-orange-500';
      textColor = 'text-orange-400';
    } else if (score > 30) {
      barColor = 'bg-yellow-500';
      textColor = 'text-yellow-400';
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
        </div>
        <span className={`text-[10px] font-mono font-bold ${textColor}`}>{score}</span>
      </div>
    );
  };

  return (
    <div id="iot-device-management-view" className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <span>IoT Fleet Device Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {devices.length} Connected Assets • Zero-Trust Segmentation • Active Port & Vulnerability Auditing
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            id="btn-add-iot-device"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add IoT Device</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-xl bg-[#10172A] border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, IP, MAC, location..."
              className="w-full bg-[#0A0F1E] border border-[#1E293B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-xs">
            {(['all', 'secure', 'suspicious', 'critical', 'isolated', 'offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[10px] font-bold tracking-wider transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher (Table vs Grid Cards) */}
        <div className="flex items-center gap-1 bg-[#0A0F1E] p-1 rounded-lg border border-[#1E293B]">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-[#10172A] text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-[#10172A] text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Grid Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Device Presentation */}
      {viewMode === 'table' ? (
        <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#10172A] text-[9px] uppercase font-bold tracking-widest text-slate-400 border-b border-[#1E293B]">
                <tr>
                  <th className="py-3.5 px-4">Device Identity</th>
                  <th className="py-3.5 px-4">IP / MAC Address</th>
                  <th className="py-3.5 px-4">Type & Protocol</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Security Status</th>
                  <th className="py-3.5 px-4">AI Risk Score</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] font-sans">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                      No IoT devices matching current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((dev) => (
                    <tr
                      key={dev.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#10172A] border border-[#1E293B] text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                            <Wifi className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{dev.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{dev.vendor} • ID: {dev.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <p className="text-slate-200 font-semibold">{dev.ipAddress}</p>
                        <p className="text-[10px] text-slate-500">{dev.macAddress}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-200">{dev.type}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{dev.protocol}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {dev.location}
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(dev)}
                      </td>

                      <td className="py-3.5 px-4">
                        {getRiskScoreBadge(dev.riskScore)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDevice(dev)}
                            className="p-1.5 rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-[#1E293B] transition-colors"
                            title="View Deep Inspection Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTriggerScan(dev.id)}
                            disabled={isScanning === dev.id}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors disabled:opacity-50"
                            title="Run AI Vulnerability Scan"
                          >
                            <Scan className={`w-3.5 h-3.5 ${isScanning === dev.id ? 'animate-spin text-cyan-400' : ''}`} />
                          </button>

                          {dev.isIsolated || dev.connectionStatus === 'isolated' ? (
                            <button
                              onClick={() => reconnectDevice(dev.id)}
                              className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/30 transition-colors"
                              title="Reconnect & Unquarantine Device"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => isolateDevice(dev.id)}
                              className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-colors"
                              title="Isolate / Quarantine Device"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => removeDevice(dev.id)}
                            className="p-1.5 rounded-lg bg-[#10172A] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#1E293B] transition-colors"
                            title="Decommission Device"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((dev) => (
            <motion.div
              key={dev.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-between transition-all ${
                dev.securityStatus === 'critical'
                  ? 'glass-panel-danger'
                  : dev.securityStatus === 'suspicious'
                  ? 'glass-panel border-amber-500/30'
                  : 'glass-panel'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{dev.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{dev.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(dev)}
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">IP:</span>
                    <span className="text-slate-200 font-semibold">{dev.ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-300 truncate max-w-[140px]">{dev.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Risk Score:</span>
                    {getRiskScoreBadge(dev.riskScore)}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Bandwidth:</span>
                    <span className="text-cyan-300">{dev.bandwidthUsageKbps} kbps</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDevice(dev)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors text-center"
                >
                  Deep Inspect
                </button>

                <button
                  onClick={() => handleTriggerScan(dev.id)}
                  disabled={isScanning === dev.id}
                  className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900"
                  title="Scan"
                >
                  <Scan className={`w-4 h-4 ${isScanning === dev.id ? 'animate-spin' : ''}`} />
                </button>

                {dev.isIsolated || dev.connectionStatus === 'isolated' ? (
                  <button
                    onClick={() => reconnectDevice(dev.id)}
                    className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                    title="Reconnect"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => isolateDevice(dev.id)}
                    className="p-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900"
                    title="Isolate"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Device Details / Deep Dive Inspection Modal */}
      <AnimatePresence>
        {selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedDevice.name}</h3>
                      {getStatusBadge(selectedDevice)}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedDevice.vendor} • ID: {selectedDevice.id} • MAC: {selectedDevice.macAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDevice(null)}
                  className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Telemetry & Spec Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">IP Address</p>
                  <p className="text-xs font-bold text-slate-100 font-mono mt-0.5">{selectedDevice.ipAddress}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Firmware</p>
                  <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5 truncate">{selectedDevice.firmwareVersion}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Protocol</p>
                  <p className="text-xs font-bold text-slate-200 font-mono mt-0.5 truncate">{selectedDevice.protocol}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Risk Index</p>
                  <p className="text-xs font-bold text-amber-400 font-mono mt-0.5">{selectedDevice.riskScore} / 100</p>
                </div>
              </div>

              {/* Open Ports & Vulnerability Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Daemon Ports Audited</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDevice.openPorts.map((port) => (
                    <span
                      key={port}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                        port === 23 || port === 554 || port === 8008
                          ? 'bg-red-950/80 text-red-300 border-red-500/50'
                          : 'bg-slate-900 text-cyan-300 border-slate-700'
                      }`}
                    >
                      Port {port} {port === 23 ? '(Telnet - High Risk)' : port === 554 ? '(RTSP Stream)' : port === 1883 ? '(MQTT)' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Risk Factors Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Security Posture & Risk Factors</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedDevice.riskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                {selectedDevice.riskScore > 30 && (
                  <button
                    onClick={() => {
                      patchDeviceVulnerabilities(selectedDevice.id);
                      setSelectedDevice(prev => prev ? {
                        ...prev,
                        riskScore: 12,
                        securityStatus: 'secure',
                        firmwareVersion: 'v5.0.1-Hardened (Latest)',
                        openPorts: prev.openPorts.filter(p => p !== 23 && p !== 8008),
                        riskFactors: ['Patched and verified by SOC team']
                      } : null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Apply Security Patch & Close Port 23</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => {
                      handleTriggerScan(selectedDevice.id);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Rescan Diagnostics</span>
                  </button>

                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New IoT Device Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                  <span>Provision & Enroll New IoT Asset</span>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Device Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Smart Biometric Lock - R&D Wing"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Device Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as DeviceType)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Smart Camera">Smart Camera</option>
                      <option value="Smart Door Lock">Smart Door Lock</option>
                      <option value="Smart Thermostat">Smart Thermostat</option>
                      <option value="Smart Router">Smart Router</option>
                      <option value="Smart Sensor">Smart Sensor</option>
                      <option value="Smart TV">Smart TV</option>
                      <option value="Medical Device">Medical Device</option>
                      <option value="Industrial Gateway">Industrial Gateway</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">IP Address</label>
                    <input
                      type="text"
                      required
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      placeholder="192.168.1.160"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">MAC Address</label>
                    <input
                      type="text"
                      value={newMac}
                      onChange={(e) => setNewMac(e.target.value)}
                      placeholder="00:2B:67:88:99:A1"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Physical Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Lab Cleanroom B"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Protocol</label>
                    <input
                      type="text"
                      value={newProtocol}
                      onChange={(e) => setNewProtocol(e.target.value)}
                      placeholder="MQTT / TLS (Port 8883)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 font-mono uppercase">Manufacturer Vendor</label>
                    <input
                      type="text"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      placeholder="SecureLink IoT"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950"
                  >
                    Enroll Asset to SOC
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
