import { Filter, Search } from "lucide-react";

type FilterBarProps = {
  searchTerm: string;
  filterRating: string;
  setSearchTerm: (value: string) => void;
  setFilterRating: (value: string) => void;
  ratings: string[];
};

export default function FilterBar({
  searchTerm,
  filterRating,
  setSearchTerm,
  setFilterRating,
  ratings,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá theo người dùng, sách hoặc bình luận..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating === "All" ? "Tất cả" : `${rating} sao`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
