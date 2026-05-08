import type { ChartPoint } from "@/types/Dashboard";
import type { Shipment } from "@/types/Shipment";
import type { User } from "@/types/User";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function countActiveShipments(shipments: Shipment[]) {
  return shipments.filter((shipment) => {
    const status = shipment.status.toLowerCase();
    return status === "in transit" || status === "out for delivery";
  }).length;
}

export function buildShipmentChart(shipments: Shipment[]): ChartPoint[] {
  const monthlyCounts = new Map<string, number>();

  shipments.forEach((shipment) => {
    const sourceDate = shipment.createdAt || shipment.updatedAt;
    if (!sourceDate) {
      return;
    }

    const parsedDate = new Date(sourceDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return;
    }

    const key = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`;
    monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1);
  });

  return Array.from(monthlyCounts.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, shipmentsCount]) => {
      const [year, month] = key.split("-").map(Number);
      return {
        month: `${MONTH_LABELS[month]} ${year}`,
        shipments: shipmentsCount,
        revenue: 0,
      };
    });
}

export function buildDashboardStats(users: User[], shipments: Shipment[]) {
  return {
    totalShipments: shipments.length,
    activeShipments: countActiveShipments(shipments),
    totalUsers: users.length,
    delayedCount: 0,
  };
}
