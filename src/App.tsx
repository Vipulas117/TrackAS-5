import React, { useState, useEffect } from 'react';
import { Shield, Building2, Truck, MessageSquare } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import AdminLoginPage from './components/AdminLoginPage';
import CompanyLoginPage from './components/CompanyLoginPage';
import OperatorLoginPage from './components/OperatorLoginPage';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EnhancedShipmentCreation from './components/EnhancedShipmentCreation';
import LiveTracking from './components/LiveTracking';
import LiveTrackingMap from './components/LiveTrackingMap';
import Analytics from './components/Analytics';
import OperatorManagement from './components/OperatorManagement';
import ShipmentApproval from './components/ShipmentApproval';
import AIRouteOptimizer from './components/AIRouteOptimizer';
import CompanyRegistration from './components/CompanyRegistration';
import VehicleRegistration from './components/VehicleRegistration';
import VerificationDashboard from './components/VerificationDashboard';
import OperationalFlow from './components/OperationalFlow';
import UnifiedRegistration from './components/UnifiedRegistration';
import CustomerTrackingPortal from './components/CustomerTrackingPortal';
import PredictiveETA from './components/PredictiveETA';
import DemandForecasting from './components/DemandForecasting';
import AnomalyDetection from './components/AnomalyDetection';
import AIInsightsDashboard from './components/AIInsightsDashboard';
import DisputeManagement from './components/DisputeManagement';
import InvoiceManagement from './components/InvoiceManagement';
import AvailableJobs from './components/AvailableJobs';
import CustomerShipments from './components/CustomerShipments';
import ProofOfDelivery from './components/ProofOfDelivery';
import VCODEAssignmentSystem from './components/VCODEAssignmentSystem';
import EnhancedAdminDashboard from './components/EnhancedAdminDashboard';
import AIAssistant from './components/AIAssistant';
import ShipperPortal from './components/ShipperPortal';
import LogisticsOperationalFlow from './components/LogisticsOperationalFlow';
import OperatorOperationalFlow from './components/OperatorOperationalFlow';
import CustomerOperationalFlow from './components/CustomerOperationalFlow';

const AppContent: React.FC = () => {
  const { state: authState } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'shipper' | 'fleet_operator' | 'individual_vehicle_owner' | 'customer' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginPage, setLoginPage] = useState<'main' | 'admin' | 'shipper' | 'fleet_operator' | 'individual_vehicle_owner'>('main');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setUserRole(authState.user.role);
      setLoginPage('main');
    }
  }, [authState]);

  const handleLogin = (role: 'admin' | 'shipper' | 'fleet_operator' | 'individual_vehicle_owner' | 'customer') => {
    setUserRole(role);
    setActiveTab('dashboard');
    setLoginPage('main');
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
        default:
          return <EnhancedAdminDashboard />;
      }
    }

    // Shipper-specific content
    if (userRole === 'shipper') {
      switch (activeTab) {
        case 'dashboard':
          return <ShipperPortal />;
        case 'create-shipment':
          return <EnhancedShipmentCreation />;
        case 'tracking':
          return <LiveTracking />;
        case 'invoices':
          return <InvoiceManagement userRole="shipper" />;
        case 'analytics':
          return <Analytics />;
        case 'ai-insights':
          return <AIInsightsDashboard />;
        case 'operational-flow':
          return <LogisticsOperationalFlow />;
        default:
          return <ShipperPortal />;
      }
    }

    // Fleet Operator & Individual Vehicle Owner content
    if (userRole === 'fleet_operator' || userRole === 'individual_vehicle_owner') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard userRole="operator" onTabChange={handleTabChange} />;
        case 'available-jobs':
          return <AvailableJobs />;
        case 'active-shipments':
          return <LiveTracking />;
        case 'tracking':
          return <LiveTracking />;
        case 'live-map':
          return <LiveTrackingMap shipmentId="TAS-2024-001" />;
        case 'invoices':
          return <InvoiceManagement userRole="operator" />;
        case 'predictive-eta':
          return (
            <PredictiveETA
              shipmentId="TAS-2024-001"
              currentLocation={{ lat: 28.6139, lng: 77.2090, address: 'Delhi, India' }}
              destination={{ lat: 19.0760, lng: 72.8777, address: 'Mumbai, India' }}
            />
          );
        case 'operational-flow':
          return <OperatorOperationalFlow />;
        default:
          return <Dashboard userRole="operator" onTabChange={handleTabChange} />;
      }
    }

    // Customer content
    if (userRole === 'customer') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard userRole="customer" onTabChange={handleTabChange} />;
        case 'my-shipments':
          return <CustomerShipments />;
        case 'tracking':
          return <LiveTracking />;
        case 'live-map':
          return <LiveTrackingMap shipmentId="TAS-2024-001" />;
        case 'invoices':
          return <InvoiceManagement userRole="customer" />;
        case 'customer-tracking':
          return <CustomerTrackingPortal />;
        case 'operational-flow':
          return <CustomerOperationalFlow />;
        default:
          return <Dashboard userRole="customer" onTabChange={handleTabChange} />;
      }
    }

    // Fallback
    return <Dashboard userRole={userRole!} onTabChange={handleTabChange} />;
  };

  // Show appropriate login page if not authenticated
  if (!authState.isAuthenticated || !userRole) {
    switch (loginPage) {
      case 'admin':
        return <AdminLoginPage onSuccess={() => handleLogin('admin')} />;
      case 'shipper':
        return <CompanyLoginPage onSuccess={() => handleLogin('shipper')} />;
      case 'fleet_operator':
        return <OperatorLoginPage onSuccess={() => handleLogin('fleet_operator')} />;
      case 'individual_vehicle_owner':
        return <OperatorLoginPage onSuccess={() => handleLogin('individual_vehicle_owner')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <img src="/LOGO.png" alt="TrackAS Logo" className="h-12 w-auto" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">TrackAS</h1>
                    <p className="text-sm text-gray-600">AI-Powered Logistics Platform</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Login Portal</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setLoginPage('admin')}
                    className="w-full flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="bg-red-600 rounded-lg p-2">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Admin Portal</h3>
                      <p className="text-sm text-gray-600">System administration & oversight</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoginPage('shipper')}
                    className="w-full flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Shipper Portal</h3>
                      <p className="text-sm text-gray-600">Create shipments & manage logistics</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoginPage('fleet_operator')}
                    className="w-full flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="bg-green-600 rounded-lg p-2">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Fleet Operator</h3>
                      <p className="text-sm text-gray-600">Manage fleet & receive assignments</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoginPage('individual_vehicle_owner')}
                    className="w-full flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="bg-purple-600 rounded-lg p-2">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Individual Vehicle Owner</h3>
                      <p className="text-sm text-gray-600">Direct job acceptance & earnings</p>
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Don't have an account? 
                    <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                      Register here
                    </a>
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <span>Powered by</span>
                    <img 
                      src="/Vipul.png" 
                      alt="Vipul Sharma" 
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span className="font-medium">Vipul Sharma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
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

          {/* AI Assistant */}
          {authState.isAuthenticated && userRole && (
            <AIAssistant
              userRole={userRole}
              userId={authState.user?.id || 'demo-user'}
              isOpen={aiAssistantOpen}
              onClose={() => setAiAssistantOpen(false)}
            />
          )}

          {/* AI Assistant Toggle Button */}
          {authState.isAuthenticated && userRole && (
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
              title="Open AI Assistant"
            >
              <MessageSquare className="h-6 w-6" />
            </button>
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