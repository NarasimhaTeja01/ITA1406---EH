import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Cpu,
  KeyRound,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  X,
  Radio,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { login } = useSecurity();

  const [email, setEmail] = useState('admin@soc.corp');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide both authorized username/email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      setIsLoading(false);
      if (!ok) {
        setErrorMsg('Invalid SOC credentials. Use admin@soc.corp / admin123');
      }
    }, 800);
  };

  const handleQuickFill = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden cyber-grid-bg">
      {/* Background Decorative Cyber Rings & Glow */}
      <div className="absolute inset-0 cyber-radar-grid pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle Radar sweep circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/10 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/10" />
        </div>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0A0F1E] border border-[#1E293B] rounded-xl shadow-2xl p-6 sm:p-8 relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#10172A] border border-[#1E293B] p-0.5 shadow-md mb-3">
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
            IoT Security Operations Center
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Autonomous AI Anomaly Detection & Prevention
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase font-mono tracking-wider">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Capstone Defense Portal</span>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Analyst Identifier / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@soc.corp"
                className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Access Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#10172A] border border-[#1E293B] rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#1E293B] bg-[#10172A] text-cyan-500 focus:ring-cyan-500"
              />
              <span>Remember station</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Reset credentials?
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>AUTHENTICATE TO SOC</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins for evaluators */}
        <div className="mt-6 pt-5 border-t border-[#1E293B]">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest text-center mb-2.5">
            Evaluator Quick Access Presets
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@soc.corp', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-[#10172A] hover:bg-slate-800 border border-[#1E293B] text-[10px] text-cyan-400 text-left font-mono transition-colors"
            >
              👑 SOC Lead Analyst
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ethical.hacker@iot.lab', 'capstone2026')}
              className="px-2.5 py-1.5 rounded-lg bg-[#10172A] hover:bg-slate-800 border border-[#1E293B] text-[10px] text-purple-400 text-left font-mono transition-colors"
            >
              🛡️ Ethical Pentester
            </button>
          </div>
        </div>

        {/* System security verification note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
          <Wifi className="w-3 h-3 text-emerald-500" />
          <span>Zero-Trust 256-Bit TLS Ingress Secured</span>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Credential Reset Protocol</span>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {resetSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Security reset token dispatched to your station inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter your registered SOC identification email to receive a dynamic HMAC credential challenge.
                  </p>
                  <div>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@soc.corp"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
                  >
                    DISPATCH RESET CHALLENGE
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
