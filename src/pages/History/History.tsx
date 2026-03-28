import React, { useState, useEffect, useMemo } from "react";
import { Filter, Download, Eye, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Badge } from "../../components/Badge";
 
type ShipmentStatus = "Processing" | "In Transit" | "Delivered" | "Pending";
 
interface StoredShipment {
  id: string;
  trackingNumber: string;
  courier: { name: string; price: number; deliveryTime: string } | string;
  from: string;
  to: string;
  weight?: string | number;
  dimensions?: string;
  status: ShipmentStatus | string;
  progress: number;
  currentLocation?: string;
  estimatedDelivery?: string;
  events: {
    status: string;
    location: string;
    date: string;
    time: string;
    completed: boolean;
    current: boolean;
  }[];
  details?: Record<string, unknown>;
}
 
const statusConfig: Record<
  string,
  { label: string; variant: "warning" | "info" | "success" | "default" }
> = {
  Processing: { label: "Processing", variant: "warning" },
  Pending: { label: "Pending", variant: "warning" },
  "In Transit": { label: "In Transit", variant: "info" },
  Delivered: { label: "Delivered", variant: "success" },
};
 
const ITEMS_PER_PAGE = 8;
 
// جلب كل الشحنات المحفوظة في localStorage
function loadShipmentsFromStorage(): StoredShipment[] {
  const shipments: StoredShipment[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("SH-")) continue;
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? "");
      if (parsed && parsed.trackingNumber) {
        shipments.push(parsed as StoredShipment);
      }
    } catch {
      // skip malformed entries
    }
  }
  // ترتيب من الأحدث للأقدم
  return shipments.reverse();
}
 
function getCourierName(
  courier: StoredShipment["courier"] | undefined
): string {
  if (!courier) return "—";
  return typeof courier === "object" ? courier.name : courier;
}
 
function getCourierPrice(
  courier: StoredShipment["courier"] | undefined
): number {
  if (!courier) return 0;
  return typeof courier === "object" ? courier.price : 0;
}
 
export default function History() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<StoredShipment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
 
  useEffect(() => {
    setShipments(loadShipmentsFromStorage());
  }, []);
 
  // stats محسوبة من البيانات الحقيقية
  const stats = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter(
      (s) => s.status === "Delivered"
    ).length;
    const inTransit = shipments.filter(
      (s) => s.status === "In Transit"
    ).length;
    const totalSpent = shipments.reduce(
      (sum, s) => sum + getCourierPrice(s.courier),
      0
    );
    return { total, delivered, inTransit, totalSpent };
  }, [shipments]);
 
  // فلترة
  const filtered = useMemo(() => {
    if (statusFilter === "All") return shipments;
    return shipments.filter((s) => s.status === statusFilter);
  }, [shipments, statusFilter]);
 
  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
 
  const handleViewShipment = (shipment: StoredShipment) => {
    navigate(`/user/tracking/${shipment.trackingNumber}`, {
      state: {
        shipment,
        courier:
          typeof shipment.courier === "object" ? shipment.courier : undefined,
        trackingNumber: shipment.trackingNumber,
      },
    });
  };
 
  const handleExport = () => {
    const rows = [
      ["Tracking ID", "From", "To", "Courier", "Status", "Price"],
      ...shipments.map((s) => [
        s.trackingNumber,
        s.from,
        s.to,
        getCourierName(s.courier),
        s.status,
        `$${getCourierPrice(s.courier).toFixed(2)}`,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
 
  const statusOptions = ["All", "Processing", "Pending", "In Transit", "Delivered"];
 
  return (
    <div className="space-y-6 mx-auto container text-gray-900 dark:text-gray-100">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "Shipment History" },
        ]}
      />
 
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shipment History
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and manage all your past shipments
          </p>
        </div>
 
        <div className="flex gap-3 relative">
          <Button
            variant="secondary"
            onClick={() => setShowFilterMenu((v) => !v)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
            {statusFilter !== "All" && (
              <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                {statusFilter}
              </span>
            )}
          </Button>
 
          {/* Filter Dropdown */}
          {showFilterMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStatusFilter(opt);
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    statusFilter === opt
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
 
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
 
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Shipments
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-blue-400">
            {stats.total}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Delivered
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.delivered}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            In Transit
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.inTransit}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Spent
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-green-400">
            ${stats.totalSpent.toFixed(2)}
          </p>
        </Card>
      </div>
 
      {/* Table */}
      <Card>
        {shipments.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No Shipments Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Your shipment history will appear here after you place an order.
            </p>
            <Button onClick={() => navigate("/user/newshipment")}>
              Create Your First Shipment
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {[
                      "Tracking ID",
                      "Route",
                      "Courier",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-4 px-4 font-medium text-gray-600 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((shipment) => (
                    <tr
                      key={shipment.trackingNumber}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      {/* Tracking ID */}
                      <td className="py-4 px-4">
                        <p className="font-mono font-medium text-gray-900 dark:text-white text-xs">
                          {shipment.trackingNumber}
                        </p>
                      </td>
 
                      {/* Route */}
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-gray-200">
                          {shipment.from}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          → {shipment.to}
                        </p>
                      </td>
 
                      {/* Courier */}
                      <td className="py-4 px-4">
                        <span className="text-gray-900 dark:text-gray-200">
                          {getCourierName(shipment.courier)}
                        </span>
                      </td>
 
                      {/* Price */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${getCourierPrice(shipment.courier).toFixed(2)}
                        </span>
                      </td>
 
                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            statusConfig[shipment.status]?.variant ?? "default"
                          }
                        >
                          {statusConfig[shipment.status]?.label ??
                            shipment.status}
                        </Badge>
                      </td>
 
                      {/* Actions */}
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 dark:text-white dark:hover:bg-gray-700"
                          onClick={() => handleViewShipment(shipment)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {filtered.length}
                </span>{" "}
                shipments
              </p>
 
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Previous
                </Button>
 
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "primary" : "secondary"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                          : "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
 
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}