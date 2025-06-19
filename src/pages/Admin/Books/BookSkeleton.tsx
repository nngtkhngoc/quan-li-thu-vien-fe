export default function BookSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-300 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-40 bg-indigo-300 rounded-lg" />
      </div>

      {/* Search bar skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded" />
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>

      {/* Book card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4"
          >
            <div className="h-48 bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-1/3 bg-gray-100 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 rounded" />
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-200 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
