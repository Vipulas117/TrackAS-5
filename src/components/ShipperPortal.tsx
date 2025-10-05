import React, { useState, useEffect } from 'react';
import {
  Package, TrendingUp, DollarSign, Clock,
  Plus, Filter, Search, Download, Eye,
  CheckCircle, XCircle, AlertTriangle, Truck,
  BarChart3, Calendar, MapPin, Users
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ShipmentStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  totalRevenue: number;
  avgDeliveryTime: number;
}

const ShipperPortal: React.FC = () => {
  const { state: authState } = useAuth();
  const { shipments, shipmentsLoading } = useDatabase();
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'analytics' | 'create'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState<ShipmentStats>({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalRevenue: 0,
    avgDeliveryTime: 0
  });

  useEffect(() => {
    if (shipments) {
      const pending = shipments.filter(s => s.status === 'pending').length;
      const inTransit = shipments.filter(s =>
        ['assigned', 'picked_up', 'in_transit'].includes(s.status)
      ).length;
      const delivered = shipments.filter(s => s.status === 'delivered').length;
      const totalRevenue = shipments.reduce((sum, s) => sum + (s.price || 0), 0);

      setStats({
        total: shipments.length,
        pending,
        inTransit,
        delivered,
        totalRevenue,
        avgDeliveryTime: 24
      });
    }
  }, [shipments]);

  const filteredShipments = shipments?.filter(shipment => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.pickup_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination_address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || shipment.status === filterStatus;

    return matchesSearch && matchesFilter;
  }) || [];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    color: string;
  }> = ({ title, value, icon, trend, trendUp, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shipments"
          value={stats.total}
          icon={<Package className="h-6 w-6 text-blue-600" />}
          trend="+12%"
          trendUp={true}
          color="bg-blue-50"
        />
        <StatCard
          title="Pending Assignment"
          value={stats.pending}
          icon={<Clock className="h-6 w-6 text-orange-600" />}
          color="bg-orange-50"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={<Truck className="h-6 w-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={<CheckCircle className="h-6 w-6 text-teal-600" />}
          trend="+8%"
          trendUp={true}
          color="bg-teal-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex items-baseline space-x-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+15.3%</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 82, 71, 89, 95, 88].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-600 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <span className="text-sm font-semibold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">4.8/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg. Delivery Time</span>
                <span className="text-sm font-semibold text-gray-900">{stats.avgDeliveryTime}h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Commission Paid</span>
                <span className="font-semibold text-gray-900">
                  ₹{(stats.totalRevenue * 0.05).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">5% platform commission</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Shipment ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Route</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.slice(0, 5).map((shipment) => (
                <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{shipment.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{shipment.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span className="truncate max-w-[100px]">{shipment.pickup_address}</span>
                      <span>→</span>
                      <span className="truncate max-w-[100px]">{shipment.destination_address}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      shipment.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    ₹{shipment.price?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderShipments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Shipments</h3>
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {shipmentsLoading ? (
          <LoadingSpinner text="Loading shipments..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pickup</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Destination</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-blue-600">{shipment.id}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{shipment.customer_name}</div>
                        <div className="text-gray-500">{shipment.customer_phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-[150px] truncate">
                      {shipment.pickup_address}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-[150px] truncate">
                      {shipment.destination_address}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'picked_up' ? 'bg-teal-100 text-teal-800' :
                        shipment.status === 'assigned' ? 'bg-cyan-100 text-cyan-800' :
                        shipment.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ₹{shipment.price?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredShipments.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No shipments found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Revenue Analytics</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Revenue (All Time)</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Commission Paid</span>
                <span className="font-medium">₹{(stats.totalRevenue * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Revenue</span>
                <span className="font-medium">₹{(stats.totalRevenue * 0.95).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">94.2%</p>
          <p className="text-sm text-gray-600">Successful Deliveries</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered</span>
                <span className="font-medium">{stats.delivered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Avg Delivery Time</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.avgDeliveryTime}h</p>
          <p className="text-sm text-gray-600">Average Time to Deliver</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fastest</span>
                <span className="font-medium">12h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slowest</span>
                <span className="font-medium">48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
        <div className="h-80 flex items-end justify-between space-x-3">
          {[45, 52, 48, 61, 58, 72, 68, 78, 85, 82, 91, 95].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="text-xs font-medium text-gray-900 mb-1">{height}</div>
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-600 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipper Portal</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {authState.user?.email || 'Shipper'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Shipment</span>
          </button>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'shipments', label: 'Shipments', icon: Package },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'shipments' && renderShipments()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-600">Create Shipment functionality will be integrated here.</p>
          <button
            onClick={() => setActiveTab('overview')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Overview
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipperPortal;
