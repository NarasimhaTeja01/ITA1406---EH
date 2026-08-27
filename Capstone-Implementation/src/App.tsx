import React from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Feature Views
import { DashboardView } from './components/dashboard/DashboardView';
import { DevicesView } from './components/devices/DevicesView';
import { ThreatDetectionView } from './components/threats/ThreatDetectionView';
import { AttackPreventionView } from './components/prevention/AttackPreventionView';
import { NetworkMonitoringView } from './components/network/NetworkMonitoringView';
import { SecurityAlertsView } from './components/alerts/SecurityAlertsView';
import { RiskAnalysisView } from './components/risk/RiskAnalysisView';
import { AttackSimulationView } from './components/simulation/AttackSimulationView';
import { ReportsView } from './components/reports/ReportsView';
import { AiModelPerformanceView } from './components/models/AiModelPerformanceView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentTab } = useSecurity();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'devices':
        return <DevicesView />;
      case 'threats':
        return <ThreatDetectionView />;
      case 'prevention':
        return <AttackPreventionView />;
      case 'network':
        return <NetworkMonitoringView />;
      case 'alerts':
        return <SecurityAlertsView />;
      case 'risk_analysis':
        return <RiskAnalysisView />;
      case 'simulation':
        return <AttackSimulationView />;
      case 'reports':
        return <ReportsView />;
      case 'ai_model':
        return <AiModelPerformanceView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#E2E8F0] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Content Canvas */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full bg-[#050810]">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <MainLayout />
    </SecurityProvider>
  );
}
