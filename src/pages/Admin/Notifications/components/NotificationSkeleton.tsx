export default function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-300 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="h-10 w-40 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg p-6 border border-gray-200"
          >
            <div className="h-6 w-10 bg-gray-300 rounded mb-3" />
            <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
            <div className="h-5 w-12 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* FilterBar Skeleton */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full">
        <div className="h-10 w-full md:w-3/4 bg-gray-200 rounded" />
        <div className="h-10 w-full md:w-1/5 bg-gray-200 rounded" />
      </div>

      {/* Notification List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2 w-4/5">
                <div className="h-4 w-3/4 bg-gray-300 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
              <div className="flex space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded-full" />
                <div className="h-4 w-4 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
