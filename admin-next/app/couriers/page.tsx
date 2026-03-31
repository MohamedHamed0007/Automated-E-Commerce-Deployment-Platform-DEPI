"use client";

import type { Courier } from "@/types/Courier";

const placeholderCouriers: Courier[] = [
  {
    id: "placeholder-1",
    name: "DHL Express",
    active: true,
    totalOrders: 0,
    avgPrice: 0,
    deliveryTime: "Pending",
    rating: 0,
  },
  {
    id: "placeholder-2",
    name: "FedEx",
    active: false,
    totalOrders: 0,
    avgPrice: 0,
    deliveryTime: "Pending",
    rating: 0,
  },
];

export default function CouriersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Couriers</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Courier data is not available in MongoDB yet.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-4 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Temporary placeholders are shown until the courier collection is ready.
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Courier", "Status", "Total orders", "Avg price", "Delivery time", "Rating"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {placeholderCouriers.map((courier) => (
              <tr
                key={courier.id}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {courier.name}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {courier.active ? "Active" : "Paused"}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {courier.totalOrders}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  ${courier.avgPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {courier.deliveryTime}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {courier.rating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
