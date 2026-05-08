type Variant = "success" | "warning" | "danger" | "info" | "default";

interface Props {
  status: string;
  variant?: Variant;
}

const autoMap: Record<string, Variant> = {
  Processing:          "warning",
  Pending:             "warning",
  "In Transit":        "info",
  "Out for Delivery":  "info",
  Delivered:           "success",
  Cancelled:           "danger",
  Active:              "success",
  Inactive:            "warning",
  Banned:              "danger",
};

const styles: Record<Variant, string> = {
  success: "bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger:  "bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400",
  info:    "bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-400",
  default: "bg-gray-100   text-gray-700   dark:bg-gray-800      dark:text-gray-300",
};

export function StatusBadge({ status, variant }: Props) {
  const v = variant ?? autoMap[status] ?? "default";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[v]}`}>
      {status}
    </span>
  );
}