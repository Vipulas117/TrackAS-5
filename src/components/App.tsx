import React, { useState, useEffect } from 'react';
import { AppProvider } from '../context/AppContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { DatabaseProvider } from '../context/DatabaseContext';
import AuthLogin from './AuthLogin';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import CreateShipment from './CreateShipment';
import LiveTracking from './LiveTracking';
import LiveTrackingMap from './LiveTrackingMap';
import Analytics from './Analytics';
import OperatorManagement from './OperatorManagement';
import ShipmentApproval from './ShipmentApproval';
import AIRouteOptimizer from './AIRouteOptimizer';
import CompanyRegistration from './CompanyRegistration';
import VehicleRegistration from './VehicleRegistration';
import VerificationDashboard from './VerificationDashboard';
import OperationalFlow from './OperationalFlow';
import LogisticsOperationalFlow from './LogisticsOperationalFlow';
import OperatorOperationalFlow from './OperatorOperationalFlow';
import CustomerOperationalFlow from './CustomerOperationalFlow';
import AvailableJobs from './AvailableJobs';
import CustomerShipments from './CustomerShipments';
import InvoiceManagement from './InvoiceManagement';
import DisputeManagement from './DisputeManagement';
import AIInsightsDashboard from './AIInsightsDashboard';
import AnomalyDetection from './AnomalyDetection';
import DemandForecasting from './DemandForecasting';
import UnifiedRegistration from './UnifiedRegistration';
import DedicatedLoginPages from './DedicatedLoginPages';
import PredictiveETA from './PredictiveETA';
import CustomerTrackingPortal from './CustomerTrackingPortal';
import EnhancedAdminDashboard from './EnhancedAdminDashboard';
import ShipperPortal from './ShipperPortal';

const AppContent: React.FC = () => {
  const { state: authState } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'logistics' | 'operator' | 'customer' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setUserRole(authState.user.role);
    }
  }, [authState]);

  const handleLogin = (role: 'admin' | 'logistics' | 'operator' | 'customer', _userData?: unknown) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    // Admin-specific content
    if (userRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <EnhancedAdminDashboard />;
        case 'approvals':
          return <ShipmentApproval userRole="admin" />;
        case 'verification':
          return <VerificationDashboard />;
        case 'disputes':
          return <DisputeManagement />;
        case 'analytics':
          return <Analytics />;
        case 'ai-insights':
          return <AIInsightsDashboard />;
        case 'anomaly-detection':
          return <AnomalyDetection />;
        case 'demand-forecasting':
          return <DemandForecasting />;
        case 'unified-registration':
          return <UnifiedRegistration />;
        case 'admin-login':
          return <DedicatedLoginPages userType="admin" />;
        default:
          return <AdminDashboard />;
      }
    }

    // Logistics/Shipper content
    if (userRole === 'logistics') {
      if (activeTab === 'dashboard') {
        return <ShipperPortal />;
      }
    }

    // Regular user content
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={userRole!} onTabChange={handleTabChange} />;
      case 'create-shipment':
        return <CreateShipment />;
      case 'shipment-approval':
        return <ShipmentApproval userRole={userRole as 'logistics'} />;
      case 'operators':
        return <OperatorManagement />;
      case 'tracking':
        return <LiveTracking />;
      case 'my-shipments':
        return <CustomerShipments />;
      case 'available-jobs':
        return <AvailableJobs />;
      case 'active-shipments':
        return <LiveTracking />;
      case 'live-map':
        return <LiveTrackingMap shipmentId="TAS-2024-001" />;
      case 'route-optimizer':
        return (
          <AIRouteOptimizer
            pickup={{ lat: 28.6139, lng: 77.2090, address: 'Delhi, India' }}
            destination={{ lat: 19.0760, lng: 72.8777, address: 'Mumbai, India' }}
            vehicleType="truck"
            urgency="standard"
            onRouteSelect={(route) => console.log('Selected route:', route)}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'ai-insights':
        return <AIInsightsDashboard />;
      case 'predictive-eta':
        return (
          <PredictiveETA
            shipmentId="TAS-2024-001"
            currentLocation={{ lat: 28.6139, lng: 77.2090, address: 'Delhi, India' }}
            destination={{ lat: 19.0760, lng: 72.8777, address: 'Mumbai, India' }}
          />
        );
      case 'demand-forecasting':
        return <DemandForecasting />;
      case 'invoices':
        return <InvoiceManagement userRole={userRole!} />;
      case 'customer-tracking':
        return <CustomerTrackingPortal />;
      case 'company-registration':
        return <CompanyRegistration />;
      case 'vehicle-registration':
        return <VehicleRegistration />;
      case 'verification':
        return <VerificationDashboard />;
      case 'operational-flow':
        switch (userRole) {
          case 'logistics':
            return <LogisticsOperationalFlow />;
          case 'operator':
            return <OperatorOperationalFlow />;
          case 'customer':
            return <CustomerOperationalFlow />;
          default:
            return <OperationalFlow />;
        }
      default:
        return <Dashboard userRole={userRole!} onTabChange={handleTabChange} />;
    }
  };

  // Show login if not authenticated
  if (!authState.isAuthenticated || !userRole) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  return (
    <DatabaseProvider userId={authState.user?.id} userType="company">
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            userRole={userRole}
          />
          
          <div className="flex">
            <Sidebar 
              isOpen={sidebarOpen}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              userRole={userRole}
            />
            
            <main className="flex-1 lg:ml-64">
              {renderContent()}
            </main>
          </div>
          
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </AppProvider>
    </DatabaseProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;