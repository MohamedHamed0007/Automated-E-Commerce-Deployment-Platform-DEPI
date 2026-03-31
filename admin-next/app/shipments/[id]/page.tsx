"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Package, Truck } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCurrentShipment,
  fetchShipmentById,
} from "@/store/shipmentsSlice";
import type { Shipment, ShipmentEvent } from "@/types/Shipment";

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentShipment, loadingCurrentShipment, error } = useAppSelector(
    (state) => state.shipments
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchShipmentById(id));

    return () => {
      dispatch(clearCurrentShipment());
    };
  }, [dispatch, id]);

  if (loadingCurrentShipment) {
    return (
      <div className="py-24 text-center text-sm text-gray-400">Loading shipment...</div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="mb-4 h-12 w-12 text-gray-300" />
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!currentShipment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="mb-4 h-12 w-12 text-gray-300" />
        <p className="text-sm text-gray-500">Shipment not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const shipmentEvents = currentShipment.events ?? [];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 text-gray-500" />
        </button>
        <div>
          <h1 className="font-mono text-xl font-semibold text-gray-900 dark:text-white">
            {getShipmentDisplayId(currentShipment)}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Shipment details</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={currentShipment.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl bg-blue-600 p-5 text-white">
            <div className="mb-5 grid grid-cols-3 gap-4">
              <div>
                <p className="mb-1 text-xs text-blue-200">From</p>
                <p className="text-sm font-medium">{currentShipment.from ?? "-"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-blue-200">To</p>
                <p className="text-sm font-medium">{currentShipment.to ?? "-"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-blue-200">ETA</p>
                <p className="text-sm font-medium">
                  {getCourierEta(currentShipment.courier) ?? "-"}
                </p>
              </div>
            </div>

            <div>
              <div className="h-1.5 overflow-hidden rounded-full bg-blue-400/40">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${getShipmentProgress(currentShipment)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-blue-200">
                Current location:{" "}
                <span className="font-medium text-white">
                  {currentShipment.currentLocation ?? currentShipment.from ?? "-"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-5 text-sm font-medium text-gray-900 dark:text-white">
              Tracking history
            </h3>

            {shipmentEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No events yet.</p>
            ) : (
              <div>
                {shipmentEvents.map((event, index) => (
                  <div key={getEventKey(event, index)} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          event.current
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <MapPin
                          className={`h-3.5 w-3.5 ${
                            event.current
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      {index < shipmentEvents.length - 1 && (
                        <div className="my-1 min-h-[20px] w-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div className="pb-5">
                      <p
                        className={`text-sm font-medium ${
                          event.current
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {event.status}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {event.location}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {formatEventDate(event)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Info</h3>

            {[
              { icon: Truck, label: "Courier", value: getCourierName(currentShipment.courier) },
              { icon: Package, label: "Price", value: formatPrice(currentShipment.courier) },
              {
                icon: Package,
                label: "Weight",
                value:
                  currentShipment.weight !== undefined ? `${currentShipment.weight}` : "-",
              },
              {
                icon: Package,
                label: "Dimensions",
                value: currentShipment.dimensions ?? "-",
              },
              {
                icon: Clock,
                label: "ETA",
                value: getCourierEta(currentShipment.courier) ?? "-",
              },
              {
                icon: MapPin,
                label: "Current location",
                value: currentShipment.currentLocation ?? "-",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
                <span className="max-w-[55%] truncate text-right font-medium text-gray-900 dark:text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getShipmentDisplayId(shipment: Shipment) {
  return shipment.trackingNumber || shipment._id || shipment.id || "-";
}

function getShipmentProgress(shipment: Shipment) {
  if (typeof shipment.progress === "number") {
    return shipment.progress;
  }

  const normalizedStatus = shipment.status.toLowerCase();

  if (normalizedStatus === "delivered") {
    return 100;
  }

  if (normalizedStatus === "out for delivery") {
    return 80;
  }

  if (normalizedStatus === "in transit") {
    return 50;
  }

  if (normalizedStatus === "processing") {
    return 10;
  }

  return 0;
}

function getEventKey(event: ShipmentEvent, index: number) {
  return event._id || event.id || `${event.status}-${event.location}-${index}`;
}

function getCourierName(courier?: Shipment["courier"]) {
  if (!courier) {
    return "-";
  }

  return typeof courier === "object" ? courier.name : courier;
}

function formatPrice(courier?: Shipment["courier"]) {
  if (!courier || typeof courier !== "object" || courier.price === undefined) {
    return "-";
  }

  return `$${courier.price.toFixed(2)}`;
}

function getCourierEta(courier?: Shipment["courier"]) {
  if (!courier || typeof courier !== "object") {
    return undefined;
  }

  return courier.deliveryTime;
}

function formatEventDate(event: ShipmentEvent) {
  if (event.date && event.time) {
    return `${event.date} - ${event.time}`;
  }

  if (event.date) {
    return event.date;
  }

  if (event.createdAt) {
    const parsedDate = new Date(event.createdAt);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString();
    }

    return event.createdAt;
  }

  return "-";
}
