const COMMISSION_RATE = 0.10; // 10% markup

export function applyCommission(baseRate: number): number {
  return Math.round(baseRate * (1 + COMMISSION_RATE) * 100) / 100;
}