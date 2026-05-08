"use client";

import { useEffect } from "react";

import { StatCard } from "@/components/StatCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShipments } from "@/store/shipmentsSlice";
import type { Shipment } from "@/types/Shipment";

export default function RevenuePage() {
  const dispatch = useAppDispatch();
  const {
    shipments,
    loadingShipments,
    error: shipmentsError,
  } = useAppSelector((state) => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  const deliveredCount = shipments.filter(
    (shipment) => shipment.status.toLowerCase() === "delivered"
  ).length;
  const inTransitCount = shipments.filter(
    (shipment) => shipment.status.toLowerCase() === "in transit"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Revenue</h1>
        <p className="mt-1 text-sm text-gray-500">Financial overview</p>
      </div>

      {shipmentsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {shipmentsError}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value="Pending data"
          sub="Revenue collection not available yet"
          trend="neutral"
        />
        <StatCard
          label="Avg order value"
          value="Pending data"
          sub="Revenue collection not available yet"
          trend="neutral"
        />
        <StatCard
          label="Delivered shipments"
          value={loadingShipments ? "Loading..." : deliveredCount.toString()}
          sub="Real shipment data"
          trend="up"
        />
        <StatCard
          label="In transit"
          value={loadingShipments ? "Loading..." : inTransitCount.toString()}
          sub="Real shipment data"
          trend="neutral"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
          Revenue status
        </p>
        <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">
          Revenue and courier finance data are not available in MongoDB yet.
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Shipment activity
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Tracking ID", "Route", "Courier", "Status"].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingShipments ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                  Loading shipments...
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                  No shipment activity yet.
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => (
                <tr
                  key={getShipmentKey(shipment)}
                  className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {shipment.trackingNumber || shipment._id || shipment.id || "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {shipment.from ?? "-"} to {shipment.to ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {getCourierName(shipment)}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {shipment.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getShipmentKey(shipment: Shipment) {
  return shipment._id || shipment.id || shipment.trackingNumber || `${shipment.from}-${shipment.to}`;
}

function getCourierName(shipment: Shipment) {
  if (!shipment.courier) {
    return "Unknown";
  }

  return typeof shipment.courier === "object" ? shipment.courier.name : shipment.courier;
}
