export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  totalUsers: number;
  delayedCount: number;
  totalRevenue?: number;
  shipmentsChange?: string;
  revenueChange?: string;
  usersChange?: string;
}

export interface ChartPoint {
  month: string;
  shipments: number;
  revenue: number;
}
