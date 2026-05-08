"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { buildDashboardStats, buildShipmentChart } from "@/lib/dashboardMetrics";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShipments } from "@/store/shipmentsSlice";
import { fetchUsers } from "@/store/usersSlice";
import type { Shipment } from "@/types/Shipment";

const REVENUE_PLACEHOLDER = "$0";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shipments, loadingShipments, error: shipmentsError } = useAppSelector(
    (state) => state.shipments
  );
  const { users, loadingUsers, error: usersError } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchShipments());
    dispatch(fetchUsers());
  }, [dispatch]);

  const dashboardStats = buildDashboardStats(users, shipments);
  const shipmentChart = buildShipmentChart(shipments);
  const recentShipments = shipments.slice(0, 5);
  const dashboardError = shipmentsError || usersError;
  const isLoading = loadingShipments || loadingUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview</p>
      </div>

      {dashboardError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {dashboardError}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total shipments"
          value={isLoading ? "Loading..." : dashboardStats.totalShipments.toLocaleString()}
          sub="Live from MongoDB shipments"
          trend="up"
        />
        <StatCard
          label="Active now"
          value={isLoading ? "Loading..." : dashboardStats.activeShipments.toLocaleString()}
          sub="In Transit + Out for Delivery"
          trend="neutral"
        />
        <StatCard
          label="Revenue"
          value={REVENUE_PLACEHOLDER}
          sub="Temporary placeholder"
          trend="neutral"
        />
        <StatCard
          label="Users"
          value={isLoading ? "Loading..." : dashboardStats.totalUsers.toLocaleString()}
          sub="Live from MongoDB users"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
            Shipment volume
          </p>
          {loadingShipments && shipmentChart.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
              Loading chart...
            </div>
          ) : shipmentChart.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
              No shipment chart data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={shipmentChart}>
                <defs>
                  <linearGradient id="dashboardShipments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="#3b82f6"
                  fill="url(#dashboardShipments)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
            Revenue by month
          </p>
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
            Revenue data is not available yet.
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Recent shipments
          </p>
          <button
            onClick={() => router.push("/shipments")}
            className="text-xs text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Tracking ID", "Route", "Courier", "Price", "Status"].map((heading) => (
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
            {loadingShipments && recentShipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                  Loading shipments...
                </td>
              </tr>
            ) : recentShipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                  No shipments yet.
                </td>
              </tr>
            ) : (
              recentShipments.map((shipment) => (
                <tr
                  key={getShipmentKey(shipment)}
                  className="cursor-pointer border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  onClick={() => router.push(`/shipments/${getShipmentRouteId(shipment)}`)}
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {getShipmentDisplayId(shipment)}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {shipment.from ?? "-"} to {shipment.to ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {getCourierName(shipment)}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {formatShipmentPrice(shipment)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={shipment.status} />
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

function getCourierName(shipment: Shipment) {
  if (!shipment.courier) {
    return "-";
  }

  return typeof shipment.courier === "object" ? shipment.courier.name : shipment.courier;
}

function formatShipmentPrice(shipment: Shipment) {
  if (!shipment.courier || typeof shipment.courier !== "object") {
    return "-";
  }

  return shipment.courier.price !== undefined
    ? `$${shipment.courier.price.toFixed(2)}`
    : "-";
}
