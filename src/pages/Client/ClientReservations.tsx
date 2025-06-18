import React, { useState } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyReservation, deleteReservation } from "../../api/reservation.api";
import { toast } from "react-toastify";
import type { ReservationResponse } from "../../types/Reservation";
import { createBorrowedBook } from "../../api/borrow.api";
import { useUser } from "../../hooks/useUser";
import { ConfirmModal } from "../../components/Admin/ConfirmModal";
import DeleteConfirmModal from "../../pages/Admin/Notifications/components/DeleteModal";

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
  const [isBorrowing, setIsBorrowing] = useState<{
    bookItemId: number;
    id: number;
  } | null>(null);

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
        setIsBorrowing(null);
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
    pending:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    completed:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  };

  const statusLabels = {
    pending: "Đang chờ",
    completed: "Hoàn thành",
  };

  const getStatusIcon = (returned: boolean) => {
    return returned ? (
      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
    );
  };

  const handleBorrowBook = (bookItemId: number, id: number) => {
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
          deleteReservationMutation(id);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded-lg w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-lg w-1/2"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <div className="h-6 w-6"></div>
                  </div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="bg-gray-800 rounded-xl p-1">
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-10 bg-gray-700 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Reservations List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Book Cover Skeleton */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="h-6 bg-gray-700 rounded-lg w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded-lg w-1/2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j}>
                          <div className="h-4 bg-gray-700 rounded-lg w-20 mb-2"></div>
                          <div className="h-5 bg-gray-700 rounded-lg w-24"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status and Actions Skeleton */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="h-8 bg-gray-700 rounded-full w-24"></div>
                    <div className="h-10 bg-gray-700 rounded-lg w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
      <div className="space-y-6">
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
          {filteredReservations && filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.reservation_id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        reservation.bookItem.book.image || "/placeholder.png"
                      }
                      alt={reservation.bookItem.book.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-md"
                    />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Số lượng
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {reservation.bookItem.book.bookItems?.length || 0}{" "}
                          cuốn
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
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

                    {reservation.returned && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sẵn sàng để mượn
                      </p>
                    )}

                    <div className="flex space-x-2">
                      {reservation.returned ? (
                        <button
                          onClick={() =>
                            setIsBorrowing({
                              bookItemId: reservation.bookItem.id,
                              id: reservation.reservation_id,
                            })
                          }
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors w-33"
                          disabled={isBorrowingBook}
                        >
                          {isBorrowingBook ? "Đang mượn..." : "Mượn ngay"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setIsDeleting(reservation.reservation_id)
                          }
                          className="px-4 py-2 mt-10 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors w-30"
                          disabled={isDeletingReservation}
                        >
                          {isDeletingReservation ? "Đang hủy..." : "Hủy"}
                        </button>
                      )}
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
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        onConfirm={() => isDeleting && deleteReservationMutation(isDeleting)}
        isPending={isDeletingReservation}
      />

      {/* Borrow Confirmation Modal */}
      <ConfirmModal
        isOpen={!!isBorrowing}
        onCancel={() => setIsBorrowing(null)}
        onSave={() =>
          isBorrowing &&
          handleBorrowBook(isBorrowing.bookItemId, isBorrowing.id)
        }
        isPending={isBorrowingBook}
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Xác nhận mượn sách
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn mượn cuốn sách này? Sau khi xác nhận, sách sẽ
            được chuyển vào danh sách sách đang mượn của bạn.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default Reservations;
