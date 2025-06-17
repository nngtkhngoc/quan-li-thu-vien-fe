import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, BookOpen, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyReservation, deleteReservation } from "../../api/reservation.api";
import { toast } from "react-toastify";
import type { ReservationResponse } from "../../types/Reservation";
import { createBorrowedBook } from "../../api/borrow.api";
import { useUser } from "../../hooks/useUser";
const Reservations: React.FC = () => {
  const { data: reservations, isLoading } = useQuery<ReservationResponse[]>({
    queryKey: ["reservations"],
    queryFn: getMyReservation,
  });

  const { userProfile } = useUser();

  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({
      queryKey: ["reservations"],
    });

  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const {
    mutate: deleteReservationMutation,
    isPending: isDeletingReservation,
  } = useMutation({
    mutationFn: deleteReservation,
    onSuccess() {
      invalidateQuery();
      toast.success("Xóa đặt trước thành công");
      setIsDeleting(null);
    },
    onError() {
      toast.error("Xóa đặt trước thất bại");
    },
  });

  const { mutate: borrowBookMutation, isPending: isBorrowingBook } =
    useMutation({
      mutationFn: createBorrowedBook,
      onSuccess() {
        invalidateQuery();
        toast.success("Mượn sách thành công!");
      },
      onError(error) {
        toast.error("Mượn sách thất bại: " + error.message);
      },
    });

  const filteredReservations = reservations
    ?.filter((reservation) => {
      if (filter === "all") return true;
      return filter === "completed"
        ? reservation.returned
        : !reservation.returned;
    })
    .sort((a, b) => {
      return (
        new Date(b.reservationDate).getTime() -
        new Date(a.reservationDate).getTime()
      );
    });

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    completed: "bg-emerald-100 text-emerald-800",
  };

  const statusLabels = {
    pending: "Đang chờ",
    completed: "Hoàn thành",
  };

  const getStatusIcon = (returned: boolean) => {
    return returned ? (
      <CheckCircle className="h-5 w-5 text-emerald-600" />
    ) : (
      <Clock className="h-5 w-5 text-amber-600" />
    );
  };

  const handleBorrowBook = (bookItemId: number) => {
    // Replace 1 with actual user ID from authentication context
    if (!userProfile) {
      toast.error("Bạn cần đăng nhập để mượn sách");
      return;
    }
    if (isBorrowingBook) {
      toast.info("Đang xử lý yêu cầu mượn sách, vui lòng đợi...");
      return;
    }
    const userId = userProfile?.id;
    borrowBookMutation(
      { user_id: userId, book_item_id: bookItemId },
      {
        onSuccess: () => {
          // After successful borrow, delete the reservation
          deleteReservationMutation(bookItemId);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Đặt trước của tôi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Theo dõi trạng thái đặt trước sách của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg h-10 w-10"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg h-10 w-10"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đang chờ
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {reservations?.filter((r) => !r.returned).length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hoàn thành
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {reservations?.filter((r) => r.returned).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Đang chờ" },
          { key: "completed", label: "Hoàn thành" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as "all" | "pending" | "completed")}
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

      {/* Reservations List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-24 w-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredReservations && filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <img
                      src={
                        reservation.bookItem.book.image || "/placeholder.png"
                      }
                      alt={reservation.bookItem.book.title}
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {reservation.bookItem.book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tác giả: {reservation.bookItem.book.author}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ngày đặt
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          reservation.reservationDate
                        ).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Thể loại
                      </p>
                      <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                        {reservation.bookItem.book.catalog?.name ||
                          "Chưa phân loại"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>
                        {reservation.bookItem.book.bookItems?.length}/
                        {reservation.bookItem.book.bookItems?.length} available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                      reservation.returned
                        ? statusColors.completed
                        : statusColors.pending
                    }`}
                  >
                    {getStatusIcon(reservation.returned)}
                    <span className="text-sm font-medium">
                      {reservation.returned
                        ? statusLabels.completed
                        : statusLabels.pending}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {!reservation.returned && (
                      <button
                        onClick={() =>
                          handleBorrowBook(reservation.bookItem.id)
                        }
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        disabled={isBorrowingBook}
                      >
                        {isBorrowingBook ? "Đang mượn..." : "Mượn ngay"}
                      </button>
                    )}
                    <button
                      onClick={() => setIsDeleting(reservation.reservation_id)}
                      className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-100 transition-colors"
                      title="Xóa"
                      disabled={isDeletingReservation}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy đặt trước
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "Bạn chưa có đặt trước nào."
                : `Bạn không có đặt trước ${
                    filter === "pending" ? "đang chờ" : "đã hoàn thành"
                  }.`}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bạn chắc chắn muốn xóa đặt trước này?
              </h3>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsDeleting(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => deleteReservationMutation(isDeleting)}
                  disabled={isDeletingReservation}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-700"
                >
                  {isDeletingReservation ? "Đang xóa..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
