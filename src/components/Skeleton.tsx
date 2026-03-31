export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-100 dark:bg-gray-800 ${className}`}
    />
  );
}