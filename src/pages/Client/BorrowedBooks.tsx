import React, { useState } from "react";
import { AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { format, differenceInDays } from "date-fns";
// import { borrows? } from "../data/mockData";
import type { BorrowBookResponse } from "../../types/Borrow";
import useBorrow from "../../hooks/useBorrow";

type FilterType = "ALL" | "BORROWED" | "RETURNED" | "OVERDUE";

const BorrowedBooks = () => {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { borrows, isLoadingBorrows } = useBorrow();

  if (isLoadingBorrows) return <p>Đang tải...</p>;

  const filteredBooks = borrows?.filter(book => {
    if (filter === "ALL") return true;
    return book.status === filter;
  });

  const getStatusIcon = (status: BorrowBookResponse["status"]) => {
    const iconMap: Record<BorrowBookResponse["status"], React.ReactElement> = {
      borrowed: <BookOpen className="h-5 w-5 text-blue-500" />,
      returned: <CheckCircle className="h-5 w-5 text-green-500" />,
      overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
    };
    return iconMap[status];
  };

  const getStatusColor = (status: BorrowBookResponse["status"]) => {
    const colorMap: Record<BorrowBookResponse["status"], string> = {
      BORROWED:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      RETURNED:
        "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
      OVERDUE:
        "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    };
    return colorMap[status];
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    return days;
  };

  const totalFines = borrows
    ?.filter(() => 0)
    .reduce((total: number) => total + 0, 0);

  const statusCounts = {
    borrowed: borrows?.filter(
      (b: BorrowBookResponse) => b.status === "BORROWED"
    ).length,
    overdue: borrows?.filter((b: BorrowBookResponse) => b.status === "OVERDUE")
      .length,
    returned: borrows?.filter(
      (b: BorrowBookResponse) => b.status === "RETURNED"
    ).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
      <div className="space-y-6 ">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sách Đã Mượn
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các khoản vay sách hiện tại và trước đây
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đang Mượn
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statusCounts.borrowed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quá Hạn
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {statusCounts.overdue}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đã Trả
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statusCounts.returned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[
            { key: "ALL" as const, label: "Tất Cả Sách" },
            { key: "BORROWED" as const, label: "Đang Mượn" },
            { key: "OVERDUE" as const, label: "Quá Hạn" },
            { key: "RETURNED" as const, label: "Đã Trả" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks?.length ?? 0 > 0 ? (
            filteredBooks?.map((borrowedBook: BorrowBookResponse) => {
              const daysRemaining =
                borrowedBook.status === "borrowed"
                  ? getDaysRemaining(borrowedBook.return_date.toLocaleString())
                  : null;

              return (
                <div
                  key={borrowedBook.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 border transition-all duration-300 ${
                    borrowedBook.status === "overdue"
                      ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <img
                        src={borrowedBook?.book_item?.book?.image}
                        alt={borrowedBook?.book_item?.book?.title}
                        className="w-24 h-32 object-cover rounded-lg shadow-md"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {borrowedBook.book_item.book.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          tác giả {borrowedBook.book_item.book.author}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ngày Mượn
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {format(
                              new Date(borrowedBook.borrow_date),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ngày Hạn Trả
                          </p>
                          <p
                            className={`font-medium ${
                              borrowedBook.status === "overdue"
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {format(
                              new Date(borrowedBook.return_date),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>

                        {borrowedBook.return_date &&
                          borrowedBook.status === "RETURNED" && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ngày Trả
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {format(
                                  new Date(borrowedBook.return_date),
                                  "dd/MM/yyyy"
                                )}
                              </p>
                            </div>
                          )}

                        {borrowedBook.status === "borrowed" &&
                          daysRemaining !== null && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Thời Gian Còn Lại
                              </p>
                              <p
                                className={`font-medium ${
                                  daysRemaining <= 3
                                    ? "text-red-600 dark:text-red-400"
                                    : daysRemaining <= 7
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {daysRemaining > 0
                                  ? `${daysRemaining} ngày`
                                  : "Quá hạn"}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end space-y-3">
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
                          borrowedBook.status
                        )}`}
                      >
                        {getStatusIcon(borrowedBook.status)}
                        <span className="text-sm font-medium capitalize">
                          {borrowedBook.status === "BORROWED"
                            ? "Đang mượn"
                            : borrowedBook.status === "RETURNED"
                            ? "Đã trả"
                            : borrowedBook.status === "OVERDUE"
                            ? "Quá hạn"
                            : borrowedBook.status}
                        </span>
                      </div>

                      {borrowedBook.status === "borrowed" && (
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Gia Hạn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy sách
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "ALL"
                  ? "Bạn chưa mượn sách nào."
                  : `Bạn không có sách nào ${
                      filter === "BORROWED"
                        ? "đang mượn"
                        : filter === "RETURNED"
                        ? "đã trả"
                        : filter === "OVERDUE"
                        ? "quá hạn"
                        : filter
                    }.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;
