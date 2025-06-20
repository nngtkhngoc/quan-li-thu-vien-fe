import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAllReservations,
  updateReservation,
  createReservation,
  deleteReservation,
} from "../../api/reservation.api";
import type {
  UpdateReservationRequest,
  CreateReservationRequest,
} from "../../types/Reservation";
import { getAllUsers } from "../../api/user.api";
import { getBooks } from "../../api/book.api";
import { toast } from "react-toastify";
import type { BookResponse } from "../../types/Book";
import { AdminConfirmModal } from "../../components/Admin/AdminConfirmModal";
import AdminDeleteModal from "../../components/Admin/AdminDeleteModal";

export default function Reservations() {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: getAllReservations,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: () => getBooks(""),
  });

  console.log("Books:", books);
  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({
      queryKey: ["reservations"],
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isConfirmingStatus, setIsConfirmingStatus] = useState<{
    id: number;
    returned: boolean;
  } | null>(null);

  const {
    mutate: updateReservationMutation,
    isPending: isUpdatingReservation,
  } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateReservationRequest;
    }) => updateReservation(id, data),
    onSuccess() {
      invalidateQuery();
      toast.success("Cập nhật đặt trước thành công");
      setIsConfirmingStatus(null);
    },
    onError() {
      toast.error("Cập nhật đặt trước thất bại");
    },
  });

  const {
    mutate: createReservationMutation,
    isPending: isCreatingReservation,
  } = useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservation(data),
    onSuccess() {
      invalidateQuery();
      toast.success("Tạo đặt trước thành công");
      setIsCreating(false);
    },
    onError() {
      toast.error("Tạo đặt trước thất bại");
    },
  });

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

  const statuses = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Đang chờ" },
    { value: "COMPLETED", label: "Sẵn sàng để mượn" },
  ];

  const statusColors = {
    PENDING: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
  };

  const statusLabels = {
    PENDING: "Đang chờ",
    COMPLETED: "Sẵn sàng để mượn",
  };

  const filteredReservations = reservations
    ?.filter((reservation) => {
      const matchesSearch =
        reservation.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.bookItem.book.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "PENDING" && !reservation.returned) ||
        (filterStatus === "COMPLETED" && reservation.returned);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      return (
        new Date(b.reservationDate).getTime() -
        new Date(a.reservationDate).getTime()
      );
    });

  const confirmStatusChange = () => {
    if (isConfirmingStatus) {
      updateReservationMutation({
        id: isConfirmingStatus.id,
        data: { returned: isConfirmingStatus.returned },
      });
    }
  };

  const handleDelete = () => {
    if (isDeleting) {
      deleteReservationMutation(isDeleting);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý đặt trước
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các yêu cầu đặt trước sách của thành viên
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 sm:mt-0 inline-flex cursor-pointer items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo đặt trước
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg h-10 w-10"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
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
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {reservations?.filter((r) => !r.returned).length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Sẵn sàng để mượn
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {reservations?.filter((r) => r.returned).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng hoặc tên sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng & Sách
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (filteredReservations?.length ?? 0) === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 italic"
                  >
                    Không có đặt trước nào.
                  </td>
                </tr>
              ) : (
                (filteredReservations ?? []).map((reservation) => (
                  <tr
                    key={reservation.reservation_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reservation.bookItem.book.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.reservationDate).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          reservation.returned
                            ? statusColors.COMPLETED
                            : statusColors.PENDING
                        }`}
                      >
                        {reservation.returned
                          ? statusLabels.COMPLETED
                          : statusLabels.PENDING}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            setIsDeleting(reservation.reservation_id)
                          }
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                          disabled={isDeletingReservation}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Create Modal */}
      {isCreating && (
        <AdminConfirmModal
          isOpen={isCreating}
          onCancel={() => setIsCreating(false)}
          onSave={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              const formData = new FormData(form);
              createReservationMutation({
                user_id: Number(formData.get("userId")),
                book_item_id: Number(formData.get("bookItemId")),
              });
            }
          }}
          isPending={isCreatingReservation}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tạo đặt trước mới
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người dùng *
                </label>
                <select
                  name="userId"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Chọn người dùng</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sách *
                </label>
                <select
                  name="bookItemId"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Chọn sách</option>
                  {books?.content?.map(
                    (book: BookResponse) =>
                      book.bookItems &&
                      book.bookItems.length > 0 && (
                        <option
                          key={Number(book.id)}
                          value={Number(book?.bookItems[0]?.id)}
                        >
                          {book.title}
                        </option>
                      )
                  )}
                </select>
              </div>
            </form>
          </div>
        </AdminConfirmModal>
      )}

      {/* Status Change Confirmation Modal */}
      {isConfirmingStatus && (
        <AdminConfirmModal
          isOpen={!!isConfirmingStatus}
          onCancel={() => setIsConfirmingStatus(null)}
          onSave={confirmStatusChange}
          isPending={isUpdatingReservation}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isConfirmingStatus.returned
                ? "Xác nhận sẵn sàng để mượn"
                : "Xác nhận chuyển đang chờ"}
            </h2>
            <p className="text-gray-600">
              {isConfirmingStatus.returned
                ? "Bạn có chắc chắn muốn đánh dấu đặt trước này là đã sẵn sàng để mượn?"
                : "Bạn có chắc chắn muốn chuyển đặt trước này về trạng thái đang chờ?"}
            </p>
          </div>
        </AdminConfirmModal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <AdminDeleteModal
          isOpen={!!isDeleting}
          onClose={() => setIsDeleting(null)}
          onConfirm={handleDelete}
          isPending={isDeletingReservation}
        />
      )}
    </div>
  );
}
