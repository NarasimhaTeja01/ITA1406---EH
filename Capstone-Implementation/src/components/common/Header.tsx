import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  ShieldCheck,
  ShieldAlert,
  Bell,
  Search,
  Cpu,
  Activity,
  LogOut,
  Sliders,
  Check,
  Trash2,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    user,
    logout,
    searchTerm,
    setSearchTerm,
    stats,
    isSimulating,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    clearNotifications,
    setCurrentTab,
    livePacketRate,
    liveBandwidthMbps
  } = useSecurity();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header id="soc-top-header" className="h-16 border-b border-[#1E293B] bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left section: System status & Live Telemetry metrics */}
      <div className="flex items-center gap-4 lg:gap-8">
        <div>
          <h1 className="text-base lg:text-lg font-semibold text-white tracking-tight">Enterprise SOC Dashboard</h1>
        </div>

        {/* AI & Protection Status indicators */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>AI ENGINE: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>PROTECTION: ACTIVE</span>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-2 text-purple-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>SIMULATION RUNNING</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IoT nodes, threats, alerts, IPs..."
            className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Attack Sim Quick Trigger, Notifications & User */}
      <div className="flex items-center gap-4">
        {/* Quick Simulation Trigger Button */}
        <button
          id="btn-quick-simulation"
          onClick={() => setCurrentTab('simulation')}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Simulate Attack</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-lg bg-[#10172A] border border-[#1E293B] hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A0F1E] border border-[#1E293B] rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-[#1E293B] flex items-center justify-between bg-[#10172A]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Security Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-semibold border border-red-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        title="Mark all as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read all</span>
                      </button>
                    )}
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-red-400 p-1"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#1E293B]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No security notifications at this time.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkTab) {
                            setCurrentTab(notif.linkTab);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 hover:bg-slate-800/30 cursor-pointer transition-colors flex items-start gap-2.5 ${
                          !notif.read ? 'bg-[#10172A]/50' : ''
                        }`}
                      >
                        <span
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            notif.type === 'critical'
                              ? 'bg-red-400 ring-2 ring-red-500/40 animate-ping'
                              : notif.type === 'warning'
                              ? 'bg-amber-400'
                              : notif.type === 'success'
                              ? 'bg-emerald-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-semibold text-slate-200 truncate">{notif.title}</h5>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Session Metadata & Profile */}
        <div className="relative flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Session</p>
            <p className="text-xs font-mono text-cyan-400">192.168.1.104</p>
          </div>

          <button
            id="btn-user-profile-toggle"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full bg-[#10172A] border border-[#1E293B] hover:border-slate-700 transition-all text-left"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 mt-2 w-56 bg-[#0A0F1E] border border-[#1E293B] rounded-xl shadow-2xl z-50 overflow-hidden py-1"
              >
                <div className="px-4 py-2.5 border-b border-[#1E293B] bg-[#10172A]">
                  <p className="text-xs font-bold text-slate-200">{user.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold uppercase border border-cyan-500/30">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 uppercase tracking-wider"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>SOC Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 uppercase tracking-wider"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate Session</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
