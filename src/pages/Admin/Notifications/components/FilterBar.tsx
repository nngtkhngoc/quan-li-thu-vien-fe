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
    <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full">
      <input
        type="text"
        placeholder="🔍 Tìm kiếm thông báo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-3/4"
      />

      <select
        value={filterRead}
        onChange={(e) => setFilterRead(e.target.value)}
        className="px-3 py-[9px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-1/5"
      >
        {readStatuses.map((status) => (
          <option key={status} value={status}>
            {status === "All"
              ? "📋 Tất cả"
              : status === "Read"
              ? "✅ Đã đọc"
              : "📩 Chưa đọc"}
          </option>
        ))}
      </select>
    </div>
  );
}
