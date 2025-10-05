import React from 'react';
import { Package, Truck, Clock, CheckCircle, TrendingUp, MapPin, Users, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import QuickActions from './QuickActions';

interface DashboardProps {
  userRole: 'logistics' | 'operator' | 'customer';
  onTabChange?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onTabChange }) => {
  const { state, dispatch } = useApp();

  const getLogisticsStats = () => [
    { 
      title: 'Active Shipments', 
      value: state.shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length.toString(), 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Available Operators', 
      value: state.operators.filter(o => o.status === 'available').length.toString(), 
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Delivered Today', 
      value: state.shipments.filter(s => s.status === 'delivered').length.toString(), 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      title: 'Revenue (Monthly)', 
      value: state.analytics.revenue, 
      icon: CreditCard, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  const getOperatorStats = () => [
    { 
      title: 'Jobs Available', 
      value: state.shipments.filter(s => s.status === 'pending').length.toString(), 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Active Deliveries', 
      value: state.shipments.filter(s => s.status === 'in_transit' || s.status === 'picked_up').length.toString(), 
      icon: Truck, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Completed Today', 
      value: state.shipments.filter(s => s.status === 'delivered').length.toString(), 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Earnings (Today)', 
      value: '₹1,250', 
      icon: CreditCard, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  const getCustomerStats = () => [
    { 
      title: 'Active Shipments', 
      value: state.shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length.toString(), 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'In Transit', 
      value: state.shipments.filter(s => s.status === 'in_transit').length.toString(), 
      icon: Truck, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Delivered', 
      value: state.shipments.filter(s => s.status === 'delivered').length.toString(), 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Pending Pickup', 
      value: state.shipments.filter(s => s.status === 'pending' || s.status === 'assigned').length.toString(), 
      icon: Clock, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50' 
    },
  ];

  const getStats = () => {
    switch (userRole) {
      case 'logistics': return getLogisticsStats();
      case 'operator': return getOperatorStats();
      case 'customer': return getCustomerStats();
      default: return [];
    }
  };

  const stats = getStats();

  const recentActivity = state.shipments.slice(0, 4).map((shipment, index) => ({
    id: index + 1,
    type: shipment.status,
    message: `Shipment #${shipment.id} - ${shipment.from} to ${shipment.to}`,
    time: shipment.updates[shipment.updates.length - 1]?.time || 'Recently',
    status: shipment.status === 'delivered' ? 'success' :
            shipment.status === 'in_transit' ? 'info' :
            shipment.status === 'pending' ? 'warning' : 'info'
  }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Welcome back! Here's what's happening with your logistics operations.</p>
          <div className="hidden md:flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border">
            <img
              src="/Vipul.png"
              alt="Vipul Sharma"
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-xs text-gray-600">Build by Vipul Sharma</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'info' ? 'bg-blue-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'info' ? 'bg-blue-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions
            userRole={userRole}
            onActionClick={(action) => onTabChange?.(action)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;