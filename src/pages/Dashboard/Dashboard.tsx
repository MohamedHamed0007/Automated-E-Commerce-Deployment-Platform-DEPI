import {
  ArrowRight,
  DollarSign,
  MapPin,
  Package,
  Plus,
  TrendingUp,
  TruckIcon,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../../components/Badge";
import { Breadcrumb } from "../../components/Breadcrumb";
 
const stats = [
  { label: "Total Shipments", value: "124", change: "+12%",          trend: "up",      icon: Package,   color: "blue"   },
  { label: "Active Shipments", value: "8",   change: "3 arriving today", trend: "neutral", icon: TruckIcon, color: "teal"   },
  { label: "Total Savings",    value: "$2,450", change: "+18%",       trend: "up",      icon: DollarSign,color: "green"  },
  { label: "Wallet Balance",   value: "$850.00", change: "Add funds", trend: "neutral", icon: Wallet,    color: "purple" },
];
 
const chartData = [
  { month: "Jan", shipments: 24 },
  { month: "Feb", shipments: 32 },
  { month: "Mar", shipments: 28 },
  { month: "Apr", shipments: 38 },
  { month: "May", shipments: 42 },
  { month: "Jun", shipments: 48 },
];
 
const statusConfig = {
  pending:    { label: "Pending",    variant: "warning" as const },
  in_transit: { label: "In Transit", variant: "info"    as const },
  delivered:  { label: "Delivered",  variant: "success" as const },
};
 
const iconBg    = ["bg-blue-100",   "bg-teal-100",   "bg-green-100",   "bg-purple-100"];
const iconColor = ["text-blue-600", "text-teal-600", "text-green-600", "text-purple-600"];
const barColor  = [
  "bg-linear-to-r from-blue-500   to-blue-600",
  "bg-linear-to-r from-teal-500   to-teal-600",
  "bg-linear-to-r from-green-500  to-green-600",
  "bg-linear-to-r from-purple-500 to-purple-600",
];
 
export default function Dashboard() {
  const navigate = useNavigate();
 
  // ── helpers ──────────────────────────────────────────────────────────────
  // جلب آخر tracking number وshipment id من localStorage
  const lastTrackingNumber = localStorage.getItem("lastTrackingNumber");
  const lastShipmentId     = localStorage.getItem("lastShipmentId");
 
  const handleTrack = () => {
    if (lastTrackingNumber) {
      navigate(`/user/tracking/${lastTrackingNumber}`);
    } else {
      // مفيش شحنة متتبعة — روّح لـ history
      navigate("/user/history");
    }
  };
 
  const handleCompare = () => {
    if (lastShipmentId) {
      navigate(`/user/compare/${lastShipmentId}`);
    } else {
      // مفيش shipment — روّح لـ new shipment الأول
      navigate("/user/newshipment");
    }
  };
 
  // جلب آخر شحنات من localStorage (keys بتبدأ بـ SH-)
  const recentShipments = Object.keys(localStorage)
    .filter((k) => k.startsWith("SH-"))
    .slice(-4)
    .reverse()
    .map((k) => {
      try { return JSON.parse(localStorage.getItem(k) ?? ""); }
      catch { return null; }
    })
    .filter(Boolean);
 
  // fallback static لو مفيش بيانات حقيقية
  const displayShipments = recentShipments.length > 0
    ? recentShipments
    : [
        { trackingNumber: "SH-2024-045", from: "New York, NY",   to: "Los Angeles, CA", courier: { name: "DHL Express" }, status: "In Transit", events: [{ date: "2024-02-15" }] },
        { trackingNumber: "SH-2024-044", from: "Chicago, IL",    to: "Miami, FL",       courier: { name: "FedEx"       }, status: "Delivered",  events: [{ date: "2024-02-14" }] },
        { trackingNumber: "SH-2024-043", from: "Houston, TX",    to: "Seattle, WA",     courier: { name: "J&T Express" }, status: "Processing", events: [{ date: "2024-02-14" }] },
      ];
 
  const getStatusVariant = (status: string) => {
    const map: Record<string, "warning" | "info" | "success"> = {
      "Processing": "warning",
      "Pending":    "warning",
      "In Transit": "info",
      "Delivered":  "success",
      "in_transit": "info",
      "pending":    "warning",
      "delivered":  "success",
    };
    return map[status] ?? "warning";
  };
 
  const getCourierName = (courier: any) =>
    typeof courier === "object" ? courier?.name : courier ?? "—";
 
  const getDate = (s: any) =>
    s.events?.[0]?.date ?? s.date ?? "—";
 
  // ─────────────────────────────────────────────────────────────────────────
 
  return (
    <div className="space-y-6 container mx-auto">
      <Breadcrumb items={[{ label: "Dashboard" }]} />
 
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 mt-1 dark:text-gray-300">
            Welcome back! Here's your shipping overview.
          </p>
        </div>
        <Button onClick={() => navigate("/user/newshipment")}>
          <Plus className="w-5 h-5" />
          New Shipment
        </Button>
      </div>
 
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.label} hover className="relative overflow-hidden dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg[i]}`}>
                <stat.icon className={`w-6 h-6 ${iconColor[i]}`} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${barColor[i]}`} />
          </Card>
        ))}
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 dark:bg-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipment Activity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monthly shipment trends</p>
            </div>
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="shipments" stroke="#3b82f6" fillOpacity={1} fill="url(#colorShipments)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
 
        {/* Quick Actions */}
        <Card className="dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4">Quick Actions</h3>
          <div className="space-y-3">
 
            {/* New Shipment */}
            <button
              onClick={() => navigate("/user/newshipment")}
              className="w-full flex items-center gap-3 p-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">New Shipment</p>
                <p className="text-xs text-blue-100">Create and compare</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
 
            {/* Track — goes to last tracked shipment or history */}
            <button
              onClick={handleTrack}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">Track Shipment</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lastTrackingNumber ? `Last: ${lastTrackingNumber}` : "View history"}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
 
            {/* Compare — goes to last shipment's compare or new shipment */}
            <button
              onClick={handleCompare}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">Compare Prices</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lastShipmentId ? "Continue last quote" : "Start new quote"}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
 
          </div>
        </Card>
      </div>
 
      {/* Recent Shipments */}
      <Card className="dark:bg-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Shipments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your latest orders</p>
          </div>
          <Button variant="ghost" className="dark:text-white dark:hover:bg-slate-700" onClick={() => navigate("/user/history")}>
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {["Tracking ID", "Route", "Courier", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayShipments.map((s: any) => (
                <tr
                  key={s.trackingNumber}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-mono font-medium text-gray-900 dark:text-white text-xs">
                      {s.trackingNumber}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 dark:text-white">{s.from}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">→ {s.to}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getCourierName(s.courier)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusVariant(s.status)}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getDate(s)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark:text-white dark:hover:bg-slate-600"
                      onClick={() =>
                        navigate(`/user/tracking/${s.trackingNumber}`, {
                          state: {
                            shipment: s,
                            trackingNumber: s.trackingNumber,
                            courier: typeof s.courier === "object" ? s.courier : undefined,
                          },
                        })
                      }
                    >
                      Track
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}