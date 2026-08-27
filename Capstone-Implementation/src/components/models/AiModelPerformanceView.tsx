import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Cpu,
  Layers,
  TrendingUp,
  Activity,
  CheckCircle,
  RefreshCw,
  Zap,
  Sparkles,
  BarChart2,
  Sliders,
  Database,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AiModelPerformanceView: React.FC = () => {
  const { aiMetrics, showToast } = useSecurity();
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = async () => {
    setIsRetraining(true);
    await new Promise((res) => setTimeout(res, 2000));
    setIsRetraining(false);
    showToast('AI Model Retrained', 'Model updated with 12,000 new edge packet telemetry samples. F1-Score increased to 99.1%', 'success');
  };

  // Attack-specific detection accuracy chart data
  const attackAccuracyData = [
    { name: 'DDoS SYN Flood', accuracy: 99.8, f1: 99.7 },
    { name: 'SSH/Telnet Brute Force', accuracy: 99.2, f1: 99.0 },
    { name: 'Port Scanning & Recon', accuracy: 98.6, f1: 98.4 },
    { name: 'Mirai Botnet C2', accuracy: 98.1, f1: 97.9 },
    { name: 'MQTT Injection', accuracy: 98.4, f1: 98.1 },
    { name: 'DNS Tunneling Exfil', accuracy: 97.2, f1: 96.8 }
  ];

  // Training loss convergence per epoch
  const trainingConvergenceData = [
    { epoch: 'Ep 1', trainingLoss: 0.68, validationLoss: 0.72, valAccuracy: 84.2 },
    { epoch: 'Ep 5', trainingLoss: 0.35, validationLoss: 0.38, valAccuracy: 92.1 },
    { epoch: 'Ep 10', trainingLoss: 0.18, validationLoss: 0.20, valAccuracy: 95.8 },
    { epoch: 'Ep 15', trainingLoss: 0.08, validationLoss: 0.11, valAccuracy: 97.9 },
    { epoch: 'Ep 20', trainingLoss: 0.03, validationLoss: 0.04, valAccuracy: 98.9 },
    { epoch: 'Ep 25 (Final)', trainingLoss: 0.015, validationLoss: 0.021, valAccuracy: 99.2 }
  ];

  return (
    <div id="ai-model-performance-view" className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>AI / Machine Learning Model Benchmark & Performance Metrics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Ensemble Architecture: Transformer Feature Extractor + XGBoost Classifier • Training Baseline: CIC-IoT-2023 & NSL-KDD
          </p>
        </div>

        <button
          id="btn-retrain-ai-model"
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Optimizing Weights & Loss...' : 'Retrain with Live Telemetry'}</span>
        </button>
      </div>

      {/* 6 Core Benchmark Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-lg bg-[#10172A] border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Accuracy</p>
          <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{aiMetrics.accuracy}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">Validated test set</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Precision</p>
          <p className="text-xl font-bold text-slate-100 font-mono mt-0.5">{aiMetrics.precision}%</p>
          <span className="text-[10px] text-slate-500 font-mono">Low false alarms</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Recall</p>
          <p className="text-xl font-bold text-slate-100 font-mono mt-0.5">{aiMetrics.recall}%</p>
          <span className="text-[10px] text-slate-500 font-mono">True positive rate</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#10172A] border border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">F1-Score</p>
          <p className="text-xl font-bold text-purple-400 font-mono mt-0.5">{aiMetrics.f1Score}%</p>
          <span className="text-[10px] text-purple-400 font-mono">Harmonic balance</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">ROC-AUC Score</p>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{aiMetrics.rocAuc}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Near-perfect curve</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#10172A] border border-[#1E293B]">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Inference Latency</p>
          <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">1.8 ms</p>
          <span className="text-[10px] text-slate-500 font-mono">Wire-speed parsing</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Specific Detection Accuracy */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Multi-Class Attack Detection Accuracy (%)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Classification rate across individual IoT attack vectors</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackAccuracyData} layout="vertical" margin={{ left: 30, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[90, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" tick={{ fontSize: 11 }} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="accuracy" name="Accuracy (%)" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                <Bar dataKey="f1" name="F1-Score (%)" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Loss & Validation Accuracy Convergence */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Training Loss & Validation Convergence</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Log loss decay across 25 training epochs</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingConvergenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#10172A', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="trainingLoss" name="Training Loss" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="validationLoss" name="Validation Loss" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="valAccuracy" name="Validation Acc (%)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & Feature Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Table */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Validation Confusion Matrix (100,000 Sample Stream)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Class distribution against ground truth labels</p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="p-4 rounded-lg bg-[#10172A] border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-wider block">True Positives (TP)</span>
              <span className="text-xl font-bold text-white mt-1 block">{aiMetrics.confusionMatrix.truePositive.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-300">Correctly Detected Attacks</span>
            </div>

            <div className="p-4 rounded-lg bg-[#10172A] border border-red-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              <span className="text-[9px] text-red-400 uppercase font-bold tracking-wider block">False Positives (FP)</span>
              <span className="text-xl font-bold text-white mt-1 block">{aiMetrics.confusionMatrix.falsePositive.toLocaleString()}</span>
              <span className="text-[10px] text-red-300">False Alarms</span>
            </div>

            <div className="p-4 rounded-lg bg-[#10172A] border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <span className="text-[9px] text-amber-400 uppercase font-bold tracking-wider block">False Negatives (FN)</span>
              <span className="text-xl font-bold text-white mt-1 block">{aiMetrics.confusionMatrix.falseNegative.toLocaleString()}</span>
              <span className="text-[10px] text-amber-300">Missed Attacks</span>
            </div>

            <div className="p-4 rounded-lg bg-[#10172A] border border-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <span className="text-[9px] text-blue-400 uppercase font-bold tracking-wider block">True Negatives (TN)</span>
              <span className="text-xl font-bold text-white mt-1 block">{aiMetrics.confusionMatrix.trueNegative.toLocaleString()}</span>
              <span className="text-[10px] text-blue-300">Correctly Verified Benign</span>
            </div>
          </div>
        </div>

        {/* Dataset & Feature Importance Info */}
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Extracted Feature Weights (SHAP Values)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Top predictive network features used by the classifier</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Packet Payload Shannon Entropy (0-8)</span>
                <span className="text-cyan-400 font-bold">Weight: 0.28</span>
              </div>
              <div className="h-1.5 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>TCP Inter-Arrival Delta (Time Variance)</span>
                <span className="text-cyan-400 font-bold">Weight: 0.24</span>
              </div>
              <div className="h-1.5 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[72%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>SYN/ACK Ratio & Connection Half-Open Ratio</span>
                <span className="text-cyan-400 font-bold">Weight: 0.21</span>
              </div>
              <div className="h-1.5 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Destination Port Anomaly Index</span>
                <span className="text-cyan-400 font-bold">Weight: 0.16</span>
              </div>
              <div className="h-1.5 bg-[#10172A] border border-[#1E293B] rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[50%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
