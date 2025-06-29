/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import BookCard from "../../components/Client/BookCard";
import { useBook } from "../../hooks/useBook";
import { ConfigProvider, Pagination } from "antd";
import BookCardSkeleton from "../../components/Client/BookCardSkeleton";
import SearchFilterSkeleton from "../../components/Client/SearchFilterSkeleton";

export default function BookCatalogue() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({
    query: "",
    category: "all",
    author: "",
    availableOnly: false,
    minRating: 0,
  });

  const [page, setPage] = useState(0);
  const size = 8;
  const newSearchParams = new URLSearchParams();
  newSearchParams.set("page", String(page));
  newSearchParams.set("size", String(size));
  const { getBookQuery, getCatalogsQuery } = useBook(
    newSearchParams.toString()
  );

  if (getBookQuery.isLoading || getCatalogsQuery.isLoading) {
    return (
      <div className="space-y-6 max-w-screen-xl mx-auto p-6">
        <SearchFilterSkeleton />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const books = getBookQuery.data?.content || [];
  const categories = getCatalogsQuery.data || [];

  const filteredBooks = books.filter((book: any) => {
    let match = true;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      match =
        match &&
        (book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q));
    }

    if (filters.category && filters.category !== "all") {
      match = match && book.catalog?.name === filters.category;
    }

    if (filters.availableOnly) {
      match =
        match &&
        book.bookItems.some((item: any) => item.status === "AVAILABLE");
    }

    if (filters.minRating) {
      match = match && book.rating >= filters.minRating;
    }

    return match;
  });

  const handleFilterChange = (key: any, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      author: "",
      availableOnly: false,
      minRating: 0,
    });
  };

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Các thể loại sách
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Khám phá bộ sưu tập sách đa dạng của chúng tôi, từ tiểu thuyết đến
            công nghệ, với các bộ lọc để tìm kiếm dễ dàng hơn.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg cursor-pointer ${
              viewMode === "grid"
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 "
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg cursor-pointer ${
              viewMode === "list"
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 "
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <List className="h-5 w-5 " />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sách, tác giả"
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="w-full pl-10 dark:text-gray-100 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="cursor-pointer flex items-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thể loại
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
                  Chỉ hiển thị sách có sẵn
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availableOnly}
                    onChange={(e) =>
                      handleFilterChange("availableOnly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 py-2">
                    Có sẵn
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đánh giá tối thiểu
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    handleFilterChange("minRating", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Tất cả </option>
                  <option value={4}>4+ ⭐</option>
                  <option value={4.5}>4.5+ ⭐</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 cursor-pointer py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Làm mới bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {`${filteredBooks.length} sách được tìm thấy`}
          </h2>
        </div>

        {filteredBooks.length > 0 ? (
          <div
            className={`grid gap-6 pb-5 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredBooks.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy sách nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: "oklch(0.585 0.233 277.117)",
              colorBorder: "oklch(0.585 0.233 277.117)",
              colorPrimary: "white",
              colorPrimaryHover: "white",
              colorPrimaryBorder: "oklch(0.585 0.233 277.117)",
              colorText: "oklch(0.585 0.233 277.117)",
              controlOutline: "oklch(0.585 0.233 277.117)",
              itemSize: 36,
              borderRadius: 8,
              fontSize: 18,
            },
          },
        }}
      >
        <Pagination
          current={page + 1}
          className="flex justify-center custom-pagination"
          total={getBookQuery.data?.totalElements || 0}
          pageSize={size}
          onChange={(currentPage) => {
            setPage(currentPage - 1);
            newSearchParams.set("page", String(currentPage - 1));
          }}
        />
      </ConfigProvider>
    </div>
  );
}
