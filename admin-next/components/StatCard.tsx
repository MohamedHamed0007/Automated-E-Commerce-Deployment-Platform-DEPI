interface Props {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ label, value, sub, trend }: Props) {
  const subColor =
    trend === "up"   ? "text-green-600 dark:text-green-400" :
    trend === "down" ? "text-red-500 dark:text-red-400"     :
                       "text-gray-500 dark:text-gray-400";
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </div>
  );
}