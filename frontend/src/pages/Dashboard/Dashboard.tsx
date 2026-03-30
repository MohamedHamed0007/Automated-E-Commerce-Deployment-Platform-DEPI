import {
  ArrowRight,
  DollarSign,
  MapPin,
  Package,
  Plus,
  TrendingUp,
  TruckIcon,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Badge } from '../../components/Badge';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../redux/hookredux';
import { getUserShipments } from '../../redux/thunk/shipmentThunk';

const stats = [
  {
    label: 'Total Shipments',
    value: '124',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'blue'
  },
  {
    label: 'Active Shipments',
    value: '8',
    change: '3 arriving today',
    trend: 'neutral',
    icon: TruckIcon,
    color: 'teal'
  },
  {
    label: 'Total Savings',
    value: '$2,450',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
    color: 'green'
  },
  {
    label: 'Wallet Balance',
    value: '$850.00',
    change: 'Add funds',
    trend: 'neutral',
    icon: Wallet,
    color: 'purple'
  }
];

const chartData = [
  { month: 'Jan', shipments: 24 },
  { month: 'Feb', shipments: 32 },
  { month: 'Mar', shipments: 28 },
  { month: 'Apr', shipments: 38 },
  { month: 'May', shipments: 42 },
  { month: 'Jun', shipments: 48 }
];

const iconBg = ['bg-blue-100', 'bg-teal-100', 'bg-green-100', 'bg-purple-100'];
const iconColor = ['text-blue-600', 'text-teal-600', 'text-green-600', 'text-purple-600'];
const barColor = [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-teal-500 to-teal-600',
  'bg-gradient-to-r from-green-500 to-green-600',
  'bg-gradient-to-r from-purple-500 to-purple-600'
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipments } = useAppSelector((state) => state.shipment);

  useEffect(() => {
    dispatch(getUserShipments());
  }, [dispatch]);

  const bookedShipments = shipments.filter((s) => s.status === 'booked');
  const lastShipment = shipments[0];
  const lastTrackingNumber = lastShipment?.trackingNumber;

  const handleTrack = () => {
    lastShipment
      ? navigate(`/user/tracking/${lastShipment._id}`)
      : navigate('/user/history');
  };

  const handleCompare = () => {
    lastShipment && lastShipment.status === 'draft'
      ? navigate(`/user/compare/${lastShipment._id}`)
      : navigate('/user/newshipment');
  };

  const recentShipments = [...shipments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const getStatusVariant = (status: string): 'warning' | 'info' | 'success' => {
    const s = status?.toLowerCase();
    if (['booked', 'delivered', 'success'].includes(s)) return 'success';
    if (['compared', 'in transit', 'in_transit'].includes(s)) return 'info';
    return 'warning';
  };

  const stats = [
    {
      label: 'Total Shipments',
      value: shipments.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      label: 'Active Shipments',
      value: bookedShipments.length.toString(),
      change: `${bookedShipments.length} booked`,
      trend: 'neutral',
      icon: TruckIcon,
      color: 'teal'
    },
    {
      label: 'Total Savings',
      value: '$2,450',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Wallet Balance',
      value: '$850.00',
      change: 'Add funds',
      trend: 'neutral',
      icon: Wallet,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 container mx-auto p-4 lg:p-0">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">
            Welcome back! Here's your shipping overview.
          </p>
        </div>
        <Button onClick={() => navigate('/user/newshipment')} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          New Shipment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className="relative overflow-hidden dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p
                  className={`text-sm mt-2 font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-slate-400'}`}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg[i]} dark:bg-opacity-10`}
              >
                <stat.icon className={`w-6 h-6 ${iconColor[i]}`} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${barColor[i]}`} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Shipment Activity
              </h3>
              <p className="text-sm text-slate-500">Monthly delivery performance</p>
            </div>
            <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="#3b82f6"
                  fill="url(#colorShipments)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/user/newshipment')}
              className="w-full flex items-center gap-4 p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold">New Shipment</p>
                <p className="text-xs text-blue-100">Book in seconds</p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70" />
            </button>

            <button
              onClick={handleTrack}
              className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-500/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-slate-900 dark:text-white">Track</p>
                <p className="text-xs text-slate-500 truncate">
                  {lastTrackingNumber || 'View history'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
            </button>

            <button
              onClick={handleCompare}
              className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-slate-900 dark:text-white">Rates</p>
                <p className="text-xs text-slate-500">Compare couriers</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </Card>
      </div>

      {recentShipments.length > 0 && (
        <Card className="dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Shipments</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/user/history')}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100 dark:border-slate-700">
                  {['Tracking ID', 'Route', 'Courier', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="pb-4 font-semibold text-slate-500 dark:text-slate-400 text-sm"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {recentShipments.map((s) => (
                  <tr
                    key={s._id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 text-sm font-mono font-medium text-blue-600 dark:text-blue-400">
                      {s.trackingNumber || s._id}
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {s.senderAddress.city}
                      </div>
                      <div className="text-xs text-slate-400">to {s.receiverAddress.city}</div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">
                      {s.selectedRate ? `${s.selectedRate.carrier} - ${s.selectedRate.service}` : '—'}
                    </td>
                    <td className="py-4">
                      <Badge variant={getStatusVariant(s.status)}>{s.status}</Badge>
                    </td>
                    <td className="py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/user/tracking/${s._id}`)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
