export default function ReviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-300 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>

      {/* StatsCard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-2"
          >
            <div className="h-4 w-1/3 bg-gray-300 rounded" />
            <div className="h-6 w-8 bg-gray-400 rounded" />
          </div>
        ))}
      </div>

      {/* FilterBar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="h-10 w-full md:w-3/4 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>

      {/* ReviewList Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
          >
            <div className="flex justify-between">
              <div className="space-y-2 w-4/5">
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/4 bg-gray-100 rounded" />
              </div>
              <div className="flex space-x-2">
                <div className="h-5 w-5 bg-gray-300 rounded-full" />
                <div className="h-5 w-5 bg-gray-300 rounded-full" />
              </div>
            </div>
            <div className="h-16 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
