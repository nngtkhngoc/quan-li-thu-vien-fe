/* eslint-disable @typescript-eslint/no-explicit-any */
export default function FilterTabs({
  setFilter,
  filter,
}: {
  setFilter: any;
  filter: any;
}) {
  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl py-5 mt-6 px-3 ">
      {[
        { key: "all", label: "Tất cả " },
        { key: "unread", label: "Chưa đọc" },
        { key: "read", label: "Đã đọc" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key as any)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            filter === key
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
