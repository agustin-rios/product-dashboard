import { Skeleton } from "@components/Skeleton";

export function KpiCard({
  label,
  value,
  sub,
  loading,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  loading: boolean;
  accent?: "warning" | "danger" | "success";
}) {
  const accentColor =
    accent === "danger"
      ? "text-red-600"
      : accent === "warning"
      ? "text-amber-600"
      : accent === "success"
      ? "text-emerald-600"
      : "text-gray-900 dark:text-gray-100";

  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-7 w-24 mt-1" />
      ) : (
        <span className={`text-2xl font-medium ${accentColor}`}>{value}</span>
      )}
      {sub && !loading && (
        <span className="text-[12px] text-gray-400">{sub}</span>
      )}
    </div>
  );
}
