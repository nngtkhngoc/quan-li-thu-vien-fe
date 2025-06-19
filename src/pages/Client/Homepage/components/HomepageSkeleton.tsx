export default function HomepageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 animate-pulse">
        <div className="max-w-4xl">
          <div className="h-12 md:h-16 bg-gray-300 dark:bg-gray-700 w-3/4 rounded mb-4"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-600 w-2/3 rounded mb-6"></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="grid grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl py-6 px-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-500 rounded" />
          </div>
        ))}
      </section>

      {/* FeaturedBooks Skeleton */}
      <section className="space-y-4">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl p-4 h-72"
            >
              <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>

      {/* RecentReviews Skeleton */}
      <section className="space-y-4">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-500 rounded mb-2" />
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-500 rounded mb-2" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-500 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
