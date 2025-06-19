export default function BadgeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-300 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>

      {/* StatsCard Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 px-4 py-6 space-y-2"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-300 rounded-lg" />
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-6 w-16 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SearchBar Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="h-10 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* Badge Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
          >
            <div className="h-[230px] space-y-3">
              <div className="h-10 w-10 mx-auto bg-gray-300 rounded-full" />
              <div className="h-4 w-2/3 mx-auto bg-gray-200 rounded" />
              <div className="h-4 w-1/3 mx-auto bg-gray-100 rounded" />
              <div className="h-3 w-3/4 mx-auto bg-gray-100 rounded" />
              <div className="h-4 w-1/2 mx-auto bg-gray-300 rounded" />
            </div>
            <div className="flex justify-center space-x-2">
              <div className="h-8 w-20 bg-gray-200 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
