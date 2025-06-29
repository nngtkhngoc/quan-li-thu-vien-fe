export function NotificationSkeleton() {
  return (
    <div className="rounded-xl py-5 px-4 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 space-y-3"
        >
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function FilterTabsSkeleton() {
  return (
    <div className="flex space-x-2 mt-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
        />
      ))}
    </div>
  );
}
