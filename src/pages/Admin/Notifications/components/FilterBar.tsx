interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterRead: string;
  setFilterRead: (value: string) => void;
  readStatuses: string[];
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  filterRead,
  setFilterRead,
  readStatuses,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Search message..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/2"
      />

      {/* Read status filter */}
      <select
        value={filterRead}
        onChange={(e) => setFilterRead(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {readStatuses.map((status) => (
          <option key={status} value={status}>
            {status === "All"
              ? "📋 All"
              : status === "Read"
              ? "✅ Read"
              : "📩 Unread"}
          </option>
        ))}
      </select>
    </div>
  );
}
