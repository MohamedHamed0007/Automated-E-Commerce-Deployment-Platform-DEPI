"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/StatusBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShipments } from "@/store/shipmentsSlice";
import type { Shipment } from "@/types/Shipment";

const STATUSES = [
  "All",
  "Processing",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function ShipmentsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shipments, loadingShipments, error } = useAppSelector(
    (state) => state.shipments
  );
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  const query = search.trim().toLowerCase();
  const filteredShipments = shipments.filter((shipment) => {
    const matchStatus = filter === "All" || shipment.status === filter;
    const matchSearch =
      !query ||
      getShipmentDisplayId(shipment).toLowerCase().includes(query) ||
      (shipment.from ?? "").toLowerCase().includes(query) ||
      (shipment.to ?? "").toLowerCase().includes(query) ||
      getCourierName(shipment.courier).toLowerCase().includes(query);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Shipments
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">{shipments.length} total</p>
        </div>

        <input
          type="text"
          placeholder="Search ID, route, courier..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              filter === status
                ? "border-blue-200 bg-blue-50 font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-1 text-gray-400">
                ({shipments.filter((shipment) => shipment.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Tracking ID", "From", "To", "Courier", "Price", "Status", ""].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loadingShipments ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                  No shipments found.
                </td>
              </tr>
            ) : (
              filteredShipments.map((shipment) => (
                <tr
                  key={getShipmentKey(shipment)}
                  className="cursor-pointer border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  onClick={() => router.push(`/shipments/${getShipmentRouteId(shipment)}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {getShipmentDisplayId(shipment)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {shipment.from ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {shipment.to ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {getCourierName(shipment.courier)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {formatPrice(shipment.courier)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-blue-600 dark:text-blue-400">
                    View
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

function getShipmentRouteId(shipment: Shipment) {
  return shipment._id || shipment.id || shipment.trackingNumber || "";
}

function getShipmentDisplayId(shipment: Shipment) {
  return shipment.trackingNumber || shipment._id || shipment.id || "-";
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
