const LeaderboardRowSkeleton = () => {
  return (
    <div className="rounded-lg p-6 bg-gray-100 dark:bg-gray-800 animate-pulse w-full md:w-1/2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-400" />
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="text-right">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
          <div className="h-4 w-10 bg-gray-200 dark:bg-gray-500 rounded" />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRowSkeleton;
