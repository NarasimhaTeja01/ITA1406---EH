import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Cpu,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Gauge,
  TerminalSquare,
  FileSpreadsheet,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Shield
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    stats,
    logout,
    isSimulating
  } = useSecurity();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'SOC Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'devices',
      label: 'IoT Devices',
      icon: Wifi,
      badge: stats.totalDevices,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'threats',
      label: 'AI Threat Detection',
      icon: Cpu,
      badge: stats.attacksDetected,
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800'
    },
    {
      id: 'network',
      label: 'Network Monitoring',
      icon: Radio
    },
    {
      id: 'prevention',
      label: 'Attack Prevention',
      icon: ShieldCheck,
      badge: `${stats.activeRules} Rules`,
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800'
    },
    {
      id: 'alerts',
      label: 'Security Alerts',
      icon: ShieldAlert,
      badge: stats.criticalDevices > 0 ? stats.criticalDevices : undefined,
      badgeColor: 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
    },
    {
      id: 'risk_analysis',
      label: 'Device Risk Analysis',
      icon: Gauge
    },
    {
      id: 'simulation',
      label: 'Attack Simulation',
      icon: TerminalSquare,
      badge: isSimulating ? 'ACTIVE' : 'LAB',
      badgeColor: isSimulating ? 'bg-purple-900 text-purple-200 animate-pulse' : 'bg-purple-950 text-purple-400 border border-purple-800'
    },
    {
      id: 'reports',
      label: 'Security Reports',
      icon: FileSpreadsheet
    },

    {
      id: 'settings',
      label: 'SOC Settings',
      icon: Settings
    }
  ];

  return (
    <aside
      id="soc-sidebar"
      className={`h-screen bg-[#0A0F1E] border-r border-[#1E293B] flex flex-col justify-between transition-all duration-300 z-40 sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 border-b border-[#1E293B] flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/30">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-tight text-[#E2E8F0] block truncate">
                  SECURE_IOT v2.0
                </span>
                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500 truncate">
                  SOC DEFENSE SUITE
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md bg-[#10172A] border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden md:block"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="py-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            {!isCollapsed ? 'Operations & Defense' : '•••'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                ) : (
                  <Icon
                    className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-300"
                  />
                )}
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Threat Info & Logout */}
      <div className="p-4 border-t border-[#1E293B] space-y-2 bg-[#0A0F1E]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 bg-red-500/20 text-red-400 rounded-md border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider block truncate">
                {stats.criticalDevices > 0 ? `${stats.criticalDevices} Active Threats` : 'Defense Active'}
              </span>
              <span className="text-[9px] font-mono text-slate-400 block truncate">AI Neural Core v4.2</span>
            </div>
          </div>
        )}

        <button
          id="sidebar-logout-btn"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="uppercase tracking-wider text-[11px]">Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
};
