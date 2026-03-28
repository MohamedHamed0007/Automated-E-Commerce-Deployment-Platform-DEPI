import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Package, MapPin, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Breadcrumb } from "@/components/Breadcrumb";
 
interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
}
 
interface ShipmentData {
  id: string;
  trackingNumber: string;
  courier: { name: string; price: number; deliveryTime: string } | string;
  from: string;
  to: string;
  weight?: string | number;
  dimensions?: string;
  status: string;
  progress: number;
  currentLocation?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
}
 
export default function Tracking() {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const location = useLocation();
 
  // أولوية البيانات: localStorage أولاً (الأدق)، ثم state
  const storedRaw = trackingNumber
    ? localStorage.getItem(trackingNumber)
    : null;
  const storedData: ShipmentData | null = storedRaw
    ? JSON.parse(storedRaw)
    : null;
 
  const stateShipment: ShipmentData | null = location.state?.shipment ?? null;
 
  const trackingData: ShipmentData | null = storedData ?? stateShipment;
 
  if (!trackingData) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/user" },
            { label: "Track Shipment" },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Shipment Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            No shipment found with tracking number{" "}
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
              {trackingNumber ?? "—"}
            </span>
          </p>
          <Button onClick={() => (window.location.href = "/user")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
 
  // normalize courier (قد يكون object أو string)
  const courierName =
    typeof trackingData.courier === "object"
      ? trackingData.courier.name
      : trackingData.courier;
 
  const estimatedDelivery =
    trackingData.estimatedDelivery ??
    (typeof trackingData.courier === "object"
      ? trackingData.courier.deliveryTime
      : undefined) ??
    "N/A";
 
  const completedCount = trackingData.events.filter((e) => e.completed).length;
  const progress =
    trackingData.events.length > 0
      ? Math.round((completedCount / trackingData.events.length) * 100)
      : trackingData.progress ?? 0;
 
  const currentLocation =
    trackingData.currentLocation ?? trackingData.from ?? "—";
 
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/user" },
          { label: "Track Shipment" },
        ]}
      />
 
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Track Your Shipment
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time updates for{" "}
          <span className="font-mono font-medium text-gray-800 dark:text-gray-200">
            {trackingData.trackingNumber ?? trackingData.id}
          </span>
        </p>
      </div>
 
      {/* Header Banner */}
      <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {trackingData.trackingNumber ?? trackingData.id}
            </h2>
            <p className="text-sm text-blue-200 mt-1">
              Shipped via {courierName}
            </p>
          </div>
          <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm">
            {trackingData.status ?? "In Transit"}
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-blue-200 mb-1">From</p>
            <p className="font-semibold text-white">{trackingData.from}</p>
          </div>
          <div>
            <p className="text-sm text-blue-200 mb-1">To</p>
            <p className="font-semibold text-white">{trackingData.to}</p>
          </div>
          <div>
            <p className="text-sm text-blue-200 mb-1">Estimated Delivery</p>
            <p className="font-semibold text-white">{estimatedDelivery}</p>
          </div>
        </div>
 
        <div>
          <div className="h-2 bg-blue-400/40 dark:bg-blue-900/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-blue-200 mt-2">
            Current location:{" "}
            <span className="font-semibold text-white">{currentLocation}</span>
          </p>
        </div>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking History */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Tracking History
          </h3>
          {trackingData.events.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No events yet.
            </p>
          ) : (
            <div className="space-y-0">
              {trackingData.events.map((event, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.current
                          ? "bg-green-200 dark:bg-green-800"
                          : event.completed
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Package
                        className={`w-5 h-5 ${
                          event.current
                            ? "text-green-700 dark:text-green-300"
                            : event.completed
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    {index < trackingData.events.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1 mb-1 min-h-[24px]" />
                    )}
                  </div>
 
                  <div className="flex-1 pb-6">
                    <h4
                      className={`font-semibold ${
                        event.current
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {event.status}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
 
        {/* Shipment Details */}
        <div className="space-y-5">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Shipment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Current Location
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[60%]">
                  {currentLocation}
                </span>
              </div>
              {trackingData.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Weight
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {trackingData.weight} kg
                  </span>
                </div>
              )}
              {trackingData.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Dimensions
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {trackingData.dimensions}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {trackingData.status ?? "Processing"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}